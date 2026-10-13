import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculate,
  buildAuditSummary,
  formatMoney,
  formatCount,
  pluralise,
  roundMoney,
  LOST_FOR_GOOD,
  MAX_SUMMARY_LENGTH,
  SUMMARY_MARKER,
} from './calculator.js';

const close = (actual, expected, msg) =>
  assert.ok(Math.abs(actual - expected) < 1e-6, `${msg}: expected ${expected}, got ${actual}`);

test('lost-for-good options map to the agreed rates', () => {
  assert.deepEqual(
    Object.values(LOST_FOR_GOOD).map((o) => o.rate),
    [0.25, 0.5, 0.75, 0.9]
  );
});

test('trades: no-shows are ignored even if supplied', () => {
  const r = calculate({
    industry: 'trades',
    enquiriesPerWeek: 20,
    missedPct: 40,
    lostForGoodRate: 0.75,
    avgValue: 2000,
    conversionOutOf10: 3,
    noShowsPerWeek: 5,
    adminHours: [3, 2],
  });
  close(r.missedPerMonth, 34.64, 'missed per month'); // 20 * 0.4 * 4.33
  close(r.lostForGoodPerMonth, 25.98, 'lost for good');
  close(r.lostWorkPerMonth, 7.794, 'lost jobs');
  close(r.lostFromMissed, 15588, 'lost from missed');
  assert.equal(r.lostFromNoShows, 0);
  close(r.totalLostMonthly, 15588, 'total monthly');
  close(r.totalLostYearly, 187056, 'total yearly');
  assert.equal(r.adminHoursPerWeek, 5);
  assert.equal(r.adminHoursPerYear, 240);
  assert.equal(r.eveningsPerYear, 80);
  assert.equal(r.saturdaysPerYear, 30);
  close(r.recoverableMonthly, 7794, 'recoverable');
  assert.equal(r.recoverableHoursYear, 120);
  assert.equal(r.recoverableEvenings, 40);
  assert.equal(r.worthIt, true);
  assert.equal(formatMoney(r.totalLostMonthly), '£15,590');
});

test('salon with no-shows', () => {
  const r = calculate({
    industry: 'beauty',
    enquiriesPerWeek: 30,
    missedPct: 30,
    lostForGoodRate: 0.5,
    avgValue: 60,
    conversionOutOf10: 5,
    noShowsPerWeek: 3,
    adminHours: [2, 1.5, 1],
  });
  close(r.missedPerMonth, 38.97, 'missed');
  close(r.lostForGoodPerMonth, 19.485, 'lost for good');
  close(r.lostWorkPerMonth, 9.7425, 'lost bookings');
  close(r.lostFromMissed, 584.55, 'lost from missed');
  close(r.lostFromNoShows, 779.4, 'no-shows'); // 3 * 4.33 * 60
  close(r.totalLostMonthly, 1363.95, 'total');
  assert.equal(r.adminHoursPerWeek, 4.5);
  assert.equal(r.adminHoursPerYear, 216);
  close(r.recoverableMonthly, 681.975, 'recoverable');
  assert.equal(r.worthIt, true); // 681.98 >= 2 * 297
  assert.equal(formatMoney(r.totalLostMonthly), '£1,360');
});

test('zero admin hours', () => {
  const r = calculate({
    industry: 'clinic',
    enquiriesPerWeek: 50,
    missedPct: 20,
    lostForGoodRate: 0.5,
    avgValue: 150,
    conversionOutOf10: 6,
    noShowsPerWeek: 0,
    adminHours: [],
  });
  assert.equal(r.adminHoursPerWeek, 0);
  assert.equal(r.adminHoursPerYear, 0);
  assert.equal(r.eveningsPerYear, 0);
  assert.equal(r.saturdaysPerYear, 0);
  assert.equal(r.recoverableEvenings, 0);
  close(r.totalLostMonthly, 1948.5, 'total'); // 50*0.2*4.33*0.5*0.6*150
  assert.equal(r.worthIt, true);
});

