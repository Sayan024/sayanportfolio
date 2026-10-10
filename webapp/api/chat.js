// Vercel serverless function: answers portfolio chat questions.
// The OpenRouter key and the system prompt stay on the server, so the browser never sees either.

import { completeChat, isSameOrigin, readJsonBody } from './_lib/openrouter.js';
import { resumeContext } from '../src/components/resumeContext.js';

export const config = { maxDuration: 60 };

const MAX_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 2000;

// Sayan's first (and current) professional role started in Dec 2024
const CAREER_START = new Date(2024, 11, 1);

const getExperienceText = () => {
  const now = new Date();
  const months = (now.getFullYear() - CAREER_START.getFullYear()) * 12 + (now.getMonth() - CAREER_START.getMonth());
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const parts = [];
  if (years) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (rem) parts.push(`${rem} month${rem > 1 ? 's' : ''}`);
  return parts.join(' ') || 'less than a month';
};

const buildSystemPrompt = () => {
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return `You are the AI assistant on Sayan Banerjee's portfolio website. Visitors are mostly recruiters and hiring managers.
Answer questions about Sayan's skills, experience, projects, certifications, target roles, and career expectations using ONLY the CV context below.

Today's date: ${today}
Total professional experience: about ${getExperienceText()} (all at Embee Software, Dec 2024 to present). Use this when asked about years of experience.

ANSWER STYLE (follow strictly):
- Answer the exact question first, in the first sentence. Short follow-ups like "in years?" refer to the previous question.
- Be concise: 1 to 3 short sentences, or at most 5 short bullet points for lists. Never write long paragraphs.
- Use "- " bullets for lists and **bold** only for a few key terms. No headings, no tables.
- No filler openings or closings. Do not offer the email address unless the answer is not in the CV.
- Never invent facts, employers, numbers, or history that are not in the CV context.

RULES:
- Salary or job search status: Sayan is actively looking for Data Analyst or Data Engineer roles, expecting around ₹9 LPA.
- Projects or dashboards: name the relevant project(s) and ALWAYS include the GitHub link(s) from the CV context.
- If the question is not answered by the CV, is a complex technical question, or asks you to build something: say briefly that you don't have that information and suggest emailing Sayan at sayanbanerjee024@gmail.com.

--- CV CONTEXT ---
${resumeContext}
`;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isSameOrigin(req)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const body = readJsonBody(req);
  const messages = Array.isArray(body?.messages)
    ? body.messages
        .filter((m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string')
        .slice(-MAX_MESSAGES)
        .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }))
    : [];

  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'A user message is required' });
  }

  try {
    const content = await completeChat({
      messages: [{ role: 'system', content: buildSystemPrompt() }, ...messages]
    });

    if (!content) {
      return res.status(502).json({ error: 'No model answered' });
    }
    return res.status(200).json({ content });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Chat is not configured' });
  }
}
