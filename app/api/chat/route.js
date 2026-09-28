import Anthropic from '@anthropic-ai/sdk';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createLead } from '@/lib/createLead';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { SYSTEM_PROMPT, BOOK_AUDIT_TOOL } from '@/lib/chat/system-prompt';

export const runtime = 'nodejs';

const MAX_USER_MESSAGES = 30;
const MAX_MESSAGE_LENGTH = 1500;
const MAX_TOOL_ROUNDS = 3;
const LIMIT_REPLY =
  "I've hit my limit for this chat. Email hello@goldmanautomation.co.uk and Adrian will get back to you.";

let anthropicClient;
function anthropic() {
  if (!anthropicClient) anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return anthropicClient;
}

function hashIp(ip) {
  return crypto.createHash('sha256').update(`${ip}:${process.env.LINK_SIGNING_SECRET}`).digest('hex');
}

function plainTextResponse(text) {
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { messages, pageUrl } = body || {};
  let conversationId = body?.conversationId || null;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'No messages' }, { status: 400 });
  }

  const lastMessage = messages[messages.length - 1];
  if (
    !lastMessage ||
    lastMessage.role !== 'user' ||
    typeof lastMessage.content !== 'string' ||
    !lastMessage.content.trim()
  ) {
    return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
  }

  const userMessageCount = messages.filter((m) => m.role === 'user').length;
  const ip = getClientIp(request);
  const withinRateLimit = checkRateLimit(ip);

  if (
    userMessageCount > MAX_USER_MESSAGES ||
    lastMessage.content.length > MAX_MESSAGE_LENGTH ||
    !withinRateLimit
  ) {
    return plainTextResponse(LIMIT_REPLY);
  }

  const cleanMessages = messages
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_USER_MESSAGES * 2)
    .map((m) => ({ role: m.role, content: m.content }));

  if (conversationId) {
    const { data } = await supabaseAdmin()
      .from('chat_conversations')
      .select('id')
      .eq('id', conversationId)
      .maybeSingle();
    if (!data) conversationId = null;
  }

  if (!conversationId) {
    const { data, error } = await supabaseAdmin()
      .from('chat_conversations')
      .insert({ page_url: pageUrl || null, transcript: cleanMessages, ip_hash: hashIp(ip) })
      .select('id')
      .single();
    if (!error) conversationId = data.id;
  } else {
    await supabaseAdmin()
      .from('chat_conversations')
      .update({ transcript: cleanMessages })
      .eq('id', conversationId);
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function write(text) {
        controller.enqueue(encoder.encode(text));
      }

      let assistantText = '';
      let leadBooked = false;

      try {
        let workingMessages = [...cleanMessages];

        for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
          const messageStream = anthropic().messages.stream({
            model: process.env.CHAT_MODEL || 'claude-sonnet-5',
            max_tokens: 500,
            system: SYSTEM_PROMPT,
            tools: [BOOK_AUDIT_TOOL],
            messages: workingMessages,
          });

          messageStream.on('text', (delta) => {
            assistantText += delta;
            write(delta);
          });

          const finalMessage = await messageStream.finalMessage();

          if (finalMessage.stop_reason !== 'tool_use') break;

          const toolUse = finalMessage.content.find((block) => block.type === 'tool_use');
          if (!toolUse || toolUse.name !== 'book_audit') break;

          const input = toolUse.input || {};
          let toolResultContent;

          if (!input.phone && !input.email) {
            toolResultContent =
              'Missing contact details: ask for at least a phone number or an email address, then call book_audit again.';
          } else {
            try {
              await createLead({
                source: 'chat',
                name: input.name,
                email: input.email,
                phone: input.phone,
                businessType: input.business_type,
                businessName: input.business_name,
                mainProblem: input.main_problem,
                bestTimes: input.best_times,
                language: input.language || 'en',
                notes: input.notes,
                chatConversationId: conversationId,
                transcript: [
                  ...cleanMessages,
                  { role: 'assistant', content: assistantText || '[booking audit]' },
                ],
              });
              leadBooked = true;
              toolResultContent = 'Booked. Confirm this to the visitor now, briefly.';
            } catch {
              toolResultContent =
                'System error saving the booking. Apologise briefly and give them hello@goldmanautomation.co.uk instead.';
            }
          }

          workingMessages = [
            ...workingMessages,
            { role: 'assistant', content: finalMessage.content },
            {
              role: 'user',
              content: [
                { type: 'tool_result', tool_use_id: toolUse.id, content: toolResultContent },
              ],
            },
          ];
        }
      } catch (err) {
        console.error('POST /api/chat stream failed', err);
        write(
          "\n\nSomething went wrong on my end. Email hello@goldmanautomation.co.uk and Adrian will pick it up."
        );
      }

      try {
        await supabaseAdmin()
          .from('chat_conversations')
          .update({ transcript: [...cleanMessages, { role: 'assistant', content: assistantText }] })
          .eq('id', conversationId);
      } catch (err) {
        console.error('POST /api/chat: failed to persist transcript', err);
      }

      write(`\u0000META\u0000${JSON.stringify({ conversationId, leadBooked })}`);
      controller.close();
    },
  });

  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
