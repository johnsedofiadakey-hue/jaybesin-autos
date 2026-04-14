import React from "react";
import { Zap, HelpCircle, Cpu } from "lucide-react";
import { fmtUSD } from "../utils/theme";

export function ChargingPage({ charging = [] }) {
  return (
    <div className="sec" style={{ paddingTop: "140px" }}>
      <div className="sec-chip chip-4 rv on" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text)' }}>Sustainable Infrastructure</div>
      <h2 className="sec-h rv on">EV Sourcing & <span style={{ opacity: 0.4 }}>Grid Protocols</span></h2>
      <p className="sec-p rv on" style={{ marginBottom: "60px", maxWidth: '700px' }}>
        Jaybesin Autos facilitates the transition to sustainable mobility by providing mission-critical 
        charging architecture and expert installation protocols for the Ghanaian market.
      </p>

      <div className="svc-grid">
        {charging.map((c, i) => (
          <div key={c.id} className="adm-card rv on" style={{ transitionDelay: `${i * 0.1}s`, padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
              <div className="dc-icon" style={{ width: '48px', height: '48px', borderRadius: '12px' }}>
                <Zap size={24} />
              </div>
              <div style={{ fontSize: "24px", opacity: 0.5 }}>{c.emoji || "🔌"}</div>
            </div>
            
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
              {c.brand} · {c.type}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px' }}>{c.name}</div>
            <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: '24px' }}>
              High-performance {c.power} output. Engineered for durability and optimized power delivery in residential and commercial settings.
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "24px" }}>
              <div>
                <div style={{ fontSize: "24px", fontWeight: 800 }}>{fmtUSD(c.price)}</div>
                <div style={{ fontSize: "10px", fontWeight: 700, opacity: 0.5, marginTop: '4px' }}>UNIT VALUATION</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>{fmtUSD(c.installation)}</div>
                <div style={{ fontSize: "10px", fontWeight: 700, opacity: 0.5, marginTop: '4px' }}>INSTALLATION</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="adm-card" style={{ marginTop: "80px", textAlign: "center", padding: "64px 40px", background: 'rgba(255,255,255,0.02)' }}>
        <Cpu size={48} style={{ marginBottom: "24px", opacity: 0.1 }} />
        <h3 style={{ fontSize: "28px", fontWeight: 800, marginBottom: '16px' }}>Custom Infrastructure Design</h3>
        <p className="sec-p" style={{ margin: "0 auto 32px", maxWidth: '600px' }}>
          Our engineering team develops bespoke charging ecosystems for fleet operators and private estates. 
          Request a specialized technical assessment today.
        </p>
        <button className="btn-p" style={{ padding: '0 40px', height: '56px' }}>
          Initiate Engineering Consultation
        </button>
      </div>
    </div>
  );
}
