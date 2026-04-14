import React from "react";
import { Package, Settings, Search } from "lucide-react";

export function PartsPage({ parts = [] }) {
  const usd = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

  return (
    <div className="sec" style={{ paddingTop: "140px", background: "var(--bg)" }}>
      <div className="sec-chip" style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>
        Genuine Components
      </div>
      <h2 className="sec-h">Quality Spare <span style={{ color: "var(--accent)" }}>Parts</span></h2>
      <p className="sec-p" style={{ marginBottom: "60px", maxWidth: "700px" }}>
        We source and deliver genuine spare parts directly from top manufacturers. 
        Ensure your vehicle remains in peak condition with our reliable supply chain.
      </p>

      <div className="svc-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
        {parts.map((p, i) => (
          <div key={p.id} className="adm-card" style={{ 
            padding: "32px", 
            border: "1px solid var(--border)", 
            borderRadius: "16px",
            background: "var(--bg-card)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "24px" }}>
              <div style={{ 
                width: "52px", 
                height: "52px", 
                background: "var(--bg-alt)", 
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent)",
                border: "1px solid var(--border)"
              }}>
                <Settings size={24} />
              </div>
              <div style={{ fontSize: "28px" }}>{p.emoji || "⚙️"}</div>
            </div>
            
            <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
              {p.category}
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px", color: "var(--text)" }}>{p.name}</h3>
            
            <div style={{ background: "var(--bg-alt)", padding: "16px", borderRadius: "10px", marginBottom: "24px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "10px", fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>Compatibility</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{p.compatible}</div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "24px" }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Price</div>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text)" }}>{usd(p.price)}</div>
              </div>
              <button className="btn-sm-ghost" style={{ borderRadius: "8px", padding: "10px 18px", fontSize: "12px", border: "1px solid var(--border-bright)" }}>
                Inquire
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="adm-card" style={{ 
        marginTop: "80px", 
        padding: "40px", 
        display: "flex", 
        alignItems: "center", 
        gap: "32px", 
        flexWrap: "wrap",
        borderRadius: "20px",
        background: "var(--bg-alt)",
        border: "1px solid var(--border)"
      }}>
        <div style={{ 
          width: "64px", 
          height: "64px", 
          background: "var(--accent)", 
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF"
        }}>
          <Package size={32} />
        </div>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h3 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "8px", color: "var(--text)" }}>Looking for something specific?</h3>
          <p style={{ fontSize: "15px", color: "var(--text-dim)", lineHeight: 1.6 }}>
            Our sourcing team can find any part you need. From specialized engine components to 
            exterior body parts, we've got you covered.
          </p>
        </div>
        <button className="btn-p" style={{ height: "56px", padding: "0 40px", fontSize: "15px" }}>
          Contact Sourcing Team
        </button>
      </div>
    </div>
  );
}
