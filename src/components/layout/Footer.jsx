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
  const parts = settings.companyName ? settings.companyName.split(" ") : ["Jaybesin", "Autos"];

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand-col">
          <div className="footer-logo">
            <div className="f-logo-box">J</div>
            <div className="nav-brand"><span>{parts[0]}</span>{parts.slice(1).join(" ")}</div>
          </div>
          <p className="footer-desc">Premium vehicle sourcing and shipping from China to Ghana. Trusted by hundreds of buyers in Accra and beyond.</p>
          <div className="footer-socials">
            {sociaLinks.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer" className="social-btn">
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
          <div className="footer-map-placeholder" style={{ background: "var(--bg3)", border: "1px solid var(--border2)" }}>
            <MapPin size={18} style={{ marginBottom: 4, color: "var(--neon)" }} />
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text)" }}>Greater Accra Region</div>
            <div style={{ fontSize: 10, opacity: 0.8, color: "var(--text2)" }}>Ghana, West Africa</div>
          </div>
          <div className="footer-contact-info">
            <div className="f-info-item"><Phone size={14} color="var(--neon)" /> <span>{settings.phone || "+233 00 000 000"}</span></div>
            <div className="f-info-item"><Mail size={14} color="var(--neon)" /> <span>{settings.email || "sales@jaybesinautos.com"}</span></div>
          </div>
        </div>
      </div>
      <div className="footer-bot" style={{ paddingTop: '40px', borderTop: '1px solid var(--border)', marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
          © {year} {settings.companyName || "Jaybesin Autos"}. All rights reserved.
        </div>
        <button 
          onClick={onAdminClick} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text)', 
            opacity: 0.3, 
            fontSize: '10px', 
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          Systems Access
        </button>
      </div>
    </footer>
  );
}
