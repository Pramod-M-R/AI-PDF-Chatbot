import React, { useState } from "react";
import {
  BookOpen,
  ChevronUp,
  FileText,
} from "lucide-react";

import "./SourceAccordion.css";

export default function SourceAccordion({
  sources,
}) {

  const [open, setOpen] =
    useState(true);

  if (!sources || sources.length === 0)
    return null;

  return (

    <div className="source-accordion">

      <button
        className="source-accordion__header"
        onClick={() => setOpen(!open)}
      >

        <span className="source-accordion__label">

          <BookOpen
            size={15}
          />

          Sources ({sources.length})

        </span>

        <ChevronUp
          size={16}
          className={`source-accordion__chevron ${
            open
              ? ""
              : "source-accordion__chevron--closed"
          }`}
        />

      </button>

      {open && (

        <div className="source-accordion__body">

          {sources.map((source, index) => (

            <div
              key={index}
              className="source-chip"
            >

              <FileText
                size={14}
              />

              <span>
                {source}
              </span>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}