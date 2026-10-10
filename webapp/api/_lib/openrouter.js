/* global process */
// Shared by the chat and chat-summary functions. Files under _lib are not exposed as routes.

// Ordered fastest-first (measured Oct 2026)
export const CHAT_MODELS = [
  'nvidia/nemotron-3-super-120b-a12b:free',
  'apodex/apodex-1.1-mini:free',
  'nvidia/nemotron-3.5-lightning:free',
  'google/gemma-4-31b-it:free',
  'google/gemma-4-26b-a4b-it:free',
  'thinkingmachines/inkling:free',
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  // Not in OpenRouter's model catalog as of Oct 2026; kept last so they don't slow down every request
  'inception/mercury-decide:free',
  'openai/gpt-oss-20b:free'
];

// Browsers send an Origin header on cross-site POSTs; only this site's own pages may call the API
export const isSameOrigin = (req) => {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
};

// sendBeacon and some clients deliver the JSON body as a string
export const readJsonBody = (req) => {
  if (typeof req.body !== 'string') return req.body;
  try {
    return JSON.parse(req.body);
  } catch {
    return null;
  }
};

// Tries each model in order and returns the first non-empty answer, or null if none answers in time
export const completeChat = async ({
  messages,
  models = CHAT_MODELS,
  maxTokens = 400,
  temperature = 0.3,
  perModelTimeoutMs = 10000,
  deadlineMs = 45000
}) => {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set in Vercel');

  const startedAt = Date.now();

  for (const model of models) {
    const remaining = deadlineMs - (Date.now() - startedAt);
    if (remaining < 2000) break;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          // Reasoning off: these are simple CV lookups and thinking tokens only add latency
          reasoning: { enabled: false }
        }),
        signal: AbortSignal.timeout(Math.min(perModelTimeoutMs, remaining))
      });
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content?.trim();
      if (response.ok && content) return content;
      console.warn(`Model ${model} failed, trying next:`, data.error?.message || response.status);
    } catch (error) {
      console.warn(`Model ${model} failed, trying next:`, error?.message || error);
    }
  }

  return null;
};
