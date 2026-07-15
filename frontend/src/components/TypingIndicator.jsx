import React from 'react';
import { Sparkles } from 'lucide-react';
import './TypingIndicator.css';

export default function TypingIndicator() {
  return (
    <div className="message message--assistant typing-row">
      <span className="message__avatar message__avatar--assistant">
        <Sparkles size={15} strokeWidth={2.3} />
      </span>
      <div className="message__content">
        <div className="message__meta">
          <span className="message__name">Assistant</span>
        </div>
        <div className="typing-bubble">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}
