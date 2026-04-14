import React, { useState } from "react";
import { 
  Ship, Package, Check, Clock, User, Phone, Mail, 
  DollarSign, ExternalLink, Hash, ArrowRight,
  ChevronRight, FileText, Send, Plus, X, Activity,
  Camera, FileCheck, CheckCircle2, MessageCircle
} from "lucide-react";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { fmtUSD } from "../utils/theme";
import { uploadImage } from "../firestore";

export function AdminOrders({ 
  orders = [], 
  onUpdateStatus, 
  onGenerateInvoice, 
  onSendUpdate, 
  onLogout, 
  settings = {} 
}) {
  const [uploadingId, setUploadingId] = useState("");

  const handleUploadDoc = async (orderId, fileList) => {
    setUploadingId(orderId);
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const files = Array.from(fileList || []);
      const uploadedUrls = await Promise.all(files.map(async (file, i) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              const url = await uploadImage(reader.result, `orders/${orderId}/${Date.now()}_${i}`);
              resolve({ name: file.name, url, date: new Date().toISOString() });
            } catch (e) { reject(e); }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }));

      const updatedDocs = [...(order.documents || []), ...uploadedUrls];
      onUpdateStatus(orderId, order.status, updatedDocs);
    } catch (e) {
      console.error("Upload error:", e);
      alert("Failed to upload documents.");
    } finally {
      setUploadingId("");
    }
  };

  const removeDoc = (orderId, docIdx) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const nextDocs = (order.documents || []).filter((_, i) => i !== docIdx);
    onUpdateStatus(orderId, order.status, nextDocs);
  };

  const getStatusColor = (s) => {
    if (s === 'delivered') return '#10B981';
    if (s === 'cancelled') return '#EF4444';
    if (s === 'ready') return '#F97316';
    return 'var(--accent, #0071e3)';
  };

  return (
    <div className="adm-wrap">
      <AdminSidebar onLogout={onLogout} settings={settings} />
      
      <main className="adm-main">
        <AdminHeader title="Logistics & Fulfillment" icon={Ship} />
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: "Active Pipelines", val: orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length, color: 'var(--accent)' },
            { label: "Pending Payment", val: orders.filter(o => o.status === 'confirmed').length, color: '#F97316' },
            { label: "In Transit", val: orders.filter(o => o.status === 'ocean_freight').length, color: '#8B5CF6' },
            { label: "Completed", val: orders.filter(o => o.status === 'delivered').length, color: '#10B981' }
          ].map(s => (
            <div key={s.label} className="adm-card" style={{ padding: '16px 20px' }}>
              <div className="lbl" style={{ marginBottom: '4px', fontSize: '10px' }}>{s.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>

        {orders.length === 0 ? (
          <div className="adm-card" style={{ textAlign: "center", padding: "80px 40px" }}>
            <div style={{ opacity: 0.1, marginBottom: "20px" }}><Ship size={64} /></div>
            <div style={{ fontSize: "16px", color: "var(--text-dim)", fontWeight: 600 }}>Registry Empty</div>
            <p style={{ marginTop: '8px', opacity: 0.5 }}>Confirmed orders will appear here for logistics management.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '24px' }}>
            {orders.map(o => (
              <div key={o.id} className="adm-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: getStatusColor(o.status) }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={28} style={{ color: getStatusColor(o.status) }} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '22px', fontWeight: 800 }}>{o.item}</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.6, background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>{o.id}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-dim)', fontWeight: 600 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> {o.customer}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--accent)' }} onClick={() => window.open(`tel:${o.phone}`)}><Phone size={14} /> {o.phone}</span>
                        <span style={{ fontSize: '11px', opacity: 0.5 }}>Ordered: {o.date || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)', marginBottom: '8px' }}>{fmtUSD(o.amount)}</div>
                    <select 
                      className="inp" 
                      style={{ width: '180px', height: '40px', fontSize: '11px', fontWeight: 700, textAlign: 'center', border: `1px solid ${getStatusColor(o.status)}22` }} 
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

                <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)' }}>
                      <Activity size={14} /> Pipeline Progress
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)' }}>
                      {Math.round(((o.tracking || []).filter(t => t.done).length / (Math.max(1, (o.tracking || []).length))) * 100)}% Complete
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
                    {(o.tracking || []).map((step, i) => (
                      <div key={i} style={{ 
                        minWidth: '130px',
                        padding: '12px', 
                        borderRadius: '10px', 
                        background: step.done ? 'rgba(0, 229, 100, 0.05)' : step.active ? 'rgba(0, 113, 227, 0.1)' : 'transparent',
                        border: step.done ? '1px solid rgba(0, 229, 100, 0.2)' : step.active ? '1px solid rgba(0, 113, 227, 0.3)' : '1px solid rgba(255,255,255,0.05)',
                        opacity: step.done || step.active ? 1 : 0.4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '9px', fontWeight: 800, opacity: 0.5 }}>STEP {i+1}</span>
                          {step.done ? <CheckCircle2 size={12} color="#10B981" /> : step.active ? <Clock size={12} color="var(--accent)" /> : null}
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 700, lineHeight: 1.2 }}>{step.step}</div>
                        <div style={{ fontSize: '9px', color: 'var(--text-dim)' }}>{step.date || "TBD"}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dossier & Evidence</div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: 'var(--accent)', cursor: 'pointer' }}>
                        <input type="file" multiple style={{ display: 'none' }} onChange={e => handleUploadDoc(o.id, e.target.files)} />
                        {uploadingId === o.id ? <div style={{ width: '12px', height: '12px', border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .5s linear infinite' }} /> : <Plus size={14} />}
                        Add Files
                      </label>
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(o.documents || []).length > 0 ? (o.documents.map((doc, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                          <a href={doc.url} target="_blank" rel="noreferrer" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {doc.url.includes("image") ? <img src={doc.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FileCheck size={32} style={{ opacity: 0.3 }} />}
                          </a>
                          <button 
                            onClick={() => removeDoc(o.id, idx)}
                            style={{ position: 'absolute', top: 2, right: 2, width: '16px', height: '16px', background: 'rgba(255,0,0,0.8)', color: '#fff', border: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px' }}
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))) : (
                        <div style={{ fontSize: '11px', color: 'var(--text-dim)', opacity: 0.5, padding: '10px 0' }}>No files attached yet.</div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button className="btn-p" style={{ justifyContent: 'center', height: '44px', fontSize: '12px' }} onClick={() => onGenerateInvoice(o.id)}>
                      <FileText size={16} /> Generate Invoice Protocol
                    </button>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button className="btn-sm-ghost" style={{ justifyContent: 'center', padding: '10px' }} onClick={() => onSendUpdate(o)}>
                        <Send size={16} /> Update Client
                      </button>
                      <button className="btn-sm-ghost" style={{ justifyContent: 'center', padding: '10px' }} onClick={() => window.open(`https://wa.me/${o.phone.replace(/\D/g, '')}`, '_blank')}>
                        <MessageCircle size={16} /> WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

