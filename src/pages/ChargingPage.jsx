import React from "react";
import { Zap, ShieldCheck, HelpCircle, Phone } from "lucide-react";
import { fmtUSD } from "../utils/theme";

export function ChargingPage({ charging = [] }) {
  return (
    <div className="sec" style={{ paddingTop: "120px" }}>
      <div className="sec-chip chip-4 rv on">Sustainability</div>
      <h2 className="sec-h rv on">EV Sourcing <span className="gt-neon2">& Infrastructure</span></h2>
      <p className="sec-p rv on" style={{ marginBottom: "40px" }}>
        Go green with Jaybesin. We provide top-tier Chinese Electric Vehicles along with 
        the necessary charging infrastructure for your home or business in Ghana.
      </p>

      <div className="svc-grid">
        {charging.map((c, i) => (
          <div key={c.id} className="svc-card rv on" style={{ transitionDelay: `${i * 0.1}s` }}>
            <div className="svc-icon" style={{ background: "color-mix(in srgb,var(--neon2) 12%,transparent)", border: "1px solid color-mix(in srgb,var(--neon2) 22%,transparent)" }}>
              <Zap size={22} style={{ color: "var(--neon2)" }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="svc-name">{c.name}</div>
              <div style={{ fontSize: "20px" }}>{c.emoji || "🔌"}</div>
            </div>
            <div style={{ fontSize: "12px", color: "var(--neon2)", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>{c.brand} · {c.type}</div>
            <div className="svc-desc" style={{ marginBottom: "16px" }}>{c.power} Power Output. Reliable, safe, and professional setup.</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border2)", paddingTop: "12px" }}>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text)" }}>{fmtUSD(c.price)}</div>
              <div style={{ fontSize: "11px", color: "var(--text3)" }}>+ {fmtUSD(c.installation)} Installation</div>
            </div>
          </div>
        ))}
      </div>

      <div className="adm-card" style={{ marginTop: "48px", background: "var(--bg2)", border: "1px solid var(--border2)", textAlign: "center", padding: "40px" }}>
        <HelpCircle size={32} style={{ marginBottom: "15px", opacity: 0.1 }} />
        <h3 className="sec-h" style={{ fontSize: "20px" }}>Need advice or a custom setup?</h3>
        <p className="sec-p" style={{ margin: "0 auto 24px" }}>
          Our engineering team can design the perfect charging architecture for your fleet or private residence. 
          Get in touch today for a professional consultation.
        </p>
        <button className="btn-p">Consult with Engineer</button>
      </div>
    </div>
  );
}
