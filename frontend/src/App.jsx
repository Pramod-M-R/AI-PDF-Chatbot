import React, {
  useState,
  useCallback,
  useEffect,
} from "react";

import {
  uploadPDF,
  askQuestion,
  getDocuments,
} from "./services/api";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";

import { currentUser } from "./data/placeholderData";

import "./App.css";

let idCounter = 100;

const nextId = () => `m${idCounter++}`;

function formatTime() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function App() {

  const [theme, setTheme] = useState("light");

  const [activeNav, setActiveNav] = useState("start-over");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [documents, setDocuments] = useState([]);

  const [activeDocumentId, setActiveDocumentId] =
    useState(null);

  const [messages, setMessages] = useState([]);

  const [isTyping, setIsTyping] = useState(false);

  const [uploadState, setUploadState] =
    useState("idle");

  const [pdfUploaded, setPdfUploaded] =
    useState(false);

  // NEW
  const [showStartOverDialog, setShowStartOverDialog] =
    useState(false);

  const toggleTheme = () => {

    setTheme(previousTheme => {

      const nextTheme =
        previousTheme === "light"
          ? "dark"
          : "light";

      document.documentElement.setAttribute(
        "data-theme",
        nextTheme
      );

      return nextTheme;

    });

  };

  useEffect(() => {

  async function loadDocuments() {

    try {

      const docs = await getDocuments();

      setDocuments(docs);

      if (docs.length > 0) {

        setPdfUploaded(true);

        setActiveDocumentId(docs[0].id);

      }

    } catch (error) {

      console.error(
        "Unable to load documents",
        error
      );

    }

  }

  loadDocuments();

}, []);

  const handleFileSelected = useCallback(async (file) => {

  try {

    setUploadState("uploading");

    const response = await uploadPDF(file);

    // Backend rejected the upload
    if (!response.success) {

      alert(response.message);

      setUploadState("idle");

      return;

    }

    const newDocument = {

      id: `doc-${Date.now()}`,

      name: file.name,

      size: `${(
        file.size /
        (1024 * 1024)
      ).toFixed(1)} MB`,

      uploadedAt: "Uploaded just now",

      status: "ready",

    };

    setDocuments(previous => [

      newDocument,

      ...previous,

    ]);

    setActiveDocumentId(newDocument.id);

    setPdfUploaded(true);

    setMessages([]);

    setUploadState("success");

    setTimeout(() => {

      setUploadState("idle");

    }, 1500);

  } catch (error) {

    console.error(error);

    if (error.response?.data?.message) {

      alert(error.response.data.message);

    } else {

      alert("Unable to upload the PDF.");

    }

    setUploadState("idle");

  }

}, []);

  const confirmStartOver = () => {

    setMessages([]);

    setIsTyping(false);

    setShowStartOverDialog(false);

  };

  const handleSend = useCallback(async (text) => {

    const userMessage = {

      id: nextId(),

      role: "user",

      text,

      time: formatTime(),

    };

    setMessages(previous => [

      ...previous,

      userMessage,

    ]);

    setIsTyping(true);

    try {

      const response =
        await askQuestion(text);

      const assistantMessage = {

        id: nextId(),

        role: "assistant",

        text: response.answer,

        sources:
          response.sources || [],

        time: formatTime(),

      };

      setMessages(previous => [

        ...previous,

        assistantMessage,

      ]);

    } catch (error) {

      console.error(error);

      setMessages(previous => [

        ...previous,

        {

          id: nextId(),

          role: "assistant",

          text:
            "Sorry, something went wrong while talking to the AI.",

          time: formatTime(),

        },

      ]);

    } finally {

      setIsTyping(false);

    }

  }, []);

  const activeDocument =
    documents.find(
      document =>
        document.id === activeDocumentId
    ) || null;

    return (
  <>
    <div className="app">

      <Sidebar
        documents={documents}
        activeNav={activeNav}
        onNavChange={(key) => {

          if (key === "start-over") {

  const confirmed = window.confirm(
    "Start over?\n\nThis will clear your current conversation.\n\nYour uploaded PDF will remain available.\nYou can continue asking questions about the same PDF.\n\nThis action cannot be undone."
  );

  if (!confirmed) {

    setSidebarOpen(false);

    return;

  }

  setMessages([]);

  setIsTyping(false);

  setSidebarOpen(false);

  return;

}

          setActiveNav(key);

          setSidebarOpen(false);

        }}
        activeDocumentId={activeDocumentId}
        onSelectDocument={(id) => {

          setActiveDocumentId(id);

          setSidebarOpen(false);

        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="app__main">

        <Topbar
          user={currentUser}
          theme={theme}
          onToggleTheme={toggleTheme}
          onMenuClick={() => setSidebarOpen(true)}
          documentTitle={activeDocument?.name}
        />

        <ChatWindow
          messages={messages}
          isTyping={isTyping}
          document={activeDocument}
          uploadState={uploadState}
          onFileSelected={handleFileSelected}
          pdfUploaded={pdfUploaded}
        />

        {pdfUploaded && (

          <ChatInput
            onSend={handleSend}
            onFileSelected={handleFileSelected}
            disabled={isTyping}
          />

        )}

      </div>

    </div>

    {showStartOverDialog && (

      <div className="modal-overlay">

        <div className="modal">

          <h2>
            Start Over?
          </h2>

          <p style={{ marginTop: "12px" }}>
            This will clear your current conversation.
          </p>

          <ul
            style={{
              marginTop: "15px",
              paddingLeft: "20px",
              lineHeight: "1.8",
            }}
          >
            <li>
              Your uploaded PDF will remain available.
            </li>

            <li>
              You can continue asking questions about the same PDF.
            </li>

            <li>
              Your current conversation cannot be recovered.
            </li>
          </ul>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "25px",
            }}
          >

            <button
              onClick={() =>
                setShowStartOverDialog(false)
              }
            >
              Cancel
            </button>

            <button
              onClick={confirmStartOver}
            >
              Start Over
            </button>

          </div>

        </div>

      </div>

    )}

  </>
);
}