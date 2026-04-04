import React, { useState, useEffect, useRef, useCallback } from "react";
import { Particles } from "../common/Particles";

export function HeroSlider({ slides = [], onExplore, onQuote }) {
  const [cur, setCur] = useState(0);
  const timer = useRef();
  const total = slides.length || 1;

  const next = useCallback(() => setCur(c => (c + 1) % total), [total]);
  const prev = () => setCur(c => (c - 1 + total) % total);

  useEffect(() => {
    timer.current = setInterval(next, 6000);
    return () => clearInterval(timer.current);
  }, [next]);

  const go = (i) => {
    clearInterval(timer.current);
    setCur(i);
    timer.current = setInterval(next, 6000);
  };

  return (
    <>
      {Array.from({ length: total }, (_, i) => {
        const slide = slides[i] || {};
        return (
          <div key={i} className={`hero-slide${!slide.image ? " hero-slide-default" : ""}${i === cur ? " active" : ""}`}
            style={slide.image ? { backgroundImage: `url(${slide.image})` } : {}}
          />
        );
      })}

      <div className="hero-overlay" />
      <Particles />

      <div className="hero-content">
        <div className="hero-chip">China's #1 Auto Importer in Ghana</div>
        <h1 className="hero-h1"><span className="gt-neon">Jaybesin</span><br />Autos</h1>
        <div className="hero-h1-sub">China's Finest. West Africa's Pride.</div>
        <p className="hero-desc">Premium second-hand vehicles sourced from China — Electric, Hybrid, SUVs, 4×4s and Saloons — delivered to your doorstep in Ghana and across West Africa.</p>
        <div className="hero-btns">
          <button className="btn-p" onClick={onExplore}>Explore Our Garage →</button>
          <button className="btn-o" onClick={onQuote}><span>Get Custom Quote</span></button>
        </div>
      </div>

      <div className="hero-slide-counter"><span>{String(cur + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")}</div>

      {total > 1 && (
        <div className="hero-arrows">
          <button className="hero-arrow" onClick={prev}>←</button>
          <button className="hero-arrow" onClick={next}>→</button>
        </div>
      )}

      {total > 1 && (
        <div className="hero-dots">
          {Array.from({ length: total }, (_, i) => (
            <div key={i} className={`hero-dot${i === cur ? " act" : ""}`} onClick={() => go(i)} />
          ))}
        </div>
      )}

      <div className="hero-scroll"><div className="hero-scroll-dot" />Scroll</div>
    </>
  );
}
