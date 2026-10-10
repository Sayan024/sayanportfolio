/* global process */
// Vercel serverless function: summarises a finished portfolio chat and emails it to Sayan.
// Secrets come from Vercel environment variables and never reach the browser.

import { CHAT_MODELS, completeChat, isSameOrigin, readJsonBody } from './_lib/openrouter.js';

export const config = { maxDuration: 30 };

const OWNER_EMAIL = 'sayanbanerjee024@gmail.com';
// Resend's shared sender; it can only deliver to the address the Resend account was created with
const FROM_ADDRESS = 'Portfolio Chat <onboarding@resend.dev>';

const MIN_USER_MESSAGES = 2;
const MAX_MESSAGES = 60;
const MAX_MESSAGE_CHARS = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const SUMMARY_PROMPT =
  "You summarise chats between a visitor and the AI assistant on Sayan Banerjee's portfolio website, for Sayan to read. " +
  'Write 3 to 5 short plain-text bullet points starting with "- ": who the visitor seems to be (recruiter, peer, unknown), ' +
  'what they asked about, any hiring interest or role mentioned, and any follow-up Sayan should do. ' +
  'Use only what is in the transcript. No markdown formatting other than the bullets.';

// The email still goes out with the transcript if no model can summarise it
const summarise = async (transcript) => {
  try {
    return await completeChat({
      messages: [
        { role: 'system', content: SUMMARY_PROMPT },
        { role: 'user', content: transcript }
      ],
      models: CHAT_MODELS.slice(0, 3),
      maxTokens: 250,
      temperature: 0.2,
      perModelTimeoutMs: 8000,
      deadlineMs: 20000
    });
  } catch {
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isSameOrigin(req)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY is not set in Vercel' });
  }

  const body = readJsonBody(req);
  if (!body) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const messages = Array.isArray(body?.messages)
    ? body.messages
        .filter((m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string')
        .slice(0, MAX_MESSAGES)
        .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }))
    : [];

  if (messages.filter((m) => m.role === 'user').length < MIN_USER_MESSAGES) {
    return res.status(200).json({ sent: false, reason: 'Conversation too short' });
  }

  const visitorName = typeof body.visitor?.name === 'string' ? body.visitor.name.replace(/[\r\n]+/g, ' ').trim().slice(0, 100) : '';
  const rawEmail = typeof body.visitor?.email === 'string' ? body.visitor.email.trim().slice(0, 200) : '';
  const visitorEmail = EMAIL_PATTERN.test(rawEmail) ? rawEmail : '';

  const transcript = messages
    .map((m) => `${m.role === 'user' ? 'Visitor' : 'Assistant'}: ${m.content}`)
    .join('\n\n');

  const summary = await summarise(transcript);

  const summaryHtml = summary
    ? `<ul>${summary
        .split('\n')
        .map((line) => line.replace(/^\s*[-*•]\s*/, '').trim())
        .filter(Boolean)
        .map((line) => `<li>${escapeHtml(line)}</li>`)
        .join('')}</ul>`
    : '<p><em>Summary unavailable. See the transcript below.</em></p>';

  const transcriptHtml = messages
    .map(
      (m) =>
        `<p style="margin:0 0 10px"><strong style="color:${m.role === 'user' ? '#b45309' : '#475569'}">${
          m.role === 'user' ? 'Visitor' : 'Assistant'
        }:</strong> ${escapeHtml(m.content).replace(/\n/g, '<br>')}</p>`
    )
    .join('');

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#111827;max-width:640px">
      <h2 style="margin:0 0 12px">New portfolio chat</h2>
      <p style="margin:0 0 4px"><strong>Name:</strong> ${visitorName ? escapeHtml(visitorName) : 'Not provided'}</p>
      <p style="margin:0 0 16px"><strong>Email:</strong> ${
        visitorEmail ? `<a href="mailto:${escapeHtml(visitorEmail)}">${escapeHtml(visitorEmail)}</a>` : 'Not provided'
      }</p>
      <h3 style="margin:0 0 6px">Summary</h3>
      ${summaryHtml}
      <h3 style="margin:16px 0 6px">Full transcript</h3>
      ${transcriptHtml}
    </div>`;

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: OWNER_EMAIL,
      subject: `Portfolio chat${visitorName ? ` from ${visitorName}` : ''}${visitorEmail ? ` (${visitorEmail})` : ''}`,
      html,
      ...(visitorEmail ? { reply_to: visitorEmail } : {})
    })
  });

  if (!emailResponse.ok) {
    const detail = await emailResponse.text();
    console.error('Resend error:', emailResponse.status, detail);
    return res.status(502).json({ error: 'Email could not be sent' });
  }

  return res.status(200).json({ sent: true, summarised: Boolean(summary) });
}
