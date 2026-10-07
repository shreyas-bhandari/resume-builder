import React from "react";
import { FONT_PRESETS, normalizeResume } from "../../lib/resumeSchema";

export default function ClassicTemplate({ data, accentColor, typography }) {
  const {
    name, title, email, phone, location, links,
    summary,
  } = data;

  const resume = normalizeResume(data);
  const eduLines = resume.educationLines;
  const skillList = resume.skillList;
  const expItems = resume.experienceItems;
  const projItems = resume.projectItems;
  const certLines = resume.certificationLines;
  const contactLine = [email, phone, location].filter(Boolean).join("  •  ");
  const style = typography ? {
    "--resume-font": FONT_PRESETS[typography.fontFamily]?.stack || FONT_PRESETS.inter.stack,
    "--resume-body": `${typography.bodySize}px`,
    "--resume-heading": `${typography.headingSize}px`,
    "--resume-name": `${typography.nameSize}px`,
    "--resume-line": typography.lineHeight,
    "--resume-section": `${typography.sectionSpacing}px`,
    "--resume-margin": `${typography.pageMargin}px`,
  } : undefined;

  const sectionTitle = (text) => (
    <h2 className="tc-section-title">
      <span className="tc-section-line" style={{ background: accentColor }} />
      {text}
    </h2>
  );

  return (
    <div id="resume-paper" className="resume-paper tc-wrap" style={style} aria-label="Resume preview">
      {/* Header */}
      <header className="tc-header">
        <h1 className="tc-name" style={{ color: accentColor }}>{name || "YOUR NAME"}</h1>
        {title && <div className="tc-title">{title}</div>}
        {contactLine && <div className="tc-contact">{contactLine}</div>}
        {links && <div className="tc-links">{links}</div>}
      </header>

      <div className="tc-rule" style={{ background: accentColor }} />

      {/* Summary */}
      {summary?.trim() && (
        <section className="tc-section">
          {sectionTitle("Professional Summary")}
          <p className="tc-body">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {expItems.length > 0 && (
        <section className="tc-section">
          {sectionTitle("Experience")}
          {expItems.map((job, i) => (
            <div key={i} className="tc-job">
              <div className="tc-job-header">
                <span className="tc-job-company">
                  {job.company}
                  {job.role ? <span className="tc-job-role"> — {job.role}</span> : null}
                </span>
                {job.dates && <span className="tc-job-dates">{job.dates}</span>}
              </div>
              {job.bullets.length > 0 && (
                <ul className="tc-bullets">
                  {job.bullets.map((b, j) => (
                    <li key={j}><span className="tc-bullet-dot" style={{ color: accentColor }}>▸</span>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {eduLines.length > 0 && (
        <section className="tc-section">
          {sectionTitle("Education")}
          {eduLines.map((ln, i) => <p key={i} className="tc-body">{ln}</p>)}
        </section>
      )}

      {/* Skills */}
      {skillList.length > 0 && (
        <section className="tc-section">
          {sectionTitle("Skills")}
          <div className="tc-tags">
            {skillList.map((s, i) => (
              <span key={i} className="tc-tag" style={{ borderColor: accentColor + "55" }}>{s}</span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projItems.length > 0 && (
        <section className="tc-section">
          {sectionTitle("Projects")}
          {projItems.map((proj, i) => (
            <div key={i} className="tc-job">
              <div className="tc-project-name">{proj.title}</div>
              {proj.bullets.length > 0 && (
                <ul className="tc-bullets">
                  {proj.bullets.map((b, j) => (
                    <li key={j}><span className="tc-bullet-dot" style={{ color: accentColor }}>▸</span>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certLines.length > 0 && (
        <section className="tc-section">
          {sectionTitle("Certifications & Achievements")}
          <ul className="tc-bullets">
            {certLines.map((ln, i) => (
              <li key={i}><span className="tc-bullet-dot" style={{ color: accentColor }}>▸</span>{ln}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
