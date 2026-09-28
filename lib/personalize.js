import Anthropic from '@anthropic-ai/sdk';

let client;
function anthropic() {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

// One personalised sentence restating the lead's problem in plain words.
// Rules: British English (or Polish), no numbers, no promises, no hype words, one sentence only.
export async function generatePersonalizedSentence({ mainProblem, businessType, language }) {
  const fallback = `You mentioned ${mainProblem}.`;
  if (!mainProblem) return fallback;

  try {
    const languageLine =
      language === 'pl'
        ? 'Write the sentence in Polish.'
        : 'Write the sentence in British English.';

    const response = await anthropic().messages.create({
      model: process.env.CHAT_MODEL || 'claude-sonnet-5',
      max_tokens: 250,
      messages: [
        {
          role: 'user',
          content: `A small business owner running a "${businessType || 'unspecified'}" business told us: "${mainProblem}".

Write exactly ONE sentence that restates their problem back to them in plain, empathetic words, as if picking up the conversation. ${languageLine}

Rules:
- No numbers or figures of any kind.
- No promises of results.
- No hype words (revolutionary, cutting-edge, game-changer, seamless, leverage, unlock, transform).
- One sentence only, nothing else in your reply.`,
        },
      ],
    });

    const text = response.content.find((block) => block.type === 'text')?.text?.trim();
    return text || fallback;
  } catch (err) {
    console.error(`[lead] step=ai_sentence error=${err.message || err}`);
    return fallback;
  }
}

// One-line summary for the admin notification email: what the business is,
// the main problem, and which system it most likely fits.
export async function generateLeadSummary({ mainProblem, businessType }) {
  if (!mainProblem) return null;

  try {
    const response = await anthropic().messages.create({
      model: process.env.CHAT_MODEL || 'claude-sonnet-5',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: `Business type: "${businessType || 'unspecified'}". Main problem in their words: "${mainProblem}".

Write exactly ONE sentence for Adrian (the founder) summarising: what the business is, the main problem, and which of his systems it most likely fits — pick one of: missed calls/enquiries, bookings/no-shows, follow-ups/chasing, paperwork, bespoke. No numbers, no hype words. One sentence only, nothing else in your reply.`,
        },
      ],
    });

    return response.content.find((block) => block.type === 'text')?.text?.trim() || null;
  } catch (err) {
    console.error(`[lead] step=ai_summary error=${err.message || err}`);
    return null;
  }
}
