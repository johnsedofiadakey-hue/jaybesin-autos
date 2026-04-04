import React from "react";

export function Tgl({ on, onChange, label }) {
  return (
    <div className="tgl-wrap">
      <div className={`tgl${on ? " on" : ""}`} onClick={onChange} />
      {label && <span className="tgl-lbl">{label}</span>}
    </div>
  );
}
