import React from "react";

const scoreLabels = {
  content: "Content",
  structure: "Structure",
  impact: "Impact",
  ats: "ATS",
  readability: "Readability",
};

export default function ResumeInsights({ analysis }) {
  return (
    <section className="advisor-card" aria-labelledby="resume-health-title">
      <div className="advisor-card-header">
        <div>
          <span className="eyebrow">Resume health</span>
          <h2 id="resume-health-title">Truthful strength signals</h2>
        </div>
        <div className="score-ring" aria-label={`Overall resume score ${analysis.overall} out of 100`}>
          <span>{analysis.overall}</span>
        </div>
      </div>

      <div className="score-grid">
        {Object.entries(analysis.scores).map(([key, value]) => (
          <div className="score-row" key={key}>
            <div className="score-row-top">
              <span>{scoreLabels[key]}</span>
              <strong>{value}</strong>
            </div>
            <div className="mini-track" aria-hidden="true">
              <span style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="insight-stats" aria-label="Resume statistics">
        <span>{analysis.stats.sections} sections</span>
        <span>{analysis.stats.bullets} bullets</span>
        <span>{analysis.stats.metricBullets} impact signals</span>
        <span>{analysis.stats.skills} skills</span>
      </div>

      <div className="advisor-list">
        <h3>Recommended next moves</h3>
        {analysis.recommendations.length ? (
          <ul>
            {analysis.recommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="advisor-empty">The core resume structure is in good shape. Fine-tune wording against a target job next.</p>
        )}
      </div>
      <p className="advisor-note">ATS compatibility is an estimate, not a guarantee.</p>
    </section>
  );
}
