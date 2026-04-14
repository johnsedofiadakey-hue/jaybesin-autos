import React, { useState } from "react";
import { 
  MessageCircle, CheckCircle2, User, Mail, Phone, 
  Trash2, ArrowRight, Download, Filter, Search,
  Clock, Hash, Activity, Flame, Sparkles, Send,
  MoreVertical, CheckSquare, XCircle
} from "lucide-react";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminSidebar } from "../components/admin/AdminSidebar";

export function AdminInquiries({ 
  inquiries = [], 
  orders = [],
  onUpdateStatus, 
  onDeleteInquiry, 
  onConvertOrder, 
  onLogout, 
  settings = {} 
}) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const isHotLead = (inq) => {
    const text = (inq.subject + " " + inq.message).toLowerCase();
    const hotKeywords = ["reserve", "buy", "purchase", "asap", "price", "negotiate", "shipping"];
    return hotKeywords.some(k => text.includes(k)) || inq.type === "vehicle";
  };

  const hasConverted = (inq) => {
    const phoneNormal = inq.phone?.replace(/\D/g, "");
    return orders.some(o => o.phone?.replace(/\D/g, "") === phoneNormal);
  };

  const filtered = inquiries
    .filter(i => {
      if (filter === "new") return i.status === "new";
      if (filter === "processed") return i.status !== "new";
      if (filter === "hot") return isHotLead(i) && i.status === "new";
      return true;
    })
    .filter(i => {
      if (!search) return true;
      const q = search.toLowerCase();
      return i.name.toLowerCase().includes(q) || i.phone.includes(q) || (i.subject || "").toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (a.status === "new" && b.status !== "new") return -1;
      if (a.status !== "new" && b.status === "new") return 1;
      return new Date(b.date || 0) - new Date(a.date || 0);
    });

  const getStatusStyle = (status) => {
    if (status === "new") return { color: "var(--accent)", bg: "rgba(0,113,227,0.1)", label: "New Lead" };
    return { color: "var(--text-dim)", bg: "rgba(255,255,255,0.05)", label: "Processed" };
  };

  return (
    <div className="adm-wrap">
      <AdminSidebar onLogout={onLogout} settings={settings} />
      
      <main className="adm-main">
        <AdminHeader title="Client Lead Registry" icon={MessageCircle} />
        
        {/* Statistics Cluster */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: "High Priority", val: inquiries.filter(i => i.status === "new" && isHotLead(i)).length, color: '#F97316' },
            { label: "New Incoming", val: inquiries.filter(i => i.status === "new").length, color: 'var(--accent)' },
            { label: "Pending Response", val: inquiries.filter(i => i.status === "awaiting").length, color: '#8B5CF6' },
            { label: "Total Volume", val: inquiries.length, color: 'var(--text-dim)' }
          ].map(s => (
            <div key={s.label} className="adm-card" style={{ padding: '16px 20px' }}>
              <div className="lbl" style={{ fontSize: '10px', marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Search & Filter Toolbar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
            <input 
              className="inp" 
              placeholder="Search leads by name, phone, or subject..." 
              style={{ paddingLeft: '40px' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="inp" style={{ width: '160px' }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All Channels</option>
            <option value="new">Unprocessed</option>
            <option value="hot">High Priority</option>
            <option value="processed">Dossier Archived</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="adm-card" style={{ textAlign: "center", padding: "80px 40px" }}>
            <div style={{ opacity: 0.1, marginBottom: "20px" }}><MessageCircle size={64} /></div>
            <div style={{ fontSize: "16px", color: "var(--text-dim)", fontWeight: 600 }}>Zero Incoming Logged</div>
            <p style={{ marginTop: '8px', opacity: 0.5 }}>Search results or registry empty.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {filtered.map(inq => {
              const hot = isHotLead(inq);
              const converted = hasConverted(inq);
              const s = getStatusStyle(inq.status);

              return (
                <div key={inq.id} className="adm-card" style={{ 
                  padding: '0', 
                  overflow: 'hidden',
                  position: 'relative',
                  borderLeft: hot && inq.status === 'new' ? '4px solid #F97316' : inq.status === 'new' ? '4px solid var(--accent)' : '4px solid var(--border)'
                }}>
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={24} style={{ opacity: 0.6 }} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '18px', fontWeight: 800 }}>{inq.name}</span>
                            {converted && (
                              <span style={{ fontSize: '10px', background: 'rgba(0, 229, 100, 0.1)', color: '#10B981', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>CONVERTED</span>
                            )}
                            {hot && inq.status === 'new' && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#F97316', fontWeight: 800 }}>
                                <Flame size={12} fill="#F97316" /> PRIORITY
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: 'var(--text-dim)', fontWeight: 600 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {inq.email || "No Email"}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', cursor: 'pointer' }} onClick={() => window.open(`tel:${inq.phone}`)}><Phone size={14} /> {inq.phone}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {inq.date}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ textAlign: 'right', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: s.color, background: s.bg, padding: '4px 10px', borderRadius: '6px' }}>
                          {s.label}
                        </div>
                        <button onClick={() => onDeleteInquiry(inq.id)} style={{ padding: '8px', color: '#FF4A5A', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4 }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '20px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Hash size={14} /> {inq.subject || "General Inquiry"}
                      </div>
                      <div style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-dim)', whiteSpace: 'pre-wrap' }}>
                        {inq.message}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          className="btn-p" 
                          style={{ height: '36px', fontSize: '11px', padding: '0 16px' }}
                          onClick={() => onUpdateStatus(inq.id, inq.status === 'new' ? 'processed' : 'new')}
                        >
                          {inq.status === 'new' ? <CheckCircle2 size={14} style={{ marginRight: 6 }} /> : <Clock size={14} style={{ marginRight: 6 }} />}
                          {inq.status === 'new' ? "Mark Processed" : "Restore to New"}
                        </button>
                        <button 
                          className="btn-sm-neon" 
                          style={{ height: '36px', fontSize: '11px', padding: '0 16px' }}
                          onClick={() => onConvertOrder(inq)}
                          disabled={converted}
                        >
                          <Sparkles size={14} style={{ marginRight: 6 }} />
                          {converted ? "Already Converted" : "Initialize Order"}
                        </button>
                      </div>
                      <button 
                        className="btn-sm-ghost" 
                        style={{ height: '36px', fontSize: '11px' }}
                        onClick={() => window.open(`https://wa.me/${inq.phone.replace(/\D/g, "")}`, '_blank')}
                      >
                        <Send size={14} style={{ marginRight: 6 }} />
                        WhatsApp Lead
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

