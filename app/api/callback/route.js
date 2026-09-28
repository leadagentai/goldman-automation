import { NextResponse } from 'next/server';
import { createLead } from '@/lib/createLead';
import { businessTypeLabel, problemLabel } from '@/lib/businessTypes';
import { normalizeProblemCategory } from '@/lib/problemSentences';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { name, phone, email, business, problem, times, notes, website } = body || {};

  // Honeypot: real visitors never fill this hidden field.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !phone || !email || !business || !problem) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const bestTimes = Array.isArray(times) ? times.join(', ') : times || null;
  const mainProblem = [problemLabel(problem), notes].filter(Boolean).join(' - ');

  try {
    await createLead({
      source: 'form',
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      phone: String(phone).slice(0, 50),
      businessType: businessTypeLabel(business),
      mainProblem: mainProblem.slice(0, 2000),
      bestTimes,
      problemCategory: normalizeProblemCategory(problem),
      language: 'en',
      notes: notes ? String(notes).slice(0, 2000) : null,
    });
  } catch (err) {
    console.error('POST /api/callback failed', err);
    return NextResponse.json({ error: 'Could not save your request' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
