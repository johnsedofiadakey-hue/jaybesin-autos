import React from "react";

export function ColorPick({ label, value, onChange }) {
  return (
    <div className="theme-color-item">
      <div className="theme-color-lbl">{label}</div>
      <div className="theme-color-pick">
        <div className="color-swatch">
          <input type="color" value={value} onChange={e => onChange(e.target.value)} />
        </div>
        <span className="theme-color-hex">{value}</span>
      </div>
    </div>
  );
}
