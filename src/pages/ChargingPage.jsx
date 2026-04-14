import React from "react";
import { Zap, Cpu, CheckCircle } from "lucide-react";

export function ChargingPage({ charging = [] }) {
  const usd = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

  return (
    <div className="sec" style={{ paddingTop: "140px", background: "var(--bg)" }}>
      <div className="sec-chip" style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>
        EV Infrastructure
      </div>
      <h2 className="sec-h">Power Your <span style={{ color: "var(--accent)" }}>Journey</span></h2>
      <p className="sec-p" style={{ marginBottom: "60px", maxWidth: "700px" }}>
        We provide professional EV charging solutions for your home and business. 
        Engineered for performance and durability in the Ghanaian environment.
      </p>

      <div className="svc-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        {charging.map((c, i) => (
          <div key={c.id} className="adm-card" style={{ 
            padding: "32px", 
            border: "1px solid var(--border)", 
            borderRadius: "16px",
            background: "var(--bg-card)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "24px" }}>
              <div style={{ 
                width: "56px", 
                height: "56px", 
                background: "var(--accent)", 
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF"
              }}>
                <Zap size={28} />
              </div>
              <div style={{ fontSize: "28px" }}>{c.emoji || "🔌"}</div>
            </div>
            
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
              {c.brand} · {c.type}
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "12px", color: "var(--text)" }}>{c.name}</h3>
            <p style={{ fontSize: "14px", color: "var(--text-dim)", lineHeight: 1.6, marginBottom: "24px" }}>
              High-performance {c.power} output. Ideal for rapid daily charging and long-term battery health.
            </p>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Unit Price</div>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text)" }}>{usd(c.price)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Installation</div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--accent)" }}>+ {usd(c.installation)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: "80px", 
        textAlign: "center", 
        padding: "64px 40px", 
        background: "var(--bg-alt)", 
        borderRadius: "24px",
        border: "1px solid var(--border)"
      }}>
        <Cpu size={48} style={{ marginBottom: "24px", color: "var(--accent)", opacity: 0.8 }} />
        <h3 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "16px", color: "var(--text)" }}>Professional Consultation</h3>
        <p className="sec-p" style={{ margin: "0 auto 32px", maxWidth: "600px" }}>
          Need a custom charging setup for your office or fleet? Our engineers are ready to design 
          the perfect power ecosystem for your needs.
        </p>
        <button className="btn-p" style={{ padding: "0 40px", height: "56px", fontSize: "15px" }}>
          Get a Custom Quote
        </button>
      </div>
    </div>
  );
}
