import React from "react";
import {
  RotateCcw,
  FileText,
  CheckCircle2,
  X,
} from "lucide-react";
import "./Sidebar.css";

const navItems = [
  {
    key: "start-over",
    label: "Start Over",
    icon: RotateCcw,
    accent: true,
  },
];

export default function Sidebar({
  documents,
  activeNav,
  onNavChange,
  activeDocumentId,
  onSelectDocument,
  isOpen,
  onClose,
}) {
  return (
    <>
      {isOpen && (
        <div
          className="sidebar-scrim"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar ${
          isOpen ? "sidebar--open" : ""
        }`}
      >

        {/* Header */}
        <div className="sidebar__header">
          <button
            className="sidebar__close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Start Over */}
        <nav
          className="sidebar__nav"
          aria-label="Primary"
        >
          {navItems.map(
            ({
              key,
              label,
              icon: Icon,
              accent,
            }) => (
              <button
                key={key}
                className={`sidebar__nav-item ${
                  accent
                    ? "sidebar__nav-item--accent"
                    : ""
                } ${
                  activeNav === key
                    ? "sidebar__nav-item--active"
                    : ""
                }`}
                onClick={() => onNavChange(key)}
              >
                <Icon
                  size={17}
                  strokeWidth={2}
                />

                <span>{label}</span>
              </button>
            )
          )}
        </nav>

        <div className="sidebar__divider" />

        {/* Uploaded Documents */}
        <div className="sidebar__section">

          <div className="sidebar__section-head">
            <span>Uploaded Documents</span>
          </div>

          <ul className="sidebar__doc-list">

            {documents.length === 0 ? (

              <div className="sidebar__empty">
                No documents uploaded yet.
              </div>

            ) : (

              documents.map((doc) => (

                <li key={doc.id}>

                  <button
                    className={`sidebar__doc ${
                      activeDocumentId === doc.id
                        ? "sidebar__doc--active"
                        : ""
                    }`}
                    onClick={() =>
                      onSelectDocument(doc.id)
                    }
                  >

                    <span className="sidebar__doc-icon">
                      <FileText size={16} />
                    </span>

                    <span className="sidebar__doc-info">

                      <span className="sidebar__doc-name">
                        {doc.name}
                      </span>

                      <span className="sidebar__doc-meta">
                        {doc.uploadedAt}
                      </span>

                    </span>

                    {doc.status ===
                      "ready" && (
                      <CheckCircle2
                        size={16}
                        className="sidebar__doc-status"
                      />
                    )}

                  </button>

                </li>

              ))

            )}

          </ul>

        </div>

      </aside>
    </>
  );
}