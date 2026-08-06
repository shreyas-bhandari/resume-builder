import React from "react";

const splitLines = (txt = "") =>
  txt.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);

const skillsToArray = (txt = "") =>
  txt.split(",").map((s) => s.trim()).filter(Boolean);

function parseExperience(raw = "") {
  const lines = splitLines(raw);
  const items = [];
  let current = null;
  for (const line of lines) {
    if (line.startsWith("- ")) {
      if (current) current.bullets.push(line.replace(/^- /, "").trim());
    } else {
      if (current) items.push(current);
      const [left, right = ""] = line.split("|").map((s) => s.trim());
      const parts = left.split(/—|–/).map((s) => s.trim());
      current = {
        company: parts[0] || left,
        role: parts.slice(1).join(" – ") || "",
        dates: right,
        bullets: [],
      };
    }
  }
  if (current) items.push(current);
  return items;
}

function parseProjects(raw = "") {
  const lines = splitLines(raw);
  const items = [];
  let current = null;
  for (const line of lines) {
    if (line.startsWith("- ")) {
      if (current) current.bullets.push(line.replace(/^- /, "").trim());
    } else {
      if (current) items.push(current);
      current = { title: line, bullets: [] };
    }
  }
  if (current) items.push(current);
  return items;
}

export default function ClassicTemplate({ data, accentColor }) {
  const {
    name, title, email, phone, location, links,
    summary, education, skills, experience, projects, certifications,
  } = data;

  const eduLines = splitLines(education);
  const skillList = skillsToArray(skills);
  const expItems = parseExperience(experience);
  const projItems = parseProjects(projects);
  const certLines = splitLines(certifications);
  const contactLine = [email, phone, location].filter(Boolean).join("  •  ");

  const sectionTitle = (text) => (
    <h2 className="tc-section-title">
      <span className="tc-section-line" style={{ background: accentColor }} />
      {text}
    </h2>
  );

  return (
    <div id="resume-paper" className="resume-paper tc-wrap" aria-label="Resume preview">
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