test('zero missed %: only no-shows count', () => {
  const r = calculate({
    industry: 'other',
    enquiriesPerWeek: 40,
    missedPct: 0,
    lostForGoodRate: 0.9,
    avgValue: 100,
    conversionOutOf10: 5,
    noShowsPerWeek: 2,
    adminHours: [0],
  });
  assert.equal(r.missedPerMonth, 0);
  assert.equal(r.lostForGoodPerMonth, 0);
  assert.equal(r.lostWorkPerMonth, 0);
  assert.equal(r.lostFromMissed, 0);
  close(r.lostFromNoShows, 866, 'no-shows');
  close(r.totalLostMonthly, 866, 'total');
  close(r.recoverableMonthly, 433, 'recoverable');
  assert.equal(r.worthIt, false); // 433 < 598, 0 hours
});

test('small business below the worthIt threshold', () => {
  const r = calculate({
    industry: 'trades',
    enquiriesPerWeek: 5,
    missedPct: 10,
    lostForGoodRate: 0.9,
    avgValue: 300,
    conversionOutOf10: 4,
    noShowsPerWeek: 0,
    adminHours: [2],
  });
  close(r.lostWorkPerMonth, 0.7794, 'lost jobs');
  close(r.totalLostMonthly, 233.82, 'total'); // 5*0.1*4.33*0.9*0.4*300
  close(r.recoverableMonthly, 116.91, 'recoverable');
  assert.equal(r.recoverableHoursYear, 48);
  assert.equal(r.worthIt, false);
});

test('worthIt can be true on admin hours alone', () => {
  const r = calculate({
    industry: 'beauty',
    enquiriesPerWeek: 1,
    missedPct: 0,
    lostForGoodRate: 0.25,
    avgValue: 10,
    conversionOutOf10: 1,
    noShowsPerWeek: 0,
    adminHours: [6.25], // 6.25 * 48 * 0.5 = 150
  });
  assert.equal(r.recoverableHoursYear, 150);
  assert.equal(r.worthIt, true);
});

test('formatting helpers', () => {
  assert.equal(roundMoney(4253), 4250);
  assert.equal(roundMoney(4255), 4260);
  assert.equal(formatMoney(1234567), '£1,234,570');
  assert.equal(formatCount(0), '0');
  assert.equal(formatCount(0.3), 'less than 1');
  assert.equal(formatCount(10.39), '10');
  assert.equal(pluralise('job', 0), 'jobs');
  assert.equal(pluralise('job', 0.3), 'job'); // "less than 1 lost job"
  assert.equal(pluralise('job', 1.2), 'job');
  assert.equal(pluralise('job', 1.6), 'jobs');
});

test('form summary starts with the marker, includes every answer, stays under the cap', () => {
  const input = {
    industry: 'beauty',
    business: 'Nails & lashes, Hackney ' + 'x'.repeat(2000),
    timeEater: 'DMs at 11pm? Yes. ' + 'y'.repeat(3000),
    enquiriesPerWeek: 30,
    missedPct: 30,
    lostForGood: 'half',
    lostForGoodRate: 0.5,
    avgValue: 60,
    conversionOutOf10: 5,
    noShowsPerWeek: 3,
    tickedTasks: ['Booking and rescheduling'],
  };
  const results = calculate({ ...input, adminHours: [2] });
  const summary = buildAuditSummary(input, results);
  assert.ok(summary.startsWith(`${SUMMARY_MARKER}\n`));
  assert.ok(summary.length <= MAX_SUMMARY_LENGTH, `summary is ${summary.length} chars`);
  assert.match(summary, /Industry: Salon & beauty/);
  assert.match(summary, /Business: Nails & lashes, Hackney x+…/);
  assert.match(summary, /Missed callers who never come back: About half the time/);
  assert.match(summary, /Admin hours per week: 2 \(Booking and rescheduling\)/);
  assert.match(summary, /Estimated loss: £1,360\/month$/);
});

test('form summary marks missing free text as not given', () => {
  const input = {
    industry: 'trades',
    enquiriesPerWeek: 10,
    missedPct: 37,
    lostForGood: 'rarely',
    lostForGoodRate: 0.25,
    avgValue: 1500,
    conversionOutOf10: 3,
    noShowsPerWeek: 0,
    tickedTasks: [],
  };
  const summary = buildAuditSummary(input, calculate({ ...input, adminHours: [] }));
  assert.match(summary, /Business: not given/);
  assert.match(summary, /What eats most of my time: not given/);
  assert.match(summary, /No-shows per week: n\/a/);
  assert.match(summary, /Missed callers who never come back: Rarely, most call back/);
  assert.match(summary, /\(none ticked\)/);
});
