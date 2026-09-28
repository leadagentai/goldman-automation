'use client';
import { useEffect, useRef, useState } from 'react';
import CallbackForm from './CallbackForm';

// The single "Book a free lost-revenue audit" CTA, used on every page.
// If the mechanism changes, it changes here — never per page.
export default function ContactSection({
  heading = 'Tell me when’s good and I’ll call.',
  intro = 'No fixed slot, no back-and-forth — just let me know your best days and times, and the one thing that’s costing you the most in admin right now.',
}) {
  const [submitted, setSubmitted] = useState(false);
  const successRef = useRef(null);

  useEffect(() => {
    if (submitted && successRef.current) {
      successRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      successRef.current.focus();
    }
  }, [submitted]);

  if (submitted) {
    return (
      <div className="contact" id="contact">
        <div className="wrap">
          <div className="contact-success reveal">
            <h2 ref={successRef} tabIndex={-1}>
              Done. I&#39;ll call you.
            </h2>
            <p>
              A confirmation is on its way to your inbox. If you can&#39;t see it, check your spam
              folder. I&#39;ll call at one of the times you picked, usually within one working day.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact" id="contact">
      <div className="wrap contact-grid">
        <div className="reveal">
          <h2>{heading}</h2>
          <p className="intro">{intro}</p>
        </div>
        <div className="reveal">
          <CallbackForm onSuccess={() => setSubmitted(true)} />
        </div>
      </div>
    </div>
  );
}
