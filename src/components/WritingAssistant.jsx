import React, { useMemo, useState } from "react";
import { createBulletSuggestion } from "../lib/resumeSchema";

const INITIAL = {
  situation: "",
  task: "",
  action: "",
  tools: "",
  result: "",
  impact: "",
};

export default function WritingAssistant({ onUseSuggestion }) {
  const [draft, setDraft] = useState(INITIAL);

  const suggestion = useMemo(() => createBulletSuggestion(draft), [draft]);

  const update = (event) => {
    const { name, value } = event.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="advisor-card" aria-labelledby="writing-assistant-title">
      <div className="advisor-card-header">
        <div>
          <span className="eyebrow">STAR + Impact</span>
          <h2 id="writing-assistant-title">Build a stronger bullet</h2>
        </div>
      </div>

      <div className="assistant-grid">
        <label>
          Problem
          <input name="situation" value={draft.situation} onChange={update} placeholder="Manual support tracking was slow" />
        </label>
        <label>
          Responsibility
          <input name="task" value={draft.task} onChange={update} placeholder="Improve request visibility" />
        </label>
        <label>
          Action
          <input name="action" value={draft.action} onChange={update} placeholder="Built an internal dashboard" />
        </label>
        <label>
          Tools
          <input name="tools" value={draft.tools} onChange={update} placeholder="React, Node.js, PostgreSQL" />
        </label>
        <label>
          Result
          <input name="result" value={draft.result} onChange={update} placeholder="centralize requests" />
        </label>
        <label>
          Impact
          <input name="impact" value={draft.impact} onChange={update} placeholder="reduced manual follow-up" />
        </label>
      </div>

      <div className="suggestion-box">
        <span>Suggested bullet</span>
        {suggestion.suggestion ? (
          <p>{suggestion.suggestion}</p>
        ) : (
          <p className="muted">Add an action to generate a grounded suggestion.</p>
        )}
        <small>{suggestion.why}</small>
      </div>

      <button
        className="btn-secondary"
        type="button"
        disabled={!suggestion.suggestion}
        onClick={() => onUseSuggestion(suggestion.suggestion)}
      >
        Add to projects
      </button>
    </section>
  );
}
