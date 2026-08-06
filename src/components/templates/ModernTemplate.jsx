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

// Darken a hex color for text contrast
function darken(hex, amount = 30) {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  let r = Math.max(0, parseInt(c.substring(0, 2), 16) - amount);
  let g = Math.max(0, parseInt(c.substring(2, 4), 16) - amount);
  let b = Math.max(0, parseInt(c.substring(4, 6), 16) - amount);
  return `rgb(${r},${g},${b})`;
}

export default function ModernTemplate({ data, accentColor }) {
  const {
    name, title, email, phone, location, links,
    summary, education, skills, experience, projects, certifications,
  } = data;

  const skillList = skillsToArray(skills);
  const expItems = parseExperience(experience);
  const projItems = parseProjects(projects);
  const eduLines = splitLines(education);
  const certLines = splitLines(certifications);

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

  return (
    <div id="resume-paper" className="resume-paper tm-wrap" aria-label="Resume preview">
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
