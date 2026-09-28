import { Resend } from 'resend';
import { unsubscribeUrl, leadActionUrl } from './leadActions';

let resendClient;
function resend() {
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

const FROM = 'Adrian Goldman <hello@goldmanautomation.co.uk>';

function firstName(name) {
  if (!name) return 'there';
  return name.trim().split(/\s+/)[0];
}

function footer(leadId) {
  const unsubLink = leadId ? unsubscribeUrl(leadId) : null;
  return `
    <p style="margin-top:32px;padding-top:16px;border-top:1px solid #e1eae1;color:#797B6E;font-size:12px;">
      Goldman Automation, London.
      ${unsubLink ? `<a href="${unsubLink}" style="color:#797B6E;">Unsubscribe from further emails</a>.` : ''}
    </p>
  `;
}

function wrapHtml(bodyHtml, leadId) {
  return `<div style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.6;color:#24261F;max-width:560px;">${bodyHtml}${footer(leadId)}</div>`;
}

export async function sendLeadConfirmationEmail({ leadId, to, name, personalizedSentence, language }) {
  if (!to) return;
  const first = firstName(name);

  if (language === 'pl') {
    const subject = 'Twój darmowy audyt - oddzwonię';
    const html = wrapHtml(
      `
      <p>Cze&#347;&#263; ${first},</p>
      <p>Dzi&#281;ki za wiadomo&#347;&#263;. ${personalizedSentence}</p>
      <p>Zadzwoni&#281; w jednym z terminów, które poda&#322;e&#347;, zwykle w ci&#261;gu jednego dnia roboczego. Rozmowa trwa 20 minut. Zapytam, jak dzi&#347; trafiaj&#261; do Ciebie zapytania i rezerwacje i gdzie si&#281; gubi&#261;, a potem powiem wprost, ile Ci&#281; to kosztuje i czy automatyzacja si&#281; zwróci. Je&#347;li nie, powiem to.</p>
      <p>Je&#347;li co&#347; jest pilne, po prostu odpisz na tego maila.</p>
      <p>Adrian<br/>Goldman Automation<br/>goldmanautomation.co.uk</p>
      `,
      leadId
    );
    return resend().emails.send({ from: FROM, to, replyTo: 'hello@goldmanautomation.co.uk', subject, html });
  }

  const subject = "Your free audit - I'll call you";
  const html = wrapHtml(
    `
    <p>Hi ${first},</p>
    <p>Thanks for getting in touch. ${personalizedSentence}</p>
    <p>I'll call you at one of the times you gave me, usually within one working day. The call takes 20 minutes. I'll ask how enquiries and bookings reach you today and where they get lost, then give you a straight answer on what it's costing you and whether automation would pay for itself. If it won't, I'll tell you.</p>
    <p>If anything's urgent, just reply to this email.</p>
    <p>Adrian<br/>Goldman Automation<br/>goldmanautomation.co.uk</p>
    `,
    leadId
  );
  return resend().emails.send({ from: FROM, to, replyTo: 'hello@goldmanautomation.co.uk', subject, html });
}

export async function sendFollowupEmailToLead({ leadId, to, name, language }) {
  if (!to) return;
  const first = firstName(name);

  if (language === 'pl') {
    const subject = 'Nadal chcesz porozmawia&#263;?';
    const html = wrapHtml(
      `
      <p>Cze&#347;&#263; ${first},</p>
      <p>Nie uda&#322;o mi si&#281; jeszcze do Ciebie dodzwoni&#263;. Je&#347;li tak b&#281;dzie &#322;atwiej, odpisz z dniem i godzin&#261;, która Ci pasuje, a zadzwoni&#281; wtedy. Albo odpisz "nie teraz", a zostawi&#281; to na razie.</p>
      <p>Adrian</p>
      `,
      leadId
    );
    return resend().emails.send({ from: FROM, to, replyTo: 'hello@goldmanautomation.co.uk', subject, html });
  }

  const subject = 'Still happy to talk?';
  const html = wrapHtml(
    `
    <p>Hi ${first},</p>
    <p>I haven't managed to catch you yet. If it's easier, reply with a day and time that suits you and I'll call then. Or reply "not now" and I'll leave it there.</p>
    <p>Adrian</p>
    `,
    leadId
  );
  return resend().emails.send({ from: FROM, to, replyTo: 'hello@goldmanautomation.co.uk', subject, html });
}

function actionButtons(leadId) {
  const actions = [
    ['Mark as contacted', 'contacted'],
    ['Mark audit done', 'audit_done'],
    ['Won', 'won'],
    ['Lost', 'lost'],
  ];
  return actions
    .map(
      ([label, action]) =>
        `<a href="${leadActionUrl(leadId, action)}" style="display:inline-block;margin:4px 8px 4px 0;padding:8px 14px;background:#163F34;color:#F6F2E7;text-decoration:none;border-radius:6px;font-size:13px;">${label}</a>`
    )
    .join('');
}

export async function sendAdminNotificationEmail({
  leadId,
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
}) {
  const to = process.env.ADMIN_EMAIL;
  const subject = `New lead (${source}): ${businessType || 'unspecified'} — ${name || 'unnamed'}`;

  const rows = [
    ['Source', source],
    ['Name', name],
    ['Email', email],
    ['Phone', phone],
    ['Business type', businessType],
    ['Business name', businessName],
    ['Main problem', mainProblem],
    ['Best times', bestTimes],
    ['Language', language],
    ['Notes', notes],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#797B6E;">${k}</td><td>${v}</td></tr>`)
    .join('');

  const transcriptHtml =
    source === 'chat' && Array.isArray(transcript)
      ? `<h4>Full transcript</h4><pre style="white-space:pre-wrap;background:#FBF9F1;padding:12px;border-radius:8px;font-size:12px;">${transcript
          .map((m) => `${m.role}: ${m.content}`)
          .join('\n')}</pre>`
      : '';

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;font-size:14px;color:#24261F;max-width:640px;">
      ${aiSummary ? `<p><b>Summary:</b> ${aiSummary}</p>` : ''}
      <table>${rows}</table>
      <div style="margin-top:16px;">${actionButtons(leadId)}</div>
      ${transcriptHtml}
    </div>
  `;

  return resend().emails.send({ from: FROM, to, subject, html });
}

export async function sendFollowupReminderToAdmin({ name, businessType, phone, email }) {
  const to = process.env.ADMIN_EMAIL;
  const subject = `Not yet called: ${name || 'unnamed'}`;
  const html = `<p>Not yet called: ${name || 'unnamed'}, ${businessType || 'unspecified'}, ${phone || email || 'no contact given'}.</p>`;
  return resend().emails.send({ from: FROM, to, subject, html });
}
