import React from "react";
import { Package, Settings, Cpu } from "lucide-react";
import { fmtUSD } from "../utils/theme";

export function PartsPage({ parts = [] }) {
  return (
    <div className="sec" style={{ paddingTop: "140px" }}>
      <div className="sec-chip chip-4 rv on" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text)' }}>Component Logistics</div>
      <h2 className="sec-h rv on">Spare Parts & <span style={{ opacity: 0.4 }}>Technical Arsenal</span></h2>
      <p className="sec-p rv on" style={{ marginBottom: "60px", maxWidth: '700px' }}>
        We source and deliver genuine spare parts directly from manufacturers in China. 
        Maintain the operational integrity of your vehicle with Jaybesin's logistics chain.
      </p>

      <div className="svc-grid">
        {parts.map((p, i) => (
          <div key={p.id} className="adm-card rv on" style={{ transitionDelay: `${i * 0.1}s`, padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
              <div className="dc-icon" style={{ width: '48px', height: '48px', borderRadius: '12px' }}>
                <Settings size={22} />
              </div>
              <div style={{ fontSize: "24px", opacity: 0.5 }}>{p.emoji || "⚙️"}</div>
            </div>
            
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
              {p.category} Specialist
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>{p.name}</div>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, opacity: 0.5, marginBottom: '4px' }}>COMPATIBILITY MATRIX</div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>{p.compatible}</div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "24px" }}>
              <div>
                <div style={{ fontSize: "24px", fontWeight: 800 }}>{fmtUSD(p.price)}</div>
                <div style={{ fontSize: "10px", fontWeight: 700, opacity: 0.5, marginTop: '4px' }}>DIRECT IMPORT COST</div>
              </div>
              <button className="btn-sm-ghost" style={{ padding: '8px 16px', fontSize: '11px' }}>
                Inquire Specs
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="adm-card" style={{ marginTop: "80px", padding: '48px', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
        <div className="dc-icon" style={{ width: '64px', height: '64px', borderRadius: '16px' }}>
          <Package size={32} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>Large Scale Consignment?</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-dim)' }}>
            Bulk orders for fleet maintenance and commercial workshops are handled with priority logistics.
          </p>
        </div>
        <button className="btn-p" style={{ height: '52px', padding: '0 32px' }}>
          Open Consignment Order
        </button>
      </div>
    </div>
  );
}
