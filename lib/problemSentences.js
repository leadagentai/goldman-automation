const CATEGORIES = ['missed-calls', 'no-shows', 'follow-up', 'paperwork'];

const SENTENCES = {
  en: {
    'missed-calls': "I'll ask how calls and enquiries reach you today and which ones go unanswered",
    'no-shows':
      "I'll ask how bookings, reminders and cancellations work for you today and where the gaps are",
    'follow-up': "I'll ask who and what you chase today and how much of your week it takes",
    paperwork:
      "I'll ask which forms, records and paperwork eat your time and where the same details get typed twice",
    other: "I'll ask how a normal week runs and where the time and money go",
  },
  pl: {
    'missed-calls': 'Zapytam, jak dziś trafiają do Ciebie telefony i zapytania i które zostają bez odpowiedzi',
    'no-shows': 'Zapytam, jak dziś działają u Ciebie rezerwacje, przypomnienia i odwołania i gdzie są luki',
    'follow-up': 'Zapytam, kogo i o co dziś gonisz i ile czasu w tygodniu Ci to zajmuje',
    paperwork:
      'Zapytam, które formularze, dokumenty i papierologia zabierają Ci czas i gdzie te same dane wpisujesz dwa razy',
    other: 'Zapytam, jak wygląda zwykły tydzień i gdzie uciekają czas i pieniądze',
  },
};

// Collapses "something else", "not sure yet" and anything unrecognised into
// the same fallback bucket used for the confirmation email's problem sentence.
export function normalizeProblemCategory(value) {
  return CATEGORIES.includes(value) ? value : 'other';
}

export function problemSentence(category, language) {
  const lang = language === 'pl' ? 'pl' : 'en';
  return SENTENCES[lang][normalizeProblemCategory(category)];
}
