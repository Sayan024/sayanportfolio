import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User } from 'lucide-react';
import './ChatAssistant.css';
import { resumeContext } from './resumeContext';

const MODELS = [
  // Ordered fastest-first (measured Oct 2026)
  "nvidia/nemotron-3-super-120b-a12b:free",
  "apodex/apodex-1.1-mini:free",
  "nvidia/nemotron-3.5-lightning:free",
  "google/gemma-4-31b-it:free",
  "google/gemma-4-26b-a4b-it:free",
  "thinkingmachines/inkling:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  // Not in OpenRouter's model catalog as of Oct 2026; kept last so they don't slow down every request
  "inception/mercury-decide:free",
  "openai/gpt-oss-20b:free"
];

// Give up on a model that hasn't answered in this long and try the next one
const MODEL_TIMEOUT_MS = 12000;

const SUGGESTED_QUESTIONS = [
  "How many years of experience?",
  "What are his top skills?",
  "Show me his projects",
  "Which certifications?"
];

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

const INLINE_PATTERN = /(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;
const BULLET_PATTERN = /^\s*(?:[-*•]|\d+[.)])\s+/;

// Renders the small markdown subset the assistant is asked to use: bold, links, emails
const renderInline = (text) =>
  text.split(INLINE_PATTERN).map((part, i) => {
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const mdLink = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (mdLink) {
      return <a key={i} href={mdLink[2]} target="_blank" rel="noopener noreferrer">{mdLink[1]}</a>;
    }
    if (/^https?:\/\//.test(part)) {
      const url = part.replace(/[.,;:!?]+$/, '');
      const trailing = part.slice(url.length);
      return (
        <React.Fragment key={i}>
          <a href={url} target="_blank" rel="noopener noreferrer">{url.replace(/^https?:\/\//, '')}</a>
          {trailing}
        </React.Fragment>
      );
    }
    if (/^[\w.+-]+@[\w-]+(?:\.[\w-]+)+$/.test(part)) {
      return <a key={i} href={`mailto:${part}`}>{part}</a>;
    }
    return part.replace(/[*`]/g, '');
  });

const renderMessage = (content) => {
  const blocks = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length) {
      blocks.push(<ul key={`ul-${blocks.length}`}>{listItems}</ul>);
      listItems = [];
    }
  };

  content.split('\n').forEach((rawLine, i) => {
    const line = rawLine.replace(/^\s*#+\s*/, '').trim();
    if (!line) {
      flushList();
    } else if (BULLET_PATTERN.test(line)) {
      listItems.push(<li key={i}>{renderInline(line.replace(BULLET_PATTERN, ''))}</li>);
    } else {
      flushList();
      blocks.push(<p key={i}>{renderInline(line)}</p>);
    }
  });
  flushList();

  return blocks;
};

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Sayan's AI assistant. Ask me anything about his experience, skills, or projects." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const sendMessage = async (text) => {
    const question = text.trim();
    if (!question || isLoading) return;

    const userMessage = { role: 'user', content: question };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

      // Prepare messages for the API (including system prompt)
      const apiMessages = [
        { role: 'system', content: buildSystemPrompt() },
        ...newMessages.map(m => ({ role: m.role, content: m.content }))
      ];

      // Model routing: try each model in order, moving to the next on any failure
      let assistantMessage = null;
      for (const model of MODELS) {
        try {
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model,
              messages: apiMessages,
              temperature: 0.3,
              max_tokens: 400,
              // Reasoning off: these are simple CV lookups and thinking tokens only add latency
              reasoning: { enabled: false }
            }),
            signal: AbortSignal.timeout(MODEL_TIMEOUT_MS)
          });

          const data = await response.json();

          if (response.ok && data.choices?.[0]?.message?.content?.trim()) {
            assistantMessage = data.choices[0].message;
            break;
          }
          console.warn(`Model ${model} failed, trying next:`, data.error?.message || response.status);
        } catch (modelError) {
          console.warn(`Model ${model} failed, trying next:`, modelError);
        }
      }

      if (assistantMessage) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: assistantMessage.content.trim()
        }]);
      } else {
        throw new Error("All models failed");
      }

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I couldn't reach the AI service just now. Please try again, or email Sayan directly at sayanbanerjee024@gmail.com."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    sendMessage(inputValue);
  };

  const showSuggestions = messages.length === 1 && !isLoading;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="chat-toggle-btn"
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open AI assistant"
      >
        <img src="/aichat.gif" alt="AI Chat" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-avatar" style={{ overflow: 'hidden' }}>
                  <img src="/aichat.gif" alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h3>Sayan's AI Assistant</h3>
                  <p className="chat-status"><span className="chat-status-dot"></span>Online · answers from his CV</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setIsOpen(false)} aria-label="Close chat">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`chat-bubble-container ${msg.role}`}
                >
                  <div className="chat-bubble-avatar">
                    {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className={`chat-bubble ${msg.role}`}>
                    {msg.role === 'assistant' ? renderMessage(msg.content) : msg.content}
                  </div>
                </motion.div>
              ))}
              {showSuggestions && (
                <div className="chat-suggestions">
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      className="chat-suggestion"
                      onClick={() => sendMessage(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
              {isLoading && (
                <div className="chat-bubble-container assistant">
                  <div className="chat-bubble-avatar">
                    <Bot size={16} />
                  </div>
                  <div className="chat-bubble assistant typing" aria-label="Assistant is typing">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Ask about skills, experience, projects..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
              <button type="submit" disabled={!inputValue.trim() || isLoading} aria-label="Send message">
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;
