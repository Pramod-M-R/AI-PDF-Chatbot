import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import './DocumentCard.css';

export default function DocumentCard({ document }) {
  if (!document) return null;

  return (
    <div className="document-card">
      <span className="document-card__icon">
        <FileText size={18} strokeWidth={2} />
      </span>
      <div className="document-card__info">
        <p className="document-card__name">{document.name}</p>
        <p className="document-card__meta">
          {document.uploadedAt} · {document.size}
        </p>
      </div>
      <CheckCircle2 size={20} className="document-card__status" strokeWidth={2} />
    </div>
  );
}
