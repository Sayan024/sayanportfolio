/* global process */
// Vercel serverless function: summarises a finished portfolio chat and emails it to Sayan.
// Secrets come from Vercel environment variables and never reach the browser.

export const config = { maxDuration: 30 };

const OWNER_EMAIL = 'sayanbanerjee024@gmail.com';
// Resend's shared sender; it can only deliver to the address the Resend account was created with
const FROM_ADDRESS = 'Portfolio Chat <onboarding@resend.dev>';

const ALLOWED_ORIGINS = [
  'https://sayanportfolio-tau.vercel.app',
  'http://localhost:5173'
];

const SUMMARY_MODELS = [
  'nvidia/nemotron-3-super-120b-a12b:free',
  'apodex/apodex-1.1-mini:free',
  'nvidia/nemotron-3.5-lightning:free'
];

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

const summarise = async (transcript) => {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) return null;

  for (const model of SUMMARY_MODELS) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_tokens: 250,
          reasoning: { enabled: false },
          messages: [
            {
              role: 'system',
              content:
                "You summarise chats between a visitor and the AI assistant on Sayan Banerjee's portfolio website, for Sayan to read. " +
                'Write 3 to 5 short plain-text bullet points starting with "- ": who the visitor seems to be (recruiter, peer, unknown), ' +
                'what they asked about, any hiring interest or role mentioned, and any follow-up Sayan should do. ' +
                'Use only what is in the transcript. No markdown formatting other than the bullets.'
            },
            { role: 'user', content: transcript }
          ]
        }),
        signal: AbortSignal.timeout(8000)
      });
      const data = await response.json();
      const summary = data.choices?.[0]?.message?.content?.trim();
      if (response.ok && summary) return summary;
    } catch {
      // try the next model
    }
  }
  return null;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const origin = req.headers.origin;
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY is not set in Vercel' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
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
