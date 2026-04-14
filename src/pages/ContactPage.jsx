import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, ArrowRight } from "lucide-react";
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
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sec" style={{ paddingTop: "140px", background: "var(--bg)", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <div style={{ maxWidth: "800px", marginBottom: "60px" }}>
          <div className="sec-chip" style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>Contact Us</div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: "20px", color: "var(--text)" }}>
            Let's Start a <span style={{ color: "var(--accent)" }}>Conversation</span>
          </h1>
          <p style={{ fontSize: "18px", color: "var(--text-dim)", lineHeight: 1.6 }}>
            Whether you have a specific vehicle in mind or need expert advice on imports, 
            our team is here to help you every step of the way.
          </p>
        </div>

        <div className="adm-split" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "48px", alignItems: "start" }}>
          {/* Info Side */}
          <div style={{ display: "grid", gap: "24px" }}>
            <div className="adm-card" style={{ padding: "32px", borderRadius: "20px", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "32px" }}>Get in Touch</h3>
              
              <div style={{ display: "flex", gap: "20px", marginBottom: "32px" }}>
                <div style={{ 
                  width: "48px", height: "48px", background: "var(--bg-alt)", borderRadius: "12px", 
                  display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)"
                }}><Phone size={20} /></div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>Call or WhatsApp</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--text)" }}>{settings.phone || "+233 00 000 000"}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "20px", marginBottom: "32px" }}>
                <div style={{ 
                  width: "48px", height: "48px", background: "var(--bg-alt)", borderRadius: "12px", 
                  display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)"
                }}><Mail size={20} /></div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>Email Us</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--text)" }}>{settings.email || "hello@jaybesinautos.com"}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ 
                  width: "48px", height: "48px", background: "var(--bg-alt)", borderRadius: "12px", 
                  display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)"
                }}><MapPin size={20} /></div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>Office Location</div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)" }}>{settings.address || "Accra, Ghana"}</div>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="adm-card" style={{ padding: "24px", borderRadius: "16px", textAlign: "center" }}>
                <Clock size={24} style={{ marginBottom: "12px", color: "var(--accent)", margin: "0 auto 12px" }} />
                <div style={{ fontSize: "14px", fontWeight: 800 }}>Business Hours</div>
                <div style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "4px" }}>Mon - Sat: 8:00 - 18:00</div>
              </div>
              <div className="adm-card" style={{ padding: "24px", borderRadius: "16px", textAlign: "center" }}>
                <MessageSquare size={24} style={{ marginBottom: "12px", color: "var(--accent)", margin: "0 auto 12px" }} />
                <div style={{ fontSize: "14px", fontWeight: 800 }}>Fast Response</div>
                <div style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "4px" }}>Average reply within 1hr</div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="adm-card" style={{ padding: "40px", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div style={{ 
                  width: "72px", height: "72px", background: "var(--accent-dim)", borderRadius: "50%", 
                  display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)",
                  margin: "0 auto 24px"
                }}><Send size={32} /></div>
                <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "16px" }}>Message Sent!</h2>
                <p style={{ color: "var(--text-dim)", marginBottom: "32px", lineHeight: 1.6 }}>
                  Thank you for reaching out. One of our agents will contact you shortly to discuss your request.
                </p>
                <button className="btn-p" onClick={() => setSent(false)} style={{ padding: "0 32px", height: "48px" }}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "32px" }}>Send us a Message</h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <div className="fg">
                    <label className="lbl">Full Name</label>
                    <input required className="inp" style={{ background: "var(--bg-alt)" }} value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="fg">
                    <label className="lbl">Phone Number</label>
                    <input required className="inp" style={{ background: "var(--bg-alt)" }} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                </div>

                <div className="fg" style={{ marginBottom: "20px" }}>
                  <label className="lbl">Email Address</label>
                  <input required className="inp" type="email" style={{ background: "var(--bg-alt)" }} value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>

                <div className="fg" style={{ marginBottom: "20px" }}>
                  <label className="lbl">I'm interested in...</label>
                  <select className="inp" style={{ background: "var(--bg-alt)" }} value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                    <option>General Inquiry</option>
                    <option>Vehicle Purchase</option>
                    <option>Import Service</option>
                    <option>Spare Parts</option>
                  </select>
                </div>

                <div className="fg" style={{ marginBottom: "32px" }}>
                  <label className="lbl">Your Message</label>
                  <textarea required className="inp" rows={4} style={{ background: "var(--bg-alt)" }} value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                </div>

                <button className="btn-p" type="submit" disabled={loading} style={{ width: "100%", height: "56px", fontSize: "16px", gap: "12px" }}>
                  {loading ? "Sending..." : "Send Message"} <ArrowRight size={20} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .adm-split { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </div>
  );
}
