import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ResumePreview from "./components/ResumePreview";
import FormSection from "./components/FormSection";
import TemplateSwitcher from "./components/TemplateSwitcher";
import ColorPicker from "./components/ColorPicker";
import ProgressBar from "./components/ProgressBar";
import ResumeInsights from "./components/ResumeInsights";
import WritingAssistant from "./components/WritingAssistant";
import {
  ACCENT_COLORS,
  ACTIVE_RESUME_KEY,
  DEFAULT_TYPOGRAPHY,
  DEMO_RESUME,
  EMPTY_RESUME,
  FONT_PRESETS,
  LIBRARY_KEY,
  STORAGE_KEY,
  analyzeJobMatch,
  analyzeResume,
  createResumeRecord,
} from "./lib/resumeSchema";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeTypography(typography = {}) {
  const merged = { ...DEFAULT_TYPOGRAPHY, ...typography };
  return {
    ...merged,
    bodySize: typography.bodySize === 12.5 ? DEFAULT_TYPOGRAPHY.bodySize : merged.bodySize,
    lineHeight: typography.lineHeight === 1.5 ? DEFAULT_TYPOGRAPHY.lineHeight : merged.lineHeight,
    sectionSpacing: typography.sectionSpacing === 16 ? DEFAULT_TYPOGRAPHY.sectionSpacing : merged.sectionSpacing,
    pageMargin: typography.pageMargin === 50 ? DEFAULT_TYPOGRAPHY.pageMargin : merged.pageMargin,
  };
}

function loadLibrary() {
  const existing = readJSON(LIBRARY_KEY, null);
  if (Array.isArray(existing) && existing.length) {
    return existing.map((record) => ({
      ...record,
      data: { ...EMPTY_RESUME, ...(record.data || {}) },
      accentColor: record.accentColor === "#4f46e5" ? "#111827" : record.accentColor || "#111827",
      typography: normalizeTypography(record.typography),
    }));
  }

  const migratedData = readJSON(STORAGE_KEY, EMPTY_RESUME);
  return [createResumeRecord(migratedData, { name: migratedData.title || "General Resume" })];
}

