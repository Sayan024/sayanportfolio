import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Check } from 'lucide-react';
import './ChatAssistant.css';

// The model list, API key and system prompt live in the /api/chat serverless function
const CHAT_ENDPOINT = '/api/chat';
const CHAT_TIMEOUT_MS = 55000;

const SUGGESTED_QUESTIONS = [
  "How many years of experience?",
  "What are his top skills?",
  "Show me his projects",
  "Which certifications?"
];

// The conversation summary is emailed to Sayan when the chat is closed, after this much inactivity, or when the visitor leaves the page
const SUMMARY_IDLE_MS = 2 * 60 * 1000;
const SUMMARY_ENDPOINT = '/api/chat-summary';
const MIN_USER_MESSAGES_FOR_SUMMARY = 2;

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

const INITIAL_MESSAGES = [
  { role: 'assistant', content: "Hi! I'm Sayan's AI assistant. Ask me anything about his experience, skills, or projects." }
];

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Optional contact details the visitor chooses to leave
  const [visitor, setVisitor] = useState(null);
  const [leadDismissed, setLeadDismissed] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '' });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const messagesRef = useRef(messages);
  const visitorRef = useRef(visitor);
  const lastSummaryRef = useRef('');
  // Bumped when the chat is closed so a late answer can't land in the next conversation
  const conversationIdRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading, visitor, leadDismissed]);

  // Emails Sayan a summary of the conversation, at most once per conversation state
  const sendSummary = (pageIsClosing) => {
    const chat = messagesRef.current;
    const userCount = chat.filter(m => m.role === 'user').length;
    const signature = `${chat.length}|${visitorRef.current?.email || ''}`;
    if (userCount < MIN_USER_MESSAGES_FOR_SUMMARY || signature === lastSummaryRef.current) return;
    lastSummaryRef.current = signature;

    const payload = JSON.stringify({
      messages: chat.map(m => ({ role: m.role, content: m.content })),
      visitor: visitorRef.current
    });

    if (pageIsClosing && navigator.sendBeacon) {
      navigator.sendBeacon(SUMMARY_ENDPOINT, new Blob([payload], { type: 'application/json' }));
    } else {
      fetch(SUMMARY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(() => {});
    }
  };

  // Treat the conversation as ended after a period of inactivity
  useEffect(() => {
    messagesRef.current = messages;
    visitorRef.current = visitor;
    const idleTimer = setTimeout(() => sendSummary(false), SUMMARY_IDLE_MS);
    return () => clearTimeout(idleTimer);
  }, [messages, visitor]);

  // ...or when the visitor leaves the page
  useEffect(() => {
    const handlePageHide = () => sendSummary(true);
    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, []);

  const sendMessage = async (text) => {
    const question = text.trim();
    if (!question || isLoading) return;
    const conversationId = conversationIdRef.current;

    const userMessage = { role: 'user', content: question };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
        signal: AbortSignal.timeout(CHAT_TIMEOUT_MS)
      });
      const data = await response.json();

      if (conversationId !== conversationIdRef.current) return;

      if (!response.ok || !data.content) {
        throw new Error(data.error || `Chat request failed (${response.status})`);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);

    } catch (error) {
      console.error("Chat error:", error);
      if (conversationId !== conversationIdRef.current) return;
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I couldn't reach the AI service just now. Please try again, or email Sayan directly at sayanbanerjee024@gmail.com."
      }]);
    } finally {
      if (conversationId === conversationIdRef.current) setIsLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    sendMessage(inputValue);
  };

  // Closing the chat ends the conversation: send the summary now and start fresh next time
  const handleClose = () => {
    sendSummary(false);
    lastSummaryRef.current = '';
    conversationIdRef.current += 1;
    setIsLoading(false);
    setIsOpen(false);
    setMessages(INITIAL_MESSAGES);
    setVisitor(null);
    setLeadDismissed(false);
    setLeadForm({ name: '', email: '' });
    setInputValue('');
    launcherRef.current?.focus();
  };

  // Lets the Escape listener call the latest handleClose without re-subscribing on every render
  const closeRef = useRef(handleClose);
  useEffect(() => {
    closeRef.current = handleClose;
  });

  // Keyboard users land in the input when the chat opens, and Escape closes it
  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeRef.current();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    const email = leadForm.email.trim();
    if (!email) return;
    setVisitor({ name: leadForm.name.trim(), email });
  };

  const showSuggestions = messages.length === 1 && !isLoading;
  const userMessageCount = messages.filter(m => m.role === 'user').length;
  const showLeadForm = userMessageCount >= MIN_USER_MESSAGES_FOR_SUMMARY && !visitor && !leadDismissed && !isLoading;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        ref={launcherRef}
        className="chat-toggle-btn"
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open the AI assistant chat"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        tabIndex={isOpen ? -1 : 0}
        style={{ pointerEvents: isOpen ? 'none' : 'auto' }}
      >
        <img src="/chat-bubble.png" alt="" className="chat-toggle-bubble" width="255" height="240" />
        <img src="/chat-mascot.png" alt="" className="chat-toggle-mascot" width="258" height="420" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-window"
            role="dialog"
            aria-label="Chat with Sayan's AI assistant"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-avatar">
                  <img src="/chat-bubble.png" alt="" />
                </div>
                <div>
                  <h2>Sayan's AI Assistant</h2>
                  <p className="chat-status"><span className="chat-status-dot" aria-hidden="true"></span>AI assistant · answers from his CV</p>
                </div>
              </div>
              <button className="close-btn" onClick={handleClose} aria-label="Close and end chat">
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="chat-messages" role="log" aria-live="polite" aria-label="Conversation">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`chat-bubble-container ${msg.role}`}
                >
                  <div className="chat-bubble-avatar" aria-hidden="true">
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
              {showLeadForm && (
                <form className="chat-lead-card" onSubmit={handleLeadSubmit}>
                  <p className="chat-lead-title">Want Sayan to follow up?</p>
                  <p className="chat-lead-text">Leave your details and he'll get back to you.</p>
                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    aria-label="Your name (optional)"
                    autoComplete="name"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    maxLength={100}
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    aria-label="Your email"
                    autoComplete="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    maxLength={200}
                    required
                  />
                  <div className="chat-lead-actions">
                    <button type="submit" className="chat-lead-submit">Share</button>
                    <button type="button" className="chat-lead-skip" onClick={() => setLeadDismissed(true)}>
                      No thanks
                    </button>
                  </div>
                </form>
              )}
              {visitor && (
                <div className="chat-lead-card chat-lead-done">
                  <Check size={16} aria-hidden="true" />
                  <span>Thanks{visitor.name ? `, ${visitor.name}` : ''}! Sayan will reach out at {visitor.email}.</span>
                </div>
              )}
              {isLoading && (
                <div className="chat-bubble-container assistant">
                  <div className="chat-bubble-avatar" aria-hidden="true">
                    <Bot size={16} />
                  </div>
                  <div className="chat-bubble assistant typing" role="status" aria-label="Assistant is typing">
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
                ref={inputRef}
                type="text"
                placeholder="Ask about skills, experience, projects..."
                aria-label="Your question"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                maxLength={500}
                autoComplete="off"
              />
              <button type="submit" disabled={!inputValue.trim() || isLoading} aria-label="Send message">
                <Send size={18} aria-hidden="true" />
              </button>
            </form>
            <p className="chat-privacy-note">Answers come from an AI service. Chats may be shared with Sayan so he can follow up.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;
