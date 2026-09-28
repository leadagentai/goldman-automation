import { supabaseAdmin } from './supabaseAdmin';
import { sendLeadConfirmationEmail, sendAdminNotificationEmail } from './email';
import { generatePersonalizedSentence, generateLeadSummary } from './personalize';

// Shared by the contact form and the chat's book_audit tool: saves the lead,
// then sends the confirmation email (if we have an address) and the admin
// notification. Never throws — a failed email should not lose the lead.
export async function createLead({
  source,
  name,
  email,
  phone,
  businessType,
  businessName,
  mainProblem,
  bestTimes,
  language = 'en',
  notes,
  chatConversationId,
  transcript,
}) {
  const { data: lead, error } = await supabaseAdmin()
    .from('site_leads')
    .insert({
      source,
      name,
      email,
      phone,
      business_type: businessType,
      business_name: businessName,
      main_problem: mainProblem,
      best_times: bestTimes,
      language,
      notes,
      chat_conversation_id: chatConversationId || null,
    })
    .select()
    .single();

  if (error) {
    console.error('createLead: failed to save lead', error);
    throw new Error('Could not save lead');
  }

  if (chatConversationId) {
    await supabaseAdmin()
      .from('chat_conversations')
      .update({ lead_id: lead.id })
      .eq('id', chatConversationId);
  }

  const [personalizedSentence, aiSummary] = await Promise.all([
    generatePersonalizedSentence({ mainProblem, businessType, language }),
    generateLeadSummary({ mainProblem, businessType }),
  ]);

  const emailResults = await Promise.allSettled([
    sendLeadConfirmationEmail({
      leadId: lead.id,
      to: email,
      name,
      personalizedSentence,
      language,
    }),
    sendAdminNotificationEmail({
      leadId: lead.id,
      source,
      name,
      email,
      phone,
      businessType,
      businessName,
      mainProblem,
      bestTimes,
      language,
      notes,
      transcript,
      aiSummary,
    }),
  ]);

  emailResults.forEach((result, i) => {
    if (result.status === 'rejected') {
      const label = i === 0 ? 'confirmation' : 'admin notification';
      console.error(`createLead: ${label} email failed for lead ${lead.id}`, result.reason);
    } else if (result.value?.error) {
      const label = i === 0 ? 'confirmation' : 'admin notification';
      console.error(`createLead: ${label} email rejected by Resend for lead ${lead.id}`, result.value.error);
    }
  });

  return lead;
}
