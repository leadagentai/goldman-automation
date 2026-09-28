import Anthropic from '@anthropic-ai/sdk';

let client;
function anthropic() {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

const CATEGORY_LABEL_EN = {
  'missed-calls': 'missed calls and enquiries',
  'no-shows': 'no-shows and cancellations',
  'follow-up': 'following up and chasing',
  paperwork: 'forms, records and paperwork',
};

const CATEGORY_LABEL_PL = {
  'missed-calls': 'nieodebrane telefony i zapytania',
  'no-shows': 'nieodwołane wizyty i rezerwacje',
  'follow-up': 'przypominanie się klientom',
  paperwork: 'formularze, dokumenty i papierologię',
};

function fallbackLabel(problemCategory, mainProblem, language) {
  const map = language === 'pl' ? CATEGORY_LABEL_PL : CATEGORY_LABEL_EN;
  if (map[problemCategory]) return map[problemCategory];
  return mainProblem ? mainProblem.toLowerCase() : '';
}

function fallbackSentence({ problemCategory, mainProblem, language }) {
  const label = fallbackLabel(problemCategory, mainProblem, language);
  return language === 'pl' ? `Wspominasz o: ${label}.` : `You mentioned ${label}.`;
}

const BANNED_PHRASES = [
  'frustrating',
  'frustration',
  'stressful',
  'disruption',
  'slipping through the cracks',
  'fall through the gaps',
  'juggling',
  'hectic',
  'overwhelming',
  'it sounds like',
  'must be',
  'valuable',
  'real',
  'pain point',
  'i understand',
];

function breaksRules(text) {
  if (!text) return true;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount > 25) return true;
  const lower = text.toLowerCase();
  return BANNED_PHRASES.some((phrase) => lower.includes(phrase));
}

// One or two short, plain sentences restating the lead's problem, written the
// way Adrian would say it himself — not empathetic guesswork about how they
// feel. Falls back to a fixed, safe sentence if the AI call fails or its
// output breaks the word-count/banned-word rules.
export async function generatePersonalizedSentence({ mainProblem, businessType, problemCategory, language }) {
  const fallback = fallbackSentence({ problemCategory, mainProblem, language });
  if (!mainProblem) return fallback;

  try {
    const isPolish = language === 'pl';
    const prompt = isPolish
      ? `Właściciel małej firmy (typ działalności: "${businessType || 'nieokreślony'}") napisał o swoim problemie: "${mainProblem}".

Napisz 1 lub maksymalnie 2 krótkie zdania, które Adrian wysyła w mailu, odnosząc się do tego, co ta osoba napisała. Brzmi jak on sam, nie jak marketing: krótko, konkretnie, bez domysłów o emocjach.

ZASADY
- W sumie maksymalnie 25 słów.
- Zdanie 1 zaczyna się od "Piszesz, że" albo "Wspominasz o" i powtarza problem prostymi słowami.
- Odnieś się do branży naturalnie, nigdy nie kopiuj nazwy z listy rozwijanej dosłownie i nigdy nie zgaduj bardziej szczegółowego typu niż dostałeś. Jeśli typ to "Coś innego", nie wspominaj branży w ogóle.
- Zdanie 2 (opcjonalne): jedna prosta, oczywista obserwacja wynikająca wprost z branży i problemu. Jeśli nic oczywistego nie pasuje, pomiń je.
- Używaj wyłącznie tego, co dała ta osoba: typ działalności, problem, jej własne słowa. Nigdy nie dodawaj szczegółów, których nie podała (żadnych domysłów o planowaniu, przychodach, personelu, klientach, zleceniach, narzędziach).
- Zakazane słowa i zwroty: frustrujące, frustracja, stresujące, chaos, żonglowanie, przytłaczające, "wygląda na to", "musi być", cenne, prawdziwe, "punkt bólu", rozumiem.
- Bez liczb, bez obietnic, bez pytań, bez wykrzykników.

Odpowiedz WYŁĄCZNIE tymi 1-2 zdaniami, nic więcej.`
      : `A small business owner (business type: "${businessType || 'unspecified'}") wrote about their problem: "${mainProblem}".

Write 1 or at most 2 short sentences for Adrian to send in an email, referring back to what this person wrote. It should sound like Adrian wrote it himself: short, plain, dry — not marketing copy, and not guessing at how they feel.

RULES
- 25 words maximum in total.
- Sentence 1 always starts with "You mentioned" and restates their problem in plain words.
- Refer to the business naturally, never by copying the dropdown label verbatim, and never guess a more specific type than you were given. "Construction & trades" becomes "on site" or "the business". "Restaurants, cafés & hospitality" is THREE different kinds of business bundled into one label — unless their own words say which one, you do not know which it is, so say "the business", never "the restaurant" or "the café". If the business type is "Something else", don't mention the sector at all.
- Sentence 2 (optional): one plain, obvious observation that follows directly from their business type and problem. If nothing obvious fits, leave it out.
- Only use what they actually gave you: business type, problem, their own words. Never add details they didn't give (no guesses about planning, revenue, staff, customers, covers, jobs, tools).
- Banned words and phrases: frustrating, frustration, stressful, disruption, slipping through the cracks, fall through the gaps, juggling, hectic, overwhelming, "it sounds like", "must be", valuable, real, pain point, I understand.
- No numbers, no promises, no questions, no exclamation marks.

Examples of the target tone:
- "You mentioned no-shows and last-minute cancellations."
- "You mentioned missed calls and enquiries. On site, that usually means the phone rings while your hands are full."
- "You mentioned chasing clients. For an accountant, that's usually documents that should have arrived weeks ago."
- "You mentioned you're not sure yet where automation fits. That's what the call is for."

Reply with ONLY those 1-2 sentences, nothing else.`;

    const response = await anthropic().messages.create({
      model: process.env.CHAT_MODEL || 'claude-sonnet-5',
      max_tokens: 100,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content.find((block) => block.type === 'text')?.text?.trim();
    if (breaksRules(text)) {
      console.error(`[lead] step=ai_sentence error=output broke rules: "${text}"`);
      return fallback;
    }
    return text;
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
