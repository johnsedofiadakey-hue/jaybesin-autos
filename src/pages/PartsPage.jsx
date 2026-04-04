import React from "react";
import { Wrench, Package, ShieldCheck, Mail } from "lucide-react";
import { fmtUSD } from "../utils/theme";

export function PartsPage({ parts = [] }) {
  return (
    <div className="sec" style={{ paddingTop: "120px" }}>
      <div className="sec-chip chip-2 rv on">Genuine Parts</div>
      <h2 className="sec-h rv on">Quality <span className="gt-orange">Spare Parts</span></h2>
      <p className="sec-p rv on" style={{ marginBottom: "40px" }}>
        We supply genuine OEM and high-quality aftermarket spare parts for all major Chinese automobile brands. 
        Reliable inventory, fast delivery, and expert support.
      </p>

      <div className="svc-grid">
        {parts.map((p, i) => (
          <div key={p.id} className="svc-card rv on" style={{ transitionDelay: `${i * 0.08}s` }}>
            <div className="svc-icon" style={{ background: "color-mix(in srgb,var(--orange) 12%,transparent)", border: "1px solid color-mix(in srgb,var(--orange) 22%,transparent)" }}>
              <Wrench size={22} style={{ color: "var(--orange)" }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="svc-name">{p.name}</div>
              <div style={{ fontSize: "20px" }}>{p.emoji || "⚙️"}</div>
            </div>
            <div style={{ fontSize: "12px", color: "var(--orange)", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>Category: {p.category}</div>
            <div className="svc-desc" style={{ marginBottom: "16px" }}>Compatibility: {p.compatible}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border2)", paddingTop: "12px" }}>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text)" }}>{fmtUSD(p.price)}</div>
              <div style={{ fontSize: "11px", color: "var(--text3)" }}>In Stock / Order</div>
            </div>
          </div>
        ))}
      </div>

      <div className="adm-card" style={{ marginTop: "48px", background: "var(--bg2)", border: "1px solid var(--border2)", textAlign: "center", padding: "40px" }}>
        <Package size={32} style={{ marginBottom: "15px", opacity: 0.1 }} />
        <h3 className="sec-h" style={{ fontSize: "20px" }}>Bulk Order or Specific Component?</h3>
        <p className="sec-p" style={{ margin: "0 auto 24px" }}>
          We source niche parts directly from manufacturers in China. If you can't find what you need in our standard catalog, 
          let us know and we'll track it down for you.
        </p>
        <button className="btn-p">Request Specific Part</button>
      </div>
    </div>
  );
}
