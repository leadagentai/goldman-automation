import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendFollowupEmailToLead, sendFollowupReminderToAdmin } from '@/lib/email';

export const runtime = 'nodejs';

function isAuthorized(request) {
  const auth = request.headers.get('authorization');
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const { data: leads, error } = await supabaseAdmin()
    .from('site_leads')
    .select('id, name, email, phone, business_type, language')
    .eq('status', 'new')
    .is('followup_sent_at', null)
    .lt('created_at', cutoff);

  if (error) {
    console.error('GET /api/cron/followup: query failed', error);
    return NextResponse.json({ error: 'Query failed' }, { status: 500 });
  }

  let sent = 0;
  for (const lead of leads || []) {
    try {
      await sendFollowupEmailToLead({
        leadId: lead.id,
        to: lead.email,
        name: lead.name,
        language: lead.language,
      });
      await sendFollowupReminderToAdmin({
        name: lead.name,
        businessType: lead.business_type,
        phone: lead.phone,
        email: lead.email,
      });
      await supabaseAdmin()
        .from('site_leads')
        .update({ followup_sent_at: new Date().toISOString() })
        .eq('id', lead.id);
      sent += 1;
    } catch (err) {
      console.error(`GET /api/cron/followup: failed for lead ${lead.id}`, err);
    }
  }

  return NextResponse.json({ processed: leads?.length || 0, sent });
}
