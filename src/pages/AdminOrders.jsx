import React from "react";
import { 
  Ship, Package, Check, Clock, User, Phone, Mail, 
  DollarSign, ExternalLink, Hash, ArrowRight,
  ChevronRight, FileText, Send
} from "lucide-react";
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
  return (
    <div className="adm-wrap">
      <AdminSidebar onLogout={onLogout} settings={settings} />
      
      <main className="adm-main">
        <AdminHeader title="Order Fulfillment Registry" icon={Ship} />
        
        {/* Statistics Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <div className="adm-card" style={{ padding: '16px 24px' }}>
            <div className="lbl">Active Logistics</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)' }}>
              {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length}
            </div>
          </div>
          <div className="adm-card" style={{ padding: '16px 24px' }}>
            <div className="lbl">Total Fulfilled</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dim)' }}>
              {orders.filter(o => o.status === 'delivered').length}
            </div>
          </div>
          <div className="adm-card" style={{ padding: '16px 24px' }}>
            <div className="lbl">Transactional Volume</div>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>{orders.length}</div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="adm-card" style={{ textAlign: "center", padding: "80px 40px" }}>
            <div style={{ opacity: 0.1, marginBottom: "20px" }}><Ship size={64} /></div>
            <div style={{ fontSize: "16px", color: "var(--text-dim)", fontWeight: 600 }}>Registry Empty</div>
            <p style={{ marginTop: '8px', opacity: 0.5 }}>Confirmed orders will appear here for logistics management.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {orders.map(o => (
              <div key={o.id} className="adm-card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <div className="dc-icon" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                      <Package size={24} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '20px', fontWeight: 800 }}>{o.item}</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>{o.id}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-dim)', fontWeight: 600 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> {o.customer}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {o.phone}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {o.email}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)', marginBottom: '8px' }}>{fmtUSD(o.amount)}</div>
                    <select 
                      className="inp" 
                      style={{ width: '180px', height: '40px', fontSize: '12px', textAlign: 'center' }} 
                      value={o.status} 
                      onChange={e => onUpdateStatus(o.id, e.target.value)}
                    >
                      {[
                        "confirmed", "payment_received", "sourcing", "port_china", 
                        "ocean_freight", "tema_port", "customs", "ready", "delivered", "cancelled"
                      ].map(s => <option key={s} value={s}>{s.replace(/_/g, " ").toUpperCase()}</option>)}
                    </select>
                  </div>
                </div>

                {/* Logistics Timeline */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <Activity size={14} /> Logistics Pipeline Status
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                    {(o.tracking || []).map((step, i) => (
                      <div key={i} style={{ 
                        padding: '16px', 
                        borderRadius: '12px', 
                        border: '1px solid var(--border)',
                        background: step.done ? 'rgba(255,255,255,0.03)' : step.active ? 'var(--bg)' : 'transparent',
                        opacity: step.done || step.active ? 1 : 0.4,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>Step {i + 1}</span>
                          {step.done ? <Check size={14} color="var(--accent)" /> : step.active ? <Clock size={14} color="var(--accent)" /> : null}
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 700 }}>{step.step}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>{step.date || "Pending"}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn-p" style={{ padding: '10px 20px', fontSize: '12px' }} onClick={() => onGenerateInvoice(o.id)}>
                    <FileText size={16} /> Generate Invoice Protocol
                  </button>
                  <button className="btn-sm-ghost" style={{ padding: '10px 20px', fontSize: '12px' }} onClick={() => onSendUpdate(o)}>
                    <Send size={16} /> WhatsApp Transmission
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
