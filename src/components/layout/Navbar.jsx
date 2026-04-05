import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Car, User, Flame } from "lucide-react";

export function Navbar({ settings, annOn, onAdminClick }) {
  const [sc, setSc] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const h = () => setSc(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  // lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const navLinks = [
    { name: "Browse Cars", path: "/" },
    { name: "Import From China", path: "/import" },
    { name: "Sell Car", path: "/sell" },
    { name: "Deals", path: "/deals" },
    { name: "Account", path: "/account" },
  ];

  const isActive = (path) => location.pathname === path;
  const parts = settings.companyName ? settings.companyName.split(" ") : ["Jaybesin", "Autos"];

  return (
    <>
      <nav className={`nav${sc ? " sc" : ""}`} style={{ top: annOn ? "38px" : "0" }}>
        <Link to="/" className="nav-logo" onClick={() => setDrawerOpen(false)} style={{ cursor: "none" }}>
          {settings.logo
            ? <img src={settings.logo} style={{ width: 36, height: 36, borderRadius: 8, objectFit: "contain" }} alt="" />
            : <div className="nav-logo-mark">{parts[0][0]}</div>}
          <div className="nav-brand"><span>{parts[0]}</span>{parts.slice(1).join(" ")}</div>
        </Link>
        
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link 
                to={link.path} 
                className={isActive(link.path) ? "active" : ""}
                style={{ cursor: "none", color: isActive(link.path) ? "var(--neon)" : undefined }}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button className="btn-sm btn-sm-ghost" onClick={onAdminClick}>Admin</button>
          <Link to="/browse" className="btn-p" style={{ padding: "9px 22px", fontSize: "11px", cursor: "none" }}>Browse Cars</Link>
        </div>

        {/* Hamburger */}
        <button className={`nav-burger${drawerOpen ? " open" : ""}`} onClick={() => setDrawerOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-drawer${drawerOpen ? " open" : ""}`}>
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "var(--bg)", borderBottom: "1px solid var(--border2)", zIndex: 991 }}>
          <Link to="/" className="nav-logo" onClick={() => setDrawerOpen(false)} style={{ cursor: "none" }}>
            {settings.logo
              ? <img src={settings.logo} style={{ width: 30, height: 30, borderRadius: 6, objectFit: "contain" }} alt="" />
              : <div className="nav-logo-mark" style={{ width: 30, height: 30, fontSize: 12 }}>{parts[0][0]}</div>}
            <div className="nav-brand" style={{ fontSize: 15 }}><span>{parts[0]}</span>{parts.slice(1).join(" ")}</div>
          </Link>
          <button onClick={() => setDrawerOpen(false)} style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid var(--border2)", background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer", color: "var(--text)" }}><X size={18} /></button>
        </div>
        
        {navLinks.map((link) => {
          const Icon = link.path === "/" ? Car : link.path === "/browse" ? Car : link.path === "/import" ? Menu : link.path === "/sell" ? User : Car; // Simplified for now but better than emojis
          return (
            <Link key={link.name} to={link.path} className="nav-drawer-link" onClick={() => setDrawerOpen(false)}>
              <span style={{ margin: "0 14px 0 0", color: "var(--neon)" }}>
                {link.path === "/" && <Car size={20} />}
                {link.path === "/browse" && <Car size={20} />}
                {link.path === "/import" && <Menu size={20} />}
                {link.path === "/sell" && <User size={20} />}
                {link.path === "/deals" && <Flame size={20} />}
                {link.path === "/account" && <User size={20} />}
              </span>
              {link.name}
            </Link>
          );
        })}
        
        <Link to="/browse" className="btn-p nav-drawer-cta" onClick={() => setDrawerOpen(false)}>Browse Cars →</Link>
        <button className="btn-sm btn-sm-ghost" style={{ marginTop: "10px", width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: "8px" }} onClick={onAdminClick}><User size={14} /> Admin Portal</button>
        
        <div style={{ marginTop: "auto", paddingTop: 24, fontSize: 11, color: "var(--text3)", textAlign: "center" }}>
          {settings.phone} · {settings.email}
        </div>
      </div>
    </>
  );
}
