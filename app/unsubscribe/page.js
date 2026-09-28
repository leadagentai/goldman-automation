import { verifyLeadActionToken } from '@/lib/leadActions';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const metadata = { robots: { index: false, follow: false } };

export default async function UnsubscribePage({ searchParams }) {
  const { token } = await searchParams;
  const verified = verifyLeadActionToken(token);

  if (!verified || verified.action !== 'unsubscribe') {
    return (
      <main style={{ maxWidth: 480, margin: '80px auto', padding: '0 20px', fontFamily: 'Inter, sans-serif' }}>
        <h1>Link expired or invalid</h1>
        <p>This unsubscribe link has already been used or isn&#39;t valid.</p>
      </main>
    );
  }

  const { error } = await supabaseAdmin()
    .from('site_leads')
    .update({ status: 'unsubscribed' })
    .eq('id', verified.leadId);

  return (
    <main style={{ maxWidth: 480, margin: '80px auto', padding: '0 20px', fontFamily: 'Inter, sans-serif' }}>
      <h1>{error ? 'Something went wrong' : 'Unsubscribed'}</h1>
      <p>
        {error
          ? 'Please email hello@goldmanautomation.co.uk and ask to be removed.'
          : "You won't get any further emails from Goldman Automation about this enquiry."}
      </p>
    </main>
  );
}
