import React, { useState } from "react";
import { 
  Search, Check, Clock, Globe, 
  MapPin, Activity, FileText,
  AlertCircle, Hash
} from "lucide-react";

export function TrackingPage({ orders = [] }) {
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);

  const handleTrack = () => {
    setError(false);
    const found = orders.find(o => o.id.toLowerCase() === orderId.toLowerCase() || (o.customer && o.customer.toLowerCase().includes(orderId.toLowerCase()) && orderId.length > 3));
    if (found) {
      setResult(found);
    } else {
      setError(true);
      setResult(null);
    }
  };

  return (
    <div className="sec" style={{ paddingTop: "140px", minHeight: "90vh", background: "var(--bg)" }}>
      <div className="sec-chip" style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>
        Order Tracking
      </div>
      <h2 className="sec-h">Where is my <span style={{ color: "var(--accent)" }}>Car?</span></h2>
      <p className="sec-p" style={{ marginBottom: "60px", maxWidth: "600px" }}>
        Enter your Order ID (e.g. ACG-2024-1234) to see the live status of your shipment from China to Ghana.
      </p>

      <div className="adm-card" style={{ maxWidth: "600px", margin: "0 auto 48px", padding: "32px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", gap: "12px", flexDirection: window.innerWidth < 768 ? "column" : "row" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Hash size={18} style={{ position: "absolute", left: "16px", top: "18px", color: "var(--text-dim)" }} />
            <input 
              className="inp"
              style={{ paddingLeft: "48px", height: "56px", fontSize: "16px", background: "var(--bg-alt)" }}
              placeholder="Order ID"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleTrack()}
            />
          </div>
          <button className="btn-p" style={{ height: "56px", padding: "0 32px", fontSize: "15px" }} onClick={handleTrack}>
            Track Order
          </button>
        </div>
        {error && (
          <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px", color: "#E63946", fontSize: "14px", fontWeight: 600 }}>
            <AlertCircle size={16} /> Order ID not found. Please check and try again.
          </div>
        )}
      </div>

      {result && (
        <div className="rv on" style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div className="adm-card" style={{ padding: "40px", borderRadius: "24px", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <Globe size={16} color="var(--accent)" />
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "1px" }}>Active Shipment</span>
                </div>
                <h3 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text)" }}>{result.item}</h3>
                <div style={{ fontSize: "14px", color: "var(--text-dim)", marginTop: "4px" }}>Order Ref: {result.id}</div>
              </div>
              <div style={{ 
                background: "var(--accent-dim)", 
                padding: "8px 20px", 
                borderRadius: "50px",
                border: "1px solid var(--accent)",
                color: "var(--accent)",
                fontSize: "13px",
                fontWeight: 800,
                textTransform: "uppercase"
              }}>
                {result.status.replace(/_/g, " ")}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "40px" }}>
              {(result.tracking || []).map((step, i) => (
                <div key={i} style={{ 
                  background: step.done ? "var(--accent-dim)" : "var(--bg-alt)", 
                  padding: "24px",
                  borderRadius: "16px",
                  border: step.active ? "2px solid var(--accent)" : "1px solid var(--border)",
                  opacity: step.done || step.active ? 1 : 0.4
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)" }}>STEP {i + 1}</span>
                    {step.done ? <Check size={16} color="var(--accent)" /> : step.active ? <Activity size={16} className="pulse" color="var(--accent)" /> : null}
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--text)", marginBottom: "4px" }}>{step.step}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>{step.date || "Scheduled"}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "24px", padding: "24px", background: "var(--bg-alt)", borderRadius: "16px", border: "1px solid var(--border)", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "140px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>CUSTOMER</div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text)" }}>{result.customer}</div>
              </div>
              <div style={{ flex: 1, minWidth: "140px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "4px" }}>DESTINATION</div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text)" }}>Tema Port, Ghana</div>
              </div>
              <div style={{ flex: 1, minWidth: "140px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <button className="btn-sm-ghost" style={{ background: "#FFFFFF", padding: "10px 20px" }} onClick={() => window.print()}>
                  <FileText size={16} /> <span style={{ marginLeft: "8px" }}>Print Manifest</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pulse { animation: pulse 2s infinite; }
      `}</style>
    </div>
  );
}
