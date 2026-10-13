'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { prefillCallbackForm } from '../components/CallbackForm';
import {
  INDUSTRIES,
  LOST_FOR_GOOD,
  RECEPTIONIST_COST_RANGE,
  isIndustry,
  calculate,
  buildAuditSummary,
  formatMoney,
  formatWhole,
  formatCount,
  formatUpTo1dp,
  pluralise,
} from '@/lib/calculator';

// Everything here runs in the browser only. Nothing is sent anywhere unless the
// visitor sends the shared callback form, which the results can pre-fill.

const INDUSTRY_ORDER = ['trades', 'beauty', 'clinic', 'other'];
const BUSINESS_MAX = 300;
const TIME_EATER_MAX = 500;

const INITIAL = {
  industry: '',
  business: '',
  enquiries: '',
  missedPct: 37,
  lostForGood: '',
  avgValue: '',
  conversion: null,
  noShows: '0',
  tasks: {}, // { [taskIndex]: hoursString } for ticked tasks only
  timeEater: '',
};

function parseNum(raw) {
  const cleaned = String(raw).replace(/[£,\s]/g, '');
  if (cleaned === '') return NaN;
  return Number(cleaned);
}

function validateWhole(raw, min, max, emptyMsg) {
  const n = parseNum(raw);
  if (raw === '' || Number.isNaN(n)) return emptyMsg;
  if (!Number.isInteger(n)) return 'Please use a whole number.';
  if (n < min || n > max) return `Enter a number between ${formatWhole(min)} and ${formatWhole(max)}.`;
  return '';
}

function validateValue(raw) {
  const n = parseNum(raw);
  if (raw === '' || Number.isNaN(n)) return 'Enter a rough figure in pounds. A best guess is fine.';
  if (n < 1 || n > 100000) return 'Enter an amount between £1 and £100,000.';
  return '';
}

function validateHours(raw) {
  const n = parseNum(raw);
  if (raw === '' || Number.isNaN(n)) return 'Enter the hours, or untick this task.';
  if (n < 0 || n > 40) return 'Enter between 0 and 40 hours.';
  if (Math.round(n * 2) !== n * 2) return 'Use whole or half hours, like 2 or 2.5.';
  return '';
}

function stepsFor(industry) {
  return industry && !INDUSTRIES[industry].hasNoShows
    ? ['business', 'calls', 'value', 'admin']
    : ['business', 'calls', 'value', 'noshows', 'admin'];
}

