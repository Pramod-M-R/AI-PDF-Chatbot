import React, { useRef, useState } from "react";
import { Send, Paperclip } from "lucide-react";
import "./ChatInput.css";

export default function ChatInput({
  onSend,
  onFileSelected,
  disabled,
}) {
  const [value, setValue] = useState("");

  const textareaRef = useRef(null);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setValue(e.target.value);

    const el = textareaRef.current;

    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 140) + "px";
    }
  };

  const submit = () => {
    const trimmed = value.trim();

    if (!trimmed || disabled) return;

    onSend(trimmed);

    setValue("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      onFileSelected(file);
    }
  };

  return (
    <div className="chat-input">

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        hidden
        onChange={handleFileChange}
      />

      <div
        className={`chat-input__box ${
          disabled ? "chat-input__box--disabled" : ""
        }`}
      >

        <button
          className="chat-input__attach"
          aria-label="Attach PDF"
          type="button"
          disabled={disabled}
          onClick={() => fileInputRef.current.click()}
        >
          <Paperclip size={18} />
        </button>

        <textarea
          ref={textareaRef}
          className="chat-input__textarea"
          placeholder="Ask anything about your PDF…"
          rows={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />

        <button
          className="chat-input__send"
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
        >
          <Send size={17} strokeWidth={2.3} />
        </button>

      </div>

      <p className="chat-input__hint">
        AI can make mistakes. Please verify important information.
      </p>

    </div>
  );
}