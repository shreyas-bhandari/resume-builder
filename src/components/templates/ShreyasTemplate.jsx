import React from "react";
import { FONT_PRESETS, normalizeResume } from "../../lib/resumeSchema";

function SectionHeader({ children, accentColor }) {
  return (
    <div className="sh-section-header">
      <span className="sh-section-title">{children}</span>
      <div className="sh-section-rule" style={{ background: accentColor }} />
    </div>
  );
}

export default function ShreyasTemplate({ data, accentColor, typography }) {
  const {
    name, title, email, phone, location,
    summary,
  } = data;

  const resume = normalizeResume(data);
  const skillList = resume.skillList;
  const expItems = resume.experienceItems;
  const projItems = resume.projectItems;
  const eduLines = resume.educationLines;
  const certLines = resume.certificationLines;
  const linkList = resume.linkList;
  const style = typography ? {
    "--resume-font": FONT_PRESETS[typography.fontFamily]?.stack || FONT_PRESETS.dm.stack,
    "--resume-body": `${typography.bodySize}px`,
    "--resume-heading": `${typography.headingSize}px`,
    "--resume-name": `${Math.max(24, typography.nameSize - 4)}px`,
    "--resume-line": typography.lineHeight,
    "--resume-section": `${Math.max(10, typography.sectionSpacing - 2)}px`,
    "--resume-margin": `${Math.max(34, typography.pageMargin - 10)}px`,
  } : undefined;

  return (
    <div id="resume-paper" className="resume-paper sh-wrap" style={style} aria-label="Resume preview">

      {/* ── TOP HEADER BAR ── */}
      <header className="sh-header" style={{ background: accentColor }}>
        <h1 className="sh-name">{name || "YOUR NAME"}</h1>
        {title && <div className="sh-headline">{title}</div>}

        <div className="sh-contact-bar">
          {email && (
            <span className="sh-contact-item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              {email}
            </span>
          )}
          {phone && (
            <span className="sh-contact-item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.15 1.22 2 2 0 012.11 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
              </svg>
              {phone}
            </span>
          )}
          {location && (
            <span className="sh-contact-item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {location}
            </span>
          )}
          {linkList.map((lnk, i) => (
            <span key={i} className="sh-contact-item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
              </svg>
              {lnk}
            </span>
          ))}
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="sh-body">

        {/* Summary */}
        {summary?.trim() && (
          <section className="sh-section">
            <SectionHeader accentColor={accentColor}>Professional Summary</SectionHeader>
            <p className="sh-body-text">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {expItems.length > 0 && (
          <section className="sh-section">
            <SectionHeader accentColor={accentColor}>Work Experience</SectionHeader>
            {expItems.map((job, i) => (
              <div key={i} className="sh-entry">
                <div className="sh-entry-header">
                  <div className="sh-entry-left">
                    <span className="sh-entry-company">{job.company}</span>
                    {job.role && (
                      <span className="sh-entry-role"> · {job.role}</span>
                    )}
                  </div>
                  {job.dates && (
                    <span className="sh-entry-dates" style={{ color: accentColor }}>
                      {job.dates}
                    </span>
                  )}
                </div>
                {job.bullets.length > 0 && (
                  <ul className="sh-bullets">
                    {job.bullets.map((b, j) => (
                      <li key={j}>
                        <span className="sh-bullet-dot" style={{ background: accentColor }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {eduLines.length > 0 && (
          <section className="sh-section">
            <SectionHeader accentColor={accentColor}>Education</SectionHeader>
            {eduLines.map((ln, i) => {
              // Try to parse "University — Degree | Year" format
              const [left, right = ""] = ln.split("|").map((s) => s.trim());
              const parts = left.split(/—|–/).map((s) => s.trim());
              const inst = parts[0];
              const deg = parts.slice(1).join(" – ");
              return (
                <div key={i} className="sh-entry">
                  <div className="sh-entry-header">
                    <div className="sh-entry-left">
                      <span className="sh-entry-company">{inst}</span>
                      {deg && <span className="sh-entry-role"> · {deg}</span>}
                    </div>
                    {right && (
                      <span className="sh-entry-dates" style={{ color: accentColor }}>
                        {right}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* Skills */}
        {skillList.length > 0 && (
          <section className="sh-section">
            <SectionHeader accentColor={accentColor}>Technical Skills</SectionHeader>
            <div className="sh-skills-grid">
              {skillList.map((s, i) => (
                <span
                  key={i}
                  className="sh-skill-tag"
                  style={{
                    borderColor: accentColor + "55",
                    color: accentColor,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projItems.length > 0 && (
          <section className="sh-section">
            <SectionHeader accentColor={accentColor}>Projects</SectionHeader>
            {projItems.map((proj, i) => (
              <div key={i} className="sh-entry">
                <div className="sh-entry-header">
                  <span className="sh-entry-company">{proj.title}</span>
                  {proj.tech && (
                    <span
                      className="sh-tech-badge"
                      style={{ background: accentColor + "18", color: accentColor }}
                    >
                      {proj.tech}
                    </span>
                  )}
                </div>
                {proj.bullets.length > 0 && (
                  <ul className="sh-bullets">
                    {proj.bullets.map((b, j) => (
                      <li key={j}>
                        <span className="sh-bullet-dot" style={{ background: accentColor }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {certLines.length > 0 && (
          <section className="sh-section">
            <SectionHeader accentColor={accentColor}>Certifications & Achievements</SectionHeader>
            <ul className="sh-bullets">
              {certLines.map((ln, i) => (
                <li key={i}>
                  <span className="sh-bullet-dot" style={{ background: accentColor }} />
                  {ln}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
