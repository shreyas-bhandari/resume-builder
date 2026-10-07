import React from "react";
import { FONT_PRESETS, normalizeResume } from "../../lib/resumeSchema";

export default function ModernTemplate({ data, accentColor, typography }) {
  const {
    name, title, email, phone, location, links,
    summary,
  } = data;

  const resume = normalizeResume(data);
  const skillList = resume.skillList;
  const expItems = resume.experienceItems;
  const projItems = resume.projectItems;
  const eduLines = resume.educationLines;
  const certLines = resume.certificationLines;

  const sideLabel = (text) => (
    <h3 className="tm-side-label">{text}</h3>
  );

  const mainLabel = (text) => (
    <h2 className="tm-main-label">
      {text}
      <span className="tm-main-rule" style={{ background: accentColor }} />
    </h2>
  );

  const contactItems = [
    email && { icon: "✉", text: email },
    phone && { icon: "✆", text: phone },
    location && { icon: "⌖", text: location },
  ].filter(Boolean);
  const style = typography ? {
    "--resume-font": FONT_PRESETS[typography.fontFamily]?.stack || FONT_PRESETS.inter.stack,
    "--resume-body": `${typography.bodySize}px`,
    "--resume-heading": `${typography.headingSize}px`,
    "--resume-name": `${Math.max(20, typography.nameSize - 8)}px`,
    "--resume-line": typography.lineHeight,
    "--resume-section": `${typography.sectionSpacing}px`,
    "--resume-margin": `${Math.max(28, typography.pageMargin - 14)}px`,
  } : undefined;

  return (
    <div id="resume-paper" className="resume-paper tm-wrap" style={style} aria-label="Resume preview">
      {/* Sidebar */}
      <aside className="tm-sidebar" style={{ background: accentColor }}>
        {/* Name / Title in sidebar */}
        <div className="tm-sidebar-top">
          <h1 className="tm-name">{name || "YOUR NAME"}</h1>
          {title && <div className="tm-title">{title}</div>}
        </div>

        {/* Contact */}
        {contactItems.length > 0 && (
          <div className="tm-side-section">
            {sideLabel("Contact")}
            {contactItems.map((item, i) => (
              <div key={i} className="tm-contact-item">
                <span className="tm-contact-icon">{item.icon}</span>
                <span className="tm-contact-text">{item.text}</span>
              </div>
            ))}
            {links && (
              <div className="tm-contact-links">{links}</div>
            )}
          </div>
        )}

        {/* Skills */}
        {skillList.length > 0 && (
          <div className="tm-side-section">
            {sideLabel("Skills")}
            <div className="tm-skill-list">
              {skillList.map((s, i) => (
                <span key={i} className="tm-skill-tag">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Education in sidebar */}
        {eduLines.length > 0 && (
          <div className="tm-side-section">
            {sideLabel("Education")}
            {eduLines.map((ln, i) => (
              <p key={i} className="tm-side-body">{ln}</p>
            ))}
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="tm-main">
        {/* Summary */}
        {summary?.trim() && (
          <section className="tm-section">
            {mainLabel("Summary")}
            <p className="tm-body">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {expItems.length > 0 && (
          <section className="tm-section">
            {mainLabel("Experience")}
            {expItems.map((job, i) => (
              <div key={i} className="tm-job">
                <div className="tm-job-header">
                  <div>
                    <span className="tm-job-company">{job.company}</span>
                    {job.role && <span className="tm-job-role"> — {job.role}</span>}
                  </div>
                  {job.dates && (
                    <span className="tm-job-dates" style={{ color: accentColor }}>{job.dates}</span>
                  )}
                </div>
                {job.bullets.length > 0 && (
                  <ul className="tm-bullets">
                    {job.bullets.map((b, j) => (
                      <li key={j}>
                        <span className="tm-bullet-marker" style={{ background: accentColor }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projItems.length > 0 && (
          <section className="tm-section">
            {mainLabel("Projects")}
            {projItems.map((proj, i) => (
              <div key={i} className="tm-job">
                <div className="tm-project-name">{proj.title}</div>
                {proj.bullets.length > 0 && (
                  <ul className="tm-bullets">
                    {proj.bullets.map((b, j) => (
                      <li key={j}>
                        <span className="tm-bullet-marker" style={{ background: accentColor }} />
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
          <section className="tm-section">
            {mainLabel("Certifications")}
            <ul className="tm-bullets">
              {certLines.map((ln, i) => (
                <li key={i}>
                  <span className="tm-bullet-marker" style={{ background: accentColor }} />
                  {ln}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
