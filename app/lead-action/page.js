import { verifyLeadActionToken } from '@/lib/leadActions';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const metadata = { robots: { index: false, follow: false } };

const LABELS = {
  contacted: 'marked as contacted',
  audit_done: 'marked as audit done',
  won: 'marked as won',
  lost: 'marked as lost',
};

export default async function LeadActionPage({ searchParams }) {
  const { token } = await searchParams;
  const verified = verifyLeadActionToken(token);

  if (!verified || verified.action === 'unsubscribe') {
    return (
      <main style={{ maxWidth: 480, margin: '80px auto', padding: '0 20px', fontFamily: 'Inter, sans-serif' }}>
        <h1>Link expired or invalid</h1>
        <p>This link has already been used, expired, or isn&#39;t valid.</p>
      </main>
    );
  }

  const update = { status: verified.status };
  if (verified.action === 'contacted') update.contacted_at = new Date().toISOString();

  const { error } = await supabaseAdmin().from('site_leads').update(update).eq('id', verified.leadId);

  return (
    <main style={{ maxWidth: 480, margin: '80px auto', padding: '0 20px', fontFamily: 'Inter, sans-serif' }}>
      <h1>{error ? 'Something went wrong' : 'Done'}</h1>
      <p>
        {error
          ? "Couldn't update that lead. Try again from Supabase directly."
          : `Lead ${LABELS[verified.action]}.`}
      </p>
    </main>
  );
}
