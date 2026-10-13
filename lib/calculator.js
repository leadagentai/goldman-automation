// Pure maths and formatting for the /calculator page.
// No React, no browser APIs — everything here is unit-tested in calculator.test.mjs.

export const WEEKS_PER_MONTH = 4.33;
export const WORKING_WEEKS_PER_YEAR = 48;
export const HOURS_PER_EVENING = 3;
export const HOURS_PER_SATURDAY = 8;
export const RECOVERY_RATE = 0.5; // conservative: we only ever claim half
export const RECEPTIONIST_COST_RANGE = '£2,300–2,900';
export const MAX_SUMMARY_LENGTH = 1800; // the callback API keeps the first 2,000 chars of notes

// "When you miss one, how often do you never hear from them again?"
export const LOST_FOR_GOOD = {
  rarely: { label: 'Rarely, most call back', rate: 0.25 },
  half: { label: 'About half the time', rate: 0.5 },
  most: { label: 'Most of the time', rate: 0.75 },
  almost: { label: 'Almost always', rate: 0.9 },
};

export const INDUSTRIES = {
  trades: {
    label: 'Trades & construction',
    unit: 'job',
    valueLabel: 'Average job value',
    monthlyFee: 299,
    hasNoShows: false,
    tasks: [
      'Replying to enquiries',
      'Writing quotes',
      'Chasing quotes and follow-ups',
      'Booking and rescheduling jobs',
      'Invoices and paperwork',
      'Answering the same questions again and again',
    ],
  },
  beauty: {
    label: 'Salon & beauty',
    unit: 'booking',
    valueLabel: 'Average spend per booking',
    monthlyFee: 297,
    hasNoShows: true,
    tasks: [
      'Replying to enquiries and DMs',
      'Booking and rescheduling',
      'Reminder calls and texts',
      'Consultation forms and paperwork',
      'Chasing reviews and rebookings',
      'Answering the same questions again and again',
    ],
  },
  clinic: {
    label: 'Clinic (aesthetic, dental, physio)',
    unit: 'appointment',
    valueLabel: 'Average value per appointment',
    monthlyFee: 297,
    hasNoShows: true,
    tasks: [
      'Replying to enquiries and DMs',
      'Booking and rescheduling',
      'Reminder calls and texts',
      'Consultation forms and paperwork',
      'Chasing reviews and rebookings',
      'Answering the same questions again and again',
    ],
  },
  other: {
    label: 'Other service business',
    unit: 'customer',
    valueLabel: 'Average value per customer',
    monthlyFee: 299,
    hasNoShows: true,
    tasks: [
      'Replying to enquiries',
      'Quotes and proposals',
      'Chasing and follow-ups',
      'Booking and scheduling',
      'Invoices and paperwork',
      'Answering the same questions again and again',
    ],
  },
};

export function isIndustry(value) {
  return Object.prototype.hasOwnProperty.call(INDUSTRIES, value);
}

/**
 * @param {object} input
 * @param {string} input.industry          trades | beauty | clinic | other
 * @param {number} input.enquiriesPerWeek
 * @param {number} input.missedPct         0–80, as a percentage (37 means 37%)
 * @param {number} input.lostForGoodRate   share of missed enquiries that never come back (see LOST_FOR_GOOD)
 * @param {number} input.avgValue          £
 * @param {number} input.conversionOutOf10 1–10
 * @param {number} input.noShowsPerWeek    ignored for trades
 * @param {number[]} input.adminHours      hours per week for each ticked task
 */