function formatDate(value) {
  if (!value) return "Not saved yet";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function hasResumeContent(data) {
  return Object.values(data).some((value) => String(value || "").trim());
}

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

function ConfirmDialog({ open, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="dialog-overlay" role="dialog" aria-modal="true" aria-label="Confirm clear">
      <div className="dialog-box">
        <div className="dialog-icon">!</div>
        <h3 className="dialog-title">Clear this resume?</h3>
        <p className="dialog-desc">This only clears the active resume content. Other saved resumes stay in your library.</p>
        <div className="dialog-actions">
          <button className="btn-ghost" onClick={onCancel} id="dialog-cancel" type="button">Cancel</button>
          <button className="btn-danger" onClick={onConfirm} id="dialog-confirm" type="button">Clear resume</button>
        </div>
      </div>
    </div>
  );
}

const CREATION_DEFAULTS = {
  intent: "job",
  role: "",
  experience: "fresher",
  start: "scratch",
};

const intentLabels = {
  first: "First Resume",
  internship: "Internship Resume",
  job: "Job Resume",
  experienced: "Experienced Professional",
  career: "Career Change",
};

function buildStarterResume({ role, experience }) {
  const targetRole = role.trim();
  const summary =
    experience === "student" || experience === "fresher"
      ? `${targetRole || "Entry-level professional"} focused on building practical skills through projects, coursework, and hands-on learning. Add your strongest technologies, academic work, internships, or project outcomes here.`
      : `${targetRole || "Professional"} with experience in relevant delivery, collaboration, and measurable outcomes. Replace this with your real scope, strongest skills, and target role evidence.`;

  const projectPrompt =
    experience === "student" || experience === "fresher"
      ? "Academic or Personal Project | Tech stack\n- Built [what you built] using [tools] to solve [problem].\n- Add a truthful result, user, grade, demo, or learning outcome if available."
      : "";

  return {
    ...EMPTY_RESUME,
    title: targetRole,
    summary,
    projects: projectPrompt,
  };
}

function GuidedCreateDialog({ open, onCancel, onCreate }) {
  const [draft, setDraft] = useState(CREATION_DEFAULTS);

  useEffect(() => {
    if (open) setDraft(CREATION_DEFAULTS);
  }, [open]);

  if (!open) return null;

  const update = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="guided-create-title">
      <div className="guided-dialog">
        <div className="guided-dialog-head">
          <span className="eyebrow">Guided creation</span>
          <h2 id="guided-create-title">What are you building?</h2>
          <p>ResumeForge will create an editable starting point. It will not invent experience, metrics, or skills.</p>
        </div>

        <div className="choice-grid">
          {Object.entries(intentLabels).map(([id, label]) => (
            <button
              key={id}
              className={`choice-card ${draft.intent === id ? "active" : ""}`}
              type="button"
              onClick={() => update("intent", id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="guided-form">
          <label>
            Target role
            <input value={draft.role} onChange={(event) => update("role", event.target.value)} placeholder="Frontend Developer, Data Analyst, Product Manager..." />
          </label>
          <label>
            Experience level
            <select value={draft.experience} onChange={(event) => update("experience", event.target.value)}>
              <option value="student">Student</option>
              <option value="fresher">Fresher</option>
              <option value="junior">1-2 years</option>
              <option value="mid">3-5 years</option>
              <option value="senior">5+ years</option>
            </select>
          </label>
          <label>
            Starting point
            <select value={draft.start} onChange={(event) => update("start", event.target.value)}>
              <option value="scratch">Start from scratch</option>
              <option value="guided">Build with guided prompts</option>
              <option value="tailor">Create a job-targeted version later</option>
            </select>
          </label>
        </div>

        <div className="dialog-actions">
          <button className="btn-ghost" type="button" onClick={onCancel}>Cancel</button>
          <button className="btn-primary" type="button" onClick={() => onCreate(draft)}>Create resume</button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ resumes, activeId, onOpen, onCreate, onDuplicate, onDelete, onLoadDemo }) {
  const active = resumes.find((record) => record.id === activeId) || resumes[0];
  const averageScore = resumes.length
    ? Math.round(resumes.reduce((sum, record) => sum + analyzeResume(record.data).overall, 0) / resumes.length)
    : 0;

  return (
    <main className="dashboard-shell" aria-label="ResumeForge dashboard">
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">ResumeForge</span>
          <h1>Build a resume that explains your value clearly.</h1>
          <p>Create versions, improve truthful impact, check ATS readiness, and tailor a copy for a job without overwriting the original.</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn-primary" type="button" onClick={onCreate}>Create Resume</button>
          <button className="btn-ghost" type="button" onClick={onLoadDemo}>Load Example</button>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="metric-card">
          <span>Average health</span>
          <strong>{averageScore}</strong>
          <p>Across {resumes.length} saved {resumes.length === 1 ? "resume" : "resumes"}.</p>
        </article>
        <article className="metric-card">
          <span>Active resume</span>
          <strong>{active?.name || "None"}</strong>
          <p>{active ? `Updated ${formatDate(active.updatedAt)}` : "Create your first resume to begin."}</p>
        </article>
        <article className="metric-card">
          <span>Privacy</span>
          <strong>Local</strong>
          <p>Your resume library is stored in this browser.</p>
        </article>
      </section>

      <section className="resume-library" aria-labelledby="library-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Library</span>
            <h2 id="library-title">My resumes</h2>
          </div>
          <button className="btn-secondary compact" type="button" onClick={onCreate}>New version</button>
        </div>

        <div className="resume-card-grid">
          {resumes.map((record) => {
            const analysis = analyzeResume(record.data);
            return (
              <article className={`resume-card ${record.id === activeId ? "active" : ""}`} key={record.id}>
                <div className="resume-card-top">
                  <div>
                    <h3>{record.name}</h3>
                    <p>{record.version} - {record.template}</p>
                  </div>
                  <div className="resume-score">{analysis.overall}</div>
                </div>
                <div className="resume-card-meta">
                  <span>{analysis.stats.sections} sections</span>
                  <span>{analysis.stats.bullets} bullets</span>
                  <span>{formatDate(record.updatedAt)}</span>
                </div>
                <div className="resume-card-actions">
                  <button className="btn-primary" type="button" onClick={() => onOpen(record.id)}>Edit</button>
                  <button className="btn-ghost" type="button" onClick={() => onDuplicate(record.id)}>Duplicate</button>
                  {resumes.length > 1 && (
                    <button className="btn-ghost" type="button" onClick={() => onDelete(record.id)}>Delete</button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function TypographyPanel({ typography, onChange }) {
  const update = (key, value) => onChange({ ...typography, [key]: value });
  const bodyWarning = typography.bodySize > 13.5 || typography.lineHeight < 1.35 || typography.pageMargin < 36;

  return (
    <section className="advisor-card" aria-labelledby="typography-title">
      <div className="advisor-card-header">
        <div>
          <span className="eyebrow">Typography</span>
          <h2 id="typography-title">Layout controls</h2>
        </div>
      </div>
      <div className="control-stack">
        <label>
          Font
          <select value={typography.fontFamily} onChange={(event) => update("fontFamily", event.target.value)}>
            {Object.entries(FONT_PRESETS).map(([id, font]) => (
              <option key={id} value={id}>{font.label} - {font.category}</option>
            ))}
          </select>
        </label>
        <label>
          Body size <strong>{typography.bodySize}px</strong>
          <input type="range" min="10" max="14.5" step="0.5" value={typography.bodySize} onChange={(event) => update("bodySize", Number(event.target.value))} />
        </label>
        <label>
          Line height <strong>{typography.lineHeight}</strong>
          <input type="range" min="1.25" max="1.75" step="0.05" value={typography.lineHeight} onChange={(event) => update("lineHeight", Number(event.target.value))} />
        </label>
        <label>
          Section spacing <strong>{typography.sectionSpacing}px</strong>
          <input type="range" min="10" max="24" step="1" value={typography.sectionSpacing} onChange={(event) => update("sectionSpacing", Number(event.target.value))} />
        </label>
        <label>
          Page margin <strong>{typography.pageMargin}px</strong>
          <input type="range" min="32" max="64" step="2" value={typography.pageMargin} onChange={(event) => update("pageMargin", Number(event.target.value))} />
        </label>
      </div>
      {bodyWarning && (
        <div className="advisor-warning">
          Current typography may create overflow or dense text. Recommended: 11-13px body, 1.4+ line height, 40px+ margins.
        </div>
      )}
    </section>
  );
}

function JobMatchPanel({ data, onCreateTailoredVersion }) {
  const [jobDescription, setJobDescription] = useState("");
  const match = useMemo(() => analyzeJobMatch(data, jobDescription), [data, jobDescription]);

  return (
    <section className="advisor-card" aria-labelledby="job-match-title">
      <div className="advisor-card-header">
        <div>
          <span className="eyebrow">Job match</span>
          <h2 id="job-match-title">Compare against a role</h2>
        </div>
        <div className="score-ring small" aria-label={`Job match score ${match.score} out of 100`}>
          <span>{match.score}</span>
        </div>
      </div>
      <textarea
        className="job-textarea"
        value={jobDescription}
        onChange={(event) => setJobDescription(event.target.value)}
        placeholder="Paste a job description to find truthful matches and gaps..."
        rows={7}
      />
      <div className="match-columns">
        <div>
          <h3>Strong matches</h3>
          <div className="keyword-list">
            {match.matched.length ? match.matched.map((item) => <span key={item.word}>{item.word}</span>) : <em>No matches yet</em>}
          </div>
        </div>
        <div>
          <h3>Potential gaps</h3>
          <div className="keyword-list">
            {match.missing.length ? match.missing.map((item) => <span key={item.word}>{item.word}</span>) : <em>No gaps yet</em>}
          </div>
        </div>
      </div>
      <div className="advisor-list compact-list">
        <h3>Recommendations</h3>
        <ul>
          {match.recommendations.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <button className="btn-secondary" type="button" disabled={!jobDescription.trim()} onClick={() => onCreateTailoredVersion(jobDescription, match)}>
        Create tailored copy
      </button>
    </section>
  );
}

const DISCOVERY_ITEMS = [
  {
    id: "academic",
    label: "Academic project",
    target: "projects",
    text: "Academic Project | Add tech stack\n- Built [what you built] to solve [problem or coursework objective].\n- Add the outcome only if you know it.",
  },
  {
    id: "internship",
    label: "Internship or training",
    target: "experience",
    text: "Organization - Intern | Dates\n- Assisted with [real responsibility] using [tools or process].\n- Contributed to [truthful result or learning outcome].",
  },
  {
    id: "hackathon",
    label: "Hackathon or competition",
    target: "certifications",
    text: "Hackathon / Competition - Role or Result (Year)",
  },
  {
    id: "coursework",
    label: "Relevant coursework",
    target: "education",
    text: "Relevant Coursework: Data Structures, DBMS, Operating Systems, Web Development",
  },
  {
    id: "openSource",
    label: "Open-source or freelancing",
    target: "projects",
    text: "Open-source / Freelance Work | Tools\n- Contributed [specific change] to [project/client context].\n- Mention links or scope if available.",
  },
];

function FresherDiscovery({ onAddPrompt }) {
  return (
    <section className="advisor-card" aria-labelledby="fresher-title">
      <div className="advisor-card-header">
        <div>
          <span className="eyebrow">Fresher mode</span>
          <h2 id="fresher-title">Find real experience</h2>
        </div>
      </div>
      <p className="advisor-empty">If you have little work history, add only experience you can honestly discuss.</p>
      <div className="discovery-list">
        {DISCOVERY_ITEMS.map((item) => (
          <button key={item.id} type="button" onClick={() => onAddPrompt(item)}>
            <span>{item.label}</span>
            <small>Add prompt</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function EditorFields({ data, update, openSections, toggleSection }) {
  return (
    <>
      <FormSection id="personal" title="Personal Info" icon="ID" open={openSections.personal} onToggle={() => toggleSection("personal")}>
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
          <span className="field-hint">Separate with a pipe, comma, or bullet.</span>
        </div>
      </FormSection>

      <FormSection id="summary" title="Professional Summary" icon="S" open={openSections.summary} onToggle={() => toggleSection("summary")}>
        <div className="field">
          <label className="field-label" htmlFor="field-summary">Summary</label>
          <textarea id="field-summary" className="field-textarea" name="summary" value={data.summary} onChange={update} placeholder="2-4 sentences based on your real role, skills, and target." rows={4} />
          <span className="field-hint">{data.summary.length} characters. Avoid generic claims.</span>
        </div>
      </FormSection>

      <FormSection id="experience" title="Work Experience" icon="W" open={openSections.experience} onToggle={() => toggleSection("experience")}>
        <div className="field">
          <label className="field-label" htmlFor="field-experience">Experience</label>
          <textarea id="field-experience" className="field-textarea" name="experience" value={data.experience} onChange={update} rows={8} placeholder={`Company Name - Job Title | Start - End Date\n- Achievement or responsibility with truthful impact\n- Another result or contribution\n\nNext Company - Role | Dates\n- Achievement...`} />
          <span className="field-hint">Format: Company - Role | Dates, then "- " for bullet points.</span>
        </div>
      </FormSection>

      <FormSection id="education" title="Education" icon="E" open={openSections.education} onToggle={() => toggleSection("education")}>
        <div className="field">
          <label className="field-label" htmlFor="field-education">Education</label>
          <textarea id="field-education" className="field-textarea" name="education" value={data.education} onChange={update} rows={4} placeholder={`University Name - Degree | Graduation Year\nRelevant Coursework: Subject A, Subject B`} />
        </div>
      </FormSection>

      <FormSection id="skills" title="Skills" icon="SK" open={openSections.skills} onToggle={() => toggleSection("skills")}>
        <div className="field">
          <label className="field-label" htmlFor="field-skills">Skills</label>
          <input id="field-skills" className="field-input" name="skills" value={data.skills} onChange={update} placeholder="JavaScript, React, Node.js, Python, SQL, Docker, Git..." />
          <span className="field-hint">Only include skills you can explain or demonstrate.</span>
        </div>
      </FormSection>

      <FormSection id="projects" title="Projects" icon="P" open={openSections.projects} onToggle={() => toggleSection("projects")}>
        <div className="field">
          <label className="field-label" htmlFor="field-projects">Projects</label>
          <textarea id="field-projects" className="field-textarea" name="projects" value={data.projects} onChange={update} rows={6} placeholder={`Project Name | Tech Stack\n- Developed X using Y to solve Z\n- Add measurable impact only if you know it`} />
          <span className="field-hint">Use the STAR + Impact assistant when you are unsure how to phrase a project.</span>
        </div>
      </FormSection>

      <FormSection id="certifications" title="Certifications & Achievements" icon="A" open={openSections.certifications} onToggle={() => toggleSection("certifications")}>
        <div className="field">
          <label className="field-label" htmlFor="field-certifications">Certifications</label>
          <textarea id="field-certifications" className="field-textarea" name="certifications" value={data.certifications} onChange={update} rows={3} placeholder={`AWS Certified Developer - Associate (2024)\nHackathon finalist - Project Name (2023)`} />
        </div>
      </FormSection>
    </>
  );
}

export default function App() {
  const [library, setLibrary] = useState(loadLibrary);
  const [activeId, setActiveId] = useState(() => localStorage.getItem(ACTIVE_RESUME_KEY) || "");
  const [view, setView] = useState("dashboard");
  const [openSections, setOpenSections] = useState({
    personal: true,
    summary: false,
    experience: false,
    education: false,
    skills: false,
    projects: false,
    certifications: false,
  });
  const [savedToast, setSavedToast] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [mobileTab, setMobileTab] = useState("edit");
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 700);
  const saveTimerRef = useRef(null);

  const activeResume = useMemo(() => {
    return library.find((record) => record.id === activeId) || library[0] || createResumeRecord();
  }, [activeId, library]);

  const data = activeResume.data;
  const analysis = useMemo(() => analyzeResume(data), [data]);
  const completeness = useMemo(() => {
    const values = Object.values(data);
    const filled = values.filter((value) => String(value || "").trim().length > 0).length;
    return Math.round((filled / values.length) * 100);
  }, [data]);

  useEffect(() => {
    if (!library.some((record) => record.id === activeId) && library[0]) {
      setActiveId(library[0].id);
    }
  }, [activeId, library]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 700);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
      localStorage.setItem(ACTIVE_RESUME_KEY, activeResume.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeResume.data));
      setSavedToast(true);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => setSavedToast(false), 1500);
    } catch {
      /* storage unavailable */
    }
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [activeResume, library]);

  const updateActiveResume = useCallback((updater) => {
    setLibrary((prev) => prev.map((record) => {
      if (record.id !== activeResume.id) return record;
      const patch = typeof updater === "function" ? updater(record) : updater;
      return { ...record, ...patch, updatedAt: new Date().toISOString() };
    }));
  }, [activeResume.id]);

  const update = useCallback((event) => {
    const { name, value } = event.target;
    updateActiveResume((record) => ({
      data: { ...record.data, [name]: value },
      name: name === "title" && value.trim() ? value.trim() : record.name,
    }));
  }, [updateActiveResume]);

  const toggleSection = useCallback((key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const openResume = useCallback((id) => {
    setActiveId(id);
    setView("editor");
  }, []);

  const openCreateDialog = useCallback(() => {
    setShowCreateDialog(true);
  }, []);

  const createResume = useCallback((draft = CREATION_DEFAULTS) => {
    const starter = buildStarterResume(draft);
    const name = draft.role?.trim()
      ? `${draft.role.trim()} Resume`
      : intentLabels[draft.intent] || "Untitled Resume";
    const record = createResumeRecord(starter, {
      name,
      version: intentLabels[draft.intent] || "General",
      template: draft.experience === "student" || draft.experience === "fresher" ? "classic" : activeResume?.template || "classic",
    });
    setLibrary((prev) => [record, ...prev]);
    setActiveId(record.id);
    setShowCreateDialog(false);
    setView("editor");
    setOpenSections({
      personal: true,
      summary: true,
      experience: false,
      education: draft.experience === "student" || draft.experience === "fresher",
      skills: true,
      projects: draft.experience === "student" || draft.experience === "fresher",
      certifications: false,
    });
  }, [activeResume?.template]);

  const duplicateResume = useCallback((id = activeResume.id, suffix = "Copy") => {
    const source = library.find((record) => record.id === id) || activeResume;
    const record = createResumeRecord(source.data, {
      name: `${source.name} - ${suffix}`,
      version: suffix,
      template: source.template,
      accentColor: source.accentColor,
      typography: source.typography,
    });
    setLibrary((prev) => [record, ...prev]);
    setActiveId(record.id);
    setView("editor");
  }, [activeResume, library]);

  const deleteResume = useCallback((id) => {
    setLibrary((prev) => prev.filter((record) => record.id !== id));
  }, []);

  const loadDemo = useCallback(() => {
    const record = createResumeRecord(DEMO_RESUME, { name: "Software Engineer Resume", version: "Demo", template: "shreyas" });
    setLibrary((prev) => [record, ...prev]);
    setActiveId(record.id);
    setView("editor");
    setOpenSections({
      personal: true,
      summary: true,
      experience: true,
      education: true,
      skills: true,
      projects: true,
      certifications: true,
    });
  }, []);

  const handleClearConfirm = useCallback(() => {
    updateActiveResume({ data: EMPTY_RESUME, name: "Untitled Resume" });
    setShowClearDialog(false);
  }, [updateActiveResume]);

  const handleUseSuggestion = useCallback((suggestion) => {
    updateActiveResume((record) => {
      const prefix = record.data.projects.trim() ? `${record.data.projects.trim()}\n` : "Guided Project | Add tech stack\n";
      return { data: { ...record.data, projects: `${prefix}- ${suggestion}` } };
    });
    setOpenSections((prev) => ({ ...prev, projects: true }));
  }, [updateActiveResume]);

  const addDiscoveryPrompt = useCallback((item) => {
    updateActiveResume((record) => {
      const current = record.data[item.target]?.trim();
      return {
        data: {
          ...record.data,
          [item.target]: current ? `${current}\n\n${item.text}` : item.text,
        },
      };
    });
    setOpenSections((prev) => ({ ...prev, [item.target]: true }));
  }, [updateActiveResume]);

  const createTailoredVersion = useCallback((jobDescription, match) => {
    const role = data.title?.trim() || "Target Role";
    const record = createResumeRecord(data, {
      name: `${role} - Tailored Draft`,
      version: "Tailored",
      template: activeResume.template,
      accentColor: activeResume.accentColor,
      typography: activeResume.typography,
    });
    record.jobDescription = jobDescription;
    record.tailoringNotes = match.missing.slice(0, 8).map((item) => item.word);
    setLibrary((prev) => [record, ...prev]);
    setActiveId(record.id);
    setView("editor");
  }, [activeResume, data]);

  const downloadPDF = useCallback(async () => {
    if (pdfLoading) return;

    setPdfLoading(true);

    const safeName = data.name?.trim()
      ? data.name.trim().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")
      : "Resume";
    const previousTitle = document.title;

    try {
      if (!document.getElementById("resume-paper")) {
        setView("editor");
        setMobileTab("preview");
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      }

      const el = document.getElementById("resume-paper");
      if (!el) return;

      await new Promise((resolve) => setTimeout(resolve, 80));
      document.title = `${safeName}_Resume`;
      window.print();
    } finally {
      document.title = previousTitle;
      setPdfLoading(false);
    }
  }, [data.name, pdfLoading]);

  return (
    <div className="app-shell" style={{ "--accent": activeResume.accentColor }}>
      <ConfirmDialog open={showClearDialog} onConfirm={handleClearConfirm} onCancel={() => setShowClearDialog(false)} />
      <GuidedCreateDialog open={showCreateDialog} onCancel={() => setShowCreateDialog(false)} onCreate={createResume} />
      <Toast message="Saved" type="success" visible={savedToast} />
      <Toast message="Preparing PDF..." type="loading" visible={pdfLoading} />

      <header className="app-header">
        <button className="app-logo logo-button" type="button" onClick={() => setView("dashboard")} aria-label="Open dashboard">
          <span className="logo-icon" aria-hidden="true">RF</span>
          <span className="logo-text">ResumeForge</span>
          <span className="logo-badge">LOCAL</span>
        </button>

        <nav className="top-nav" aria-label="Primary navigation">
          <button className={view === "dashboard" ? "active" : ""} type="button" onClick={() => setView("dashboard")}>Dashboard</button>
          <button className={view === "editor" ? "active" : ""} type="button" onClick={() => setView("editor")}>Editor</button>
        </nav>

        <ProgressBar value={completeness} />

        <div className="header-controls">
          <button className="btn-ghost" id="load-demo-btn" onClick={loadDemo} type="button">Load Example</button>
          <button className="btn-ghost" id="clear-form-btn" onClick={() => setShowClearDialog(true)} type="button" disabled={!hasResumeContent(data)}>Clear</button>
          <button className="btn-primary" id="download-pdf-btn" onClick={downloadPDF} disabled={pdfLoading} type="button">
            {pdfLoading ? <span className="btn-spinner" aria-hidden="true" /> : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )}
            {pdfLoading ? "Preparing" : "Export PDF"}
          </button>
        </div>
      </header>

      {view === "dashboard" ? (
        <Dashboard
          resumes={library}
          activeId={activeResume.id}
          onOpen={openResume}
          onCreate={openCreateDialog}
          onDuplicate={duplicateResume}
          onDelete={deleteResume}
          onLoadDemo={loadDemo}
        />
      ) : (
        <>
          <div className={`mobile-tabs ${isMobile ? "mobile-tabs-visible" : ""}`}>
            <button className={`mobile-tab ${mobileTab === "edit" ? "active" : ""}`} onClick={() => setMobileTab("edit")} id="mobile-tab-edit" type="button" aria-selected={mobileTab === "edit"}>Edit</button>
            <button className={`mobile-tab ${mobileTab === "preview" ? "active" : ""}`} onClick={() => setMobileTab("preview")} id="mobile-tab-preview" type="button" aria-selected={mobileTab === "preview"}>Preview</button>
          </div>

          <div className="main-layout">
            <aside className={`form-panel ${isMobile && mobileTab === "preview" ? "panel-hidden" : ""}`} aria-label="Resume editor">
              <div className="active-resume-bar">
                <div>
                  <span className="eyebrow">Editing</span>
                  <strong>{activeResume.name}</strong>
                </div>
                <button className="btn-ghost" type="button" onClick={() => duplicateResume(activeResume.id)}>Duplicate</button>
              </div>
              <EditorFields data={data} update={update} openSections={openSections} toggleSection={toggleSection} />
              <div className="form-footer">
                <span>Autosaved locally</span>
                <span>-</span>
                <span>No resume content leaves your browser</span>
              </div>
            </aside>

            <aside className={`advisor-panel ${isMobile && mobileTab === "preview" ? "panel-hidden" : ""}`} aria-label="Resume guidance">
              <ResumeInsights analysis={analysis} />
              <WritingAssistant onUseSuggestion={handleUseSuggestion} />
              <FresherDiscovery onAddPrompt={addDiscoveryPrompt} />
              <TypographyPanel typography={activeResume.typography} onChange={(typography) => updateActiveResume({ typography })} />
              <JobMatchPanel data={data} onCreateTailoredVersion={createTailoredVersion} />
            </aside>

            <main className={`preview-panel ${isMobile && mobileTab === "edit" ? "panel-hidden" : ""}`} aria-label="Resume preview">
              <div className="preview-controls">
                <TemplateSwitcher value={activeResume.template} onChange={(template) => updateActiveResume({ template })} />
                <ColorPicker colors={ACCENT_COLORS} value={activeResume.accentColor} onChange={(accentColor) => updateActiveResume({ accentColor })} />
              </div>
              <div className="preview-scroll">
                <ResumePreview data={data} template={activeResume.template} accentColor={activeResume.accentColor} typography={activeResume.typography} />
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
}
