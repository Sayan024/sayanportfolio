import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import './ChatAssistant.css';
import { resumeContext } from './resumeContext';

const SYSTEM_PROMPT = `You are a helpful AI assistant on Sayan Banerjee's portfolio website. 
Your job is to answer questions about Sayan's skills, experience, and projects using ONLY the provided CV context below.
Keep your answers relatively brief, friendly, and professional.
CRITICAL INSTRUCTION: If the user asks a highly complex technical question, asks to build something for them, or asks something not found in the CV, you MUST politely tell them to email Sayan at sayanbanerjee024@gmail.com.

--- CV CONTEXT ---
${resumeContext}
`;

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Sayan's AI assistant. Ask me anything about his experience or skills!" }
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
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage = { role: 'user', content: inputValue };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      
      // Prepare messages for the API (including system prompt)
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...newMessages.map(m => ({ 
          role: m.role, 
          content: m.content,
          ...(m.reasoning_details ? { reasoning_details: m.reasoning_details } : {}) 
        }))
      ];

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b:free", // Using the free tier model the user requested
          messages: apiMessages,
          reasoning: { enabled: true }
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        const assistantMessage = data.choices[0].message;
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: assistantMessage.content,
          reasoning_details: assistantMessage.reasoning_details
        }]);
      } else {
        throw new Error("Invalid response format");
      }
      
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Oops! I encountered an error connecting to my brain. Please try again or email Sayan directly at sayanbanerjee024@gmail.com." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

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
                  <h3>AI Assistant</h3>
                  <p>Ask about Sayan's experience</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
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
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="chat-bubble-container assistant">
                  <div className="chat-bubble-avatar">
                    <Bot size={16} />
                  </div>
                  <div className="chat-bubble assistant typing">
                    <Loader2 size={16} className="spinner" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form className="chat-input-area" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
              <button type="submit" disabled={!inputValue.trim() || isLoading}>
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
