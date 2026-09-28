'use client';
import { useState } from 'react';
import Link from 'next/link';
import { BUSINESS_TYPE_LABELS, PROBLEM_LABELS } from '@/lib/businessTypes';

const DAY_OPTIONS = [
  'Mon–Fri morning',
  'Mon–Fri afternoon',
  'Mon–Fri evening',
  'Weekend',
];

export default function CallbackForm({ onSuccess }) {
  const [times, setTimes] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function toggleTime(value) {
    setTimes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const form = new FormData(e.target);

    const payload = {
      name: form.get('name'),
      phone: form.get('phone'),
      email: form.get('email'),
      business: form.get('business'),
      problem: form.get('problem'),
      times,
      notes: form.get('notes'),
      website: form.get('website'), // honeypot
    };

    setSubmitting(true);
    try {
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Request failed');
      onSuccess?.();
    } catch {
      setError("Something went wrong sending that. Please email hello@goldmanautomation.co.uk instead.");
      setSubmitting(false);
    }
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
          {Object.entries(BUSINESS_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="cb-problem">What costs you the most in admin right now?</label>
        <select id="cb-problem" name="problem" defaultValue="" required>
          <option value="" disabled>
            Choose one
          </option>
          {Object.entries(PROBLEM_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
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

      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        <label htmlFor="cb-website">Leave this field blank</label>
        <input id="cb-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {error && <p className="form-note" style={{ color: '#b3261e' }}>{error}</p>}

      <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
        {submitting ? 'Sending…' : 'Request a callback'}
      </button>
      <p className="form-note">
        No fixed slot, no back-and-forth. I&#39;ll call you on one of the days you pick.
      </p>
      <p className="form-note">
        By sending this, you agree to Adrian calling you about your enquiry. How we use your
        details: <Link href="/privacy">Privacy policy</Link>.
      </p>
    </form>
  );
}
