export const BUSINESS_TYPE_LABELS = {
  trades: 'Construction & trades',
  'beauty-clinics': 'Beauty, clinics & health',
  hospitality: 'Restaurants, cafés & hospitality',
  'professional-services': 'Accountants & professional services',
  property: 'Property & letting',
  fitness: 'Fitness & wellbeing',
  'home-services': 'Cleaning, gardening & home services',
  other: 'Something else',
};

export const PROBLEM_LABELS = {
  'missed-calls': 'Missed calls and enquiries',
  'no-shows': 'No-shows and cancellations',
  'follow-up': 'Following up and chasing',
  paperwork: 'Forms, records and paperwork',
  'not-sure': "Not sure yet, that's why I'm here",
  other: 'Something else',
};

export function businessTypeLabel(value) {
  return BUSINESS_TYPE_LABELS[value] || value;
}

export function problemLabel(value) {
  return PROBLEM_LABELS[value] || value;
}
