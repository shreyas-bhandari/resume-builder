import React from "react";

const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    desc: "Clean & ATS-friendly",
    preview: (
      <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" className="tmpl-svg">
        <rect width="80" height="100" fill="white" />
        <rect x="10" y="10" width="60" height="6" rx="1" fill="#6366f1" opacity="0.9" />
        <rect x="18" y="19" width="44" height="3" rx="1" fill="#94a3b8" />
        <rect x="22" y="24" width="36" height="2" rx="1" fill="#cbd5e1" />
        <rect x="10" y="32" width="60" height="1" fill="#e2e8f0" />
        <rect x="10" y="36" width="22" height="2" rx="1" fill="#6366f1" opacity="0.7" />
        <rect x="10" y="41" width="60" height="2" rx="1" fill="#e2e8f0" />
        <rect x="10" y="45" width="55" height="2" rx="1" fill="#e2e8f0" />
        <rect x="10" y="52" width="22" height="2" rx="1" fill="#6366f1" opacity="0.7" />
        <rect x="10" y="57" width="40" height="2" rx="1" fill="#e2e8f0" />
        <rect x="10" y="61" width="3" height="2" rx="0.5" fill="#6366f1" opacity="0.5" />
        <rect x="15" y="61" width="35" height="2" rx="1" fill="#e2e8f0" />
        <rect x="10" y="65" width="3" height="2" rx="0.5" fill="#6366f1" opacity="0.5" />
        <rect x="15" y="65" width="30" height="2" rx="1" fill="#e2e8f0" />
        <rect x="10" y="72" width="22" height="2" rx="1" fill="#6366f1" opacity="0.7" />
        <rect x="10" y="77" width="18" height="5" rx="2" fill="#6366f1" opacity="0.15" />
        <rect x="30" y="77" width="15" height="5" rx="2" fill="#6366f1" opacity="0.15" />
        <rect x="47" y="77" width="20" height="5" rx="2" fill="#6366f1" opacity="0.15" />
      </svg>
    ),
  },
  {
    id: "modern",
    name: "Modern",
    desc: "Sidebar & bold style",
    preview: (
      <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" className="tmpl-svg">
        <rect width="80" height="100" fill="white" />
        <rect width="26" height="100" fill="#6366f1" opacity="0.9" />
        <rect x="3" y="12" width="20" height="3" rx="1" fill="white" opacity="0.9" />
        <rect x="5" y="17" width="16" height="2" rx="1" fill="white" opacity="0.6" />
        <rect x="3" y="26" width="13" height="1.5" rx="0.5" fill="white" opacity="0.5" />
        <rect x="3" y="30" width="20" height="1.5" rx="0.5" fill="white" opacity="0.3" />
        <rect x="3" y="33" width="18" height="1.5" rx="0.5" fill="white" opacity="0.3" />
        <rect x="3" y="36" width="15" height="1.5" rx="0.5" fill="white" opacity="0.3" />
        <rect x="3" y="46" width="13" height="1.5" rx="0.5" fill="white" opacity="0.5" />
        <rect x="4" y="50" width="10" height="3" rx="1" fill="white" opacity="0.2" />
        <rect x="4" y="55" width="14" height="3" rx="1" fill="white" opacity="0.2" />
        <rect x="4" y="60" width="11" height="3" rx="1" fill="white" opacity="0.2" />
        <rect x="30" y="10" width="40" height="3" rx="1" fill="#1e293b" />
        <rect x="30" y="15" width="28" height="2" rx="1" fill="#94a3b8" />
        <rect x="30" y="24" width="18" height="2" rx="1" fill="#6366f1" opacity="0.7" />
        <rect x="30" y="29" width="38" height="1.5" rx="0.5" fill="#e2e8f0" />
        <rect x="30" y="33" width="35" height="1.5" rx="0.5" fill="#e2e8f0" />
        <rect x="30" y="42" width="18" height="2" rx="1" fill="#6366f1" opacity="0.7" />
        <rect x="30" y="47" width="40" height="1.5" rx="0.5" fill="#e2e8f0" />
        <rect x="30" y="51" width="3" height="1.5" rx="0.5" fill="#6366f1" opacity="0.5"/>
        <rect x="35" y="51" width="33" height="1.5" rx="0.5" fill="#e2e8f0" />
        <rect x="30" y="55" width="3" height="1.5" rx="0.5" fill="#6366f1" opacity="0.5"/>
        <rect x="35" y="55" width="28" height="1.5" rx="0.5" fill="#e2e8f0" />
      </svg>
    ),
  },
  {
    id: "shreyas",
    name: "Executive",
    desc: "Dark header & bold",
    preview: (
      <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" className="tmpl-svg">
        <rect width="80" height="100" fill="white" />
        {/* Dark header bar */}
        <rect width="80" height="22" fill="#6366f1" opacity="0.9" />
        <rect x="6" y="5" width="40" height="5" rx="1" fill="white" opacity="0.95" />
        <rect x="6" y="12" width="28" height="2" rx="1" fill="white" opacity="0.6" />
        <rect x="6" y="16" width="14" height="2" rx="0.5" fill="white" opacity="0.4" />
        <rect x="24" y="16" width="14" height="2" rx="0.5" fill="white" opacity="0.4" />
        <rect x="44" y="16" width="16" height="2" rx="0.5" fill="white" opacity="0.4" />
        {/* Section: Experience */}
        <rect x="6" y="27" width="20" height="2" rx="0.5" fill="#6366f1" opacity="0.8" />
        <rect x="28" y="28" width="46" height="0.75" fill="#6366f1" opacity="0.4" />
        <rect x="6" y="32" width="38" height="2" rx="1" fill="#1e293b" opacity="0.8" />
        <rect x="6" y="36" width="2" height="2" rx="0.5" fill="#6366f1" opacity="0.7" />
        <rect x="10" y="36" width="45" height="1.5" rx="0.5" fill="#e2e8f0" />
        <rect x="6" y="40" width="2" height="2" rx="0.5" fill="#6366f1" opacity="0.7" />
        <rect x="10" y="40" width="38" height="1.5" rx="0.5" fill="#e2e8f0" />
        {/* Section: Skills */}
        <rect x="6" y="48" width="14" height="2" rx="0.5" fill="#6366f1" opacity="0.8" />
        <rect x="22" y="49" width="52" height="0.75" fill="#6366f1" opacity="0.4" />
        <rect x="6" y="53" width="16" height="5" rx="2" fill="#6366f1" opacity="0.12" />
        <rect x="24" y="53" width="14" height="5" rx="2" fill="#6366f1" opacity="0.12" />
        <rect x="40" y="53" width="18" height="5" rx="2" fill="#6366f1" opacity="0.12" />
        {/* Section: Projects */}
        <rect x="6" y="63" width="16" height="2" rx="0.5" fill="#6366f1" opacity="0.8" />
        <rect x="24" y="64" width="50" height="0.75" fill="#6366f1" opacity="0.4" />
        <rect x="6" y="68" width="34" height="2" rx="1" fill="#1e293b" opacity="0.8" />
        <rect x="6" y="72" width="2" height="2" rx="0.5" fill="#6366f1" opacity="0.7" />
        <rect x="10" y="72" width="42" height="1.5" rx="0.5" fill="#e2e8f0" />
        <rect x="6" y="76" width="2" height="2" rx="0.5" fill="#6366f1" opacity="0.7" />
        <rect x="10" y="76" width="35" height="1.5" rx="0.5" fill="#e2e8f0" />
      </svg>
    ),
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Elegant & serif",
    preview: (
      <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" className="tmpl-svg">
        <rect width="80" height="100" fill="white" />
        <rect x="10" y="12" width="50" height="5" rx="1" fill="#0f172a" />
        <rect x="10" y="20" width="30" height="2" rx="1" fill="#64748b" />
        <rect x="10" y="24" width="60" height="0.75" fill="#0f172a" opacity="0.15" />
        <rect x="10" y="30" width="60" height="0.5" fill="#0f172a" opacity="0.08" />
        <rect x="10" y="34" width="16" height="1.5" rx="0.5" fill="#0f172a" opacity="0.5" />
        <rect x="10" y="38" width="58" height="1.5" rx="0.5" fill="#e2e8f0" />
        <rect x="10" y="42" width="52" height="1.5" rx="0.5" fill="#e2e8f0" />
        <rect x="10" y="50" width="16" height="1.5" rx="0.5" fill="#0f172a" opacity="0.5" />
        <rect x="10" y="54" width="44" height="1.5" rx="0.5" fill="#e2e8f0" />
        <rect x="12" y="58" width="2" height="1.5" rx="0.5" fill="#94a3b8" />
        <rect x="16" y="58" width="38" height="1.5" rx="0.5" fill="#e2e8f0" />
        <rect x="12" y="62" width="2" height="1.5" rx="0.5" fill="#94a3b8" />
        <rect x="16" y="62" width="30" height="1.5" rx="0.5" fill="#e2e8f0" />
        <rect x="10" y="70" width="16" height="1.5" rx="0.5" fill="#0f172a" opacity="0.5" />
        <rect x="10" y="75" width="55" height="1.5" rx="0.5" fill="#e2e8f0" />
        <rect x="10" y="79" width="50" height="1.5" rx="0.5" fill="#e2e8f0" />
      </svg>
    ),
  },
];

export default function TemplateSwitcher({ value, onChange }) {
  return (
    <div className="template-switcher" role="radiogroup" aria-label="Resume template">
      <span className="template-switcher-label">Template</span>
      <div className="template-cards">
        {TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            className={`template-card ${value === tmpl.id ? "active" : ""}`}
            onClick={() => onChange(tmpl.id)}
            role="radio"
            aria-checked={value === tmpl.id}
            aria-label={`${tmpl.name} template — ${tmpl.desc}`}
            id={`template-${tmpl.id}`}
            type="button"
          >
            <div className="template-preview">{tmpl.preview}</div>
            <div className="template-info">
              <span className="template-name">{tmpl.name}</span>
              <span className="template-desc">{tmpl.desc}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
