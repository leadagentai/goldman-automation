'use client';
import { useState } from 'react';

const DAY_OPTIONS = [
  'Mon–Fri morning',
  'Mon–Fri afternoon',
  'Mon–Fri evening',
  'Weekend',
];

export default function CallbackForm() {
  const [times, setTimes] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  function toggleTime(value) {
    setTimes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: POST to /api/callback — sends branded confirmation to the lead
    // and a notification to Adrian (same Resend pattern as Scure confirmations).
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="form-success">
        <h3>Got it — thanks.</h3>
        <p>
          I&#39;ll be in touch on one of the days you picked. You&#39;ll get a confirmation
          email shortly with what to expect from the call.
        </p>
      </div>
    );
  }

  return (
    <form className="callback-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="cb-name">Your name</label>
        <input id="cb-name" name="name" type="text" autoComplete="name" required />
      </div>

      <div className="field">
        <label htmlFor="cb-phone">Phone</label>
        <input id="cb-phone" name="phone" type="tel" autoComplete="tel" required />
      </div>

      <div className="field">
        <label htmlFor="cb-email">Email</label>
        <input id="cb-email" name="email" type="email" autoComplete="email" required />
      </div>

      <div className="field">
        <label htmlFor="cb-business">Type of business</label>
        <select id="cb-business" name="business" defaultValue="" required>
          <option value="" disabled>
            Choose one
          </option>
          <option value="trades">Construction &amp; trades</option>
          <option value="clinic">Beauty &amp; clinics</option>
          <option value="other">Something else</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="cb-problem">What costs you the most in admin right now?</label>
        <select id="cb-problem" name="problem" defaultValue="" required>
          <option value="" disabled>
            Choose one
          </option>
          <option value="missed-calls">Missed calls and enquiries</option>
          <option value="no-shows">No-shows and cancellations</option>
          <option value="follow-up">Following up and chasing</option>
          <option value="paperwork">Forms, records and paperwork</option>
          <option value="other">Something else</option>
        </select>
      </div>

      <div className="field">
        <label>Best days and times to call</label>
        <div className="choice-group">
          {DAY_OPTIONS.map((opt) => (
            <label key={opt} className="choice">
              <input
                type="checkbox"
                name="times"
                value={opt}
                checked={times.includes(opt)}
                onChange={() => toggleTime(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div className="field">
        <label htmlFor="cb-notes">Anything else? (optional)</label>
        <textarea id="cb-notes" name="notes" rows={3} />
      </div>

      <button type="submit" className="btn btn-primary btn-block">
        Request a callback
      </button>
      <p className="form-note">
        No fixed slot, no back-and-forth. I&#39;ll call you on one of the days you pick.
      </p>
    </form>
  );
}
