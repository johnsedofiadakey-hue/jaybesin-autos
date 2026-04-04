import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Linkedin, MapPin, Phone, Mail } from "lucide-react";

export function Footer({ onAdminClick, settings = {} }) {
  const sociaLinks = [
    { icon: Instagram, url: settings.instagram || "#" },
    { icon: Facebook, url: settings.facebook || "#" },
    { icon: Twitter, url: settings.twitter || "#" },
    { icon: Linkedin, url: settings.linkedin || "#" },
  ];

  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand-col">
          <div className="footer-logo">
            <div className="f-logo-box">J</div>
            <span>Jaybesin Autos</span>
          </div>
          <p className="footer-desc">Premium vehicle sourcing and shipping from China to Ghana. Trusted by hundreds of buyers in Accra and beyond.</p>
          <div className="footer-socials">
            {sociaLinks.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer" className="social-icon">
                <s.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-links-col">
          <div className="footer-hd">Services</div>
          <ul className="footer-links">
            <li><Link to="/browse">Buy Vehicle</Link></li>
            <li><Link to="/import">Import Request</Link></li>
            <li><Link to="/sell">Sell Your Car</Link></li>
            <li><Link to="/track">Track Shipment</Link></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <div className="footer-hd">Support</div>
          <ul className="footer-links">
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/services">Help Center</Link></li>
            <li><Link to="/account">My Account</Link></li>
            <li><Link to="/">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="footer-loc">
          <div className="footer-hd">Accra Office</div>
          <div className="footer-map-placeholder">
            <MapPin size={18} style={{ marginBottom: 4 }} />
            <div style={{ fontSize: 11, fontWeight: 700 }}>Greater Accra Region</div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>Ghana, West Africa</div>
          </div>
          <div className="footer-contact-info">
            <div className="f-info-item"><Phone size={14} /> <span>{settings.phone || "+233 00 000 000"}</span></div>
            <div className="f-info-item"><Mail size={14} /> <span>{settings.email || "sales@jaybesinautos.com"}</span></div>
          </div>
        </div>
      </div>
      <div className="footer-bot">
        <div className="footer-copy">© {year} {settings.companyName || "Jaybesin Autos"}. All rights reserved. Professional Vehicle Procurement.</div>
        <button className="admin-ghost" onClick={onAdminClick}>⬡ Systems Admin</button>
      </div>

      <style>{`
        .footer{background:#0a0a0b;border-top:1px solid #1d1d20;padding:64px 20px 32px;color:#98a2b3}
        .footer-grid{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1.2fr 0.8fr 0.8fr 1fr;gap:48px}
        .footer-logo{display:flex;align-items:center;gap:12px;color:#fff;font-family:Syne,sans-serif;font-weight:800;font-size:22px;margin-bottom:20px}
        .f-logo-box{width:36px;height:36px;background:var(--grad-neon);color:#0a0a0b;border-radius:10px;display:grid;place-items:center;font-size:18px}
        .footer-desc{font-size:14px;line-height:1.6;margin-bottom:24px;max-width:320px}
        .footer-socials{display:flex;gap:12px}
        .social-icon{width:36px;height:36px;background:#1d1d20;border-radius:10px;display:grid;place-items:center;color:#fff;transition:0.2s}
        .social-icon:hover{background:var(--neon);color:#0a0a0b;transform:translateY(-2px)}
        .footer-hd{color:#fff;font-weight:800;font-size:14px;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:24px}
        .footer-links{list-style:none;padding:0;margin:0}
        .footer-links li{margin-bottom:12px}
        .footer-links a{color:#98a2b3;text-decoration:none;font-size:14px;transition:0.2s}
        .footer-links a:hover{color:var(--neon)}
        .footer-loc{background:#111113;padding:24px;border-radius:16px;border:1px solid #1d1d20}
        .footer-map-placeholder{background:#0a0a0b;border-radius:10px;padding:20px;text-align:center;margin-bottom:20px;border:1px solid #1d1d20}
        .footer-contact-info{display:flex;flex-direction:column;gap:12px}
        .f-info-item{display:flex;align-items:center;gap:10px;font-size:13px;color:#fff}
        .footer-bot{max-width:1200px;margin:48px auto 0;padding-top:32px;border-top:1px solid #1d1d20;display:flex;justify-content:space-between;align-items:center}
        .footer-copy{font-size:12px}
        .admin-ghost{background:none;border:none;color:#475467;font-size:11px;cursor:pointer;transition:0.2s;font-family:inherit}
        .admin-ghost:hover{color:var(--neon)}
        
        @media (max-width: 992px) {
          .footer-grid{grid-template-columns:1fr 1fr;gap:32px}
        }
        @media (max-width: 576px) {
          .footer-grid{grid-template-columns:1fr;gap:32px}
        }
      `}</style>
    </footer>
  );
}
