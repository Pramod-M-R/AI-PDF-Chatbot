import React, { useEffect, useRef } from "react";
import {
  CheckCircle,
  Database,
  FileText,
  Search,
} from "lucide-react";

import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import UploadZone from "./UploadZone";
import DocumentCard from "./DocumentCard";

import "./ChatWindow.css";

export default function ChatWindow({
  messages,
  isTyping,
  document,
  uploadState,
  onFileSelected,
  pdfUploaded,
}) {

  const endRef = useRef(null);

  useEffect(() => {

    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });

  }, [messages, isTyping]);

  return (

    <div className="chat-window">

      {!pdfUploaded && (

        <div className="chat-window__landing">

          <h1 className="chat-window__title">
            AI PDF Chatbot
          </h1>

          <p className="chat-window__subtitle">
            Upload one or more PDF documents and ask questions in
            natural language. Answers are generated using Retrieval
            Augmented Generation (RAG) with source attribution.
          </p>

          <div className="chat-window__features">

            <div className="chat-window__feature">
              <CheckCircle size={18} />
              <span>Multiple PDF Support</span>
            </div>

            <div className="chat-window__feature">
              <Search size={18} />
              <span>Semantic Search (RAG)</span>
            </div>

            <div className="chat-window__feature">
              <Database size={18} />
              <span>Knowledge Base Retrieval</span>
            </div>

            <div className="chat-window__feature">
              <FileText size={18} />
              <span>Source Attribution</span>
            </div>

          </div>

          <div className="chat-window__supported">

            <h3>Supported File Type</h3>

            <p>📄 PDF (.pdf)</p>

          </div>

          <UploadZone
            onFileSelected={onFileSelected}
            uploadState={uploadState}
          />

        </div>

      )}

      {pdfUploaded && (

        <div className="chat-window__top">

          {document && (
            <DocumentCard
              document={document}
            />
          )}

        </div>

      )}

      {pdfUploaded && (

        <div className="chat-window__messages">

          {messages.length === 0 &&
            !isTyping && (

              <div className="chat-window__empty">

                <p>
                  Your PDF is ready.
                </p>

                <p>
                  Ask anything about your uploaded
                  documents.
                </p>

              </div>

            )}

          {messages.map(message => (

            <MessageBubble
              key={message.id}
              message={message}
            />

          ))}

          {isTyping && (
            <TypingIndicator />
          )}

          <div ref={endRef} />

        </div>

      )}

    </div>

  );

}