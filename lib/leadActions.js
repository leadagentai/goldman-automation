import crypto from 'crypto';

const VALID_ACTIONS = ['contacted', 'audit_done', 'won', 'lost', 'unsubscribe'];
const STATUS_BY_ACTION = {
  contacted: 'contacted',
  audit_done: 'audit_done',
  won: 'won',
  lost: 'lost',
  unsubscribe: 'unsubscribed',
};

function sign(payload) {
  return crypto
    .createHmac('sha256', process.env.LINK_SIGNING_SECRET)
    .update(payload)
    .digest('base64url');
}

// Encodes {leadId, action} into a signed, URL-safe token good for 30 days.
export function createLeadActionToken(leadId, action) {
  if (!VALID_ACTIONS.includes(action)) {
    throw new Error(`Invalid lead action: ${action}`);
  }
  const exp = Date.now() + 30 * 24 * 60 * 60 * 1000;
  const payload = `${leadId}.${action}.${exp}`;
  return `${Buffer.from(payload).toString('base64url')}.${sign(payload)}`;
}

export function verifyLeadActionToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return null;

  let payload;
  try {
    payload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
  } catch {
    return null;
  }

  const expected = sign(payload);
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  const [leadId, action, expStr] = payload.split('.');
  const exp = Number(expStr);
  if (!leadId || !VALID_ACTIONS.includes(action) || !exp || Date.now() > exp) return null;

  return { leadId, action, status: STATUS_BY_ACTION[action] };
}

export function leadActionUrl(leadId, action) {
  const token = createLeadActionToken(leadId, action);
  return `${process.env.SITE_URL}/lead-action?token=${token}`;
}

export function unsubscribeUrl(leadId) {
  const token = createLeadActionToken(leadId, 'unsubscribe');
  return `${process.env.SITE_URL}/unsubscribe?token=${token}`;
}
