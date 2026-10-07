import React from "react";

export default function ColorPicker({ colors, value, onChange }) {
  return (
    <div className="color-picker" role="radiogroup" aria-label="Accent color">
      <span className="color-picker-label">Color</span>
      {colors.map((color) => (
        <button
          key={color.id}
          className={`color-swatch ${value === color.value ? "active" : ""}`}
          style={{ "--swatch-color": color.value }}
          onClick={() => onChange(color.value)}
          title={color.label}
          aria-label={color.label}
          aria-checked={value === color.value}
          role="radio"
          id={`color-${color.id}`}
          type="button"
        >
          <span className="swatch-dot" />
          {value === color.value && (
            <svg
              className="swatch-check"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
      ))}
    </div>
  );
}
