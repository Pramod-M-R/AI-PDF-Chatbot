import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Copy, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import SourceAccordion from './SourceAccordion';
import './MessageBubble.css';

export default function MessageBubble({ message, userInitials = 'P' }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [rated, setRated] = useState(null);

  const handleCopy = () => {
    const text = [message.text, ...(message.list || [])].join('\n');
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`message ${isUser ? 'message--user' : 'message--assistant'}`}>
      <span className={`message__avatar ${isUser ? 'message__avatar--user' : 'message__avatar--assistant'}`}>
        {isUser ? userInitials : <Sparkles size={15} strokeWidth={2.3} />}
      </span>

      <div className="message__content">
        <div className="message__meta">
          <span className="message__name">{isUser ? 'You' : 'Assistant'}</span>
          <span className="message__time">{message.time}</span>
        </div>

        <div className="message__bubble">
          {message.text && (
  <div className="message__text">
    <ReactMarkdown>
      {message.text}
    </ReactMarkdown>
  </div>
)}

          {message.list && (
            <ul className="message__list">
              {message.list.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}

          {!isUser && <SourceAccordion sources={message.sources} />}
        </div>

        {!isUser && (
          <div className="message__actions">
            <button className="message__action-btn" onClick={handleCopy} aria-label="Copy message">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            <button
              className={`message__action-btn ${rated === 'up' ? 'message__action-btn--active' : ''}`}
              onClick={() => setRated(rated === 'up' ? null : 'up')}
              aria-label="Good response"
            >
              <ThumbsUp size={14} />
            </button>
            <button
              className={`message__action-btn ${rated === 'down' ? 'message__action-btn--active-down' : ''}`}
              onClick={() => setRated(rated === 'down' ? null : 'down')}
              aria-label="Bad response"
            >
              <ThumbsDown size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
