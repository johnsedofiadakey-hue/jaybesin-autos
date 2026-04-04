import React from "react";
import { MessageCircle, CheckCircle2, User, Mail, Phone, Trash2 } from "lucide-react";
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
  const newInquiriesCount = inquiries.filter(i => i.status === "new").length;

  return (
    <div className="adm-wrap">
      <AdminSidebar onLogout={onLogout} settings={settings} />
      
      <main className="adm-main">
        <AdminHeader title="Inquiries" icon={MessageCircle} />
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ color: "var(--neon)", fontSize: "14px", fontWeight: 700 }}>
            {newInquiriesCount} New Inquiries
          </div>
        </div>

        {inquiries.length === 0 ? (
          <div className="adm-card" style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ opacity: 0.2, marginBottom: "15px" }}><MessageCircle size={48} /></div>
            <div style={{ fontSize: "14px", color: "var(--text2)" }}>No inquiries found.</div>
          </div>
        ) : (
          inquiries.map(inq => (
            <div key={inq.id} className="adm-card" style={{ 
              borderLeft: `4px solid ${inq.status === "new" ? "var(--neon)" : "var(--border2)"}`,
              position: "relative"
            }}>
              <button 
                onClick={() => onDeleteInquiry(inq.id)}
                style={{ 
                  position: "absolute", 
                  top: "20px", 
                  right: "20px", 
                  background: "none", 
                  border: "none", 
                  color: "var(--text3)", 
                  cursor: "pointer" 
                }}
              >
                <Trash2 size={16} />
              </button>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap", gap: "8px", paddingRight: "30px" }}>
                <div>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "16px", color: "var(--text)" }}>{inq.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--text2)", marginTop: "4px" }}>
                    <Mail size={10} inline /> {inq.email} · <Phone size={10} inline /> {inq.phone} · {inq.date}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <span className="tag tag-dim" style={{ opacity: 0.6 }}>{inq.type}</span>
                  <span className={`tag ${inq.status === "new" ? "tag-3" : "tag-g"}`}>{inq.status.toUpperCase()}</span>
                </div>
              </div>

              <div style={{ 
                fontWeight: 600, 
                fontSize: "14px", 
                color: "var(--neon2)", 
                marginBottom: "8px",
                fontFamily: "Outfit, sans-serif" 
              }}>
                {inq.subject}
              </div>
              
              <div style={{ 
                fontSize: "13px", 
                color: "var(--text2)", 
                lineHeight: 1.7, 
                marginBottom: "20px",
                background: "var(--bg3)",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--border2)"
              }}>
                {inq.message}
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button 
                  className="btn-sm btn-sm-neon" 
                  onClick={() => onUpdateStatus(inq.id, inq.status === "new" ? "replied" : "new")}
                >
                  {inq.status === "new" ? "Mark Replied" : "Mark as New"}
                </button>
                <button className="btn-sm btn-sm-ghost" onClick={() => onConvertOrder(inq)}>
                  Convert to Order
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
