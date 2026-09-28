import { supabaseAdmin } from './supabaseAdmin';
import { sendLeadConfirmationEmail, sendAdminNotificationEmail } from './email';
import { generatePersonalizedSentence, generateLeadSummary } from './personalize';

function errMessage(err) {
  if (!err) return 'unknown error';
  if (typeof err === 'string') return err;
  return err.message || JSON.stringify(err);
}

// Shared by the contact form and the chat's book_audit tool. Only a failed
// database insert is fatal — once the lead row exists, every later step
// (linking, AI copy, emails) is best-effort and logged, never thrown, so a
// lead is never lost because an email or an AI call failed.
export async function createLead({
  source,
  name,
  email,
  phone,
  businessType,
  businessName,
  mainProblem,
  bestTimes,
  problemCategory,
  language = 'en',
  notes,
  chatConversationId,
  transcript,
}) {
  const { data: lead, error } = await supabaseAdmin()
    .from('site_leads')
    .insert({
      source,
      name,
      email,
      phone,
      business_type: businessType,
      business_name: businessName,
      main_problem: mainProblem,
      best_times: bestTimes,
      language,
      notes,
      chat_conversation_id: chatConversationId || null,
    })
    .select()
    .single();

  if (error) {
    console.error(`[lead] step=db_insert source=${source} error=${errMessage(error)}`);
    throw new Error('Could not save lead');
  }

  if (chatConversationId) {
    const { error: linkError } = await supabaseAdmin()
      .from('chat_conversations')
      .update({ lead_id: lead.id })
      .eq('id', chatConversationId);
    if (linkError) {
      console.error(`[lead] step=link_conversation lead=${lead.id} error=${errMessage(linkError)}`);
    }
  }

  // generatePersonalizedSentence/generateLeadSummary never throw — they log
  // their own [lead] step=ai_sentence/ai_summary failures and fall back.
  const personalizedSentence = await generatePersonalizedSentence({
    mainProblem,
    businessType,
    problemCategory,
    language,
  });
  const aiSummary = await generateLeadSummary({ mainProblem, businessType });

  try {
    const result = await sendLeadConfirmationEmail({
      leadId: lead.id,
      to: email,
      name,
      personalizedSentence,
      bestTimes,
      problemCategory,
      language,
    });
    if (result?.error) {
      console.error(`[lead] step=email_lead lead=${lead.id} error=${errMessage(result.error)}`);
    }
  } catch (err) {
    console.error(`[lead] step=email_lead lead=${lead.id} error=${errMessage(err)}`);
  }

  try {
    const result = await sendAdminNotificationEmail({
      leadId: lead.id,
      source,
      name,
      email,
      phone,
      businessType,
      businessName,
      mainProblem,
      bestTimes,
      language,
      notes,
      transcript,
      aiSummary,
    });
    if (result?.error) {
      console.error(`[lead] step=email_admin lead=${lead.id} error=${errMessage(result.error)}`);
    }
  } catch (err) {
    console.error(`[lead] step=email_admin lead=${lead.id} error=${errMessage(err)}`);
  }

  return lead;
}
