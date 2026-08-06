import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import ResumePreview from "./components/ResumePreview";
import FormSection from "./components/FormSection";
import TemplateSwitcher from "./components/TemplateSwitcher";
import ColorPicker from "./components/ColorPicker";
import ProgressBar from "./components/ProgressBar";
import html2pdf from "html2pdf.js";

const STORAGE_KEY = "resumeforge_data_v2";

const EMPTY = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  links: "",
  summary: "",
  education: "",
  skills: "",
  experience: "",
  projects: "",
  certifications: "",
};

const DEMO = {
  name: "Shreyas Bhandari",
  title: "Software Engineer",
  email: "shreyas.bhandari@gmail.com",
  phone: "+91 98765 43210",
  location: "Bangalore, India",
  links: "linkedin.com/in/shreyasbhandari | github.com/shreyasb | shreyasbhandari.dev",
  summary:
    "Results-driven software engineer with 3+ years of experience building high-performance web applications and scalable backend systems. Proficient in React, Node.js, and cloud technologies. Passionate about clean architecture, developer experience, and shipping products that delight users.",
  education:
    "Indian Institute of Technology, Mumbai — B.Tech Computer Science | 2019–2023\nRelevant Coursework: Data Structures, Algorithms, System Design, Operating Systems, DBMS",
  skills:
    "JavaScript, TypeScript, React, Next.js, Node.js, Express, PostgreSQL, MongoDB, Redis, Docker, AWS, Git, GraphQL, REST APIs, CI/CD, Kubernetes",
  experience: `Infosys Ltd — Senior Software Engineer | Jan 2023 – Present
- Architected a React-based dashboard serving 80K+ daily active users across 12 countries.
- Reduced API response time by 55% through Redis caching and query optimization.
- Led a team of 5 engineers to deliver a microservices migration on schedule.

TCS — Software Engineer | Jun 2021 – Dec 2022
- Built end-to-end features for a fintech SaaS platform using the MERN stack.
- Designed RESTful APIs consumed by 3 mobile and 2 web clients.
- Implemented CI/CD pipelines reducing deployment time from 2 hours to 8 minutes.`,
  projects: `Smart Resume Analyzer | React, Node.js, OpenAI API
- Built an AI-powered tool that analyzes resumes and suggests ATS-friendly improvements.
- Achieved 4.8/5 rating from 500+ beta users in first month.

E-Commerce Platform | Next.js, Stripe, PostgreSQL
- Handles 15K+ monthly transactions with 99.9% uptime.
- Implemented real-time inventory and order tracking with WebSockets.`,
  certifications:
    "AWS Certified Developer – Associate (2024)\nGoogle Professional Cloud Developer (2023)\nMeta Front-End Developer Certificate (2022)",
};

const ACCENT_COLORS = [
  { id: "indigo", value: "#6366f1", label: "Indigo" },
  { id: "violet", value: "#8b5cf6", label: "Violet" },
  { id: "blue",   value: "#3b82f6", label: "Blue"   },
  { id: "teal",   value: "#0d9488", label: "Teal"   },
  { id: "rose",   value: "#e11d48", label: "Rose"   },
  { id: "slate",  value: "#334155", label: "Slate"  },
];

function loadSavedData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : EMPTY;
  } catch {
    return EMPTY;
  }
}

