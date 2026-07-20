import React, {
  useState,
  useEffect,
  useCallback,
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
  async function initialize() {
    await fetch("http://127.0.0.1:8000/clear-documents", {
      method: "POST",
    });

    try {
      const docs = await getDocuments();

      setDocuments(docs);

      if (docs.length > 0) {
        setPdfUploaded(true);
        setActiveDocumentId(docs[0].id);
      }
    } catch (error) {
      console.error("Unable to load documents", error);
    }
  }

  initialize();
}, []);

  const handleFileSelected = useCallback(async (file) => {

    const alreadyExists = documents.some(
      doc => doc.name === file.name
    );

    if (alreadyExists) {

      alert("This PDF has already been uploaded.");

      return;

    }

    try {

      setUploadState("uploading");

      const response =
        await uploadPDF(file);

      if (!response.success) {

        alert(
          response.message ||
          "Upload failed."
        );

        setUploadState("idle");

        return;

      }

      const docs =
        await getDocuments();

      setDocuments(docs);

      if (docs.length > 0) {

        setPdfUploaded(true);

        setActiveDocumentId(
          docs[docs.length - 1].id
        );

      }

      setMessages([]);

      setUploadState("success");

      setTimeout(() => {

        setUploadState("idle");

      }, 1500);

    } catch (error) {

  console.error("UPLOAD ERROR:", error);

  console.log(error.response);

  alert(
    error.response?.data?.message ||
    error.response?.data?.detail ||
    error.message
  );

  setUploadState("idle");

}

  }, [documents]);

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

      const response = await askQuestion(text);

      const assistantMessage = {
        id: nextId(),
        role: "assistant",
        text:
          response.answer ||
          "No answer received.",
        sources:
          response.sources || [],
        time: formatTime(),
      };

      setMessages(previous => [
        ...previous,
        assistantMessage,
      ]);

    } catch (error) {

  console.error("CHAT ERROR:", error);
  console.log(error.response);

  setMessages(previous => [
    ...previous,
    {
      id: nextId(),
      role: "assistant",
      text:
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message,
      time: formatTime(),
    },
  ]);

} finally {

      setIsTyping(false);

    }

  }, []);

  const activeDocument =
    documents.find(
      doc =>
        doc.id === activeDocumentId
    ) || null;

  return (
    <div className="app">

      <Sidebar
        documents={documents}
        activeNav={activeNav}
        activeDocumentId={activeDocumentId}
        onSelectDocument={(id) => {
          setActiveDocumentId(id);
          setSidebarOpen(false);
        }}
        onNavChange={(key) => {

          if (key === "start-over") {

            const confirmed = window.confirm(
              "Start over?\n\nThis will clear the current conversation.\n\nYour uploaded PDF will remain available."
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
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="app__main">

        <Topbar
          user={currentUser}
          theme={theme}
          onToggleTheme={toggleTheme}
          onMenuClick={() =>
            setSidebarOpen(true)
          }
          documentTitle={
            activeDocument?.name
          }
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
  );

}