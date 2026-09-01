import CallbackForm from './CallbackForm';

// The single "Book a free lost-revenue audit" CTA, used on every page.
// If the mechanism changes, it changes here — never per page.
export default function ContactSection({
  heading = 'Tell me when’s good and I’ll call.',
  intro = 'No fixed slot, no back-and-forth — just let me know your best days and times, and the one thing that’s costing you the most in admin right now.',
}) {
  return (
    <div className="contact" id="contact">
      <div className="wrap contact-grid">
        <div className="reveal">
          <h2>{heading}</h2>
          <p className="intro">{intro}</p>
        </div>
        <div className="reveal">
          <CallbackForm />
        </div>
      </div>
    </div>
  );
}
