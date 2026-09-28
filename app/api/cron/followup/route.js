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

  const retention = await runRetentionCleanup();

  return NextResponse.json({ processed: leads?.length || 0, sent, retention });
}

// Deletes data past the retention periods promised in the privacy policy.
// "won" leads are never touched — they're simply not in the status list below.
async function runRetentionCleanup() {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  const leadsCutoff = twelveMonthsAgo.toISOString();
  const conversationsCutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

  let leadsDeleted = 0;
  try {
    const { data, error } = await supabaseAdmin()
      .from('site_leads')
      .delete()
      .in('status', ['new', 'contacted', 'audit_done', 'lost', 'unsubscribed'])
      .or(
        `and(contacted_at.is.null,created_at.lt.${leadsCutoff}),and(contacted_at.not.is.null,contacted_at.lt.${leadsCutoff})`
      )
      .select('id');
    if (error) throw error;
    leadsDeleted = data?.length || 0;
  } catch (err) {
    console.error(`[cron] step=retention_leads error=${err.message || err}`);
  }

  let conversationsDeleted = 0;
  try {
    const { data, error } = await supabaseAdmin()
      .from('chat_conversations')
      .delete()
      .is('lead_id', null)
      .lt('created_at', conversationsCutoff)
      .select('id');
    if (error) throw error;
    conversationsDeleted = data?.length || 0;
  } catch (err) {
    console.error(`[cron] step=retention_conversations error=${err.message || err}`);
  }

  console.log(
    `[cron] retention: deleted ${leadsDeleted} lead(s), ${conversationsDeleted} chat conversation(s)`
  );

  return { leadsDeleted, conversationsDeleted };
}
