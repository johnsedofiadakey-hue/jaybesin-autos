import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, ArrowRight } from "lucide-react";
import { addInquiry } from "../firestore";

export function ContactPage({ settings = {} }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addInquiry({
        ...form,
        date: new Date().toISOString().slice(0,10),
        status: "new",
        type: "contact_form"
      });
      setSent(true);
      setForm({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to send inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sec" style={{ paddingTop: "140px", background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', marginBottom: '80px' }}>
          <div className="section-label">Consultation Cluster</div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 800, letterSpacing: '-2px', marginBottom: '24px' }}>
            Elevate Your <span style={{ color: 'var(--accent)' }}>Fleet</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-dim)', lineHeight: 1.6 }}>
            Whether you're looking for a single unit or building a logistics pipeline from China, 
            our verified supply chain ensures absolute quality.
          </p>
        </div>

        <div className="adm-split" style={{ alignItems: 'start' }}>
          {/* Contact Info Cards */}
          <div style={{ display: 'grid', gap: '16px' }}>
            <div className="adm-card">
              <div className="section-label" style={{ marginBottom: '24px' }}>Established Channels</div>
              
              <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                <div className="dc-icon" style={{ flexShrink: 0 }}><Phone size={20} /></div>
                <div>
                  <div className="lbl" style={{ marginBottom: '4px' }}>Voice & WhatsApp</div>
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>{settings.phone || "+233 00 000 000"}</div>
                  <div style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 600, marginTop: '2px' }}>Operational 24/7 for Logistics</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
                <div className="dc-icon" style={{ flexShrink: 0 }}><Mail size={20} /></div>
                <div>
                  <div className="lbl" style={{ marginBottom: '4px' }}>Secure Inquiries</div>
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>{settings.email || "ops@jaybesinautos.com"}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div className="dc-icon" style={{ flexShrink: 0 }}><MapPin size={20} /></div>
                <div>
                  <div className="lbl" style={{ marginBottom: '4px' }}>Regional Command</div>
                  <div style={{ fontSize: '16px', fontWeight: 700 }}>{settings.address || "Accra, Ghana Cluster"}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="adm-card" style={{ padding: '24px' }}>
                <Clock size={20} style={{ marginBottom: '16px', color: 'var(--accent)' }} />
                <div style={{ fontSize: '13px', fontWeight: 700 }}>Market Hours</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Standard: 08:00 - 18:00</div>
              </div>
              <div className="adm-card" style={{ padding: '24px' }}>
                <Globe size={20} style={{ marginBottom: '16px', color: 'var(--accent)' }} />
                <div style={{ fontSize: '13px', fontWeight: 700 }}>Global Sync</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Active Real-time Monitoring</div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="adm-card" style={{ padding: '48px' }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div className="dc-icon" style={{ margin: "0 auto 24px", width: '64px', height: '64px' }}>
                  <Send size={32} />
                </div>
                <h2>Transmission Success</h2>
                <p style={{ margin: "16px auto 32px" }}>
                  Your inquiry has been logged into the protocol. An operative will contact you regarding your requirements.
                </p>
                <button className="btn-sm-ghost" onClick={() => setSent(false)}>Initiate New Request</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="section-label" style={{ marginBottom: '32px' }}>Transmission Protocol</div>
                
                <div className="frow" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="fg">
                    <label className="lbl">Operator Identity</label>
                    <input required className="inp" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="fg">
                    <label className="lbl">Contact Frequency</label>
                    <input required className="inp" placeholder="Phone Number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                </div>

                <div className="fg">
                  <label className="lbl">Secure Email</label>
                  <input required className="inp" type="email" placeholder="email@provider.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>

                <div className="fg">
                  <label className="lbl">Request Category</label>
                  <select className="inp" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                    <option>General Inquiry</option>
                    <option>Vehicle Purchase</option>
                    <option>Import Pipeline Request</option>
                    <option>Hardware/Spare Parts</option>
                    <option>Partnership Protocol</option>
                  </select>
                </div>

                <div className="fg">
                  <label className="lbl">Message Payload</label>
                  <textarea required className="inp" rows={4} placeholder="Describe your requirements in detail..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                </div>

                <button className="btn-p" type="submit" disabled={loading} style={{ width: "100%", height: '52px', justifyContent: "center", fontSize: '14px' }}>
                  {loading ? "Transmitting..." : "Send Secure Message"} <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