export function calculate(input) {
  const industry = INDUSTRIES[input.industry];
  const missedShare = input.missedPct / 100;

  const missedPerMonth = input.enquiriesPerWeek * missedShare * WEEKS_PER_MONTH;
  const lostForGoodPerMonth = missedPerMonth * input.lostForGoodRate;
  const lostWorkPerMonth = lostForGoodPerMonth * (input.conversionOutOf10 / 10);
  const lostFromMissed = lostWorkPerMonth * input.avgValue;
  const lostFromNoShows = industry.hasNoShows
    ? (input.noShowsPerWeek || 0) * WEEKS_PER_MONTH * input.avgValue
    : 0;
  const totalLostMonthly = lostFromMissed + lostFromNoShows;
  const totalLostYearly = totalLostMonthly * 12;

  const adminHoursPerWeek = (input.adminHours || []).reduce((sum, h) => sum + (h || 0), 0);
  const adminHoursPerYear = adminHoursPerWeek * WORKING_WEEKS_PER_YEAR;
  const eveningsPerYear = adminHoursPerYear / HOURS_PER_EVENING;
  const saturdaysPerYear = adminHoursPerYear / HOURS_PER_SATURDAY;

  const recoverableMonthly = totalLostMonthly * RECOVERY_RATE;
  const recoverableHoursYear = adminHoursPerYear * RECOVERY_RATE;
  const recoverableEvenings = recoverableHoursYear / HOURS_PER_EVENING;

  const worthIt = recoverableMonthly >= 2 * industry.monthlyFee || recoverableHoursYear >= 150;

  return {
    missedPerMonth,
    lostForGoodPerMonth,
    lostWorkPerMonth,
    lostFromMissed,
    lostFromNoShows,
    totalLostMonthly,
    totalLostYearly,
    adminHoursPerWeek,
    adminHoursPerYear,
    eveningsPerYear,
    saturdaysPerYear,
    recoverableMonthly,
    recoverableHoursYear,
    recoverableEvenings,
    worthIt,
  };
}

/* ---------- formatting ---------- */

const wholeFormat = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });
const oneDpFormat = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 1 });

export function roundMoney(value) {
  return Math.round(value / 10) * 10;
}

/** £4,253.12 -> "£4,250" */
export function formatMoney(value) {
  return `£${wholeFormat.format(roundMoney(value))}`;
}

/** 1234.6 -> "1,235" */
export function formatWhole(value) {
  return wholeFormat.format(Math.round(value));
}

/** For echoing back the user's own inputs, e.g. 2.5 hours a week. */
export function formatUpTo1dp(value) {
  return oneDpFormat.format(value);
}

/** Counts like "lost jobs": anything between 0 and 0.5 reads as "less than 1". */
export function formatCount(value) {
  if (value > 0 && value < 0.5) return 'less than 1';
  return formatWhole(value);
}

/** "1 lost job", "less than 1 lost job", "0 lost jobs", "3 lost jobs". */
export function pluralise(unit, value) {
  return value > 0 && value < 1.5 ? unit : `${unit}s`;
}

/* ---------- callback form summary ---------- */

export const SUMMARY_MARKER = 'Source: calculator';

function truncate(text, max) {
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

/**
 * The plain-text summary pre-filled into the shared callback form's message field.
 * Kept under MAX_SUMMARY_LENGTH characters by trimming the free text.
 */
export function buildAuditSummary(input, results) {
  const industry = INDUSTRIES[input.industry];
  const business = (input.business || '').trim();
  const timeEater = (input.timeEater || '').trim();
  const tasks = input.tickedTasks && input.tickedTasks.length ? input.tickedTasks.join(', ') : 'none ticked';
  const lostForGood = LOST_FOR_GOOD[input.lostForGood];

  const compose = (biz, eater) =>
    [
      SUMMARY_MARKER,
      '',
      'Hi Adrian, I used your calculator.',
      `Industry: ${industry.label}`,
      `Business: ${biz || 'not given'}`,
      `Enquiries per week: ${formatUpTo1dp(input.enquiriesPerWeek)}, missed: ${input.missedPct}%`,
      `Missed callers who never come back: ${lostForGood ? lostForGood.label : 'not given'}`,
      `Average value: £${formatUpTo1dp(input.avgValue)}, converting ${input.conversionOutOf10} in 10`,
      `No-shows per week: ${industry.hasNoShows ? formatUpTo1dp(input.noShowsPerWeek || 0) : 'n/a'}`,
      `Admin hours per week: ${formatUpTo1dp(results.adminHoursPerWeek)} (${tasks})`,
      `What eats most of my time: ${eater || 'not given'}`,
      `Estimated loss: ${formatMoney(results.totalLostMonthly)}/month`,
    ].join('\n');

  let summary = compose(business, timeEater);
  if (summary.length > MAX_SUMMARY_LENGTH) {
    const spare = MAX_SUMMARY_LENGTH - compose(business, '').length + 'not given'.length;
    summary = compose(business, truncate(timeEater, Math.max(40, spare)));
  }
  if (summary.length > MAX_SUMMARY_LENGTH) {
    const half = Math.max(20, Math.floor((MAX_SUMMARY_LENGTH - compose('', '').length) / 2));
    summary = compose(truncate(business, half), truncate(timeEater, half));
  }
  return summary;
}
