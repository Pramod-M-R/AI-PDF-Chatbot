# PDF Chatbot — Frontend (UI only)

A production-quality React + Vite frontend for an AI PDF chatbot, styled with
plain CSS. This is a **UI/UX prototype only** — there is no backend, no API
calls, and no real PDF parsing. All chat replies, documents, and sources are
placeholder data defined in `src/data/placeholderData.js`.

## Stack

- React 19 (functional components + hooks only)
- Vite
- Plain CSS with CSS custom properties (no Tailwind / Bootstrap / MUI)
- [lucide-react](https://lucide.dev/) for icons

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  App.jsx                 Top-level layout & state (chat, upload, theme)
  App.css
  index.css                Design tokens (CSS variables) & global resets
  data/
    placeholderData.js     Mock chats, documents, messages
  components/
    Sidebar.jsx / .css     Left nav: logo, New Chat, Chats, Documents,
                            Settings, Uploaded Documents list
    Topbar.jsx / .css      Top bar: active document, theme toggle, profile menu
    UploadZone.jsx / .css  Drag-and-drop PDF upload control
    DocumentCard.jsx / .css  Uploaded-file summary card
    ChatWindow.jsx / .css  Scrollable message list + empty state
    MessageBubble.jsx / .css  User / assistant chat bubble w/ actions
    SourceAccordion.jsx / .css  Collapsible "Sources" page-reference chips
    TypingIndicator.jsx / .css  Animated "assistant is typing" bubble
    ChatInput.jsx / .css   Auto-growing textarea + send button
```

## Notable UI behavior (all simulated client-side)

- Dropping or choosing a PDF shows an "uploading" state, then a success
  state and adds the file to the sidebar's Uploaded Documents list.
- Sending a chat message appends a user bubble, shows the typing indicator,
  then appends a canned assistant reply with source-page chips after a short
  delay — no network requests are made.
- Theme toggle switches a `data-theme` attribute on `<html>` between a light
  and dark palette, both defined via CSS variables in `src/index.css`.
- The sidebar collapses to an off-canvas drawer under 900px width; the
  hamburger icon in the top bar opens it.

## Extending this into a real app

Wire `handleFileSelected` and `handleSend` in `src/App.jsx` up to your
backend (e.g. an upload endpoint and a RAG query endpoint) — the rest of the
UI already expects the same shapes used in `placeholderData.js`.
