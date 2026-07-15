import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  UploadCloud,
  FileCheck2,
  LoaderCircle,
} from "lucide-react";

import "./UploadZone.css";

export default function UploadZone({
  onFileSelected,
  uploadState,
}) {

  const [isDragging, setIsDragging] =
    useState(false);

  const [loadingText, setLoadingText] =
    useState("Uploading PDF...");

  const inputRef = useRef(null);

  useEffect(() => {

    if (uploadState !== "uploading")
      return;

    setLoadingText(
      "Uploading PDF..."
    );

    const timer = setTimeout(() => {

      setLoadingText(
        "Processing document..."
      );

    }, 1200);

    return () => clearTimeout(timer);

  }, [uploadState]);

  const handleDrop = useCallback(

    (e) => {

      e.preventDefault();

      setIsDragging(false);

      const file =
        e.dataTransfer.files?.[0];

      if (file)
        onFileSelected(file);

    },

    [onFileSelected]

  );

  const handleChange = (e) => {

    const file =
      e.target.files?.[0];

    if (file)
      onFileSelected(file);

  };

  return (

    <div
      className={`upload-zone ${
        isDragging
          ? "upload-zone--dragging"
          : ""
      } ${
        uploadState === "uploading"
          ? "upload-zone--busy"
          : ""
      }`}
      onDragOver={(e) => {

        e.preventDefault();

        setIsDragging(true);

      }}
      onDragLeave={() =>
        setIsDragging(false)
      }
      onDrop={handleDrop}
      onClick={() =>
        inputRef.current?.click()
      }
      role="button"
      tabIndex={0}
    >

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        hidden
        onChange={handleChange}
      />

      <span className="upload-zone__icon">

        {uploadState ===
        "uploading" ? (

          <LoaderCircle
            size={34}
            className="upload-zone__loader"
          />

        ) : uploadState ===
          "success" ? (

          <FileCheck2
            size={34}
          />

        ) : (

          <UploadCloud
            size={34}
          />

        )}

      </span>

      <p className="upload-zone__title">

        {uploadState ===
        "uploading"
          ? loadingText
          : uploadState ===
            "success"
          ? "Knowledge Base Ready!"
          : "Drag & Drop your PDF"}

      </p>

      <p className="upload-zone__subtitle">

        {uploadState ===
        "uploading"
          ? "Creating embeddings and preparing your documents..."
          : uploadState ===
            "success"
          ? "You can now start chatting with your documents."
          : "or click to browse"}

      </p>

      {uploadState !==
        "uploading" && (

        <button
          className="upload-zone__btn"
          type="button"
        >

          Choose PDF

        </button>

      )}

    </div>

  );

}