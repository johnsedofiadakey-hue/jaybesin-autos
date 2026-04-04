import React from "react";
import { Ship, Package, Check, Clock, User, Phone, Mail, DollarSign, ExternalLink } from "lucide-react";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { fmtUSD } from "../utils/theme";

export function AdminOrders({ 
  orders = [], 
  onUpdateStatus, 
  onGenerateInvoice, 
  onSendUpdate, 
  onLogout, 
  settings = {} 
}) {
  const getStatusColor = (status) => {
    const s = status.toLowerCase();
    if (s.includes("confirmed")) return "var(--neon)";
    if (s.includes("payment")) return "var(--neon2)";
    if (s.includes("delivered")) return "var(--tag-g)";
    if (s.includes("cancel")) return "var(--orange)";
    return "var(--text3)";
  };

  return (
    <div className="adm-wrap">
      <AdminSidebar onLogout={onLogout} settings={settings} />
      
      <main className="adm-main">
        <AdminHeader title="Customer Orders" icon={Ship} />
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ color: "var(--neon)", fontSize: "14px", fontWeight: 700 }}>
            {orders.length} Total Orders
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="adm-card" style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ opacity: 0.2, marginBottom: "15px" }}><Ship size={48} /></div>
            <div style={{ fontSize: "14px", color: "var(--text2)" }}>No orders found.</div>
          </div>
        ) : (
          orders.map(o => (
            <div key={o.id} className="adm-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "18px", color: "var(--text)" }}>{o.item}</div>
                  <div style={{ fontSize: "12px", color: "var(--text2)", marginTop: "4px" }}>
                    <span style={{ color: "var(--neon)", fontWeight: 700 }}>{o.id}</span> · {o.customer} · {o.email} · {o.phone}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "22px", color: "var(--neon)" }}>{fmtUSD(o.amount)}</div>
                  <select 
                    className="inp" 
                    style={{ width: "auto", fontSize: "11px", height: "36px", padding: "0 12px" }} 
                    value={o.status} 
                    onChange={e => onUpdateStatus(o.id, e.target.value)}
                  >
                    {[
                      "confirmed", "payment_received", "sourcing", "port_china", 
                      "ocean_freight", "tema_port", "customs", "ready", "delivered"
                    ].map(s => <option key={s} value={s}>{s.replace(/_/g, " ").toUpperCase()}</option>)}
                  </select>
                </div>
              </div>

              {/* Order Tracking Timeline */}
              <div style={{ background: "var(--bg3)", padding: "20px", borderRadius: "10px", marginBottom: "20px", border: "1px solid var(--border2)" }}>
                <div className="track-line">
                  {(o.tracking || []).map((step, i) => (
                    <div key={i} className="track-step">
                      <div className={`track-dot${step.done ? " done" : step.active ? " active" : ""}`}>
                        {step.done ? "✓" : step.active ? "●" : ""}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: "13px", color: step.done ? "var(--text)" : "var(--text2)", fontWeight: 600 }}>{step.step}</div>
                        <div style={{ fontSize: "10px", color: "var(--text3)" }}>{step.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button className="btn-sm btn-sm-neon" onClick={() => onGenerateInvoice(o.id)}>Generate Invoice</button>
                <button className="btn-sm btn-sm-ghost" onClick={() => onSendUpdate(o)}>Send WhatsApp Update</button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
