import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Car, User, Flame, LayoutDashboard, Search, Package, Zap, ChevronRight } from "lucide-react";

export function Navbar({ settings, annOn, onAdminClick }) {
  const [sc, setSc] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const h = () => setSc(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const navLinks = [
    { name: "Garage", path: "/", icon: Car },
    { name: "Global Browse", path: "/browse", icon: Search },
    { name: "Import Service", path: "/import", icon: Zap },
    { name: "Specials", path: "/deals", icon: Flame },
  ];

  const isActive = (path) => location.pathname === path;
  const parts = settings.companyName ? settings.companyName.split(" ") : ["Jaybesin", "Autos"];

  return (
    <>
      <nav className={`nav${sc ? " sc" : ""}`} style={{ top: annOn ? "38px" : "0" }}>
        <div className="nav-container" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" className="nav-logo" onClick={() => setDrawerOpen(false)}>
            {settings.logo
              ? <img src={settings.logo} className="logo-img" alt="" />
              : <div className="nav-logo-mark">{parts[0][0]}</div>}
            <div className="nav-brand"><span>{parts[0]}</span> {parts.slice(1).join(" ")}</div>
          </Link>
          
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link to={link.path} className={isActive(link.path) ? "active" : ""}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button className="btn-sm btn-sm-ghost" onClick={onAdminClick}>
              <LayoutDashboard size={14} /> Admin
            </button>
            <Link to="/browse" className="btn-p">Start Browsing</Link>
          </div>

          <button className={`nav-burger${drawerOpen ? " open" : ""}`} onClick={() => setDrawerOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`nav-drawer${drawerOpen ? " open" : ""}`}>
        <div className="drawer-inner">
          <div className="drawer-header">
            <div className="nav-brand drawer-brand"><span>{parts[0]}</span> {parts.slice(1).join(" ")}</div>
            <button className="close-btn" onClick={() => setDrawerOpen(false)}><X size={22} /></button>
          </div>
          
          <div className="drawer-section">
            <div className="section-label">Inventory Management</div>
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="drawer-link" onClick={() => setDrawerOpen(false)}>
                <div className="link-icon"><link.icon size={18} /></div>
                <div className="link-label">{link.name}</div>
                <ChevronRight size={14} className="arrow" />
              </Link>
            ))}
          </div>

          <div className="drawer-section">
            <div className="section-label">Account & Control</div>
            <Link to="/account" className="drawer-link" onClick={() => setDrawerOpen(false)}>
              <div className="link-icon"><User size={18} /></div>
              <div className="link-label">My Account</div>
              <ChevronRight size={14} className="arrow" />
            </Link>
            <button className="drawer-link admin-btn" onClick={() => { setDrawerOpen(false); onAdminClick(); }}>
              <div className="link-icon"><LayoutDashboard size={18} /></div>
              <div className="link-label">Administrator Portal</div>
              <ChevronRight size={14} className="arrow" />
            </button>
          </div>

          <div className="drawer-footer">
            <div className="footer-line">Official {settings.companyName} System</div>
            <div className="footer-meta">Verification Required for Ordering</div>
          </div>
        </div>
      </div>
    </>
  );
}
