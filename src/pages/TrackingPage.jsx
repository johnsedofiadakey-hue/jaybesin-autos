import React, { useState } from "react";
import { Ship, Search, Clock, CheckCircle2, ChevronRight, Package, MapPin } from "lucide-react";
import { fmtUSD } from "../utils/theme";

export function TrackingPage({ orders = [] }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(null);

  const handleSearch = () => {
    const found = orders.find(o => o.id.toLowerCase() === q.toLowerCase().trim() || o.phone === q.trim());
    setActive(found || "none");
  };

  return (
    <div className="sec" style={{ paddingTop: "120px", minHeight: "80vh" }}>
      <div className="sec-chip chip-1 rv on">Global Logistics</div>
      <h2 className="sec-h rv on">Track Your <span className="gt-neon">Shipment</span></h2>
      <p className="sec-p rv on" style={{ marginBottom: "40px" }}>
        Enter your order ID or phone number to track your vehicle's journey from China to your doorstep in Ghana.
      </p>

      {/* Search Box */}
      <div className="adm-card" style={{ maxWidth: "600px", margin: "0 auto 48px", padding: "10px", display: "flex", gap: "10px" }}>
        <input 
          className="inp" 
          placeholder="Enter Order ID (e.g. ACG-2024-1234)" 
          style={{ border: 'none', background: 'none' }}
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
        />
        <button className="btn-p" onClick={handleSearch}>Track Status</button>
      </div>

      {active === "none" && (
        <div style={{ textAlign: "center", color: "var(--orange)", fontWeight: 700 }}>
          Order not found. Please check your ID and try again.
        </div>
      )}

      {active && active !== "none" && (
        <div className="rv on" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="adm-card" style={{ border: '1.5px solid var(--neon)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "24px", borderBottom: '1px solid var(--border2)', paddingBottom: '16px' }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--neon)", fontWeight: 700 }}>ORDER #{active.id}</div>
                <div style={{ fontSize: "20px", fontWeight: 800, fontFamily: "Syne, sans-serif" }}>{active.item}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: "11px", color: "var(--text3)" }}>EXPECTED DELIVERY</div>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>{active.expectedDate || "TBA"}</div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="track-line" style={{ margin: "32px 0" }}>
              {(active.tracking || []).map((step, i) => (
                <div key={i} className={`track-step${step.done ? " done" : step.active ? " active" : ""}`}>
                  <div className={`track-dot${step.done ? " done" : step.active ? " active" : ""}`}>
                    {step.done ? "✓" : step.active ? "●" : ""}
                  </div>
                  <div style={{ fontSize: "14px", color: step.done ? "var(--text)" : "var(--text2)", fontWeight: 700 }}>{step.step}</div>
                  <div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "4px" }}>{step.date || (step.done ? "Completed" : "Pending")}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '16px', background: 'var(--bg3)', padding: '16px', borderRadius: '10px', fontSize: '13px' }}>
              <Package size={20} style={{ color: 'var(--neon)', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, marginBottom: '2px' }}>Current Insight</div>
                <div style={{ color: 'var(--text2)', lineHeight: 1.5 }}>
                  {active.status.replace(/_/g, ' ').toUpperCase()}: Your shipment is currently being processed at the current stage. 
                  Reach out to your account manager if you need a detailed update.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Band */}
      {!active && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", marginTop: "48px" }}>
          {[
            { icon: Ship, title: "Ocean Freight", desc: "Average transit time from China to Tema is 35-45 days." },
            { icon: MapPin, title: "Tracking", desc: "Real-time updates as your vehicle clears checkpoints." },
            { icon: Clock, title: "Support", desc: "Our logistics team is available 24/7 for order inquiries." }
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: "20px" }}>
              <div style={{ marginBottom: "12px", color: "var(--neon)" }}><item.icon size={28} style={{ margin: "0 auto" }} /></div>
              <div style={{ fontWeight: 800, fontSize: "14px", marginBottom: "6px" }}>{item.title}</div>
              <div style={{ fontSize: "12px", color: "var(--text3)", lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
