import React from "react";
import { 
  MessageCircle, CheckCircle2, User, Mail, Phone, 
  Trash2, ArrowRight, Download, Filter, Search,
  Clock, Hash
} from "lucide-react";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminSidebar } from "../components/admin/AdminSidebar";

export function AdminInquiries({ 
  inquiries = [], 
  onUpdateStatus, 
  onDeleteInquiry, 
  onConvertOrder, 
  onLogout, 
  settings = {} 
}) {
  const newInquiries = inquiries.filter(i => i.status === "new");
  const processedInquiries = inquiries.filter(i => i.status !== "new");

  return (
    <div className="adm-wrap">
      <AdminSidebar onLogout={onLogout} settings={settings} />
      
      <main className="adm-main">
        <AdminHeader title="Client Lead Registry" icon={MessageCircle} />
        
        {/* Statistics Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <div className="adm-card" style={{ padding: '16px 24px' }}>
            <div className="lbl">High Priority (New)</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)' }}>{newInquiries.length}</div>
          </div>
          <div className="adm-card" style={{ padding: '16px 24px' }}>
            <div className="lbl">Processed Dossiers</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dim)' }}>{processedInquiries.length}</div>
          </div>
          <div className="adm-card" style={{ padding: '16px 24px' }}>
            <div className="lbl">Total Throughput</div>
            <div style={{ fontSize: '24px', fontWeight: 800 }}>{inquiries.length}</div>
          </div>
        </div>

        {inquiries.length === 0 ? (
          <div className="adm-card" style={{ textAlign: "center", padding: "80px 40px" }}>
            <div style={{ opacity: 0.1, marginBottom: "20px" }}><MessageCircle size={64} /></div>
            <div style={{ fontSize: "16px", color: "var(--text-dim)", fontWeight: 600 }}>Zero Incoming Logged</div>
            <p style={{ marginTop: '8px', opacity: 0.5 }}>New inquiries from the platform will appear here in real-time.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {[...newInquiries, ...processedInquiries].map(inq => (
              <div key={inq.id} className="adm-card" style={{ 
                borderLeft: inq.status === 'new' ? '4px solid var(--accent)' : '4px solid var(--border)',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="dc-icon" style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
                      <User size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 800 }}>{inq.name}</div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {inq.email}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {inq.phone}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {inq.date}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ 
                      fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px',
                      padding: '4px 8px', borderRadius: '4px', 
                      background: inq.status === 'new' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                      color: inq.status === 'new' ? 'var(--accent)' : 'var(--text-dim)',
                      border: `1px solid ${inq.status === 'new' ? 'var(--accent)' : 'var(--border)'}`
                    }}>
                      {inq.status}
                    </span>
                    <button onClick={() => onDeleteInquiry(inq.id)} style={{ padding: '6px', background: 'none', border: 'none', color: '#FF4A5A', cursor: 'pointer', opacity: 0.5 }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    <Hash size={12} /> {inq.subject || "No Subject Specified"}
                  </div>
                  <div style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-dim)' }}>
                    {inq.message}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    className="btn-p" 
                    style={{ padding: '8px 16px', fontSize: '12px' }}
                    onClick={() => onUpdateStatus(inq.id, inq.status === "new" ? "processed" : "new")}
                  >
                    {inq.status === "new" ? "Mark Processed" : "Revert to New"}
                  </button>
                  <button 
                    className="btn-sm-ghost" 
                    style={{ padding: '8px 16px', fontSize: '12px' }}
                    onClick={() => onConvertOrder(inq)}
                  >
                    Generate Order
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
