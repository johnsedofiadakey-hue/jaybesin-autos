import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from "lucide-react";
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
    <div className="sec" style={{ paddingTop: "120px" }}>
      <div className="sec-chip chip-1 rv on">Get In Touch</div>
      <h2 className="sec-h rv on">We're Here <span className="gt-neon">To Help</span></h2>
      <p className="sec-p rv on" style={{ marginBottom: "48px" }}>
        Have questions about vehicle sourcing, importing, or spare parts? 
        Our team in Accra and China are ready to assist you.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "64px", alignItems: "start" }} className="rv on">
        {/* Contact Info */}
        <div style={{ display: "grid", gap: "24px" }}>
          <div className="adm-card" style={{ padding: "32px", border: "1px solid var(--border2)" }}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--grad-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--btn-text)' }}>
                <Phone size={20} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase' }}>Phone & WhatsApp</div>
                <div style={{ fontSize: '15px', fontWeight: 800 }}>{settings.phone || "+233 00 000 000"}</div>
                <div style={{ fontSize: '12px', color: 'var(--neon)', fontWeight: 700 }}>WhatsApp: {settings.whatsapp || "Active"}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--grad-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--btn-text)' }}>
                <Mail size={20} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase' }}>Email Support</div>
                <div style={{ fontSize: '15px', fontWeight: 800 }}>{settings.email || "sales@jaybesinautos.com"}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--grad-neon)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--btn-text)' }}>
                <MapPin size={20} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase' }}>Office Address</div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>{settings.address || "Accra, Ghana"}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="adm-card" style={{ padding: '20px', textAlign: 'center' }}>
              <Clock size={20} style={{ margin: '0 auto 10px', color: 'var(--neon)' }} />
              <div style={{ fontSize: '12px', fontWeight: 800 }}>Opening Hours</div>
              <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Mon - Sat: 8AM - 6PM</div>
            </div>
            <div className="adm-card" style={{ padding: '20px', textAlign: 'center' }}>
              <Globe size={20} style={{ margin: '0 auto 10px', color: 'var(--neon)' }} />
              <div style={{ fontSize: '12px', fontWeight: 800 }}>Global Sourcing</div>
              <div style={{ fontSize: '11px', color: 'var(--text3)' }}>24/7 Monitoring</div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="adm-card" style={{ padding: "40px" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ width: "64px", height: "64px", background: "color-mix(in srgb,var(--neon) 15%,transparent)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "var(--neon)" }}>
                <Send size={32} />
              </div>
              <h3 className="sec-h" style={{ fontSize: "24px" }}>Message Sent!</h3>
              <p className="sec-p" style={{ margin: "16px auto 24px" }}>
                Thank you for reaching out. Our team will review your inquiry and get back to you shortly.
              </p>
              <button className="btn-sm btn-sm-neon" onClick={() => setSent(false)}>Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
              <div className="frow">
                <div className="fg"><label className="lbl">Full Name</label><input required className="inp" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                <div className="fg"><label className="lbl">Email Address</label><input required className="inp" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              </div>
              <div className="frow">
                <div className="fg"><label className="lbl">Phone Number</label><input required className="inp" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                <div className="fg">
                  <label className="lbl">Subject</label>
                  <select className="inp" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                    <option>General Inquiry</option>
                    <option>Vehicle Purchase</option>
                    <option>Import Request</option>
                    <option>Spare Parts</option>
                    <option>Partnership</option>
                  </select>
                </div>
              </div>
              <div className="fg">
                <label className="lbl">Your Message</label>
                <textarea required className="inp" rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
              </div>
              <button className="btn-p" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
                {loading ? "Sending..." : "Send Message →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
