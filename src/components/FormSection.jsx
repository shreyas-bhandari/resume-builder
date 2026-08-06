import React from "react";

export default function FormSection({ id, title, icon, open, onToggle, children }) {
  return (
    <div className={`form-section ${open ? "open" : "closed"}`}>
      <button
        className="form-section-header"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`section-body-${id}`}
        id={`section-toggle-${id}`}
        type="button"
      >
        <span className="form-section-icon">{icon}</span>
        <span className="form-section-title">{title}</span>
        <svg
          className="form-section-chevron"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className="form-section-body"
        id={`section-body-${id}`}
        role="region"
        aria-labelledby={`section-toggle-${id}`}
      >
        <div className="form-section-content">{children}</div>
      </div>
    </div>
  );
}
