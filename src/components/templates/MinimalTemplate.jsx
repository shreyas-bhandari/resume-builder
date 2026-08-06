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
      current = { company: parts[0] || left, role: parts.slice(1).join(" – ") || "", dates: right, bullets: [] };
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

export default function MinimalTemplate({ data, accentColor }) {
  const {
    name, title, email, phone, location, links,
    summary, education, skills, experience, projects, certifications,
  } = data;

  const skillList = skillsToArray(skills);
  const expItems = parseExperience(experience);
  const projItems = parseProjects(projects);
  const eduLines = splitLines(education);
  const certLines = splitLines(certifications);
  const contactParts = [email, phone, location].filter(Boolean);

  const section = (label, children) => (
    <section className="tmin-section">
      <div className="tmin-section-header">
        <h2 className="tmin-section-title">{label}</h2>
        <div className="tmin-section-rule" style={{ borderColor: accentColor + "40" }} />
      </div>
      <div className="tmin-section-body">{children}</div>
    </section>
  );

  return (
    <div id="resume-paper" className="resume-paper tmin-wrap" aria-label="Resume preview">
      {/* Header */}
      <header className="tmin-header">
        <h1 className="tmin-name">{name || "YOUR NAME"}</h1>
        {title && <div className="tmin-title" style={{ color: accentColor }}>{title}</div>}
        {contactParts.length > 0 && (
          <div className="tmin-contact">
            {contactParts.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="tmin-dot">·</span>}
                <span>{c}</span>
              </React.Fragment>
            ))}
          </div>
        )}
        {links && <div className="tmin-links">{links}</div>}
        <div className="tmin-header-rule" />
      </header>

      {/* Summary */}
      {summary?.trim() && section("Profile",
        <p className="tmin-body">{summary}</p>
      )}

      {/* Experience */}
      {expItems.length > 0 && section("Experience",
        expItems.map((job, i) => (
          <div key={i} className="tmin-job">
            <div className="tmin-job-header">
              <div className="tmin-job-left">
                <span className="tmin-job-company">{job.company}</span>
                {job.role && <span className="tmin-job-role">,&nbsp;{job.role}</span>}
              </div>
              {job.dates && <span className="tmin-job-dates">{job.dates}</span>}
            </div>
            {job.bullets.length > 0 && (
              <ul className="tmin-bullets">
                {job.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            )}
          </div>
        ))
      )}

      {/* Education */}
      {eduLines.length > 0 && section("Education",
        eduLines.map((ln, i) => <p key={i} className="tmin-body">{ln}</p>)
      )}

      {/* Skills */}
      {skillList.length > 0 && section("Skills",
        <div className="tmin-skills">
          {skillList.map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="tmin-skill-sep">·</span>}
              <span className="tmin-skill">{s}</span>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Projects */}
      {projItems.length > 0 && section("Projects",
        projItems.map((proj, i) => (
          <div key={i} className="tmin-job">
            <div className="tmin-project-name">{proj.title}</div>
            {proj.bullets.length > 0 && (
              <ul className="tmin-bullets">
                {proj.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            )}
          </div>
        ))
      )}

      {/* Certifications */}
      {certLines.length > 0 && section("Certifications",
        <ul className="tmin-bullets">
          {certLines.map((ln, i) => <li key={i}>{ln}</li>)}
        </ul>
      )}
    </div>
  );
}