// ── Toast notification ───────────────────────────────────────
function Toast({ message, type = "success", visible }) {
  return (
    <div className={`toast toast-${type} ${visible ? "toast-visible" : ""}`} role="status" aria-live="polite">
      {type === "success" && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {type === "loading" && <span className="toast-spinner" aria-hidden="true" />}
      {message}
    </div>
  );
}

// ── Confirm dialog ───────────────────────────────────────────
function ConfirmDialog({ open, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="dialog-overlay" role="dialog" aria-modal="true" aria-label="Confirm clear">
      <div className="dialog-box">
        <div className="dialog-icon">🗑️</div>
        <h3 className="dialog-title">Clear all data?</h3>
        <p className="dialog-desc">This will erase everything you've entered. You can't undo this.</p>
        <div className="dialog-actions">
          <button className="btn-ghost" onClick={onCancel} id="dialog-cancel">Cancel</button>
          <button className="btn-danger" onClick={onConfirm} id="dialog-confirm">Yes, clear it</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(loadSavedData);
  const [template, setTemplate] = useState(
    () => localStorage.getItem("rf_template") || "classic"
  );
  const [accentColor, setAccentColor] = useState(
    () => localStorage.getItem("rf_accent") || "#6366f1"
  );
  const [openSections, setOpenSections] = useState({
    personal: true,
    summary: false,
    experience: false,
    education: false,
    skills: false,
    projects: false,
    certifications: false,
  });

  // UI state
  const [savedToast, setSavedToast] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [mobileTab, setMobileTab] = useState("edit");
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 700);
  const saveTimerRef = useRef(null);

  // Responsive tracking
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 700);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-save
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem("rf_template", template);
      localStorage.setItem("rf_accent", accentColor);
      setSavedToast(true);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => setSavedToast(false), 2000);
    } catch {
      /* storage unavailable */
    }
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [data, template, accentColor]);

  // Completeness score
  const completeness = useMemo(() => {
    const values = Object.values(data);
    const filled = values.filter((v) => v.trim().length > 0).length;
    return Math.round((filled / values.length) * 100);
  }, [data]);

  const update = useCallback((e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const toggleSection = useCallback((key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const loadDemo = useCallback(() => {
    setData(DEMO);
    setOpenSections({
      personal: true, summary: true, experience: true,
      education: true, skills: true, projects: true, certifications: true,
    });
  }, []);

  const handleClearConfirm = useCallback(() => {
    setData(EMPTY);
    setShowClearDialog(false);
  }, []);

  // ── PDF Download ─────────────────────────────────────────
  const downloadPDF = useCallback(async () => {
    const el = document.getElementById("resume-paper");
    if (!el || pdfLoading) return;

    setPdfLoading(true);

    // Small delay to let the loading state render
    await new Promise((r) => setTimeout(r, 80));

    const safeName = data.name?.trim()
      ? data.name.trim().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")
      : "Resume";

    const opt = {
      margin: 0,
      filename: `${safeName}_Resume.pdf`,
      image: { type: "jpeg", quality: 0.99 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        logging: false,
        letterRendering: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait", compress: true },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    try {
      await html2pdf().set(opt).from(el).save();
    } finally {
      setPdfLoading(false);
    }
  }, [data.name, pdfLoading]);

  return (
    <div className="app-shell" style={{ "--accent": accentColor }}>

      {/* ── Confirm Dialog ── */}
      <ConfirmDialog
        open={showClearDialog}
        onConfirm={handleClearConfirm}
        onCancel={() => setShowClearDialog(false)}
      />

      {/* ── Toast ── */}
      <Toast message="Saved" type="success" visible={savedToast} />
      <Toast message="Generating PDF…" type="loading" visible={pdfLoading} />

      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-logo">
          <span className="logo-icon" aria-hidden="true">⚡</span>
          <span className="logo-text">ResumeForge</span>
          <span className="logo-badge">FREE</span>
        </div>

        <ProgressBar value={completeness} />

        <div className="header-controls">
          <button
            className="btn-ghost"
            id="load-demo-btn"
            onClick={loadDemo}
            title="Load example resume data"
          >
            Load Example
          </button>
          <button
            className="btn-ghost"
            id="clear-form-btn"
            onClick={() => setShowClearDialog(true)}
            title="Clear all fields"
          >
            Clear
          </button>
          <button
            className="btn-primary"
            id="download-pdf-btn"
            onClick={downloadPDF}
            disabled={pdfLoading}
            title="Download resume as PDF"
          >
            {pdfLoading ? (
              <span className="btn-spinner" aria-hidden="true" />
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )}
            {pdfLoading ? "Generating…" : "Download PDF"}
          </button>
        </div>
      </header>

      {/* ── Mobile Tab Bar ── */}
      <div className={`mobile-tabs ${isMobile ? "mobile-tabs-visible" : ""}`}>
        <button
          className={`mobile-tab ${mobileTab === "edit" ? "active" : ""}`}
          onClick={() => setMobileTab("edit")}
          id="mobile-tab-edit"
          type="button"
          aria-selected={mobileTab === "edit"}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit
        </button>
        <button
          className={`mobile-tab ${mobileTab === "preview" ? "active" : ""}`}
          onClick={() => setMobileTab("preview")}
          id="mobile-tab-preview"
          type="button"
          aria-selected={mobileTab === "preview"}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Preview
        </button>
      </div>

      {/* ── Main Layout ── */}
      <div className="main-layout">

        {/* Left: Form Panel */}
        <aside
          className={`form-panel ${isMobile && mobileTab === "preview" ? "panel-hidden" : ""}`}
          aria-label="Resume editor"
        >
          <FormSection id="personal" title="Personal Info" icon="👤"
            open={openSections.personal} onToggle={() => toggleSection("personal")}>
            <div className="field">
              <label className="field-label" htmlFor="field-name">Full Name</label>
              <input id="field-name" className="field-input" name="name" value={data.name} onChange={update} placeholder="e.g. Shreyas Bhandari" autoComplete="name" />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="field-title">Professional Title</label>
              <input id="field-title" className="field-input" name="title" value={data.title} onChange={update} placeholder="e.g. Software Engineer" />
            </div>
            <div className="field-row">
              <div className="field">
                <label className="field-label" htmlFor="field-email">Email</label>
                <input id="field-email" className="field-input" name="email" value={data.email} onChange={update} placeholder="you@email.com" type="email" autoComplete="email" />
              </div>
              <div className="field">
                <label className="field-label" htmlFor="field-phone">Phone</label>
                <input id="field-phone" className="field-input" name="phone" value={data.phone} onChange={update} placeholder="+91 98765 43210" type="tel" autoComplete="tel" />
              </div>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="field-location">Location</label>
              <input id="field-location" className="field-input" name="location" value={data.location} onChange={update} placeholder="City, Country" autoComplete="country-name" />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="field-links">Links</label>
              <input id="field-links" className="field-input" name="links" value={data.links} onChange={update} placeholder="linkedin.com/in/you | github.com/you | yoursite.com" />
              <span className="field-hint">Separate with • or |</span>
            </div>
          </FormSection>

          <FormSection id="summary" title="Professional Summary" icon="📝"
            open={openSections.summary} onToggle={() => toggleSection("summary")}>
            <div className="field">
              <label className="field-label" htmlFor="field-summary">Summary</label>
              <textarea id="field-summary" className="field-textarea" name="summary" value={data.summary} onChange={update} placeholder="2–4 sentences highlighting your experience, key skills, and what you bring to a team..." rows={4} />
              <span className="field-hint">{data.summary.length} characters</span>
            </div>
          </FormSection>

          <FormSection id="experience" title="Work Experience" icon="💼"
            open={openSections.experience} onToggle={() => toggleSection("experience")}>
            <div className="field">
              <label className="field-label" htmlFor="field-experience">Experience</label>
              <textarea
                id="field-experience"
                className="field-textarea"
                name="experience"
                value={data.experience}
                onChange={update}
                rows={8}
                placeholder={`Company Name — Job Title | Start – End Date\n- Key achievement or responsibility\n- Another achievement with impact\n\nNext Company — Role | Dates\n- Achievement...`}
              />
              <span className="field-hint">Format: Company — Role | Dates, then "- " for bullet points</span>
            </div>
          </FormSection>

          <FormSection id="education" title="Education" icon="🎓"
            open={openSections.education} onToggle={() => toggleSection("education")}>
            <div className="field">
              <label className="field-label" htmlFor="field-education">Education</label>
              <textarea
                id="field-education"
                className="field-textarea"
                name="education"
                value={data.education}
                onChange={update}
                rows={4}
                placeholder={`University Name — Degree | Graduation Year\nRelevant Coursework: Subject A, Subject B`}
              />
            </div>
          </FormSection>

          <FormSection id="skills" title="Skills" icon="⚡"
            open={openSections.skills} onToggle={() => toggleSection("skills")}>
            <div className="field">
              <label className="field-label" htmlFor="field-skills">Skills</label>
              <input
                id="field-skills"
                className="field-input"
                name="skills"
                value={data.skills}
                onChange={update}
                placeholder="JavaScript, React, Node.js, Python, SQL, Docker, Git..."
              />
              <span className="field-hint">Comma-separated — displayed as tags on the resume</span>
            </div>
          </FormSection>

          <FormSection id="projects" title="Projects" icon="🚀"
            open={openSections.projects} onToggle={() => toggleSection("projects")}>
            <div className="field">
              <label className="field-label" htmlFor="field-projects">Projects</label>
              <textarea
                id="field-projects"
                className="field-textarea"
                name="projects"
                value={data.projects}
                onChange={update}
                rows={6}
                placeholder={`Project Name | Tech Stack (optional)\n- Description, tech used, and measurable impact\n- Another key detail\n\nAnother Project\n- Description...`}
              />
              <span className="field-hint">Tip: Add tech stack after | (e.g. "My App | React, Node.js")</span>
            </div>
          </FormSection>

          <FormSection id="certifications" title="Certifications & Achievements" icon="🏆"
            open={openSections.certifications} onToggle={() => toggleSection("certifications")}>
            <div className="field">
              <label className="field-label" htmlFor="field-certifications">Certifications</label>
              <textarea
                id="field-certifications"
                className="field-textarea"
                name="certifications"
                value={data.certifications}
                onChange={update}
                rows={3}
                placeholder={`AWS Certified Developer – Associate (2024)\nGoogle Professional Certificate (2023)`}
              />
            </div>
          </FormSection>

          {/* Footer credit */}
          <div className="form-footer">
            <span>Made with ❤️ by ResumeForge</span>
            <span>·</span>
            <span>Data stays in your browser</span>
          </div>
        </aside>

        {/* Right: Preview Panel */}
        <main
          className={`preview-panel ${isMobile && mobileTab === "edit" ? "panel-hidden" : ""}`}
          aria-label="Resume preview"
        >
          <div className="preview-controls">
            <TemplateSwitcher value={template} onChange={setTemplate} />
            <ColorPicker colors={ACCENT_COLORS} value={accentColor} onChange={setAccentColor} />
          </div>
          <div className="preview-scroll">
            <ResumePreview data={data} template={template} accentColor={accentColor} />
          </div>
        </main>

      </div>
    </div>
  );
}
