import React, { useState } from "react";
import { 
  Search, Ship, Package, Check, Clock, Globe, 
  ArrowRight, Hash, MapPin, Activity, FileText,
  AlertCircle
} from "lucide-react";
import { fmtUSD } from "../utils/theme";

export function TrackingPage({ orders = [] }) {
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);

  const handleTrack = () => {
    setError(false);
    const found = orders.find(o => o.id.toLowerCase() === orderId.toLowerCase());
    if (found) {
      setResult(found);
    } else {
      setError(true);
      setResult(null);
    }
  };

  return (
    <div className="sec" style={{ paddingTop: "140px", minHeight: '90vh' }}>
      <div className="sec-chip chip-4 rv on" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text)' }}>Logistics Intelligence</div>
      <h2 className="sec-h rv on">Global Cargo <span style={{ opacity: 0.4 }}>Tracking Console</span></h2>
      <p className="sec-p rv on" style={{ marginBottom: "60px", maxWidth: '600px' }}>
        Enter your unique identity token to access the real-time logistics manifest for your vehicle or component shipment.
      </p>

      <div className="adm-card" style={{ maxWidth: '600px', margin: '0 auto 48px', padding: '32px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Hash size={18} style={{ position: 'absolute', left: '16px', top: '18px', opacity: 0.3 }} />
            <input 
              className="inp"
              style={{ paddingLeft: '48px', height: '56px', fontSize: '16px', fontWeight: 700 }}
              placeholder="IDENTITY TOKEN (e.g. ACG-2024-1234)"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleTrack()}
            />
          </div>
          <button className="btn-p" style={{ height: '56px', padding: '0 32px' }} onClick={handleTrack}>
            Search Registry
          </button>
        </div>
        {error && (
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#FF4A5A', fontSize: '13px', fontWeight: 600 }}>
            <AlertCircle size={14} /> Token not recognized in the logistics manifest.
          </div>
        )}
      </div>

      {result && (
        <div className="rv on" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="adm-card" style={{ padding: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '40px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px' }}>Shipment Dossier</span>
                  <Activity size={12} color="var(--accent)" />
                </div>
                <h3 style={{ fontSize: '32px', fontWeight: 800 }}>{result.item}</h3>
                <div style={{ fontSize: '14px', color: 'var(--text-dim)', marginTop: '4px', fontWeight: 600 }}>Tracking Token: {result.id}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, opacity: 0.5, marginBottom: '4px' }}>CURRENT STATUS</div>
                <div style={{ 
                  fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', 
                  background: 'rgba(255,255,255,0.05)', padding: '6px 16px', borderRadius: '4px',
                  border: '1px solid var(--border)'
                }}>
                  {result.status.replace(/_/g, " ")}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
              {(result.tracking || []).map((step, i) => (
                <div key={i} style={{ 
                  background: step.done ? 'var(--bg)' : 'rgba(255,255,255,0.02)', 
                  padding: '24px',
                  opacity: step.done || step.active ? 1 : 0.3
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800 }}>STEP {i + 1}</span>
                    {step.done ? <Check size={14} color="var(--accent)" /> : step.active ? <Clock size={14} color="var(--accent)" /> : null}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{step.step}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{step.date || "Scheduled"}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '40px', display: 'flex', gap: '24px', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '10px', fontWeight: 800, opacity: 0.5, marginBottom: '4px' }}>CONSIGNEE</div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>{result.customer}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '10px', fontWeight: 800, opacity: 0.5, marginBottom: '4px' }}>LOGISTICS PORT</div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>Tema Port, Ghana</div>
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <button className="btn-sm-ghost" style={{ padding: '8px 16px' }}>
                  <FileText size={14} /> View Manifest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