export default function Calculator() {
  const [view, setView] = useState('intro'); // intro | steps | results
  const [stepIndex, setStepIndex] = useState(0);
  const [v, setV] = useState(INITIAL);
  const [touched, setTouched] = useState({});
  const [urlIndustry, setUrlIndustry] = useState('');
  const focusRef = useRef(null);
  const topRef = useRef(null);
  const shouldFocus = useRef(false);

  // ?industry=trades|beauty|clinic|other preselects step 1 (used in cold emails).
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('industry');
    if (isIndustry(param)) {
      setUrlIndustry(param);
      setV((prev) => (prev.industry ? prev : { ...prev, industry: param }));
    }
  }, []);

  // Move focus to the new step / results heading after the user navigates.
  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    if (topRef.current) {
      const top = topRef.current.getBoundingClientRect().top + window.scrollY - 84;
      if (window.scrollY > top) window.scrollTo({ top });
    }
    if (focusRef.current) focusRef.current.focus({ preventScroll: true });
  }, [view, stepIndex]);

  const industry = v.industry ? INDUSTRIES[v.industry] : null;
  const steps = stepsFor(v.industry);
  const stepId = steps[stepIndex];

  const errors = useMemo(() => {
    const e = {};
    if (!v.industry) e.industry = 'Pick the option closest to your business.';
    e.enquiries = validateWhole(v.enquiries, 1, 1000, 'Enter roughly how many you get in a week. A best guess is fine.');
    if (!v.lostForGood) e.lostForGood = 'Pick the option closest to what usually happens.';
    e.avgValue = validateValue(v.avgValue);
    if (!v.conversion) e.conversion = 'Pick a number from 1 to 10.';
    if (industry && industry.hasNoShows) {
      e.noShows = validateWhole(v.noShows, 0, 100, 'Enter 0 if you don’t get any.');
    }
    Object.entries(v.tasks).forEach(([i, hours]) => {
      e[`task${i}`] = validateHours(hours);
    });
    return e;
  }, [v, industry]);

  const STEP_FIELDS = {
    business: ['industry'],
    calls: ['enquiries', 'lostForGood'],
    value: ['avgValue', 'conversion'],
    noshows: ['noShows'],
    admin: Object.keys(v.tasks).map((i) => `task${i}`),
  };
  const stepErrors = (STEP_FIELDS[stepId] || []).map((f) => errors[f]).filter(Boolean);
  const stepValid = stepErrors.length === 0;

  const set = (field, value) => setV((prev) => ({ ...prev, [field]: value }));
  const touch = (field) => setTouched((prev) => ({ ...prev, [field]: true }));
  const shownError = (field) => (touched[field] ? errors[field] : '');

  const go = (nextView, nextStep = 0) => {
    shouldFocus.current = true;
    setView(nextView);
    setStepIndex(nextStep);
  };

  const chooseIndustry = (key) => {
    // Admin task lists differ per industry, so ticks don't carry across.
    setV((prev) => (prev.industry === key ? prev : { ...prev, industry: key, tasks: {} }));
    touch('industry');
  };

  const toggleTask = (i) => {
    setV((prev) => {
      const tasks = { ...prev.tasks };
      if (i in tasks) delete tasks[i];
      else tasks[i] = '';
      return { ...prev, tasks };
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!stepValid) {
      const t = {};
      (STEP_FIELDS[stepId] || []).forEach((f) => (t[f] = true));
      setTouched((prev) => ({ ...prev, ...t }));
      return;
    }
    if (stepIndex < steps.length - 1) go('steps', stepIndex + 1);
    else go('results');
  };

  const startAgain = () => {
    setV({ ...INITIAL, industry: urlIndustry });
    setTouched({});
    go('steps', 0);
  };

  /* ---------- derived results ---------- */

  const calcInput = useMemo(() => {
    if (!industry) return null;
    const tickedIdx = Object.keys(v.tasks).map(Number).sort((a, b) => a - b);
    return {
      industry: v.industry,
      business: v.business,
      timeEater: v.timeEater,
      enquiriesPerWeek: parseNum(v.enquiries) || 0,
      missedPct: v.missedPct,
      lostForGood: v.lostForGood,
      lostForGoodRate: v.lostForGood ? LOST_FOR_GOOD[v.lostForGood].rate : 0,
      avgValue: parseNum(v.avgValue) || 0,
      conversionOutOf10: v.conversion || 0,
      noShowsPerWeek: industry.hasNoShows ? parseNum(v.noShows) || 0 : 0,
      adminHours: tickedIdx.map((i) => parseNum(v.tasks[i]) || 0),
      tickedTasks: tickedIdx.map((i) => industry.tasks[i]),
    };
  }, [v, industry]);

  const results = view === 'results' && calcInput ? calculate(calcInput) : null;
  const summary = results ? buildAuditSummary(calcInput, results) : '';

  /* ---------- render ---------- */

  return (
    <div className="calc" ref={topRef}>
      <h1 className={view === 'intro' ? 'calc-h1' : 'calc-h1 calc-h1-compact'}>
        What are missed calls and admin really costing you?
      </h1>

      {view === 'intro' && (
        <div className="calc-intro">
          <p>
            Five quick questions, about 60 seconds. You&#39;ll see what missed enquiries, no-shows
            and admin cost your business in pounds, hours and evenings. Nothing you type is stored
            or sent anywhere unless you choose to send it to me.
          </p>
          <button type="button" className="btn btn-primary calc-start" onClick={() => go('steps', 0)}>
            Work out my number
          </button>
        </div>
      )}

      {view === 'steps' && (
        <form className="calc-card" onSubmit={onSubmit} noValidate>
          <div className="calc-progress">
            <p className="calc-progress-text" id="calc-progress-label">
              Step {stepIndex + 1} of {steps.length}
            </p>
            <div
              className="calc-progress-bar"
              role="progressbar"
              aria-labelledby="calc-progress-label"
              aria-valuemin={1}
              aria-valuemax={steps.length}
              aria-valuenow={stepIndex + 1}
            >
              <span style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} />
            </div>
          </div>

          {stepId === 'business' && (
            <div className="calc-step">
              <h2 ref={focusRef} tabIndex={-1}>Your business</h2>
              <fieldset className="calc-field">
                <legend>What kind of business do you run?</legend>
                <div className="calc-industries">
                  {INDUSTRY_ORDER.map((key) => (
                    <label key={key} className="calc-industry">
                      <input
                        type="radio"
                        name="industry"
                        value={key}
                        checked={v.industry === key}
                        onChange={() => chooseIndustry(key)}
                        aria-describedby={shownError('industry') ? 'err-industry' : undefined}
                      />
                      <span>{INDUSTRIES[key].label}</span>
                    </label>
                  ))}
                </div>
                <FieldError id="err-industry" msg={shownError('industry')} />
              </fieldset>

              <div className="calc-field">
                <label htmlFor="calc-business">
                  What does your business do? <span className="calc-optional">(optional)</span>
                </label>
                <textarea
                  id="calc-business"
                  rows={2}
                  maxLength={BUSINESS_MAX}
                  value={v.business}
                  onChange={(e) => set('business', e.target.value)}
                  placeholder="e.g. Bathroom fitting in North London, 2 vans"
                  aria-describedby="calc-business-count"
                />
                <p className="calc-help" id="calc-business-count">
                  {v.business.length} of {BUSINESS_MAX} characters
                </p>
              </div>
            </div>
          )}

          {stepId === 'calls' && (
            <div className="calc-step">
              <h2 ref={focusRef} tabIndex={-1}>Calls and enquiries</h2>
              <div className="calc-field">
                <label htmlFor="calc-enquiries">
                  How many calls, messages and enquiries do you get in a typical week?
                </label>
                <input
                  id="calc-enquiries"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  className="calc-input calc-input-short"
                  value={v.enquiries}
                  onChange={(e) => set('enquiries', e.target.value)}
                  onBlur={() => touch('enquiries')}
                  aria-invalid={!!shownError('enquiries')}
                  aria-describedby={shownError('enquiries') ? 'err-enquiries' : undefined}
                />
                <FieldError id="err-enquiries" msg={shownError('enquiries')} />
              </div>

              <div className="calc-field">
                <label htmlFor="calc-missed">
                  Roughly what share do you miss or can&#39;t answer straight away?
                </label>
                <div className="calc-slider-row">
                  <input
                    id="calc-missed"
                    type="range"
                    min={0}
                    max={80}
                    step={1}
                    value={v.missedPct}
                    onChange={(e) => set('missedPct', Number(e.target.value))}
                    aria-valuetext={`${v.missedPct}%`}
                    aria-describedby="calc-missed-help"
                  />
                  <output htmlFor="calc-missed" className="calc-readout" aria-hidden="true">
                    {v.missedPct}%
                  </output>
                </div>
                <p className="calc-help" id="calc-missed-help">
                  A 2025 UK study found small businesses miss 27–47% of their calls. Trades miss
                  more because the owner is on site.
                </p>
              </div>

              <fieldset className="calc-field">
                <legend>When you miss one, how often do you never hear from them again?</legend>
                <div className="calc-options">
                  {Object.entries(LOST_FOR_GOOD).map(([key, opt]) => (
                    <label key={key} className="calc-industry">
                      <input
                        type="radio"
                        name="lostForGood"
                        value={key}
                        checked={v.lostForGood === key}
                        onChange={() => {
                          set('lostForGood', key);
                          touch('lostForGood');
                        }}
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {stepId === 'value' && industry && (
            <div className="calc-step">
              <h2 ref={focusRef} tabIndex={-1}>What a customer is worth</h2>
              <div className="calc-field">
                <label htmlFor="calc-value">{industry.valueLabel}</label>
                <div className="calc-money">
                  <span aria-hidden="true">£</span>
                  <input
                    id="calc-value"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    className="calc-input calc-input-short"
                    value={v.avgValue}
                    onChange={(e) => set('avgValue', e.target.value)}
                    onBlur={() => touch('avgValue')}
                    aria-invalid={!!shownError('avgValue')}
                    aria-describedby={shownError('avgValue') ? 'err-value' : undefined}
                  />
                </div>
                <FieldError id="err-value" msg={shownError('avgValue')} />
              </div>

              <fieldset className="calc-field">
                <legend>Out of 10 enquiries, how many usually turn into paying work?</legend>
                <div className="calc-scale">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <label key={n} className="calc-scale-opt">
                      <input
                        type="radio"
                        name="conversion"
                        value={n}
                        checked={v.conversion === n}
                        onChange={() => {
                          set('conversion', n);
                          touch('conversion');
                        }}
                      />
                      <span>{n}</span>
                    </label>
                  ))}
                </div>
                <FieldError id="err-conversion" msg={shownError('conversion')} />
              </fieldset>
            </div>
          )}

          {stepId === 'noshows' && (
            <div className="calc-step">
              <h2 ref={focusRef} tabIndex={-1}>No-shows</h2>
              <div className="calc-field">
                <label htmlFor="calc-noshows">
                  How many no-shows or last-minute cancellations in a typical week?
                </label>
                <input
                  id="calc-noshows"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  className="calc-input calc-input-short"
                  value={v.noShows}
                  onChange={(e) => set('noShows', e.target.value)}
                  onBlur={() => touch('noShows')}
                  aria-invalid={!!shownError('noShows')}
                  aria-describedby={shownError('noShows') ? 'err-noshows' : undefined}
                />
                <FieldError id="err-noshows" msg={shownError('noShows')} />
              </div>
            </div>
          )}

          {stepId === 'admin' && industry && (
            <div className="calc-step">
              <h2 ref={focusRef} tabIndex={-1}>Admin you do yourself</h2>
              <fieldset className="calc-field">
                <legend>Which of these do you do yourself? Tick any that apply.</legend>
                <ul className="calc-tasks">
                  {industry.tasks.map((task, i) => {
                    const ticked = i in v.tasks;
                    const key = `task${i}`;
                    return (
                      <li key={task} className={ticked ? 'calc-task is-on' : 'calc-task'}>
                        <label className="calc-task-check">
                          <input type="checkbox" checked={ticked} onChange={() => toggleTask(i)} />
                          <span>{task}</span>
                        </label>
                        {ticked && (
                          <div className="calc-task-hours">
                            <label htmlFor={`calc-${key}`}>
                              Hours per week<span className="sr-only"> on {task.toLowerCase()}</span>
                            </label>
                            <input
                              id={`calc-${key}`}
                              type="text"
                              inputMode="decimal"
                              autoComplete="off"
                              className="calc-input calc-input-hours"
                              value={v.tasks[i]}
                              onChange={(e) =>
                                setV((prev) => ({ ...prev, tasks: { ...prev.tasks, [i]: e.target.value } }))
                              }
                              onBlur={() => touch(key)}
                              aria-invalid={!!shownError(key)}
                              aria-describedby={shownError(key) ? `err-${key}` : undefined}
                            />
                            <FieldError id={`err-${key}`} msg={shownError(key)} />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </fieldset>

              <div className="calc-field">
                <label htmlFor="calc-time-eater">
                  What eats most of your time? <span className="calc-optional">(optional)</span>
                </label>
                <textarea
                  id="calc-time-eater"
                  rows={3}
                  maxLength={TIME_EATER_MAX}
                  value={v.timeEater}
                  onChange={(e) => set('timeEater', e.target.value)}
                  aria-describedby="calc-time-eater-count"
                />
                <p className="calc-help" id="calc-time-eater-count">
                  {v.timeEater.length} of {TIME_EATER_MAX} characters
                </p>
              </div>
            </div>
          )}

          <div className="calc-nav">
            {stepIndex > 0 ? (
              <button type="button" className="btn btn-ghost" onClick={() => go('steps', stepIndex - 1)}>
                Back
              </button>
            ) : (
              <span />
            )}
            <button type="submit" className="btn btn-primary" disabled={!stepValid}>
              {stepIndex === steps.length - 1 ? 'Show me the numbers' : 'Next'}
            </button>
          </div>
          <p className="calc-nav-hint" aria-live="polite">
            {!stepValid ? stepErrors[0] : ''}
          </p>
        </form>
      )}

      {view === 'results' && results && industry && (
        <Results
          industry={industry}
          results={results}
          onBook={() => prefillCallbackForm(summary)}
          focusRef={focusRef}
          onChange={() => go('steps', 0)}
          onRestart={startAgain}
        />
      )}
    </div>
  );
}

function FieldError({ id, msg }) {
  if (!msg) return null;
  return (
    <p className="calc-error" id={id}>
      {msg}
    </p>
  );
}

function Results({ industry, results: r, onBook, focusRef, onChange, onRestart }) {
  const unitPlural = pluralise(industry.unit, r.lostWorkPerMonth);
  const evenings = Math.round(r.recoverableEvenings);

  return (
    <div className="calc-results">
      <div className="calc-headline">
        <h2 ref={focusRef} tabIndex={-1}>
          You&#39;re losing around <span className="calc-big">{formatMoney(r.totalLostMonthly)}</span> a month.
        </h2>
        <p>That&#39;s about {formatMoney(r.totalLostYearly)} a year.</p>
      </div>

      <ul className="calc-breakdown">
        <li className="calc-bd-card">
          <h3>Missed enquiries</h3>
          <p>
            About {formatCount(r.missedPerMonth)} a month, around {formatCount(r.lostForGoodPerMonth)}{' '}
            of those don&#39;t come back <span aria-hidden="true">→</span>
            <span className="sr-only">, so</span> around {formatCount(r.lostWorkPerMonth)} lost{' '}
            {unitPlural} <span aria-hidden="true">→</span>
            <span className="sr-only">, worth</span> <b>{formatMoney(r.lostFromMissed)}</b>
          </p>
        </li>
        {industry.hasNoShows && r.lostFromNoShows > 0 && (
          <li className="calc-bd-card">
            <h3>No-shows</h3>
            <p>
              <b>{formatMoney(r.lostFromNoShows)}</b> a month
            </p>
          </li>
        )}
        {r.adminHoursPerWeek > 0 && (
          <li className="calc-bd-card">
            <h3>Admin</h3>
            <p>
              {formatUpTo1dp(r.adminHoursPerWeek)} hours a week = {formatWhole(r.adminHoursPerYear)} hours
              a year. That&#39;s {formatWhole(r.eveningsPerYear)} evenings, or{' '}
              {formatWhole(r.saturdaysPerYear)} full Saturdays.
            </p>
          </li>
        )}
      </ul>

      <div className="calc-honest">
        <p>
          If automation won back just half of that, you&#39;d get around{' '}
          <b>{formatMoney(r.recoverableMonthly)} a month</b>
          {evenings > 0 && (
            <>
              {' '}and <b>{formatWhole(evenings)} evenings a year</b>
            </>
          )}{' '}
          back.
        </p>
        <p>
          For comparison: a full-time receptionist costs {RECEPTIONIST_COST_RANGE} a month and only
          covers opening hours.
        </p>
      </div>

      {r.worthIt ? (
        <div className="calc-cta">
          <h2>Want the real number?</h2>
          <p>
            This is an estimate from your figures. The free audit is a 20-minute call where I go
            through your business and find exactly where the money and time are going. No pitch. If
            automation won&#39;t pay for itself, I&#39;ll tell you.
          </p>
          <button type="button" className="btn btn-on-dark calc-cta-btn" onClick={onBook}>
            Book my free lost-revenue audit
          </button>
          <p className="calc-cta-note">
            This adds your answers to the callback form below. Nothing is sent until you press
            Request a callback.
          </p>
        </div>
      ) : (
        <div className="calc-cta calc-cta-plain">
          <h2>Straight answer</h2>
          <p>
            On these numbers, automation probably won&#39;t pay for itself for you yet. I&#39;d
            rather tell you that than sell you something you don&#39;t need. If your enquiries grow,
            run this again.
          </p>
          <button type="button" className="calc-text-link" onClick={onBook}>
            Think the numbers are off? Ask me anyway
          </button>
        </div>
      )}

      <p className="calc-small">
        Estimate based on your figures and typical UK data. Your audit gives the real number.
      </p>

      <p className="calc-founder">
        Built by Adrian Goldman. I ran a London construction company before I built these systems,
        so I know what a missed call costs.
      </p>

      <div className="calc-nav calc-nav-results">
        <button type="button" className="btn btn-ghost" onClick={onChange}>
          Change my numbers
        </button>
        <button type="button" className="btn btn-ghost" onClick={onRestart}>
          Start again
        </button>
      </div>
    </div>
  );
}
