import React, { useState, useEffect } from "react";
import { Lock } from "lucide-react";

// hex → rgba helper for dynamic themes
const ha = (hex, a) => {
  if (!hex || hex.length < 7) return `rgba(0,0,0,${a})`;
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
};

export const GlobalStyles = ({ theme: t }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800;900&family=Syne:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cormorant+Garamond:wght@500;600;700&display=swap');
    *,*::before,*::after{box-sizing:border-box}
    html,body{margin:0;padding:0;overflow-x:hidden;overscroll-behavior-x:none;-webkit-overflow-scrolling:touch}
    @media(pointer:coarse){.cursor-el{display:none!important;pointer-events:none!important}}
    html{scroll-behavior:smooth}
    body{background:var(--bg);color:var(--text);font-family:'Plus Jakarta Sans','Outfit',sans-serif;font-weight:400;overflow-x:hidden;cursor:none}
    ::-webkit-scrollbar{width:3px}
    ::-webkit-scrollbar-track{background:var(--bg)}
    ::-webkit-scrollbar-thumb{background:var(--neon);border-radius:2px}

    /* Cursor */
    .cur{width:10px;height:10px;background:var(--neon);border-radius:50%;position:fixed;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);transition:transform .08s}
    .cur-ring{width:40px;height:40px;border:1.5px solid ${ha('#ffffff', 0.3)};border-color:var(--neon);opacity:.45;border-radius:50%;position:fixed;pointer-events:none;z-index:99998;transform:translate(-50%,-50%);transition:all .3s cubic-bezier(.23,1,.32,1)}
    .cur-ring.hov{width:56px;height:56px;opacity:1;background:${ha('#ffffff', 0.05)}}

    /* Grain */
    .grain{position:fixed;inset:0;pointer-events:none;z-index:9997;opacity:.03;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

    /* Reveal */
    .rv{opacity:0;transform:translateY(32px);transition:opacity .85s cubic-bezier(.16,1,.3,1),transform .85s cubic-bezier(.16,1,.3,1)}
    .rv.on{opacity:1;transform:none}

    /* Typography helpers */
    .gt-neon{background:var(--grad-neon);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .gt-orange{background:var(--grad-orange);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

    /* Announcement bar */
    .ann-bar{background:var(--neon);color:var(--btn-text);text-align:center;padding:9px 20px;font-size:12px;font-weight:700;letter-spacing:.5px;position:fixed;top:0;left:0;right:0;width:100%;z-index:1002}
    .ann-bar-spacer{height:38px;width:100%}
    .ann-bar a{color:inherit;text-decoration:underline;cursor:none}
    .ann-close{position:absolute;right:16px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:none;font-size:16px;color:var(--btn-text);opacity:.6;transition:opacity .2s}

    /* Nav */
    .nav{position:fixed;left:0;right:0;z-index:1000;padding:18px 64px;display:flex;align-items:center;justify-content:space-between;transition:top .3s,padding .4s,background .4s}
    .nav.sc{background:var(--nav-bg);backdrop-filter:blur(24px);padding:12px 64px;border-bottom:1px solid var(--border)}
    .nav-logo{display:flex;align-items:center;gap:12px;cursor:none}
    .nav-logo-mark{width:36px;height:36px;background:var(--grad-neon);border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;color:var(--btn-text);font-size:16px}
    .nav-brand{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;letter-spacing:-0.5px;text-transform:uppercase;color:var(--text)}
    .nav-brand span{color:var(--neon)}
    .nav-links{display:flex;gap:32px;list-style:none;margin:0;padding:0}
    .nav-links a{color:var(--text2);text-decoration:none;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;transition:color .3s;cursor:none}
    .nav-links a:hover{color:var(--neon)}
    .nav-actions{display:flex;align-items:center;gap:16px}
    .nav-burger{display:none;flex-direction:column;gap:5px;background:none;border:none;padding:5px;z-index:1001;cursor:none}
    .nav-burger span{width:24px;height:2px;background:var(--text);transition:.3s;border-radius:2px}

    /* Mobile drawer */
    .nav-drawer{position:fixed;inset:0;background:var(--bg);z-index:999;transform:translateX(100%);transition:transform .5s cubic-bezier(.16,1,.3,1);padding:100px 24px 40px;display:flex;flex-direction:column;gap:14px}
    .nav-drawer.open{transform:none}
    .nav-drawer-link{background:none;border:none;color:var(--text);font-family:'Syne',sans-serif;font-weight:800;font-size:32px;text-align:left;display:flex;align-items:center;padding:12px 0;cursor:none}
    .nav-drawer-cta{margin-top:24px;width:100%;justify-content:center;padding:20px;font-size:16px}

    /* WA Float */
    .wa-float{position:fixed;bottom:24px;right:24px;width:56px;height:56px;background:#25d366;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:990;box-shadow:0 8px 24px rgba(37,211,102,.3);border:none;cursor:none;transition:transform .3s}
    .wa-float:hover{transform:scale(1.1)}
    .wa-tooltip{position:absolute;right:70px;background:white;color:black;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:700;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .3s;box-shadow:0 4px 12px rgba(0,0,0,.1)}
    .wa-float:hover .wa-tooltip{opacity:1}

    @media (max-width: 980px){
      .nav{padding:16px 24px}
      .nav-links{display:none}
      .nav-burger{display:flex}
    }
  `}</style>
);

export function ThemeInjector({ theme: t }) {
  useEffect(() => {
    const s = `
      :root {
        --neon:${t.accent1};--neon2:${t.accent2};--orange:${t.accent3};--purple:${t.accent4};
        --bg:${t.bgPrimary};--bg2:${t.bgSecondary};--bg3:${t.bgTertiary};--bg4:${t.bgInput};--card:${t.bgCard};
        --text:${t.textPrimary};--text2:${t.textSecondary};--text3:${t.textMuted};
        --border:${ha(t.borderHex, 0.6)};--border2:${ha(t.borderHex, 0.35)};
        --nav-bg:${t.navBg};--footer-bg:${t.footerBg};--btn-text:${t.btnText};
        --grad-neon:linear-gradient(135deg,${t.accent1},${t.accent2});
        --grad-orange:linear-gradient(135deg,${t.accent3},${t.accent1});
        --grad-purple:linear-gradient(135deg,${t.accent4},${t.accent2});
        --border-raw:${t.borderHex};
      }
    `;
    let el = document.getElementById("theme-vars");
    if (!el) { el = document.createElement("style"); el.id = "theme-vars"; document.head.appendChild(el); }
    el.textContent = s;
  }, [t]);
  return null;
}

export function Nav({ setPage, settings, annOn, page, onAdminClick }) {
  const [sc, setSc] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    const h = () => setSc(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);
  const navLinks = [["Home", "home"], ["Browse Cars", "browse"], ["Import From China", "import"], ["Sell Car", "sell"], ["Deals", "deals"], ["Account", "account"]];
  const go = (p) => { setPage(p); setDrawerOpen(false); };
  const parts = (settings?.companyName || "Jaybesin Autos").split(" ");
  return (
    <>
      <nav className={`nav${sc ? " sc" : ""}`} style={{ top: annOn ? "38px" : "0" }}>
        <div className="nav-logo" onClick={() => go("home")} style={{ cursor: "pointer" }}>
          {settings.logo ? <img src={settings.logo} style={{ width: 36, height: 36, borderRadius: 8, objectFit: "contain" }} alt="" /> : <div className="nav-logo-mark">{parts[0][0]}</div>}
          <div className="nav-brand"><span>{parts[0]}</span>{parts.slice(1).join(" ")}</div>
        </div>
        <ul className="nav-links">
          {navLinks.map(([l, p]) => (
            <li key={l}><a href="#" style={{ color: page === p ? "var(--neon)" : undefined }} onClick={e => { e.preventDefault(); go(p) }}>{l}</a></li>
          ))}
        </ul>
        <div className="nav-actions">
           <button className="btn-sm btn-sm-ghost" onClick={onAdminClick}>Admin</button>
           <button className="btn-p" onClick={() => go("browse")} style={{ padding: "9px 22px", fontSize: "11px" }}>Browse Cars</button>
        </div>
        <button className={`nav-burger${drawerOpen ? " open" : ""}`} onClick={() => setDrawerOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>
      <div className={`nav-drawer${drawerOpen ? " open" : ""}`}>
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "var(--bg)", borderBottom: "1px solid var(--border2)", zIndex: 991 }}>
          <div className="nav-logo" onClick={() => go("home")} style={{ cursor: "pointer" }}>
            {settings.logo ? <img src={settings.logo} style={{ width: 30, height: 30, borderRadius: 6, objectFit: "contain" }} alt="" /> : <div className="nav-logo-mark" style={{ width: 30, height: 30, fontSize: 12 }}>{parts[0][0]}</div>}
            <div className="nav-brand" style={{ fontSize: 15 }}><span>{parts[0]}</span>{parts.slice(1).join(" ")}</div>
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid var(--border2)", background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer", color: "var(--text)" }}>✕</button>
        </div>
        {navLinks.map(([l, p]) => (
          <button key={l} className="nav-drawer-link" onClick={() => go(p)}>
            <span style={{ margin: "0 14px 0 0", fontSize: 20 }}>{p === "home" ? "🏠" : p === "browse" ? "🚗" : p === "import" ? "🚢" : p === "sell" ? "💼" : p === "deals" ? "🔥" : "👤"}</span>
            {l}
          </button>
        ))}
        <button className="btn-p nav-drawer-cta" onClick={() => go("browse")}>Browse Cars →</button>
        <button className="btn-sm btn-sm-ghost" style={{ marginTop: "10px", width: "100%", justifyContent: "center" }} onClick={onAdminClick}>Admin Portal</button>
      </div>
    </>
  );
}

export function AnnBar({ settings, setPage, onClose }) {
  if (!settings.annBarOn) return null;
  return (
    <>
      <div className="ann-bar">
        {settings.annBarText}
        {settings.annBarLink && <a href={settings.annBarLink} onClick={e => { e.preventDefault(); setPage("browse") }}>Learn more</a>}
        <button className="ann-close" onClick={onClose}>✕</button>
      </div>
      <div className="ann-bar-spacer" />
    </>
  );
}

export function Footer({ setPage, onAdminClick, settings = {} }) {
  const parts = (settings.companyName || "Jaybesin Autos").split(" ");
  return (
    <footer className="footer-wrap">
       <div className="footer-grid">
         <div className="footer-brand-col">
            <div className="nav-logo" style={{ marginBottom: 20 }}>
               <div className="nav-logo-mark" style={{ width: 42, height: 42, fontSize: 20 }}>{parts[0][0]}</div>
               <div className="nav-brand" style={{ fontSize: 22 }}><span>{parts[0]}</span>{parts.slice(1).join(" ")}</div>
            </div>
            <p style={{ color: "var(--text2)", fontSize: "14px", lineHeight: "1.6", maxWidth: "320px" }}>{settings.tagline || "China's Finest. West Africa's Pride."}</p>
         </div>
       </div>
       <div className="footer-bot">
          <div className="footer-copy">© {new Date().getFullYear()} {settings.companyName}. All rights reserved.</div>
          <button className="admin-ghost" onClick={onAdminClick}>Administrator Access</button>
       </div>
       <style>{`
         .footer-wrap{background:var(--footer-bg);padding:80px 64px 40px;border-top:1px solid var(--border)}
         .footer-grid{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:48px}
         .footer-bot{max-width:1200px;margin:48px auto 0;padding-top:32px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center}
         .admin-ghost{background:transparent;border:0;color:var(--text3);font-size:11px;cursor:pointer}
         @media (max-width: 980px){ .footer-wrap{padding:60px 24px 32px;}.footer-grid{grid-template-columns:1fr 1fr;gap:32px;} }
       `}</style>
    </footer>
  );
}

export function WAFloat({ whatsapp }) {
  return (
    <button className="wa-float" onClick={() => window.open(`https://wa.me/${(whatsapp || "").replace(/\D/g, "")}?text=Hello Jaybesin Autos, I'm interested in your vehicles.`)}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      <span className="wa-tooltip">Chat with us</span>
    </button>
  );
}
