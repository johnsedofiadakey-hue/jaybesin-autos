import React from "react";

export function Particles() {
  const pts = Array.from({ length: 16 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    s: Math.random() * 2 + .5,
    d: Math.random() * 5,
    dur: Math.random() * 6 + 6,
    c: i % 3 === 0 ? "neon" : i % 3 === 1 ? "neon2" : "orange"
  }));

  return (
    <div className="hero-particles">
      {pts.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.s}px`,
            height: `${p.s}px`,
            borderRadius: "50%",
            background: `var(--${p.c})`,
            opacity: .5,
            animation: `float${i % 3} ${p.dur}s ${p.d}s infinite ease-in-out`
          }}
        />
      ))}
      <style>{`
        @keyframes float0{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
        @keyframes float1{0%,100%{transform:translateY(0) translateX(0)}50%{transform:translateY(-12px) translateX(8px)}}
        @keyframes float2{0%,100%{transform:translateY(0)}33%{transform:translateY(-8px)}66%{transform:translateY(-16px)}}
      `}</style>
    </div>
  );
}
