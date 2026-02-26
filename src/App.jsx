import { useState, useEffect, useRef, useCallback } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import {
  onVehicles, onCharging, onParts, onOrders, onInquiries,
  saveVehicle, deleteVehicle, saveCharger, deleteCharger,
  savePart, deletePart, saveOrder, deleteOrder,
  updateInquiryStatus, deleteInquiry, addInquiry,
  getSettings, saveSettings as fsaveSettings,
  seedFirestore
} from "./firestore";

// ─────────────────────────────────────────────────────────────────
//  THEME SYSTEM
// ─────────────────────────────────────────────────────────────────
const PRESETS = {
  "Dark Neon": {
    accent1: "#00E5A0", accent2: "#00C4FF", accent3: "#FF6B35", accent4: "#7B2FFF",
    bgPrimary: "#080C14", bgSecondary: "#0D1220", bgTertiary: "#111827", bgCard: "#0F1929", bgInput: "#1A2235",
    textPrimary: "#F0F4FF", textSecondary: "#8B9CC8", textMuted: "#4A5878",
    borderHex: "#1A2E4A", navBg: "#080C14E8", footerBg: "#0D1220", btnText: "#050A0E",
  },
  "Gold Luxury": {
    accent1: "#C9A84C", accent2: "#E8C97A", accent3: "#FF6B35", accent4: "#8A6F2E",
    bgPrimary: "#060608", bgSecondary: "#0C0C10", bgTertiary: "#121215", bgCard: "#0E0E12", bgInput: "#18181F",
    textPrimary: "#F0EDE8", textSecondary: "#9B9698", textMuted: "#5A5760",
    borderHex: "#2A2520", navBg: "#060608E8", footerBg: "#0C0C10", btnText: "#060608",
  },
  "Ocean Blue": {
    accent1: "#3A86FF", accent2: "#00D4FF", accent3: "#FF006E", accent4: "#8338EC",
    bgPrimary: "#040B18", bgSecondary: "#071428", bgTertiary: "#0A1C35", bgCard: "#081525", bgInput: "#0E2040",
    textPrimary: "#E8F4FF", textSecondary: "#7AA8D8", textMuted: "#3A5878",
    borderHex: "#0E2A4A", navBg: "#040B18E8", footerBg: "#071428", btnText: "#040B18",
  },
  "Sunset Sport": {
    accent1: "#FF6B35", accent2: "#FFD60A", accent3: "#FF006E", accent4: "#7B2FFF",
    bgPrimary: "#0C0804", bgSecondary: "#1A1008", bgTertiary: "#221808", bgCard: "#180E06", bgInput: "#241806",
    textPrimary: "#FFF8F0", textSecondary: "#C49A78", textMuted: "#7A5A40",
    borderHex: "#3A2010", navBg: "#0C0804E8", footerBg: "#1A1008", btnText: "#0C0804",
  },
  "Deep Purple": {
    accent1: "#BF5FFF", accent2: "#7B2FFF", accent3: "#FF5CFF", accent4: "#00D4FF",
    bgPrimary: "#08040F", bgSecondary: "#100820", bgTertiary: "#160C2A", bgCard: "#120A1E", bgInput: "#1E1030",
    textPrimary: "#F4EEFF", textSecondary: "#9A82C8", textMuted: "#504870",
    borderHex: "#2A1850", navBg: "#08040FE8", footerBg: "#100820", btnText: "#08040F",
  },
  "Clean White": {
    accent1: "#0070F3", accent2: "#00B4D8", accent3: "#FF6B35", accent4: "#7B2FFF",
    bgPrimary: "#F8FAFF", bgSecondary: "#EEEEF8", bgTertiary: "#E4E4F0", bgCard: "#FFFFFF", bgInput: "#F0F0F8",
    textPrimary: "#0A0A1A", textSecondary: "#444466", textMuted: "#8888AA",
    borderHex: "#C8C8E0", navBg: "#F8FAFFF0", footerBg: "#EEEEF8", btnText: "#FFFFFF",
  },
};

const DEFAULT_THEME = PRESETS["Dark Neon"];

// hex → rgba helper
const ha = (hex, a) => {
  if (!hex || hex.length < 7) return `rgba(0,0,0,${a})`;
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
};

function ThemeInjector({ theme: t }) {
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
        --grad-card:linear-gradient(135deg,${ha(t.accent1, .04)},${ha(t.accent2, .02)});
        --border-raw:${t.borderHex};
      }
    `;
    let el = document.getElementById("theme-vars");
    if (!el) { el = document.createElement("style"); el.id = "theme-vars"; document.head.appendChild(el); }
    el.textContent = s;
  }, [t]);
  return null;
}

// ─────────────────────────────────────────────────────────────────
//  STATIC STYLES  (uses CSS variables set above)
// ─────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800;900&family=Syne:wght@400;500;600;700;800&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif;font-weight:300;overflow-x:hidden;cursor:none}
    ::-webkit-scrollbar{width:3px}
    ::-webkit-scrollbar-track{background:var(--bg)}
    ::-webkit-scrollbar-thumb{background:var(--neon);border-radius:2px}

    /* Cursor */
    .cur{width:10px;height:10px;background:var(--neon);border-radius:50%;position:fixed;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);transition:transform .08s}
    .cur-ring{width:40px;height:40px;border:1.5px solid ${ha('#ffffff', 0.3)};border-color:var(--neon);opacity:.45;border-radius:50%;position:fixed;pointer-events:none;z-index:99998;transform:translate(-50%,-50%);transition:all .3s cubic-bezier(.23,1,.32,1)}
    .cur-ring.hov{width:56px;height:56px;opacity:1;background:${ha('#ffffff', 0.05)};background:rgba(var(--neon-rgb,.04))}

    /* Grain */
    .grain{position:fixed;inset:0;pointer-events:none;z-index:9997;opacity:.03;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

    /* Reveal */
    .rv{opacity:0;transform:translateY(32px);transition:opacity .85s cubic-bezier(.16,1,.3,1),transform .85s cubic-bezier(.16,1,.3,1)}
    .rv.on{opacity:1;transform:none}
    .rvL{opacity:0;transform:translateX(-50px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
    .rvL.on{opacity:1;transform:none}
    .rvR{opacity:0;transform:translateX(50px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
    .rvR.on{opacity:1;transform:none}

    /* Typography helpers */
    .gt-neon{background:var(--grad-neon);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .gt-orange{background:var(--grad-orange);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .gt-purple{background:var(--grad-purple);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

    /* Announcement bar */
    .ann-bar{background:var(--neon);color:var(--btn-text);text-align:center;padding:9px 20px;font-size:12px;font-weight:700;letter-spacing:.5px;position:fixed;top:0;left:0;right:0;width:100%;z-index:1002}
    .ann-bar-spacer{height:38px;width:100%}
    .ann-bar a{color:inherit;text-decoration:underline;cursor:none}
    .ann-close{position:absolute;right:16px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:none;font-size:16px;color:var(--btn-text);opacity:.6;transition:opacity .2s}
    .ann-close:hover{opacity:1}

    /* Nav */
    .nav{position:fixed;left:0;right:0;z-index:1000;padding:18px 64px;display:flex;align-items:center;justify-content:space-between;transition:top .3s,padding .4s,background .4s}
    .nav.sc{background:var(--nav-bg);backdrop-filter:blur(24px);padding:12px 64px;border-bottom:1px solid var(--border)}
    .nav-logo{display:flex;align-items:center;gap:10px;cursor:none}
    .nav-logo-mark{width:36px;height:36px;border-radius:8px;background:var(--grad-neon);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:15px;color:var(--btn-text);flex-shrink:0}
    .nav-brand{font-family:'Syne',sans-serif;font-size:17px;font-weight:800;letter-spacing:-.3px}
    .nav-brand span{color:var(--neon)}
    .nav-links{display:flex;gap:30px;list-style:none}
    .nav-links a{font-size:11px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;color:var(--text2);text-decoration:none;cursor:none;transition:color .25s;position:relative}
    .nav-links a::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:2px;background:var(--neon);transition:width .3s;border-radius:1px}
    .nav-links a:hover{color:var(--neon)}
    .nav-links a:hover::after{width:100%}

    /* Buttons */
    .btn-p{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;background:var(--grad-neon);color:var(--btn-text);font-family:'Outfit',sans-serif;font-size:12px;font-weight:700;letter-spacing:.3px;border:none;cursor:none;border-radius:6px;position:relative;overflow:hidden;transition:transform .25s,box-shadow .25s}
    .btn-p:hover{transform:translateY(-2px);box-shadow:0 8px 30px color-mix(in srgb,var(--neon) 40%,transparent)}
    .btn-o{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;background:transparent;border:1.5px solid var(--neon);color:var(--neon);font-family:'Outfit',sans-serif;font-size:12px;font-weight:600;cursor:none;border-radius:6px;position:relative;overflow:hidden;transition:color .3s,box-shadow .25s}
    .btn-o::before{content:'';position:absolute;inset:0;background:var(--grad-neon);opacity:0;transition:opacity .3s;z-index:0}
    .btn-o:hover{color:var(--btn-text);box-shadow:0 4px 20px color-mix(in srgb,var(--neon) 30%,transparent)}
    .btn-o:hover::before{opacity:1}
    .btn-o>*{position:relative;z-index:1}
    .btn-or{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;background:var(--grad-orange);color:#fff;font-family:'Outfit',sans-serif;font-size:12px;font-weight:700;border:none;cursor:none;border-radius:6px;transition:transform .25s,box-shadow .25s}
    .btn-or:hover{transform:translateY(-2px);box-shadow:0 8px 30px color-mix(in srgb,var(--orange) 35%,transparent)}
    .btn-sm{padding:7px 16px;font-size:10px;font-weight:700;font-family:'Outfit',sans-serif;border-radius:5px;cursor:none;border:none;letter-spacing:.5px;display:inline-flex;align-items:center;gap:5px;transition:all .2s}
    .btn-sm-neon{background:color-mix(in srgb,var(--neon) 15%,transparent);color:var(--neon);border:1px solid color-mix(in srgb,var(--neon) 35%,transparent)}
    .btn-sm-neon:hover{background:color-mix(in srgb,var(--neon) 25%,transparent)}
    .btn-sm-red{background:color-mix(in srgb,#FF4A5A 12%,transparent);color:#FF4A5A;border:1px solid color-mix(in srgb,#FF4A5A 30%,transparent)}
    .btn-sm-ghost{background:transparent;color:var(--text2);border:1px solid var(--border2)}
    .btn-sm-ghost:hover{border-color:var(--neon);color:var(--neon)}

    /* ─ Hero Slider ─ */
    .hero{position:relative;width:100vw;height:100vh;min-height:680px;overflow:hidden;display:flex;align-items:center}
    .hero-slide{position:absolute;inset:0;background-size:cover;background-position:center;opacity:0;transition:opacity 1.2s ease;transform:scale(1.05);animation:none}
    .hero-slide.active{opacity:1;animation:zoomSlide 8s ease-in-out forwards}
    .hero-slide-default{background:linear-gradient(135deg,var(--bg) 0%,var(--bg3) 40%,var(--bg2) 100%)}
    @keyframes zoomSlide{from{transform:scale(1.05)}to{transform:scale(1.12)}}
    .hero-overlay{position:absolute;inset:0;z-index:1;background:linear-gradient(105deg,color-mix(in srgb,var(--bg) 90%,transparent) 0%,color-mix(in srgb,var(--bg) 65%,transparent) 45%,color-mix(in srgb,var(--bg) 25%,transparent) 70%,color-mix(in srgb,var(--bg) 55%,transparent) 100%)}
    .hero-content{position:relative;z-index:2;padding:0 64px;max-width:720px}
    .hero-chip{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;background:color-mix(in srgb,var(--neon) 12%,transparent);border:1px solid color-mix(in srgb,var(--neon) 28%,transparent);border-radius:50px;margin-bottom:24px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--neon);animation:fadeUp .8s .2s both}
    .hero-chip::before{content:'●';font-size:7px;animation:blink 2s infinite}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
    .hero-h1{font-family:'Syne',sans-serif;font-size:clamp(42px,6.5vw,88px);font-weight:800;line-height:1.0;letter-spacing:-2px;margin-bottom:10px;animation:fadeUp .9s .4s both}
    .hero-h1-sub{font-family:'Syne',sans-serif;font-size:clamp(22px,3vw,40px);font-weight:400;color:var(--text2);letter-spacing:-1px;margin-bottom:24px;animation:fadeUp .9s .55s both}
    .hero-desc{font-size:15px;font-weight:300;color:var(--text2);line-height:1.85;margin-bottom:40px;max-width:520px;animation:fadeUp .9s .7s both}
    .hero-btns{display:flex;gap:12px;flex-wrap:wrap;animation:fadeUp .9s .85s both}
    .hero-arrows{position:absolute;bottom:80px;right:64px;z-index:3;display:flex;gap:10px}
    .hero-arrow{width:44px;height:44px;border-radius:50%;border:1.5px solid color-mix(in srgb,var(--neon) 40%,transparent);background:color-mix(in srgb,var(--bg) 60%,transparent);backdrop-filter:blur(8px);color:var(--neon);cursor:none;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all .25s}
    .hero-arrow:hover{border-color:var(--neon);background:color-mix(in srgb,var(--neon) 15%,transparent)}
    .hero-dots{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);z-index:3;display:flex;gap:8px}
    .hero-dot{width:28px;height:3px;border-radius:2px;background:color-mix(in srgb,var(--neon) 30%,transparent);cursor:none;transition:all .4s}
    .hero-dot.act{background:var(--neon);width:44px}
    .hero-scroll{position:absolute;bottom:38px;right:120px;z-index:3;display:flex;flex-direction:column;align-items:center;gap:8px;color:var(--text3);font-size:9px;letter-spacing:2px;text-transform:uppercase}
    .hero-scroll-dot{width:22px;height:36px;border:1.5px solid var(--text3);border-radius:11px;position:relative;display:flex;justify-content:center}
    .hero-scroll-dot::before{content:'';width:4px;height:7px;background:var(--neon);border-radius:2px;position:absolute;top:4px;animation:scrollDot 2s infinite}
    @keyframes scrollDot{0%,100%{top:4px;opacity:1}50%{top:16px;opacity:.3}}
    .hero-slide-counter{position:absolute;top:50%;right:64px;transform:translateY(-50%);z-index:3;writing-mode:vertical-rl;font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;color:var(--text3)}
    .hero-slide-counter span{color:var(--neon)}
    .hero-particles{position:absolute;inset:0;z-index:1;overflow:hidden;pointer-events:none}

    /* Stats band */
    .stats-band{background:var(--bg2);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:44px 64px;display:grid;grid-template-columns:repeat(4,1fr)}
    .stat-box{text-align:center;padding:0 16px;border-right:1px solid var(--border2)}
    .stat-box:last-child{border-right:none}
    .stat-n{font-family:'Syne',sans-serif;font-size:40px;font-weight:800}
    .stat-l{font-size:11px;font-weight:400;color:var(--text2);margin-top:4px;letter-spacing:.5px}

    /* Section */
    .sec{padding:96px 64px}
    .sec-chip{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:50px;margin-bottom:16px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase}
    .chip-1{background:color-mix(in srgb,var(--neon) 12%,transparent);color:var(--neon);border:1px solid color-mix(in srgb,var(--neon) 22%,transparent)}
    .chip-2{background:color-mix(in srgb,var(--orange) 12%,transparent);color:var(--orange);border:1px solid color-mix(in srgb,var(--orange) 22%,transparent)}
    .chip-3{background:color-mix(in srgb,var(--purple) 12%,transparent);color:var(--purple);border:1px solid color-mix(in srgb,var(--purple) 22%,transparent)}
    .chip-4{background:color-mix(in srgb,var(--neon2) 12%,transparent);color:var(--neon2);border:1px solid color-mix(in srgb,var(--neon2) 22%,transparent)}
    .sec-h{font-family:'Syne',sans-serif;font-size:clamp(28px,3.5vw,50px);font-weight:800;letter-spacing:-1.5px;line-height:1.1;margin-bottom:16px}
    .sec-p{font-size:15px;color:var(--text2);line-height:1.9;max-width:520px}

    /* Vehicle card */
    .v-card{background:var(--card);border:1px solid var(--border2);border-radius:12px;overflow:hidden;cursor:none;transition:transform .35s cubic-bezier(.16,1,.3,1),border-color .35s,box-shadow .35s;position:relative}
    .v-card:hover{transform:translateY(-8px);border-color:color-mix(in srgb,var(--neon) 35%,transparent);box-shadow:0 20px 60px color-mix(in srgb,var(--neon) 10%,transparent)}
    .v-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--grad-neon);opacity:0;transition:opacity .35s}
    .v-card:hover::before{opacity:1}
    .v-card-img{position:relative;width:100%;height:210px;overflow:hidden;background:linear-gradient(135deg,var(--bg3),var(--bg4))}
    .v-card-img img{width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.16,1,.3,1)}
    .v-card:hover .v-card-img img{transform:scale(1.06)}
    .v-card-img-ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:72px;background:linear-gradient(135deg,var(--bg3),var(--bg2))}
    .v-card-body{padding:20px}
    .v-card-brand{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--neon);margin-bottom:4px}
    .v-card-name{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;margin-bottom:10px;letter-spacing:-.3px}
    .v-card-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
    .v-card-price{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:var(--neon)}
    .v-card-price-sub{font-size:11px;color:var(--text2);margin-top:2px}
    .v-card-ghs{font-size:11px;color:var(--text2);margin-top:1px}
    .v-card-footer{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-top:1px solid var(--border2)}

    /* Tags / badges */
    .tag{display:inline-block;padding:3px 10px;border-radius:4px;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase}
    .tag-1{background:color-mix(in srgb,var(--neon) 12%,transparent);color:var(--neon);border:1px solid color-mix(in srgb,var(--neon) 22%,transparent)}
    .tag-2{background:color-mix(in srgb,var(--neon2) 12%,transparent);color:var(--neon2);border:1px solid color-mix(in srgb,var(--neon2) 22%,transparent)}
    .tag-3{background:color-mix(in srgb,var(--orange) 12%,transparent);color:var(--orange);border:1px solid color-mix(in srgb,var(--orange) 22%,transparent)}
    .tag-4{background:color-mix(in srgb,var(--purple) 12%,transparent);color:var(--purple);border:1px solid color-mix(in srgb,var(--purple) 22%,transparent)}
    .tag-g{background:color-mix(in srgb,#00E564 12%,transparent);color:#00E564;border:1px solid color-mix(in srgb,#00E564 22%,transparent)}
    .tag-dim{background:color-mix(in srgb,var(--text3) 10%,transparent);color:var(--text2);border:1px solid var(--border2)}

    /* Filter */
    .filter-bar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:36px}
    .ftag{padding:8px 20px;border-radius:50px;background:transparent;border:1.5px solid var(--border2);color:var(--text2);font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;cursor:none;transition:all .25s}
    .ftag.act,.ftag:hover{border-color:var(--neon);color:var(--neon);background:color-mix(in srgb,var(--neon) 7%,transparent)}

    /* Grid */
    .car-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:22px}

    /* Services */
    .svc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:56px}
    .svc-card{background:var(--card);border:1px solid var(--border2);border-radius:12px;padding:34px 26px;cursor:none;position:relative;overflow:hidden;transition:transform .35s,border-color .35s}
    .svc-card:hover{transform:translateY(-6px);border-color:color-mix(in srgb,var(--neon) 28%,transparent)}
    .svc-icon{width:60px;height:60px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:22px}
    .svc-name{font-family:'Syne',sans-serif;font-size:17px;font-weight:700;margin-bottom:10px}
    .svc-desc{font-size:13px;color:var(--text2);line-height:1.8}

    /* Testimonials */
    .testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:48px}
    .testi-card{background:var(--card);border:1px solid var(--border2);border-radius:12px;padding:28px;position:relative}
    .testi-card::before{content:'❝';position:absolute;top:16px;right:20px;font-size:48px;color:var(--neon);opacity:.15;line-height:1;font-family:Georgia,serif}
    .testi-stars{color:var(--neon);font-size:13px;margin-bottom:12px;letter-spacing:2px}
    .testi-text{font-size:14px;color:var(--text2);line-height:1.85;font-style:italic;margin-bottom:20px}
    .testi-name{font-family:'Syne',sans-serif;font-weight:700;font-size:13px}
    .testi-role{font-size:11px;color:var(--text3);margin-top:2px}

    /* Inputs */
    .inp{width:100%;padding:12px 16px;background:var(--bg4);border:1.5px solid var(--border2);color:var(--text);font-family:'Outfit',sans-serif;font-size:13px;font-weight:300;border-radius:6px;outline:none;transition:border-color .25s}
    .inp:focus{border-color:var(--neon)}
    .inp::placeholder{color:var(--text3)}
    select.inp{cursor:none}
    select.inp option{background:var(--bg3)}
    textarea.inp{resize:vertical}
    .lbl{display:block;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text2);margin-bottom:7px}
    .fg{margin-bottom:16px}
    .frow{display:grid;grid-template-columns:1fr 1fr;gap:14px}

    /* Color picker */
    .color-swatch{width:36px;height:36px;border-radius:8px;border:2px solid var(--border);cursor:none;overflow:hidden;flex-shrink:0;transition:transform .2s}
    .color-swatch:hover{transform:scale(1.1)}
    .color-swatch input[type=color]{width:200%;height:200%;border:none;padding:0;margin:-25%;cursor:none;transform:scale(.5)}
    .theme-group{background:var(--bg3);border:1px solid var(--border2);border-radius:10px;padding:20px;margin-bottom:14px}
    .theme-group-title{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--neon);margin-bottom:14px}
    .theme-color-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px}
    .theme-color-item{display:flex;flex-direction:column;gap:6px}
    .theme-color-lbl{font-size:9px;color:var(--text3);letter-spacing:.5px}
    .theme-color-pick{display:flex;align-items:center;gap:8px}
    .theme-color-hex{font-size:10px;color:var(--text2);font-family:monospace;background:var(--bg4);border:1px solid var(--border2);border-radius:4px;padding:3px 7px}
    .preset-btn{padding:8px 16px;border-radius:8px;border:1.5px solid var(--border2);background:transparent;color:var(--text2);font-size:11px;font-weight:600;cursor:none;transition:all .25s;font-family:'Outfit',sans-serif}
    .preset-btn:hover,.preset-btn.act{border-color:var(--neon);color:var(--neon);background:color-mix(in srgb,var(--neon) 8%,transparent)}

    /* Image uploader */
    .img-zone{border:2px dashed var(--border2);border-radius:8px;padding:24px;text-align:center;cursor:none;transition:border-color .25s;background:var(--bg4)}
    .img-zone:hover{border-color:var(--neon)}
    .img-zone input{display:none}
    .img-thumbs{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
    .img-thumb{width:72px;height:54px;border-radius:6px;overflow:hidden;position:relative;border:1px solid var(--border2)}
    .img-thumb img{width:100%;height:100%;object-fit:cover}
    .img-thumb-del{position:absolute;top:2px;right:2px;width:17px;height:17px;background:rgba(255,50,70,.9);border:none;border-radius:50%;color:white;font-size:9px;cursor:none;display:flex;align-items:center;justify-content:center}

    /* Vehicle detail */
    .vd-wrap{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start;padding:96px 64px}
    .vd-gallery{position:sticky;top:86px}
    .vd-main{width:100%;aspect-ratio:16/10;border-radius:14px;overflow:hidden;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:110px;border:1px solid var(--border2);margin-bottom:10px}
    .vd-main img{width:100%;height:100%;object-fit:cover}
    .vd-thumbs{display:flex;gap:8px}
    .vd-thumb{width:72px;height:52px;border-radius:6px;overflow:hidden;cursor:none;border:1.5px solid transparent;transition:border-color .25s;background:var(--bg4);display:flex;align-items:center;justify-content:center;font-size:20px}
    .vd-thumb.act{border-color:var(--neon)}
    .vd-thumb img{width:100%;height:100%;object-fit:cover}
    .spec-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border2);border:1px solid var(--border2);border-radius:8px;overflow:hidden;margin:22px 0}
    .spec-item{padding:13px 17px;background:var(--bg3)}
    .spec-lbl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--text2)}
    .spec-val{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;margin-top:3px}
    .price-box{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:26px;margin:22px 0}
    .price-box-title{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text2);margin-bottom:14px}
    .price-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border2)}
    .price-row:last-child{border-bottom:none;padding-top:14px}
    .price-row-lbl{font-size:13px;color:var(--text2)}
    .price-row-val{font-family:'Syne',sans-serif;font-size:14px;font-weight:700}
    .price-row.total .price-row-val{font-size:20px;color:var(--neon)}

    /* Tracking */
    .track-line{position:relative;padding-left:36px}
    .track-line::before{content:'';position:absolute;left:10px;top:4px;bottom:4px;width:1.5px;background:var(--border2)}
    .track-step{position:relative;padding-bottom:30px}
    .track-dot{position:absolute;left:-36px;top:2px;width:22px;height:22px;border-radius:50%;border:1.5px solid var(--border2);background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:9px}
    .track-dot.done{border-color:var(--neon);background:color-mix(in srgb,var(--neon) 12%,transparent);color:var(--neon)}
    .track-dot.active{border-color:var(--neon);background:var(--neon);color:var(--btn-text);box-shadow:0 0 16px color-mix(in srgb,var(--neon) 55%,transparent);animation:tpulse 2s infinite}
    @keyframes tpulse{0%,100%{box-shadow:0 0 14px color-mix(in srgb,var(--neon) 50%,transparent)}50%{box-shadow:0 0 28px color-mix(in srgb,var(--neon) 80%,transparent)}}

    /* Modal */
    .mo{position:fixed;inset:0;background:color-mix(in srgb,var(--bg) 82%,transparent);backdrop-filter:blur(14px);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px}
    .mo-box{background:var(--bg2);border:1px solid var(--border);border-radius:16px;width:100%;max-width:660px;max-height:92vh;overflow-y:auto}
    .mo-hd{padding:26px 30px;border-bottom:1px solid var(--border2);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--bg2);z-index:1}
    .mo-title{font-family:'Syne',sans-serif;font-size:19px;font-weight:800}
    .mo-body{padding:26px 30px}
    .mo-ft{padding:18px 30px;border-top:1px solid var(--border2);display:flex;justify-content:flex-end;gap:10px;position:sticky;bottom:0;background:var(--bg2)}

    /* Alert */
    .alert{padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:12px;font-weight:600}
    .al-ok{background:color-mix(in srgb,var(--neon) 10%,transparent);border:1px solid color-mix(in srgb,var(--neon) 30%,transparent);color:var(--neon)}
    .al-er{background:color-mix(in srgb,#FF4A5A 10%,transparent);border:1px solid color-mix(in srgb,#FF4A5A 30%,transparent);color:#FF4A5A}
    .al-in{background:color-mix(in srgb,var(--neon2) 10%,transparent);border:1px solid color-mix(in srgb,var(--neon2) 30%,transparent);color:var(--neon2)}

    /* Progress */
    .prog-bar{height:4px;background:var(--bg4);border-radius:2px;overflow:hidden}
    .prog-fill{height:100%;background:var(--grad-neon);border-radius:2px;transition:width 1.2s cubic-bezier(.16,1,.3,1)}

    /* Toggle */
    .tgl-wrap{display:flex;align-items:center;gap:10px}
    .tgl{width:44px;height:24px;background:var(--bg4);border-radius:12px;border:1.5px solid var(--border2);position:relative;cursor:none;transition:all .25s;flex-shrink:0}
    .tgl.on{background:color-mix(in srgb,var(--neon) 20%,transparent);border-color:var(--neon)}
    .tgl::before{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;background:var(--text3);border-radius:50%;transition:transform .25s,background .25s}
    .tgl.on::before{transform:translateX(20px);background:var(--neon)}
    .tgl-lbl{font-size:12px;color:var(--text2);font-weight:500}

    /* Admin */
    .adm-wrap{display:flex;min-height:100vh}
    .adm-side{width:250px;flex-shrink:0;background:var(--bg2);border-right:1px solid var(--border);position:fixed;top:0;left:0;bottom:0;display:flex;flex-direction:column;z-index:100;overflow-y:auto}
    .adm-side-hd{padding:22px 18px;border-bottom:1px solid var(--border)}
    .adm-side-logo{font-family:'Syne',sans-serif;font-size:15px;font-weight:800}
    .adm-side-logo span{color:var(--neon)}
    .adm-side-tag{font-size:9px;color:var(--text3);margin-top:2px;letter-spacing:1.5px;text-transform:uppercase}
    .adm-sec-lbl{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text3);padding:14px 18px 6px}
    .adm-link{display:flex;align-items:center;gap:10px;padding:10px 18px;color:var(--text2);font-size:12px;font-weight:500;cursor:none;background:none;border:none;width:100%;text-align:left;transition:all .2s;border-left:2px solid transparent;letter-spacing:.3px}
    .adm-link:hover,.adm-link.act{color:var(--neon);background:color-mix(in srgb,var(--neon) 6%,transparent);border-left-color:var(--neon)}
    .adm-main{margin-left:250px;flex:1;padding:34px;min-height:100vh;background:var(--bg)}
    .adm-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;padding-bottom:18px;border-bottom:1px solid var(--border2)}
    .adm-pg-title{font-family:'Syne',sans-serif;font-size:22px;font-weight:800}
    .adm-table{width:100%;border-collapse:collapse}
    .adm-table th{text-align:left;padding:10px 14px;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--text3);background:var(--bg2);border-bottom:1px solid var(--border2)}
    .adm-table td{padding:12px 14px;font-size:12px;border-bottom:1px solid color-mix(in srgb,var(--border) 40%,transparent);color:var(--text2)}
    .adm-table tr:hover td{background:var(--bg2)}
    .adm-card{background:var(--bg2);border:1px solid var(--border2);border-radius:10px;padding:22px;margin-bottom:16px}
    .dash-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px}
    .dc{background:var(--bg2);border:1px solid var(--border2);border-radius:10px;padding:22px;position:relative;overflow:hidden}
    .dc-icon{font-size:22px;margin-bottom:10px}
    .dc-val{font-family:'Syne',sans-serif;font-size:28px;font-weight:800}
    .dc-lbl{font-size:10px;color:var(--text2);margin-top:3px;letter-spacing:.5px}
    .dc-chg{font-size:11px;margin-top:6px}

    /* Login */
    .login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;background:var(--bg);overflow:hidden}
    .login-glow{position:absolute;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--neon) 6%,transparent) 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%)}
    .login-card{position:relative;width:420px;background:var(--bg2);border:1px solid var(--border);border-radius:20px;padding:50px 42px}
    .login-title{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;text-align:center;margin-bottom:4px}
    .login-sub{text-align:center;font-size:11px;color:var(--neon);font-weight:700;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:36px}

    /* Footer */
    .footer{background:var(--footer-bg);border-top:1px solid var(--border);padding:68px 64px 34px}
    .footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:50px;margin-bottom:48px}
    .footer-brand{font-family:'Syne',sans-serif;font-size:19px;font-weight:800;margin-bottom:12px}
    .footer-brand span{color:var(--neon)}
    .footer-desc{font-size:13px;color:var(--text2);line-height:1.8;margin-bottom:18px}
    .footer-hd{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--neon);margin-bottom:14px}
    .footer-links{list-style:none;display:flex;flex-direction:column;gap:10px}
    .footer-links a{font-size:13px;color:var(--text2);text-decoration:none;cursor:none;transition:color .25s}
    .footer-links a:hover{color:var(--neon)}
    .footer-bot{border-top:1px solid var(--border2);padding-top:24px;display:flex;align-items:center;justify-content:space-between}
    .footer-copy{font-size:11px;color:var(--text3)}
    .admin-ghost{font-size:10px;color:var(--text3);cursor:none;background:none;border:none;opacity:.2;letter-spacing:1px;text-transform:uppercase;transition:opacity .3s,color .3s;font-family:'Outfit',sans-serif}
    .admin-ghost:hover{opacity:1;color:var(--neon)}

    /* WhatsApp float */
    .wa-float{position:fixed;bottom:28px;right:28px;z-index:9000;width:56px;height:56px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:none;border:none;box-shadow:0 4px 20px rgba(37,211,102,.45);transition:transform .3s,box-shadow .3s;animation:waPulse 3s 2s infinite}
    .wa-float:hover{transform:scale(1.12);box-shadow:0 8px 32px rgba(37,211,102,.6)}
    @keyframes waPulse{0%,100%{box-shadow:0 4px 20px rgba(37,211,102,.45)}50%{box-shadow:0 4px 32px rgba(37,211,102,.7),0 0 0 10px rgba(37,211,102,.1)}}
    .wa-tooltip{position:absolute;right:66px;top:50%;transform:translateY(-50%);background:var(--bg2);border:1px solid var(--border);color:var(--text);font-size:11px;font-weight:600;white-space:nowrap;padding:7px 12px;border-radius:6px;opacity:0;pointer-events:none;transition:opacity .25s}
    .wa-float:hover .wa-tooltip{opacity:1}

    /* Currency badge */
    .ghs-badge{font-size:10px;color:var(--text3);background:color-mix(in srgb,var(--text3) 8%,transparent);border:1px solid var(--border2);border-radius:4px;padding:2px 7px;display:inline-block;margin-top:2px}

    /* Social btn */
    .social-btn{width:36px;height:36px;border-radius:8px;border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:13px;cursor:none;transition:border-color .25s,background .25s}
    .social-btn:hover{border-color:var(--neon);background:color-mix(in srgb,var(--neon) 8%,transparent)}

    /* Slide hero admin list */
    .slide-item{display:flex;align-items:center;gap:12px;padding:12px;border:1px solid var(--border2);border-radius:8px;margin-bottom:8px;background:var(--bg3)}
    .slide-thumb{width:64px;height:44px;border-radius:5px;object-fit:cover;border:1px solid var(--border2)}
    .slide-thumb-ph{width:64px;height:44px;border-radius:5px;background:var(--bg4);display:flex;align-items:center;justify-content:center;font-size:22px;border:1px solid var(--border2)}

    /* ── Hamburger nav drawer ── */
    .nav-burger{display:none;flex-direction:column;justify-content:center;gap:5px;width:44px;height:44px;padding:8px;background:none;border:none;cursor:pointer;border-radius:8px;transition:background .2s;flex-shrink:0}
    .nav-burger:hover{background:color-mix(in srgb,var(--neon) 10%,transparent)}
    .nav-burger span{display:block;width:22px;height:2px;background:var(--text);border-radius:2px;transition:transform .3s,opacity .3s}
    .nav-burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
    .nav-burger.open span:nth-child(2){opacity:0}
    .nav-burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
    .nav-drawer{display:none}

    /* ── Mobile admin ── */
    .adm-mobile-nav{display:none}
    .adm-saving-bar{position:fixed;top:0;left:0;right:0;height:3px;background:var(--grad-neon);z-index:9999;animation:saveProg .8s ease-in-out infinite alternate}
    @keyframes saveProg{from{opacity:.5;transform:scaleX(.7)}to{opacity:1;transform:scaleX(1)}}
    .adm-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;border-radius:10px}

    /* ── Safe-area / touch globals ── */
    .ann-bar{padding-top:max(9px,env(safe-area-inset-top))}
    .wa-float{cursor:pointer}
    button,a,[role=button]{-webkit-tap-highlight-color:transparent}

    /* ── 1100px tablet ── */
    @media(max-width:1100px){
      .nav,.nav.sc{padding:14px 28px}
      .sec{padding:68px 28px}
      .stats-band{padding:34px 28px;grid-template-columns:repeat(2,1fr);gap:18px}
      .stat-box{border-right:none;border-bottom:1px solid var(--border2);padding-bottom:18px}
      .svc-grid{grid-template-columns:1fr 1fr}
      .testi-grid{grid-template-columns:1fr}
      .footer-grid{grid-template-columns:1fr 1fr;gap:32px}
      .vd-wrap{grid-template-columns:1fr;gap:32px;padding:68px 28px}
      .dash-grid{grid-template-columns:repeat(2,1fr)}
      .adm-main{margin-left:0;padding:20px}
      .adm-side{display:none}
      .frow{grid-template-columns:1fr}
      .hero-content{padding:0 28px}
      .hero-slide-counter{display:none}
    }

    /* ── 768px mobile ── */
    @media(max-width:768px){
      /* nav */
      .nav,.nav.sc{padding:12px 18px}
      .nav-links,.nav>.btn-p{display:none}
      .nav-burger{display:flex}
      /* drawer */
      .nav-drawer{display:flex;flex-direction:column;position:fixed;inset:0;background:var(--bg);z-index:990;padding:80px 28px 40px;gap:6px;transform:translateX(100%);transition:transform .35s cubic-bezier(.16,1,.3,1);overflow-y:auto}
      .nav-drawer.open{transform:none}
      .nav-drawer-link{display:flex;align-items:center;padding:16px 0;font-size:18px;font-weight:600;color:var(--text);border-bottom:1px solid var(--border2);text-decoration:none;cursor:pointer;background:none;border-left:none;border-right:none;border-top:none;text-align:left;width:100%;font-family:'Outfit',sans-serif;transition:color .2s;-webkit-tap-highlight-color:transparent}
      .nav-drawer-link:hover{color:var(--neon)}
      .nav-drawer-cta{margin-top:24px;width:100%;justify-content:center;padding:16px;font-size:14px}
      /* hero */
      .hero{min-height:100svh;min-height:100vh}
      .hero-content{padding:0 20px;max-width:100%}
      .hero-h1{font-size:clamp(36px,9vw,56px);letter-spacing:-1px}
      .hero-h1-sub{font-size:clamp(16px,4.5vw,26px);margin-bottom:18px}
      .hero-desc{font-size:14px;margin-bottom:28px}
      .hero-btns{flex-direction:column;gap:10px}
      .hero-btns .btn-p,.hero-btns .btn-o,.hero-btns .btn-or{width:100%;justify-content:center;padding:14px 20px;font-size:13px}
      .hero-arrows{right:50%;transform:translateX(50%);bottom:54px;gap:16px}
      .hero-arrow{width:52px;height:52px;font-size:16px}
      .hero-scroll{display:none}
      .hero-dots{bottom:24px}
      /* sections */
      .sec{padding:52px 18px}
      .sec-h{font-size:clamp(24px,6vw,36px)}
      /* stats */
      .stats-band{grid-template-columns:1fr 1fr;padding:24px 18px;gap:12px}
      .stat-n{font-size:28px}
      /* grids */
      .car-grid{grid-template-columns:1fr}
      .svc-grid{grid-template-columns:1fr}
      .footer-grid{grid-template-columns:1fr}
      /* testimonials horizontal scroll */
      .testi-grid{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;padding-bottom:8px}
      .testi-grid::-webkit-scrollbar{display:none}
      .testi-card{flex-shrink:0;width:80vw;max-width:320px;scroll-snap-align:start}
      /* vehicle card touch */
      .v-card:active{transform:scale(.98)}
      .v-card-footer .btn-p,.v-card-footer .btn-o{padding:10px 14px;font-size:11px}
      /* buttons — larger touch targets */
      .btn-p,.btn-o,.btn-or{min-height:44px;cursor:pointer}
      .btn-sm{min-height:36px;cursor:pointer}
      /* all cursors → pointer on mobile */
      *{cursor:pointer}
      .cursor-el{display:none!important}
      /* footer */
      .footer-grid{gap:28px}
      .footer-copy{text-align:center}
      .footer-socials{justify-content:center}
      .social-btn{width:44px;height:44px}
      /* WhatsApp */
      .wa-float{bottom:calc(90px + env(safe-area-inset-bottom));right:18px;width:52px;height:52px}
      /* vehicle detail */
      .vd-wrap{padding:32px 18px;gap:24px}
      /* inputs — min 16px prevents iOS zoom */
      input,select,textarea{font-size:16px!important}
      .inp{min-height:44px;padding:12px 14px}
      /* admin */
      .adm-mobile-nav{display:flex;position:fixed;bottom:0;left:0;right:0;background:var(--bg2);border-top:1px solid var(--border);z-index:200;padding:6px 0;padding-bottom:calc(6px + env(safe-area-inset-bottom));gap:0}
      .adm-mob-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:none;cursor:pointer;color:var(--text2);font-size:8px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;padding:5px 2px;transition:color .2s;min-width:0;-webkit-tap-highlight-color:transparent}
      .adm-mob-btn.act{color:var(--neon)}
      .adm-mob-btn-ico{font-size:21px;line-height:1}
      .adm-main{padding:14px 14px 90px!important;margin-left:0!important}
      .adm-hd{flex-wrap:wrap;gap:10px}
      .adm-pg-title{font-size:18px}
      .dash-grid{grid-template-columns:1fr 1fr!important}
      .dc-val{font-size:22px}
      .adm-card{padding:14px}
      .frow{grid-template-columns:1fr!important}
      /* bottom sheet modals */
      .mo{align-items:flex-end!important;padding:0!important}
      .mo-box{max-width:100%!important;width:100%!important;margin:0!important;border-radius:20px 20px 0 0!important;position:fixed!important;bottom:0!important;left:0!important;right:0!important;max-height:92vh!important;overflow-y:auto}
      .mo-box::before{content:'';display:block;width:36px;height:4px;background:var(--border2);border-radius:2px;margin:12px auto 4px}
    }

    /* ── 480px small phones ── */
    @media(max-width:480px){
      .hero-h1{font-size:clamp(30px,10vw,44px)}
      .stats-band{grid-template-columns:1fr 1fr}
      .dash-grid{grid-template-columns:1fr!important}
      .v-card-img{height:180px}
      .sec{padding:44px 16px}
      .testi-card{width:88vw}
    }
  `}</style>
);

// ─────────────────────────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────────────────────────
const SETTINGS0 = {
  companyName: "Jaybesin Autos", tagline: "China's Finest. West Africa's Pride.",
  email: "info@jaybesin.com", phone: "+233 XX XXX XXXX", whatsapp: "+233XXXXXXXXX",
  address: "Accra, Greater Accra, Ghana", logo: null,
  showPricesGlobal: true, ghsRate: 16.2,
  showGhsPrice: true,
  annBarText: "🚗 Now taking Pre-Orders for 2025 — Limited slots available. ", annBarLink: "", annBarOn: true,
  heroSlides: [{ id: 1, image: null, label: "Welcome to Jaybesin Autos" }],
  theme: DEFAULT_THEME,
  testimonials: [
    { id: 1, name: "Kwame Asante", role: "Accra, Ghana", text: "Jaybesin Autos made the whole process seamless. My BYD Han arrived in perfect condition, duties were handled professionally. Highly recommend!", stars: 5 },
    { id: 2, name: "Abena Mensah", role: "Kumasi, Ghana", text: "Fantastic service. The team guided me through every step. I'm now driving a Haval H6 and saving 40% on fuel costs versus my old petrol car.", stars: 5 },
    { id: 3, name: "Kofi Darko", role: "Takoradi, Ghana", text: "Pre-ordered my Tank 500 and the tracking system kept me updated throughout. Arrived ahead of schedule. Exceptional business.", stars: 5 },
  ],
};

const VEHICLES0 = [
  { id: 1, brand: "Xiaomi", model: "SU7", year: 2024, type: "Saloon", fuel: "Electric", drivetrain: "AWD", price: 38500, duties: 9625, totalGhana: 48125, availability: "preorder", showPrice: true, description: "China's answer to the Tesla Model S. Ultra-sleek, loaded with tech, breathtakingly fast.", specs: { range: "730km", power: "495hp", acceleration: "0–100 in 2.78s", battery: "101kWh" }, images: [], logo: null, emoji: "⚡", featured: true },
  { id: 2, brand: "BYD", model: "Han EV", year: 2023, type: "Saloon", fuel: "Electric", drivetrain: "AWD", price: 29900, duties: 7475, totalGhana: 37375, availability: "preorder", showPrice: true, description: "BYD's flagship luxury sedan with Blade Battery technology and premium interior.", specs: { range: "605km", power: "517hp", acceleration: "0–100 in 3.9s", battery: "85.4kWh" }, images: [], logo: null, emoji: "🚗", featured: true },
  { id: 3, brand: "Haval", model: "H6 HEV", year: 2023, type: "SUV", fuel: "Hybrid", drivetrain: "2WD", price: 22500, duties: 5625, totalGhana: 28125, availability: "in_stock", showPrice: true, description: "China's best-selling SUV. Refined, spacious, incredibly fuel-efficient.", specs: { range: "1050km", power: "243hp", acceleration: "0–100 in 7.7s", engine: "1.5T+Motor" }, images: [], logo: null, emoji: "🚙", featured: false },
  { id: 4, brand: "Tank", model: "500 HEV", year: 2024, type: "4x4", fuel: "Hybrid", drivetrain: "4WD", price: 58000, duties: 14500, totalGhana: 72500, availability: "preorder", showPrice: true, description: "China's Range Rover — commanding, powerful, and lavish.", specs: { range: "900km", power: "342hp+Motor", acceleration: "0–100 in 5.8s", engine: "3.0T V6" }, images: [], logo: null, emoji: "🦁", featured: true },
  { id: 5, brand: "Chery", model: "Tiggo 8 Pro", year: 2023, type: "SUV", fuel: "Gasoline", drivetrain: "AWD", price: 18500, duties: 4625, totalGhana: 23125, availability: "in_stock", showPrice: true, description: "Seven-seater family SUV with Italian-designed interior.", specs: { range: "550km", power: "197hp", acceleration: "0–100 in 7.9s", engine: "1.6T" }, images: [], logo: null, emoji: "🚐", featured: false },
  { id: 6, brand: "Geely", model: "Monjaro", year: 2023, type: "SUV", fuel: "Gasoline", drivetrain: "AWD", price: 26000, duties: 6500, totalGhana: 32500, availability: "preorder", showPrice: true, description: "Premium crossover with Volvo-derived technology.", specs: { range: "600km", power: "238hp", acceleration: "0–100 in 7.6s", engine: "2.0T" }, images: [], logo: null, emoji: "🏔️", featured: false },
];
const CHARGING0 = [{ id: 1, name: "AC Home 7kW", brand: "BYD", type: "AC", power: "7kW", price: 850, installation: 350, emoji: "🔌" }, { id: 2, name: "DC Fast 60kW", brand: "CATL", type: "DC Fast", power: "60kW", price: 8500, installation: 2200, emoji: "⚡" }, { id: 3, name: "AC Commercial 22kW", brand: "Huawei", type: "AC", power: "22kW", price: 2400, installation: 800, emoji: "🏢" }];
const PARTS0 = [{ id: 1, name: "BYD Blade Battery Cell", compatible: "BYD Han / Atto 3", category: "Battery", price: 1200, emoji: "🔋" }, { id: 2, name: "Haval H6 Front Bumper", compatible: "Haval H6 2020-2023", category: "Body", price: 380, emoji: "🚗" }, { id: 3, name: "Geely Brake Pads Set", compatible: "Geely Coolray / Monjaro", category: "Brakes", price: 95, emoji: "🛑" }, { id: 4, name: "Universal TPMS Sensors 4pc", compatible: "Universal", category: "Electronics", price: 120, emoji: "📡" }];
const ORDERS0 = [{ id: "ACG-2024-001", customer: "Kwame Mensah", email: "kwame@example.com", phone: "+233 244 123 456", item: "Tank 500 HEV", type: "vehicle", amount: 72500, status: "ocean_freight", date: "2024-11-15", tracking: [{ step: "Order Confirmed", done: true, date: "Nov 15, 2024" }, { step: "Payment Received", done: true, date: "Nov 16, 2024" }, { step: "Sourcing in China", done: true, date: "Nov 20, 2024" }, { step: "Port Clearance (China)", done: true, date: "Dec 02, 2024" }, { step: "Ocean Freight", done: false, active: true, date: "Est. Dec 20, 2024" }, { step: "Arrival at Tema Port", done: false, date: "Est. Jan 08, 2025" }, { step: "Ghana Customs & Duties", done: false, date: "Est. Jan 14, 2025" }, { step: "Ready for Collection", done: false, date: "Est. Jan 20, 2025" }] }];
const INQUIRIES0 = [{ id: 1, name: "Ama Owusu", email: "ama@gmail.com", phone: "+233 20 555 1234", subject: "BYD Han EV availability", message: "I'd love to know when the BYD Han EV will be in stock. What are the financing options?", date: "2024-12-01", status: "new", type: "vehicle" }, { id: 2, name: "Kwabena Boateng", email: "kb@corp.com", phone: "+233 54 888 9999", subject: "EV Charging for Office", message: "We need 3 × 22kW chargers installed at our corporate HQ.", date: "2024-12-03", status: "replied", type: "charging" }];

// ─── UTILS ────────────────────────────────────────────────────────
const fmtUSD = (n) => n ? `$${Number(n).toLocaleString()}` : "Price on Request";
const fmtGHS = (n, rate) => n ? `GH₵ ${(n * rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "";
function fuelTag(f) { if (f === "Electric") return <span className="tag tag-2">⚡ Electric</span>; if (f === "Hybrid") return <span className="tag tag-1">🔋 Hybrid</span>; return <span className="tag tag-3">⛽ Gasoline</span> }
function availTag(a) { return a === "in_stock" ? <span className="tag tag-g">✓ In Stock</span> : <span className="tag tag-dim">Pre-Order</span> }

// ─── IMAGE UPLOADER ───────────────────────────────────────────────
function ImgUp({ images = [], onChange, label = "Upload Images", multiple = true, single = false }) {
  const ref = useRef();
  const handle = (e) => {
    Array.from(e.target.files).forEach(f => {
      const r = new FileReader();
      r.onload = ev => {
        if (single) onChange([ev.target.result]);
        else onChange(prev => [...(prev || []), ev.target.result]);
      };
      r.readAsDataURL(f);
    });
    e.target.value = "";
  };
  const remove = (i) => onChange((images || []).filter((_, idx) => idx !== i));
  return (
    <div>
      <label className="lbl">{label}</label>
      <div className="img-zone" onClick={() => ref.current.click()}>
        <input ref={ref} type="file" accept="image/*" multiple={multiple && !single} onChange={handle} />
        <div style={{ fontSize: "24px", marginBottom: "6px" }}>📁</div>
        <div style={{ fontSize: "12px", color: "var(--text2)" }}>Click to {images?.length ? "add more " : ""}upload</div>
      </div>
      {images && images.length > 0 && (
        <div className="img-thumbs">
          {images.map((src, i) => (
            <div key={i} className="img-thumb">
              <img src={src} alt="" />
              <button className="img-thumb-del" onClick={e => { e.stopPropagation(); remove(i) }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TOGGLE ───────────────────────────────────────────────────────
function Tgl({ on, onChange, label }) {
  return (
    <div className="tgl-wrap">
      <div className={`tgl${on ? " on" : ""}`} onClick={onChange} />
      {label && <span className="tgl-lbl">{label}</span>}
    </div>
  );
}

// ─── COLOR PICKER ROW ─────────────────────────────────────────────
function ColorPick({ label, value, onChange }) {
  return (
    <div className="theme-color-item">
      <div className="theme-color-lbl">{label}</div>
      <div className="theme-color-pick">
        <div className="color-swatch">
          <input type="color" value={value} onChange={e => onChange(e.target.value)} />
        </div>
        <span className="theme-color-hex">{value}</span>
      </div>
    </div>
  );
}

// ─── CURSOR ───────────────────────────────────────────────────────
function Cursor() {
  const c = useRef(), r = useRef();
  const [hov, setHov] = useState(false);
  useEffect(() => {
    const mv = e => { if (c.current) { c.current.style.left = e.clientX + "px"; c.current.style.top = e.clientY + "px" } if (r.current) { r.current.style.left = e.clientX + "px"; r.current.style.top = e.clientY + "px" } };
    document.addEventListener("mousemove", mv);
    return () => document.removeEventListener("mousemove", mv);
  }, []);
  return <><div className="cur" ref={c} /><div className={`cur-ring${hov ? " hov" : ""}`} ref={r} /></>;
}

// ─── REVEAL ───────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) e.target.classList.add("on") }) }, { threshold: .1 });
    document.querySelectorAll(".rv,.rvL,.rvR").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

// ─── PARTICLES ────────────────────────────────────────────────────
function Particles() {
  const pts = Array.from({ length: 16 }, (_, i) => ({ x: Math.random() * 100, y: Math.random() * 100, s: Math.random() * 2 + .5, d: Math.random() * 5, dur: Math.random() * 6 + 6, c: i % 3 === 0 ? "neon" : i % 3 === 1 ? "neon2" : "orange" }));
  return (
    <div className="hero-particles">
      {pts.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: `${p.s}px`, height: `${p.s}px`, borderRadius: "50%", background: `var(--${p.c})`, opacity: .5, animation: `float${i % 3} ${p.dur}s ${p.d}s infinite ease-in-out` }} />
      ))}
      <style>{`@keyframes float0{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}@keyframes float1{0%,100%{transform:translateY(0) translateX(0)}50%{transform:translateY(-12px) translateX(8px)}}@keyframes float2{0%,100%{transform:translateY(0)}33%{transform:translateY(-8px)}66%{transform:translateY(-16px)}}`}</style>
    </div>
  );
}

// ─── HERO SLIDER ──────────────────────────────────────────────────
function HeroSlider({ slides = [], onExplore, onQuote }) {
  const [cur, setCur] = useState(0);
  const timer = useRef();
  const total = slides.length || 1;

  const next = useCallback(() => setCur(c => (c + 1) % total), [total]);
  const prev = () => setCur(c => (c - 1 + total) % total);

  useEffect(() => {
    timer.current = setInterval(next, 6000);
    return () => clearInterval(timer.current);
  }, [next]);

  const go = (i) => { clearInterval(timer.current); setCur(i); timer.current = setInterval(next, 6000) };

  return (
    <>
      {/* Slides */}
      {Array.from({ length: total }, (_, i) => {
        const slide = slides[i] || {};
        return (
          <div key={i} className={`hero-slide${!slide.image ? " hero-slide-default" : ""}${i === cur ? " active" : ""}`}
            style={slide.image ? { backgroundImage: `url(${slide.image})` } : {}}
          />
        );
      })}

      <div className="hero-overlay" />
      <Particles />

      <div className="hero-content">
        <div className="hero-chip">China's #1 Auto Importer in Ghana</div>
        <h1 className="hero-h1"><span className="gt-neon">Jaybesin</span><br />Autos</h1>
        <div className="hero-h1-sub">China's Finest. West Africa's Pride.</div>
        <p className="hero-desc">Premium second-hand vehicles sourced from China — Electric, Hybrid, SUVs, 4×4s and Saloons — delivered to your doorstep in Ghana and across West Africa.</p>
        <div className="hero-btns">
          <button className="btn-p" onClick={onExplore}>Explore Our Garage →</button>
          <button className="btn-o" onClick={onQuote}><span>Get Custom Quote</span></button>
        </div>
      </div>

      {/* Slide counter */}
      <div className="hero-slide-counter"><span>{String(cur + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")}</div>

      {/* Arrows */}
      {total > 1 && (
        <div className="hero-arrows">
          <button className="hero-arrow" onClick={prev}>←</button>
          <button className="hero-arrow" onClick={next}>→</button>
        </div>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className="hero-dots">
          {Array.from({ length: total }, (_, i) => (
            <div key={i} className={`hero-dot${i === cur ? " act" : ""}`} onClick={() => go(i)} />
          ))}
        </div>
      )}

      <div className="hero-scroll"><div className="hero-scroll-dot" />Scroll</div>
    </>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────
function Nav({ setPage, settings, annOn }) {
  const [sc, setSc] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
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
    ["Garage", "garage"], ["EV Charging", "charging"],
    ["Spare Parts", "parts"], ["Track Order", "track"], ["Contact", "contact"],
  ];
  const go = (p) => { setPage(p); setDrawerOpen(false); };
  const parts = settings.companyName.split(" ");
  return (
    <>
      <nav className={`nav${sc ? " sc" : ""}`} style={{ top: annOn ? "38px" : "0" }}>
        <div className="nav-logo" onClick={() => go("home")} style={{ cursor: "pointer" }}>
          {settings.logo
            ? <img src={settings.logo} style={{ width: 36, height: 36, borderRadius: 8, objectFit: "contain" }} alt="" />
            : <div className="nav-logo-mark">{parts[0][0]}</div>}
          <div className="nav-brand"><span>{parts[0]}</span>{parts.slice(1).join(" ")}</div>
        </div>
        <ul className="nav-links">
          {navLinks.map(([l, p]) => (
            <li key={l}><a href="#" onClick={e => { e.preventDefault(); go(p) }}>{l}</a></li>
          ))}
        </ul>
        <button className="btn-p" onClick={() => go("contact")} style={{ padding: "9px 22px", fontSize: "11px" }}>Get a Quote</button>
        {/* Hamburger */}
        <button className={`nav-burger${drawerOpen ? " open" : ""}`} onClick={() => setDrawerOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-drawer${drawerOpen ? " open" : ""}`}>
        {/* Close row */}
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "var(--bg)", borderBottom: "1px solid var(--border2)", zIndex: 991 }}>
          <div className="nav-logo" onClick={() => go("home")} style={{ cursor: "pointer" }}>
            {settings.logo
              ? <img src={settings.logo} style={{ width: 30, height: 30, borderRadius: 6, objectFit: "contain" }} alt="" />
              : <div className="nav-logo-mark" style={{ width: 30, height: 30, fontSize: 12 }}>{parts[0][0]}</div>}
            <div className="nav-brand" style={{ fontSize: 15 }}><span>{parts[0]}</span>{parts.slice(1).join(" ")}</div>
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid var(--border2)", background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer", color: "var(--text)" }}>✕</button>
        </div>
        {navLinks.map(([l, p]) => (
          <button key={l} className="nav-drawer-link" onClick={() => go(p)}>
            <span style={{ margin: "0 14px 0 0", fontSize: 20 }}>
              {p === "garage" ? "🚗" : p === "charging" ? "⚡" : p === "parts" ? "🔧" : p === "track" ? "📦" : "📞"}
            </span>
            {l}
          </button>
        ))}
        <button className="btn-p nav-drawer-cta" onClick={() => go("contact")}>Get a Quote →</button>
        <div style={{ marginTop: "auto", paddingTop: 24, fontSize: 11, color: "var(--text3)", textAlign: "center" }}>
          {settings.phone} · {settings.email}
        </div>
      </div>
    </>
  );
}

// ─── ANNOUNCEMENT BAR ─────────────────────────────────────────────
function AnnBar({ settings, setPage, onClose }) {
  if (!settings.annBarOn) return null;
  return (
    <>
      <div className="ann-bar" style={{ paddingRight: "48px" }}>
        {settings.annBarText}
        {settings.annBarLink && <a href="#" onClick={e => { e.preventDefault(); setPage("garage") }}>Shop Now</a>}
        <button className="ann-close" onClick={onClose}>×</button>
      </div>
      <div className="ann-bar-spacer" />
    </>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────
function HomePage({ setPage, vehicles, settings }) {
  useReveal();
  const featured = vehicles.filter(v => v.featured).slice(0, 3);
  const rate = settings.ghsRate || 16.2;
  const showGHS = settings.showGhsPrice;

  return (
    <div>
      <section className="hero">
        <HeroSlider slides={settings.heroSlides} onExplore={() => setPage("garage")} onQuote={() => setPage("contact")} />
      </section>

      {/* Stats */}
      <div className="stats-band">
        {[["200+", "Vehicles Imported", "var(--neon)"], ["40%", "Avg Fuel Savings (EV)", "var(--neon2)"], ["4", "Countries Served", "var(--orange)"], ["100%", "Transparent Pricing", "var(--purple)"]].map(([n, l, c]) => (
          <div key={l} className="stat-box rv">
            <div className="stat-n" style={{ color: c }}>{n}</div>
            <div className="stat-l">{l}</div>
          </div>
        ))}
      </div>

      {/* About */}
      <section className="sec" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "72px", alignItems: "center" }}>
        <div>
          <div className="sec-chip chip-1 rv">Our Story</div>
          <h2 className="sec-h rv" style={{ transitionDelay: ".1s" }}>Driving West Africa's<br /><span className="gt-neon">Automotive Future</span></h2>
          <p className="sec-p rv" style={{ transitionDelay: ".2s" }}>We bridge the gap between China's world-class auto industry and Ghana's growing market. From sleek electric saloons to powerful 4×4s — we source, ship, clear customs and deliver with full price transparency.</p>
          <div style={{ display: "flex", gap: "12px", marginTop: "32px" }} className="rv">
            <button className="btn-p" onClick={() => setPage("garage")}>Browse Inventory</button>
            <button className="btn-o" onClick={() => setPage("track")}><span>Track My Order</span></button>
          </div>
        </div>
        <div className="rvR">
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "16px", padding: "36px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle,color-mix(in srgb,var(--neon) 8%,transparent),transparent 70%)" }} />
            {[["🚗", "Vehicle Import", "Saloons, SUVs, 4×4s, EVs, Hybrids"], ["⚡", "EV Charging", "Supply & professional installation"], ["🔧", "Spare Parts", "OEM & quality aftermarket parts"], ["📦", "Full Service", "Sourcing → Shipping → Delivery"]].map(([icon, name, desc]) => (
              <div key={name} style={{ display: "flex", gap: "14px", marginBottom: "20px", alignItems: "flex-start" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "color-mix(in srgb,var(--neon) 12%,transparent)", border: "1px solid color-mix(in srgb,var(--neon) 22%,transparent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{icon}</div>
                <div><div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "14px", marginBottom: "2px" }}>{name}</div><div style={{ fontSize: "12px", color: "var(--text2)" }}>{desc}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="sec" style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", paddingTop: "72px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px" }}>
          <div><div className="sec-chip chip-2 rv">Hand-Picked</div><h2 className="sec-h rv" style={{ transitionDelay: ".1s", marginBottom: 0 }}>Featured <span className="gt-orange">Collection</span></h2></div>
          <button className="btn-o rv" onClick={() => setPage("garage")}><span>View All →</span></button>
        </div>
        <div className="car-grid">
          {featured.map((v, i) => <VehicleCard key={v.id} v={v} setPage={setPage} delay={i * .08} settings={settings} />)}
        </div>
      </section>

      {/* Services */}
      <section className="sec">
        <div className="sec-chip chip-3 rv">Everything You Need</div>
        <h2 className="sec-h rv" style={{ transitionDelay: ".1s" }}>Complete <span className="gt-purple">Automotive</span><br />Solutions</h2>
        <div className="svc-grid">
          {[{ icon: "🚗", name: "Vehicle Import", desc: "Premium Chinese vehicles — Electric, Hybrid, Gasoline. Saloons, SUVs, 4×4s and more.", chip: "chip-1", c: "var(--neon)", action: "garage" }, { icon: "⚡", name: "EV Charging Stations", desc: "AC home chargers, DC fast chargers, commercial EV infrastructure. Supply & professional install.", chip: "chip-4", c: "var(--neon2)", action: "charging" }, { icon: "🔧", name: "Spare Parts", desc: "Genuine OEM and quality aftermarket spare parts for all major Chinese brands we supply.", chip: "chip-2", c: "var(--orange)", action: "parts" }].map((s, i) => (
            <div key={s.name} className="svc-card rv" style={{ transitionDelay: `${i * .1}s` }} onClick={() => setPage(s.action)}>
              <div className="svc-icon" style={{ background: `color-mix(in srgb,${s.c} 12%,transparent)`, border: `1px solid color-mix(in srgb,${s.c} 22%,transparent)` }}>{s.icon}</div>
              <div className="svc-name">{s.name}</div>
              <div className="svc-desc">{s.desc}</div>
              <div style={{ marginTop: "18px" }}><div className={`sec-chip ${s.chip}`}>Explore →</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {settings.testimonials && settings.testimonials.length > 0 && (
        <section className="sec" style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", paddingTop: "72px" }}>
          <div className="sec-chip chip-1 rv">Real Clients</div>
          <h2 className="sec-h rv" style={{ transitionDelay: ".1s" }}>What Our <span className="gt-neon">Clients Say</span></h2>
          <div className="testi-grid">
            {settings.testimonials.map((t, i) => (
              <div key={t.id} className="testi-card rv" style={{ transitionDelay: `${i * .1}s` }}>
                <div className="testi-stars">{"★".repeat(t.stars)}</div>
                <div className="testi-text">"{t.text}"</div>
                <div className="testi-name">{t.name}</div>
                <div className="testi-role">{t.role}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: "96px 64px", textAlign: "center", background: "linear-gradient(135deg,var(--bg2),var(--bg3),var(--bg2))", borderTop: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle,color-mix(in srgb,var(--neon) 5%,transparent) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div className="sec-chip chip-1 rv" style={{ margin: "0 auto 14px" }}>Ready to Drive?</div>
        <h2 className="sec-h rv" style={{ transitionDelay: ".1s", maxWidth: "680px", margin: "0 auto 18px" }}>Your Dream Vehicle,<br /><span className="gt-neon">Delivered to Ghana</span></h2>
        <p style={{ color: "var(--text2)", fontSize: "15px", maxWidth: "460px", margin: "0 auto 36px", lineHeight: 1.9 }} className="rv">Tell us what you want. We source, ship, handle customs & duties, and deliver to your door.</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }} className="rv">
          <button className="btn-p" onClick={() => setPage("garage")}>Browse Inventory</button>
          <button className="btn-or" onClick={() => setPage("contact")}>Get Custom Quote →</button>
        </div>
      </section>
    </div>
  );
}

// ─── VEHICLE CARD ─────────────────────────────────────────────────
function VehicleCard({ v, setPage, delay = 0, settings }) {
  const mainImg = v.images && v.images.length > 0 ? v.images[0] : null;
  const showP = settings.showPricesGlobal && v.showPrice;
  const rate = settings.ghsRate || 16.2;

  return (
    <div className="v-card rv" style={{ transitionDelay: `${delay}s` }} onClick={() => setPage(`vehicle-${v.id}`)}>
      <div className="v-card-img">
        {mainImg ? <img src={mainImg} alt={v.model} /> : <div className="v-card-img-ph">{v.emoji}</div>}
        <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "5px", flexWrap: "wrap" }}>{availTag(v.availability)}</div>
        {v.logo && <div style={{ position: "absolute", bottom: "8px", right: "8px", width: "34px", height: "34px", borderRadius: "6px", background: "color-mix(in srgb,var(--bg) 80%,transparent)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}><img src={v.logo} alt="" style={{ width: "26px", height: "26px", objectFit: "contain" }} /></div>}
      </div>
      <div className="v-card-body">
        <div className="v-card-brand">{v.brand} · {v.year}</div>
        <div className="v-card-name">{v.model}</div>
        <div className="v-card-tags">{fuelTag(v.fuel)}<span className="tag tag-dim">{v.type}</span><span className="tag tag-dim">{v.drivetrain}</span></div>
        {showP ? (
          <>
            <div className="v-card-price">{fmtUSD(v.price)}</div>
            <div className="v-card-price-sub">FOB China · Ghana est. <strong style={{ color: "var(--neon2)" }}>{fmtUSD(v.totalGhana)}</strong></div>
            {settings.showGhsPrice && <div className="ghs-badge">{fmtGHS(v.totalGhana, rate)}</div>}
          </>
        ) : (
          <div style={{ fontFamily: "Syne,sans-serif", fontSize: "15px", fontWeight: 700, color: "var(--text2)" }}>Price on Request</div>
        )}
      </div>
      <div className="v-card-footer">
        <span style={{ fontSize: "11px", color: "var(--text2)" }}>{v.specs && Object.values(v.specs)[0]}</span>
        <span className="tag tag-1">Details →</span>
      </div>
    </div>
  );
}

// ─── GARAGE ───────────────────────────────────────────────────────
function GaragePage({ vehicles, setPage, settings }) {
  useReveal();
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Electric", "Hybrid", "Gasoline", "SUV", "Saloon", "4x4", "In Stock", "Pre-Order"];
  const filtered = vehicles.filter(v => {
    if (filter === "All") return true;
    if (filter === "In Stock") return v.availability === "in_stock";
    if (filter === "Pre-Order") return v.availability === "preorder";
    if (["Electric", "Hybrid", "Gasoline"].includes(filter)) return v.fuel === filter;
    return v.type === filter;
  });
  return (
    <div style={{ paddingTop: "100px" }}>
      <div className="sec" style={{ paddingBottom: "40px" }}>
        <div className="sec-chip chip-1 rv">Our Fleet</div>
        <h1 className="sec-h rv" style={{ transitionDelay: ".1s" }}>The <span className="gt-neon">Garage</span></h1>
        <p className="sec-p rv" style={{ transitionDelay: ".2s" }}>Hand-selected from China's finest. Inspected, documented, and ready for import to Ghana.</p>
        <div className="filter-bar" style={{ marginTop: "36px" }}>{filters.map(f => <button key={f} className={`ftag${filter === f ? " act" : ""}`} onClick={() => setFilter(f)}>{f}</button>)}</div>
        <div className="car-grid">{filtered.map((v, i) => <VehicleCard key={v.id} v={v} setPage={setPage} delay={i * .04} settings={settings} />)}</div>
        {filtered.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "80px 0", color: "var(--text2)" }}><div style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</div>No vehicles for this filter.</div>}
        <div style={{ marginTop: "52px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "28px", display: "flex", gap: "18px", alignItems: "flex-start" }} className="rv">
          <div style={{ fontSize: "28px" }}>💡</div>
          <div>
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "16px", marginBottom: "8px" }}>Don't See What You're Looking For?</div>
            <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.8, marginBottom: "18px" }}>We can source virtually any Chinese-made vehicle. Submit a custom enquiry with the make, model and year, and we'll provide a full quote.</p>
            <button className="btn-p" onClick={() => setPage("contact")}>Custom Vehicle Request →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── VEHICLE DETAIL ───────────────────────────────────────────────
function VehicleDetailPage({ vehicle: v, setPage, settings }) {
  useReveal();
  const [activeImg, setActiveImg] = useState(0);
  const [showInq, setShowInq] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  if (!v) return <div style={{ paddingTop: "200px", textAlign: "center" }}>Vehicle not found.</div>;
  const imgs = v.images && v.images.length > 0 ? v.images : null;
  const showP = settings.showPricesGlobal && v.showPrice;
  const rate = settings.ghsRate || 16.2;
  return (
    <div style={{ paddingTop: "80px" }}>
      <div style={{ padding: "18px 64px" }}><button className="btn-sm btn-sm-ghost" onClick={() => setPage("garage")}>← Back to Garage</button></div>
      {sent && <div className="alert al-ok" style={{ margin: "0 64px" }}>✓ Enquiry sent! We'll respond within 24 hours.</div>}
      <div className="vd-wrap">
        <div className="vd-gallery">
          <div className="vd-main">{imgs && imgs[activeImg] ? <img src={imgs[activeImg]} alt={v.model} /> : <span>{v.emoji}</span>}</div>
          <div className="vd-thumbs">
            {(imgs && imgs.length > 1 ? imgs : [null, null, null]).map((img, i) => (
              <div key={i} className={`vd-thumb${activeImg === i ? " act" : ""}`} onClick={() => setActiveImg(i)}>
                {img ? <img src={img} alt="" /> : v.emoji}
              </div>
            ))}
          </div>
        </div>
        <div>
          {v.logo && <img src={v.logo} alt="brand" style={{ height: "38px", objectFit: "contain", marginBottom: "14px" }} />}
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--neon)", marginBottom: "5px" }}>{v.brand} · {v.year}</div>
          <h1 style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(30px,4vw,50px)", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: "14px" }}>{v.model}</h1>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "22px" }}>{fuelTag(v.fuel)}{availTag(v.availability)}<span className="tag tag-dim">{v.type}</span><span className="tag tag-dim">{v.drivetrain}</span></div>
          <p style={{ fontSize: "15px", color: "var(--text2)", lineHeight: 1.85, marginBottom: "24px" }}>{v.description}</p>
          {showP ? (
            <div className="price-box">
              <div className="price-box-title">Pricing Breakdown (USD)</div>
              {[["FOB Price — China", v.price, "var(--text)"], ["Est. Ocean Freight", 1800, "var(--text)"], ["Ghana Import Duties (~25%)", v.duties, "var(--text)"], ["Total Estimated in Ghana", (v.totalGhana || 0) + 1800, "var(--neon)"]].map(([l, a, c]) => (
                <div key={l} className={`price-row${l.includes("Total") ? " total" : ""}`}>
                  <span className="price-row-lbl">{l}</span>
                  <div>
                    <div className="price-row-val" style={{ color: c }}>{fmtUSD(a)}</div>
                    {settings.showGhsPrice && <div style={{ fontSize: "10px", color: "var(--text3)" }}>{fmtGHS(a, rate)}</div>}
                  </div>
                </div>
              ))}
              <div style={{ fontSize: "10px", color: "var(--text3)", marginTop: "10px" }}>* Final price subject to exchange rates and port charges. Contact us for exact quote.</div>
            </div>
          ) : (
            <div className="price-box" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "22px", marginBottom: "8px" }}>💬</div>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "16px", marginBottom: "5px" }}>Price on Request</div>
              <div style={{ fontSize: "12px", color: "var(--text2)" }}>Contact us for a full quote including shipping and duties.</div>
            </div>
          )}
          <div className="spec-grid">{Object.entries(v.specs).map(([k, val]) => <div key={k} className="spec-item"><div className="spec-lbl">{k}</div><div className="spec-val">{val}</div></div>)}</div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button className="btn-p" onClick={() => setShowInq(true)}>{v.availability === "in_stock" ? "Purchase Now →" : "Pre-Order →"}</button>
            <button className="btn-o" onClick={() => setShowInq(true)}><span>Request Info</span></button>
          </div>
        </div>
      </div>
      {showInq && (
        <div className="mo" onClick={() => setShowInq(false)}>
          <div className="mo-box" onClick={e => e.stopPropagation()}>
            <div className="mo-hd"><div className="mo-title">{v.availability === "in_stock" ? "Purchase" : "Pre-Order"} — {v.brand} {v.model}</div><button className="btn-sm btn-sm-ghost" onClick={() => setShowInq(false)}>✕</button></div>
            <div className="mo-body">
              <div className="frow"><div className="fg"><label className="lbl">Full Name</label><input className="inp" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div><div className="fg"><label className="lbl">Phone/WhatsApp</label><input className="inp" placeholder="+233..." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div></div>
              <div className="fg"><label className="lbl">Email</label><input className="inp" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div className="fg"><label className="lbl">Message</label><textarea className="inp" rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></div>
            </div>
            <div className="mo-ft"><button className="btn-sm btn-sm-ghost" onClick={() => setShowInq(false)}>Cancel</button><button className="btn-p" onClick={() => { setSent(true); setShowInq(false) }}>Submit →</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CHARGING ─────────────────────────────────────────────────────
function ChargingPage({ charging }) {
  useReveal();
  const [modal, setModal] = useState(null);
  const [sent, setSent] = useState(false);
  return (
    <div style={{ paddingTop: "100px" }}>
      <div className="sec" style={{ paddingBottom: "40px" }}>
        <div className="sec-chip chip-4 rv">EV Infrastructure</div>
        <h1 className="sec-h rv" style={{ transitionDelay: ".1s" }}>Charging Stations <span className="gt-purple">& Installation</span></h1>
        <p className="sec-p rv" style={{ transitionDelay: ".2s" }}>Supply and professional installation of EV charging solutions for homes, offices and commercial facilities.</p>
        {sent && <div className="alert al-ok" style={{ marginTop: "28px" }}>✓ Enquiry submitted!</div>}
        <div className="car-grid" style={{ marginTop: "44px" }}>
          {charging.map((c, i) => (
            <div key={c.id} className="v-card rv" style={{ transitionDelay: `${i * .1}s` }}>
              <div className="v-card-img"><div className="v-card-img-ph" style={{ fontSize: "80px" }}>{c.emoji}</div></div>
              <div className="v-card-body">
                <div className="v-card-brand">{c.brand}</div>
                <div className="v-card-name">{c.name}</div>
                <div className="v-card-tags"><span className="tag tag-2">⚡ {c.power}</span><span className="tag tag-dim">{c.type}</span></div>
                <div className="v-card-price">{fmtUSD(c.price)}</div>
                <div className="v-card-price-sub">Installation: <strong style={{ color: "var(--neon2)" }}>{fmtUSD(c.installation)}</strong></div>
              </div>
              <div className="v-card-footer"><span style={{ fontSize: "11px", color: "var(--text2)" }}>Unit price</span><button className="btn-sm btn-sm-neon" onClick={e => { e.stopPropagation(); setModal(c) }}>Enquire →</button></div>
            </div>
          ))}
        </div>
      </div>
      {modal && <div className="mo" onClick={() => setModal(null)}><div className="mo-box" onClick={e => e.stopPropagation()}><div className="mo-hd"><div className="mo-title">Enquire — {modal.name}</div><button className="btn-sm btn-sm-ghost" onClick={() => setModal(null)}>✕</button></div><div className="mo-body"><div className="frow"><div className="fg"><label className="lbl">Name</label><input className="inp" placeholder="Your name" /></div><div className="fg"><label className="lbl">Phone</label><input className="inp" placeholder="+233..." /></div></div><div className="fg"><label className="lbl">Email</label><input className="inp" placeholder="email@..." /></div><div className="fg"><label className="lbl">Location</label><input className="inp" placeholder="Home/Office/Commercial" /></div><div className="fg"><label className="lbl">Quantity</label><input className="inp" type="number" defaultValue={1} /></div></div><div className="mo-ft"><button className="btn-sm btn-sm-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn-p" onClick={() => { setSent(true); setModal(null) }}>Submit →</button></div></div></div>}
    </div>
  );
}

// ─── PARTS ────────────────────────────────────────────────────────
function PartsPage({ parts }) {
  useReveal();
  const [modal, setModal] = useState(null);
  const [sent, setSent] = useState(false);
  return (
    <div style={{ paddingTop: "100px" }}>
      <div className="sec" style={{ paddingBottom: "40px" }}>
        <div className="sec-chip chip-2 rv">OEM & Aftermarket</div>
        <h1 className="sec-h rv" style={{ transitionDelay: ".1s" }}>Spare <span className="gt-orange">Parts</span></h1>
        <p className="sec-p rv" style={{ transitionDelay: ".2s" }}>Parts for all major Chinese brands. Can't find it? Submit an enquiry and we'll source it.</p>
        {sent && <div className="alert al-ok" style={{ marginTop: "28px" }}>✓ Enquiry submitted!</div>}
        <div className="car-grid" style={{ marginTop: "44px" }}>
          {parts.map((p, i) => (
            <div key={p.id} className="v-card rv" style={{ transitionDelay: `${i * .08}s` }}>
              <div className="v-card-img" style={{ height: "140px" }}><div className="v-card-img-ph" style={{ height: "140px", fontSize: "60px" }}>{p.emoji}</div></div>
              <div className="v-card-body"><div className="v-card-brand">{p.category}</div><div className="v-card-name" style={{ fontSize: "16px" }}>{p.name}</div><div style={{ fontSize: "12px", color: "var(--text2)", marginBottom: "12px" }}>Compatible: {p.compatible}</div><div className="v-card-price">{fmtUSD(p.price)}</div></div>
              <div className="v-card-footer"><button className="btn-sm btn-sm-neon" onClick={e => { e.stopPropagation(); setModal(p) }}>Purchase / Enquire</button></div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "44px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "36px", textAlign: "center" }} className="rv">
          <div style={{ fontSize: "32px", marginBottom: "10px" }}>🔍</div>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "18px", marginBottom: "8px" }}>Need a Specific Part?</div>
          <p style={{ fontSize: "13px", color: "var(--text2)", marginBottom: "20px", lineHeight: 1.8, maxWidth: "380px", margin: "0 auto 20px" }}>We source almost any part for Chinese vehicles.</p>
          <button className="btn-p" onClick={() => setModal({ name: "Custom Parts Enquiry", id: "custom" })}>Submit Parts Enquiry →</button>
        </div>
      </div>
      {modal && <div className="mo" onClick={() => setModal(null)}><div className="mo-box" onClick={e => e.stopPropagation()}><div className="mo-hd"><div className="mo-title">{modal.id === "custom" ? "Custom Parts Enquiry" : `Order — ${modal.name}`}</div><button className="btn-sm btn-sm-ghost" onClick={() => setModal(null)}>✕</button></div><div className="mo-body"><div className="frow"><div className="fg"><label className="lbl">Name</label><input className="inp" placeholder="Your name" /></div><div className="fg"><label className="lbl">Phone</label><input className="inp" placeholder="+233..." /></div></div><div className="fg"><label className="lbl">Email</label><input className="inp" placeholder="email@..." /></div>{modal.id === "custom" && <><div className="fg"><label className="lbl">Vehicle</label><input className="inp" placeholder="Make/Model/Year" /></div><div className="fg"><label className="lbl">Part Description</label><textarea className="inp" rows={3} placeholder="Describe the part..." /></div></>}{modal.id !== "custom" && <div className="fg"><label className="lbl">Quantity</label><input className="inp" type="number" defaultValue={1} /></div>}</div><div className="mo-ft"><button className="btn-sm btn-sm-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn-p" onClick={() => { setSent(true); setModal(null) }}>Submit →</button></div></div></div>}
    </div>
  );
}

// ─── TRACKING ─────────────────────────────────────────────────────
function TrackingPage({ orders }) {
  useReveal();
  const [q, setQ] = useState(""), found = useRef(null), [result, setResult] = useState(null), [err, setErr] = useState(false);
  const search = () => { const o = orders.find(o => o.id.toLowerCase() === q.trim().toLowerCase()); if (o) { setResult(o); setErr(false) } else { setResult(null); setErr(true) } };
  const prog = result ? (result.tracking.filter(s => s.done).length / result.tracking.length) * 100 : 0;
  return (
    <div style={{ paddingTop: "100px" }}>
      <div className="sec" style={{ paddingBottom: "60px" }}>
        <div className="sec-chip chip-1 rv">Live Status</div>
        <h1 className="sec-h rv" style={{ transitionDelay: ".1s" }}>Track Your <span className="gt-neon">Order</span></h1>
        <p className="sec-p rv" style={{ transitionDelay: ".2s" }}>Enter your order ID to see real-time status.</p>
        <div style={{ maxWidth: "500px", marginTop: "44px" }} className="rv">
          <div className="fg"><label className="lbl">Order ID</label><div style={{ display: "flex", gap: "10px" }}><input className="inp" placeholder="e.g. ACG-2024-001" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && search()} /><button className="btn-p" onClick={search}>Track →</button></div></div>
          <div style={{ fontSize: "11px", color: "var(--text3)" }}>Demo: ACG-2024-001</div>
        </div>
        {err && <div className="alert al-er" style={{ maxWidth: "500px", marginTop: "18px" }}>Order not found. Please check your Order ID.</div>}
        {result && (
          <div style={{ marginTop: "44px", maxWidth: "620px" }}>
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", marginBottom: "24px" }} className="rv">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px", marginBottom: "18px" }}>
                <div><div style={{ fontFamily: "Syne,sans-serif", fontSize: "20px", fontWeight: 800 }}>{result.item}</div><div style={{ fontSize: "12px", color: "var(--text2)", marginTop: "3px" }}>Order <span style={{ color: "var(--neon)" }}>{result.id}</span> · {result.customer}</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontFamily: "Syne,sans-serif", fontSize: "24px", fontWeight: 800, color: "var(--neon)" }}>{fmtUSD(result.amount)}</div><span className="tag tag-1">{result.status.replace(/_/g, " ").toUpperCase()}</span></div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text2)", marginBottom: "6px" }}><span>Progress</span><span style={{ color: "var(--neon)", fontWeight: 700 }}>{Math.round(prog)}%</span></div>
              <div className="prog-bar"><div className="prog-fill" style={{ width: `${prog}%` }} /></div>
            </div>
            <div className="track-line rv">
              {result.tracking.map((step, i) => (
                <div key={i} className="track-step">
                  <div className={`track-dot${step.done ? " done" : step.active ? " active" : ""}`}>{step.done ? "✓" : step.active ? "●" : ""}</div>
                  <div style={{ fontFamily: "Syne,sans-serif", fontSize: "13px", fontWeight: 700, color: step.active ? "var(--neon)" : step.done ? "var(--text)" : "var(--text2)" }}>{step.step}</div>
                  <div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "2px" }}>{step.date}</div>
                  {step.active && <div style={{ marginTop: "5px", fontSize: "11px", color: "var(--neon)", background: "color-mix(in srgb,var(--neon) 7%,transparent)", border: "1px solid color-mix(in srgb,var(--neon) 20%,transparent)", borderRadius: "4px", padding: "5px 10px", display: "inline-block" }}>● Currently at this stage</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────
function ContactPage({ settings }) {
  useReveal();
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "vehicle", message: "" });
  const [sent, setSent] = useState(false);
  return (
    <div style={{ paddingTop: "100px" }}>
      <div className="sec" style={{ paddingBottom: "60px" }}>
        <div className="sec-chip chip-1 rv">Talk to Us</div>
        <h1 className="sec-h rv" style={{ transitionDelay: ".1s" }}>Contact & <span className="gt-neon">Enquiry</span></h1>
        {sent ? <div style={{ marginTop: "36px" }}><div className="alert al-ok">✓ Your message has been sent! We'll respond within 24 hours.</div></div> : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "44px", marginTop: "44px" }}>
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "16px", padding: "40px" }} className="rvL">
              <h3 style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "19px", marginBottom: "24px" }}>Send an Enquiry</h3>
              <div className="frow"><div className="fg"><label className="lbl">Full Name *</label><input className="inp" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div><div className="fg"><label className="lbl">Phone/WhatsApp *</label><input className="inp" placeholder="+233..." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div></div>
              <div className="fg"><label className="lbl">Email</label><input className="inp" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div className="fg"><label className="lbl">Enquiry Type</label><select className="inp" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="vehicle">Vehicle Purchase/Pre-Order</option><option value="charging">EV Charging Station</option><option value="parts">Spare Parts</option><option value="tracking">Order Tracking</option><option value="other">Other</option></select></div>
              <div className="fg"><label className="lbl">Message *</label><textarea className="inp" rows={5} placeholder="Tell us what you need..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></div>
              <button className="btn-p" style={{ width: "100%", justifyContent: "center" }} onClick={() => setSent(true)}>Send Enquiry →</button>
            </div>
            <div className="rvR">
              <div style={{ marginBottom: "32px" }}>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "17px", marginBottom: "18px" }}>Contact Information</div>
                {[["📍", "Address", settings.address], ["📧", "Email", settings.email], ["📞", "Phone", settings.phone], ["💬", "WhatsApp", settings.whatsapp]].map(([icon, label, value]) => (
                  <div key={label} style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: "1px solid var(--border2)" }}>
                    <span style={{ fontSize: "16px" }}>{icon}</span>
                    <div><div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--neon)", marginBottom: "3px" }}>{label}</div><div style={{ fontSize: "13px", color: "var(--text2)" }}>{value}</div></div>
                  </div>
                ))}
              </div>
              <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px" }}>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "14px", marginBottom: "12px" }}>Business Hours</div>
                {[["Mon – Fri", "8:00 AM – 6:00 PM"], ["Saturday", "9:00 AM – 4:00 PM"], ["Sunday", "Closed"]].map(([d, h]) => (
                  <div key={d} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: "13px", color: "var(--text2)", borderBottom: "1px solid color-mix(in srgb,var(--border) 40%,transparent)" }}><span>{d}</span><span>{h}</span></div>
                ))}
              </div>
              <button className="btn-p" style={{ width: "100%", justifyContent: "center", marginTop: "16px", background: "#25D366", boxShadow: "none" }} onClick={() => window.open(`https://wa.me/${(settings.whatsapp || "").replace(/\D/g, "")}`)}>
                💬 Chat on WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────
function Footer({ setPage, onAdminClick, settings }) {
  const parts = settings.companyName.split(" ");
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand"><span>{parts[0]}</span>{parts.slice(1).join(" ")}</div>
          <div className="footer-desc">{settings.tagline}<br />Your trusted partner for Chinese automobiles in West Africa.</div>
          <div style={{ display: "flex", gap: "8px" }}>{["📘", "📸", "𝕏", "💬"].map((s, i) => <div key={i} className="social-btn">{s}</div>)}</div>
        </div>
        <div><div className="footer-hd">Our Fleet</div><ul className="footer-links">{["Electric Vehicles", "Hybrid Cars", "SUVs & 4x4", "Saloons", "Pre-Order"].map(l => <li key={l}><a href="#" onClick={e => { e.preventDefault(); setPage("garage") }}>{l}</a></li>)}</ul></div>
        <div><div className="footer-hd">Services</div><ul className="footer-links">{["EV Charging", "Spare Parts", "Custom Import", "Track Order", "Fleet Solutions"].map(l => <li key={l}><a href="#" onClick={e => { e.preventDefault(); setPage("track") }}>{l}</a></li>)}</ul></div>
        <div><div className="footer-hd">Company</div><ul className="footer-links">{["About Us", "Contact", "FAQ", "Privacy Policy"].map(l => <li key={l}><a href="#" onClick={e => { e.preventDefault(); setPage("contact") }}>{l}</a></li>)}</ul></div>
      </div>
      <div className="footer-bot">
        <div className="footer-copy">© {new Date().getFullYear()} {settings.companyName}. All rights reserved. Accra, Ghana.</div>
        <button className="admin-ghost" onClick={onAdminClick}>⬡ Admin</button>
      </div>
    </footer>
  );
}

// ─── WHATSAPP FLOAT ───────────────────────────────────────────────
function WAFloat({ whatsapp }) {
  return (
    <button className="wa-float" onClick={() => window.open(`https://wa.me/${(whatsapp || "").replace(/\D/g, "")}?text=Hello Jaybesin Autos, I'm interested in your vehicles.`)}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      <span className="wa-tooltip">Chat with us</span>
    </button>
  );
}

// ─── ADMIN LOGIN (Firebase Auth) ──────────────────────────────────
function AdminLogin({ onLogin }) {
  const [c, setC] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const go = async () => {
    if (!c.email || !c.password) { setErr("Please enter email and password."); return; }
    setLoading(true); setErr("");
    try {
      await signInWithEmailAndPassword(auth, c.email, c.password);
      onLogin();
    } catch (e) {
      setErr("Incorrect credentials. Check Firebase Auth.");
    } finally { setLoading(false); }
  };
  return (
    <div className="login-wrap">
      <div className="login-glow" />
      {[300, 500, 700].map(s => <div key={s} style={{ position: "absolute", width: s + "px", height: s + "px", borderRadius: "50%", border: "1px solid color-mix(in srgb,var(--neon) 8%,transparent)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
      )}
      <div className="login-card">
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "var(--grad-neon)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "20px", color: "var(--btn-text)" }}>A</div>
          <div className="login-title">Admin <span style={{ color: "var(--neon)" }}>Portal</span></div>
          <div className="login-sub">Jaybesin Autos</div>
        </div>
        {err && <div className="alert al-er">{err}</div>}
        <div className="fg"><label className="lbl">Email</label><input className="inp" type="email" placeholder="admin@jaybesin.com" value={c.email} onChange={e => setC({ ...c, email: e.target.value })} /></div>
        <div className="fg" style={{ marginBottom: "24px" }}><label className="lbl">Password</label><input className="inp" type="password" placeholder="••••••••" value={c.password} onChange={e => setC({ ...c, password: e.target.value })} onKeyDown={e => e.key === "Enter" && go()} /></div>
        <button className="btn-p" style={{ width: "100%", justifyContent: "center", padding: "14px" }} onClick={go} disabled={loading}>{loading ? "Signing in…" : "Sign In →"}</button>
        <div style={{ textAlign: "center", marginTop: "18px", fontSize: "10px", color: "var(--text3)" }}>🔐 Powered by Firebase Auth</div>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────
function AdminPanel({ vehicles, setVehicles, charging, setCharging, parts, setParts, orders, setOrders, inquiries, setInquiries, settings, setSettings, onLogout, setView }) {
  const [tab, setTab] = useState("dashboard");
  const [showAddV, setShowAddV] = useState(false);
  const [editVId, setEditVId] = useState(null);
  const [showAddC, setShowAddC] = useState(false);
  const [showAddP, setShowAddP] = useState(false);
  const [saveOk, setSaveOk] = useState(false);

  const blankV = { brand: "", model: "", year: 2024, type: "SUV", fuel: "Gasoline", drivetrain: "2WD", price: "", duties: "", totalGhana: "", availability: "preorder", showPrice: true, description: "", emoji: "🚗", featured: false, images: [], logo: null, specs: { range: "", power: "", acceleration: "", engine: "" } };
  const [newV, setNewV] = useState(blankV);
  const [newC, setNewC] = useState({ name: "", brand: "", type: "AC", power: "", price: "", installation: "", emoji: "⚡" });
  const [newP, setNewP] = useState({ name: "", compatible: "", category: "", price: "", emoji: "🔧" });

  // Local editable settings
  const [editS, setEditS] = useState(settings);
  useEffect(() => setEditS(settings), [settings]);

  const navItems = [
    { id: "dashboard", icon: "📊", lbl: "Dashboard" }, { id: "vehicles", icon: "🚗", lbl: "Vehicles" },
    { id: "charging", icon: "⚡", lbl: "Charging Stations" }, { id: "parts", icon: "🔧", lbl: "Spare Parts" },
    { id: "orders", icon: "📦", lbl: "Orders" }, { id: "inquiries", icon: "💬", lbl: "Inquiries" },
    { id: "invoices", icon: "🧾", lbl: "Invoices" }, { id: "settings", icon: "⚙️", lbl: "Settings" },
  ];

  const [saving, setSaving] = useState(false);

  // ── Upload any base64 images to Storage, return Firebase URLs ──
  const uploadIfBase64 = async (val, path) => {
    if (val && typeof val === 'string' && val.startsWith('data:')) {
      return await uploadImage(val, path);
    }
    return val;
  };

  const saveV = async () => {
    setSaving(true);
    try {
      const ts = Date.now();
      const images = await Promise.all(
        (newV.images || []).map((img, i) => uploadIfBase64(img, `vehicles/${ts}_img_${i}`))
      );
      const logo = await uploadIfBase64(newV.logo, `vehicles/${ts}_logo`);
      const v = { ...newV, id: editVId || String(ts), price: +newV.price, duties: +newV.duties, totalGhana: +newV.totalGhana, images, logo };
      await saveVehicle(v);
      setShowAddV(false); setEditVId(null); setNewV(blankV);
    } catch (e) { console.error('saveV:', e); }
    setSaving(false);
  };

  const deleteV = async (id) => {
    setSaving(true);
    try { await deleteVehicle(String(id)); } catch (e) { console.error('deleteV:', e); }
    setSaving(false);
  };

  const addCharger = async () => {
    setSaving(true);
    try { await saveCharger({ ...newC, price: +newC.price, installation: +newC.installation }); setShowAddC(false); setNewC({ name: '', brand: '', type: 'AC', power: '', price: '', installation: '', emoji: '⚡' }); } catch (e) { console.error(e); }
    setSaving(false);
  };

  const removeCharger = async (id) => {
    setSaving(true);
    try { await deleteCharger(String(id)); } catch (e) { console.error(e); }
    setSaving(false);
  };

  const addPart = async () => {
    setSaving(true);
    try { await savePart({ ...newP, price: +newP.price }); setShowAddP(false); setNewP({ name: '', compatible: '', category: '', price: '', emoji: '🔧' }); } catch (e) { console.error(e); }
    setSaving(false);
  };

  const removePart = async (id) => {
    setSaving(true);
    try { await deletePart(String(id)); } catch (e) { console.error(e); }
    setSaving(false);
  };

  const updateOrderStatus = async (id, status) => {
    try { await saveOrder({ id: String(id), status }); } catch (e) { console.error(e); }
  };

  const handleMarkReplied = async (id) => {
    try { await updateInquiryStatus(String(id), 'replied'); } catch (e) { console.error(e); }
  };

  const openEdit = (v) => { setNewV({ ...v, price: String(v.price), duties: String(v.duties), totalGhana: String(v.totalGhana) }); setEditVId(v.id); setShowAddV(true) };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const ts = Date.now();
      // Upload hero slide images & logo to Storage
      const heroSlides = await Promise.all(
        (editS.heroSlides || []).map(async (s, i) => ({ ...s, image: await uploadIfBase64(s.image, `hero/slide_${i}_${ts}`) }))
      );
      const logo = await uploadIfBase64(editS.logo, `brand/logo_${ts}`);
      const finalSettings = { ...editS, heroSlides, logo };
      await setSettings(finalSettings);
      setSaveOk(true); setTimeout(() => setSaveOk(false), 3000);
    } catch (e) { console.error('saveSettings:', e); }
    setSaving(false);
  };

  const applyPreset = (name) => {
    setEditS(prev => ({ ...prev, theme: PRESETS[name] }));
  };

  // Color groups for the theme editor
  const colorGroups = [
    { title: "Accent Colors", keys: [["accent1", "Primary Accent"], ["accent2", "Secondary Accent"], ["accent3", "Orange/Alert"], ["accent4", "Purple/Tertiary"]] },
    { title: "Background Colors", keys: [["bgPrimary", "Main Background"], ["bgSecondary", "Section BG"], ["bgTertiary", "Card BG Alt"], ["bgCard", "Card Surface"], ["bgInput", "Input/Field BG"]] },
    { title: "Text Colors", keys: [["textPrimary", "Heading / Main Text"], ["textSecondary", "Body / Dim Text"], ["textMuted", "Muted / Placeholder"]] },
    { title: "Other", keys: [["borderHex", "Border Color"], ["footerBg", "Footer Background"], ["btnText", "Button Text (on accent)"]] },
  ];

  return (
    <div className="adm-wrap">
      {saving && <div className="adm-saving-bar" />}
      <aside className="adm-side">
        <div className="adm-side-hd">
          <div className="adm-side-logo">Jaybesin <span>Autos</span></div>
          <div className="adm-side-tag">Admin Portal</div>
        </div>
        <div style={{ flex: 1 }}>
          <div className="adm-sec-lbl">Main</div>
          {navItems.slice(0, 5).map(n => <button key={n.id} className={`adm-link${tab === n.id ? " act" : ""}`} onClick={() => setTab(n.id)}><span>{n.icon}</span>{n.lbl}</button>)}
          <div className="adm-sec-lbl" style={{ marginTop: "6px" }}>Management</div>
          {navItems.slice(5).map(n => <button key={n.id} className={`adm-link${tab === n.id ? " act" : ""}`} onClick={() => setTab(n.id)}><span>{n.icon}</span>{n.lbl}</button>)}
        </div>
        <div style={{ borderTop: "1px solid var(--border)", padding: "8px 0" }}>
          <button className="adm-link" onClick={() => setView("public")}><span>🌐</span>View Website</button>
          <button className="adm-link" onClick={onLogout} style={{ color: "#FF4A5A" }}><span>🚪</span>Logout</button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="adm-mobile-nav">
        {navItems.map(n => (
          <button key={n.id} className={`adm-mob-btn${tab === n.id ? ' act' : ''}`} onClick={() => setTab(n.id)}>
            <span className="adm-mob-btn-ico">{n.icon}</span>
            <span>{n.lbl.split(' ')[0]}</span>
          </button>
        ))}
        <button className="adm-mob-btn" onClick={onLogout} style={{ color: '#FF4A5A' }}>
          <span className="adm-mob-btn-ico">🚪</span><span>Out</span>
        </button>
      </nav>

      <main className="adm-main">

        {/* Dashboard */}
        {tab === "dashboard" && (
          <div>
            <div className="adm-hd"><div className="adm-pg-title">Dashboard</div><div style={{ fontSize: "12px", color: "var(--text2)" }}>{new Date().toLocaleDateString("en-GH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div></div>
            <div className="dash-grid">
              {[{ icon: "🚗", lbl: "Vehicles Listed", val: vehicles.length, c: "var(--neon)" }, { icon: "📦", lbl: "Active Orders", val: orders.length, c: "var(--neon2)" }, { icon: "💬", lbl: "New Inquiries", val: inquiries.filter(i => i.status === "new").length, c: "var(--orange)" }, { icon: "💰", lbl: "Est. Revenue", val: `$${(orders.reduce((s, o) => s + o.amount, 0) / 1000).toFixed(0)}k`, c: "var(--purple)" }].map((c, i) => (
                <div key={i} className="dc"><div className="dc-icon">{c.icon}</div><div className="dc-val" style={{ color: c.c }}>{c.val}</div><div className="dc-lbl">{c.lbl}</div></div>
              ))}
            </div>
            <div className="adm-card" style={{ marginBottom: "14px" }}>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "15px", marginBottom: "14px" }}>Recent Orders</div>
              <table className="adm-table"><thead><tr><th>ID</th><th>Customer</th><th>Vehicle</th><th>Amount</th><th>Status</th></tr></thead><tbody>{orders.map(o => <tr key={o.id} style={{ cursor: "pointer" }} onClick={() => setTab("orders")}><td style={{ color: "var(--neon)", fontFamily: "monospace", fontSize: "11px" }}>{o.id}</td><td style={{ color: "var(--text)" }}>{o.customer}</td><td>{o.item}</td><td style={{ color: "var(--neon)", fontFamily: "Syne,sans-serif", fontWeight: 700 }}>{fmtUSD(o.amount)}</td><td><span className="tag tag-1">{o.status.replace(/_/g, " ")}</span></td></tr>)}</tbody></table>
            </div>
            <div className="adm-card">
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "15px", marginBottom: "14px" }}>Recent Inquiries</div>
              {inquiries.slice(0, 3).map(inq => <div key={inq.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border2)", gap: "12px" }}><div><div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{inq.name} <span style={{ color: "var(--text2)", fontWeight: 300 }}>— {inq.subject}</span></div><div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "1px" }}>{inq.date}</div></div><span className={`tag${inq.status === "new" ? " tag-3" : " tag-g"}`}>{inq.status}</span></div>)}
            </div>
          </div>
        )}

        {/* Vehicles */}
        {tab === "vehicles" && (
          <div>
            <div className="adm-hd"><div className="adm-pg-title">Vehicles ({vehicles.length})</div><button className="btn-p" onClick={() => { setNewV(blankV); setEditVId(null); setShowAddV(true) }}>+ Add Vehicle</button></div>
            <div className="adm-card">
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead><tr><th>Vehicle</th><th>Type</th><th>Fuel</th><th>FOB $</th><th>Show Price</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {vehicles.map(v => (
                      <tr key={v.id}>
                        <td><div style={{ display: "flex", alignItems: "center", gap: "10px" }}>{v.images && v.images.length > 0 ? <img src={v.images[0]} style={{ width: "40px", height: "30px", objectFit: "cover", borderRadius: "4px" }} alt="" /> : <div style={{ width: "40px", height: "30px", background: "var(--bg4)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{v.emoji}</div>}<div><div style={{ fontWeight: 600, color: "var(--text)", fontSize: "13px" }}>{v.brand} {v.model}</div><div style={{ fontSize: "10px", color: "var(--text3)" }}>{v.year}{v.featured ? " · ⭐" : ""}</div></div></div></td>
                        <td>{v.type}</td><td>{fuelTag(v.fuel)}</td>
                        <td style={{ color: "var(--neon)", fontFamily: "Syne,sans-serif", fontWeight: 700 }}>{fmtUSD(v.price)}</td>
                        <td><Tgl on={v.showPrice} onChange={async () => { const updated = { ...v, showPrice: !v.showPrice }; await saveVehicle(updated); }} /></td>
                        <td>{availTag(v.availability)}</td>
                        <td><div style={{ display: "flex", gap: "5px" }}><button className="btn-sm btn-sm-neon" onClick={() => openEdit(v)}>Edit</button><button className="btn-sm btn-sm-red" onClick={() => deleteV(v.id)}>Del</button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Charging */}
        {tab === "charging" && (
          <div>
            <div className="adm-hd"><div className="adm-pg-title">Charging Stations</div><button className="btn-p" onClick={() => setShowAddC(true)}>+ Add Station</button></div>
            <div className="adm-card"><div className="adm-table-wrap"><table className="adm-table"><thead><tr><th>Name</th><th>Brand</th><th>Type</th><th>Power</th><th>Price</th><th>Install</th><th>Act</th></tr></thead><tbody>{charging.map(c => <tr key={c.id}><td>{c.emoji} <strong style={{ color: "var(--text)" }}>{c.name}</strong></td><td>{c.brand}</td><td><span className="tag tag-2">{c.type}</span></td><td>{c.power}</td><td style={{ color: "var(--neon)", fontWeight: 700 }}>{fmtUSD(c.price)}</td><td>{fmtUSD(c.installation)}</td><td><button className="btn-sm btn-sm-red" onClick={() => removeCharger(c.id)}>Del</button></td></tr>)}</tbody></table></div></div>
          </div>
        )}

        {/* Parts */}
        {tab === "parts" && (
          <div>
            <div className="adm-hd"><div className="adm-pg-title">Spare Parts</div><button className="btn-p" onClick={() => setShowAddP(true)}>+ Add Part</button></div>
            <div className="adm-card"><div className="adm-table-wrap"><table className="adm-table"><thead><tr><th>Part</th><th>Category</th><th>Compatible</th><th>Price</th><th>Act</th></tr></thead><tbody>{parts.map(p => <tr key={p.id}><td>{p.emoji} <strong style={{ color: "var(--text)" }}>{p.name}</strong></td><td>{p.category}</td><td style={{ fontSize: "11px" }}>{p.compatible}</td><td style={{ color: "var(--neon)", fontWeight: 700 }}>{fmtUSD(p.price)}</td><td><button className="btn-sm btn-sm-red" onClick={() => removePart(p.id)}>Del</button></td></tr>)}</tbody></table></div></div>
          </div>
        )}

        {/* Orders */}
        {tab === "orders" && (
          <div>
            <div className="adm-hd"><div className="adm-pg-title">Orders ({orders.length})</div></div>
            {orders.map(o => (
              <div key={o.id} className="adm-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
                  <div><div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "17px" }}>{o.item}</div><div style={{ fontSize: "12px", color: "var(--text2)", marginTop: "3px" }}>{o.id} · {o.customer} · {o.email} · {o.phone}</div></div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}><div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "20px", color: "var(--neon)" }}>{fmtUSD(o.amount)}</div><select className="inp" style={{ width: "auto", fontSize: "10px", padding: "6px 10px" }} value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)}>{["confirmed", "payment_received", "sourcing", "port_china", "ocean_freight", "tema_port", "customs", "ready", "delivered"].map(s => <option key={s} value={s}>{s.replace(/_/g, " ").toUpperCase()}</option>)}</select></div>
                </div>
                <div className="track-line" style={{ marginBottom: "14px" }}>
                  {o.tracking.map((step, i) => <div key={i} className="track-step"><div className={`track-dot${step.done ? " done" : step.active ? " active" : ""}`}>{step.done ? "✓" : step.active ? "●" : ""}</div><div style={{ fontSize: "12px", color: step.done ? "var(--text)" : "var(--text2)", fontWeight: 600 }}>{step.step}</div><div style={{ fontSize: "10px", color: "var(--text3)" }}>{step.date}</div></div>)}
                </div>
                <div style={{ display: "flex", gap: "8px" }}><button className="btn-sm btn-sm-neon">Generate Invoice</button><button className="btn-sm btn-sm-ghost">Send Update</button></div>
              </div>
            ))}
          </div>
        )}

        {/* Inquiries */}
        {tab === "inquiries" && (
          <div>
            <div className="adm-hd"><div className="adm-pg-title">Inquiries</div><span style={{ color: "var(--neon)", fontSize: "13px", fontWeight: 700 }}>{inquiries.filter(i => i.status === "new").length} new</span></div>
            {inquiries.map(inq => (
              <div key={inq.id} className="adm-card" style={{ borderLeft: `3px solid ${inq.status === "new" ? "var(--neon)" : "var(--border)"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}><div><div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "14px" }}>{inq.name}</div><div style={{ fontSize: "11px", color: "var(--text2)" }}>{inq.email} · {inq.phone} · {inq.date}</div></div><div style={{ display: "flex", gap: "6px" }}><span className="tag tag-2">{inq.type}</span><span className={`tag${inq.status === "new" ? " tag-3" : " tag-g"}`}>{inq.status}</span></div></div>
                <div style={{ fontWeight: 600, fontSize: "13px", color: "var(--neon2)", marginBottom: "5px" }}>{inq.subject}</div>
                <div style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.7, marginBottom: "12px" }}>{inq.message}</div>
                <div style={{ display: "flex", gap: "8px" }}><button className="btn-sm btn-sm-neon" onClick={() => handleMarkReplied(inq.id)}>{inq.status === "new" ? "Mark Replied" : "Replied ✓"}</button><button className="btn-sm btn-sm-ghost">Send Quote</button><button className="btn-sm btn-sm-ghost">Create Order</button></div>
              </div>
            ))}
          </div>
        )}

        {/* Invoices */}
        {tab === "invoices" && (
          <div>
            <div className="adm-hd"><div className="adm-pg-title">Invoices & Documents</div><button className="btn-p">+ Create Invoice</button></div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>{["Commercial Invoice", "Pro-Forma", "Customs Declaration", "Bill of Lading"].map(d => <button key={d} className="btn-sm btn-sm-ghost">{d}</button>)}</div>
            <div className="adm-card"><table className="adm-table"><thead><tr><th>Invoice #</th><th>Order</th><th>Customer</th><th>Amount</th><th>Date</th><th>Action</th></tr></thead><tbody>{orders.map((o, i) => <tr key={o.id}><td style={{ color: "var(--neon)", fontFamily: "monospace" }}>INV-2024-{String(i + 1).padStart(3, "0")}</td><td style={{ fontSize: "11px" }}>{o.id}</td><td style={{ color: "var(--text)" }}>{o.customer}</td><td style={{ color: "var(--neon)", fontWeight: 700 }}>{fmtUSD(o.amount)}</td><td>{o.date}</td><td><button className="btn-sm btn-sm-neon">PDF</button></td></tr>)}</tbody></table></div>
          </div>
        )}

        {/* Settings */}
        {tab === "settings" && (
          <div>
            <div className="adm-hd">
              <div className="adm-pg-title">Settings</div>
              <button className="btn-p" onClick={saveSettings}>Save All Changes</button>
            </div>
            {saveOk && <div className="alert al-ok" style={{ marginBottom: "16px" }}>✓ Settings saved successfully!</div>}

            {/* ── THEME ── */}
            <div className="adm-card" style={{ marginBottom: "14px" }}>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "16px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                🎨 Theme & Colors
              </div>

              {/* Presets */}
              <div style={{ marginBottom: "18px" }}>
                <label className="lbl">Quick Presets</label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {Object.keys(PRESETS).map(name => (
                    <button key={name} className="preset-btn" onClick={() => applyPreset(name)}
                      style={{ borderColor: `color-mix(in srgb,${PRESETS[name].accent1} 60%,transparent)`, position: "relative" }}>
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: PRESETS[name].accent1, display: "inline-block", marginRight: "6px", verticalAlign: "middle" }} />
                      {name}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "8px" }}>Click a preset to apply, then fine-tune below and Save.</div>
              </div>

              {/* Color groups */}
              {colorGroups.map(grp => (
                <div key={grp.title} className="theme-group">
                  <div className="theme-group-title">{grp.title}</div>
                  <div className="theme-color-row">
                    {grp.keys.map(([key, label]) => (
                      <ColorPick key={key} label={label}
                        value={editS.theme?.[key] || DEFAULT_THEME[key] || "#000000"}
                        onChange={val => setEditS(prev => ({ ...prev, theme: { ...(prev.theme || DEFAULT_THEME), [key]: val } }))}
                      />
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ background: "var(--bg4)", border: "1px solid var(--border2)", borderRadius: "8px", padding: "14px", marginTop: "12px" }}>
                <div style={{ fontSize: "11px", color: "var(--text2)", lineHeight: 1.7 }}>
                  💡 <strong>Tip:</strong> Changes preview live on the site after saving. Use the "View Website" link in the sidebar to see your theme in action.
                </div>
              </div>
            </div>

            {/* ── HERO SLIDES ── */}
            <div className="adm-card" style={{ marginBottom: "14px" }}>
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "16px", marginBottom: "18px" }}>🖼️ Hero Slideshow</div>
              <div style={{ marginBottom: "14px" }}>
                {(editS.heroSlides || []).map((slide, i) => (
                  <div key={slide.id} className="slide-item">
                    {slide.image ? <img src={slide.image} className="slide-thumb" alt="" /> : <div className="slide-thumb-ph">🖼️</div>}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)" }}>Slide {i + 1}</div>
                      <div style={{ fontSize: "10px", color: "var(--text3)" }}>{slide.image ? "Image uploaded" : "No image — gradient shown"}</div>
                    </div>
                    <label style={{ cursor: "none" }}>
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                        const f = e.target.files[0]; if (!f) return;
                        const r = new FileReader(); r.onload = ev => {
                          setEditS(prev => ({ ...prev, heroSlides: prev.heroSlides.map((s, j) => j === i ? { ...s, image: ev.target.result } : s) }));
                        }; r.readAsDataURL(f);
                      }} />
                      <span className="btn-sm btn-sm-neon" style={{ cursor: "none" }}>Upload</span>
                    </label>
                    {slide.image && <button className="btn-sm btn-sm-ghost" onClick={() => setEditS(prev => ({ ...prev, heroSlides: prev.heroSlides.map((s, j) => j === i ? { ...s, image: null } : s) }))}>Clear</button>}
                    {(editS.heroSlides || []).length > 1 && <button className="btn-sm btn-sm-red" onClick={() => setEditS(prev => ({ ...prev, heroSlides: prev.heroSlides.filter((_, j) => j !== i) }))}>Del</button>}
                  </div>
                ))}
              </div>
              {(editS.heroSlides || []).length < 8 && (
                <button className="btn-sm btn-sm-neon" onClick={() => setEditS(prev => ({ ...prev, heroSlides: [...(prev.heroSlides || []), { id: Date.now(), image: null }] }))}>+ Add Slide</button>
              )}
              <div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "10px" }}>Max 8 slides. Each slide without an image shows a gradient background. Slides auto-advance every 6 seconds.</div>
            </div>

            {/* ── BRAND ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
              <div className="adm-card">
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "15px", marginBottom: "18px" }}>🏢 Brand Identity</div>
                <div className="fg"><label className="lbl">Company Name</label><input className="inp" value={editS.companyName} onChange={e => setEditS({ ...editS, companyName: e.target.value })} /></div>
                <div className="fg"><label className="lbl">Tagline</label><input className="inp" value={editS.tagline} onChange={e => setEditS({ ...editS, tagline: e.target.value })} /></div>
                <ImgUp label="Company Logo" images={editS.logo ? [editS.logo] : []} onChange={imgs => setEditS({ ...editS, logo: Array.isArray(imgs) ? (imgs[0] || null) : (imgs ? imgs[0] : null) })} single multiple={false} />
              </div>
              <div className="adm-card">
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "15px", marginBottom: "18px" }}>📞 Contact Details</div>
                {[["Email", "email"], ["Phone", "phone"], ["WhatsApp", "whatsapp"], ["Address", "address"]].map(([l, k]) => <div key={k} className="fg"><label className="lbl">{l}</label><input className="inp" value={editS[k]} onChange={e => setEditS({ ...editS, [k]: e.target.value })} /></div>)}
              </div>
            </div>

            {/* ── DISPLAY SETTINGS ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
              <div className="adm-card">
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "15px", marginBottom: "18px" }}>💰 Pricing Display</div>
                <div style={{ marginBottom: "16px" }}><Tgl on={editS.showPricesGlobal} onChange={() => setEditS({ ...editS, showPricesGlobal: !editS.showPricesGlobal })} label="Show prices globally" /><div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "6px" }}>When off, all prices show "Price on Request". Override per vehicle in the Vehicles tab.</div></div>
                <div style={{ marginBottom: "16px" }}><Tgl on={editS.showGhsPrice} onChange={() => setEditS({ ...editS, showGhsPrice: !editS.showGhsPrice })} label="Show GHS equivalent prices" /></div>
                <div className="fg"><label className="lbl">USD → GHS Rate</label><input className="inp" type="number" step="0.1" value={editS.ghsRate} onChange={e => setEditS({ ...editS, ghsRate: +e.target.value })} /><div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "5px" }}>Update this manually to keep GHS prices accurate.</div></div>
              </div>
              <div className="adm-card">
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "15px", marginBottom: "18px" }}>📢 Announcement Bar</div>
                <div style={{ marginBottom: "14px" }}><Tgl on={editS.annBarOn} onChange={() => setEditS({ ...editS, annBarOn: !editS.annBarOn })} label="Show announcement bar" /></div>
                <div className="fg"><label className="lbl">Message Text</label><input className="inp" value={editS.annBarText} onChange={e => setEditS({ ...editS, annBarText: e.target.value })} /></div>
                <div className="fg"><label className="lbl">Link Text (optional)</label><input className="inp" placeholder="e.g. Shop Now" value={editS.annBarLink} onChange={e => setEditS({ ...editS, annBarLink: e.target.value })} /></div>
              </div>
            </div>

            {/* ── TESTIMONIALS ── */}
            <div className="adm-card" style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "15px" }}>⭐ Testimonials</div>
                <button className="btn-sm btn-sm-neon" onClick={() => setEditS(prev => ({ ...prev, testimonials: [...(prev.testimonials || []), { id: Date.now(), name: "", role: "", text: "", stars: 5 }] }))}>+ Add</button>
              </div>
              {(editS.testimonials || []).map((t, i) => (
                <div key={t.id} style={{ background: "var(--bg4)", border: "1px solid var(--border2)", borderRadius: "8px", padding: "16px", marginBottom: "10px" }}>
                  <div className="frow" style={{ marginBottom: "10px" }}>
                    <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Name</label><input className="inp" value={t.name} onChange={e => setEditS(prev => ({ ...prev, testimonials: prev.testimonials.map((x, j) => j === i ? { ...x, name: e.target.value } : x) }))} /></div>
                    <div className="fg" style={{ marginBottom: 0 }}><label className="lbl">Role / Location</label><input className="inp" value={t.role} onChange={e => setEditS(prev => ({ ...prev, testimonials: prev.testimonials.map((x, j) => j === i ? { ...x, role: e.target.value } : x) }))} /></div>
                  </div>
                  <div className="fg" style={{ marginBottom: "8px" }}><label className="lbl">Testimonial Text</label><textarea className="inp" rows={2} value={t.text} onChange={e => setEditS(prev => ({ ...prev, testimonials: prev.testimonials.map((x, j) => j === i ? { ...x, text: e.target.value } : x) }))} /></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "4px" }}>{[1, 2, 3, 4, 5].map(s => <button key={s} style={{ background: "none", border: "none", cursor: "none", fontSize: "16px", color: s <= t.stars ? "var(--neon)" : "var(--text3)" }} onClick={() => setEditS(prev => ({ ...prev, testimonials: prev.testimonials.map((x, j) => j === i ? { ...x, stars: s } : x) }))}>{s <= t.stars ? "★" : "☆"}</button>)}</div>
                    <button className="btn-sm btn-sm-red" onClick={() => setEditS(prev => ({ ...prev, testimonials: prev.testimonials.filter((_, j) => j !== i) }))}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── CREDENTIALS ── */}
            <div className="adm-card">
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "15px", marginBottom: "18px" }}>🔐 Admin Credentials</div>
              <div className="frow">
                <div className="fg"><label className="lbl">Admin Email</label><input className="inp" defaultValue="admin@jaybesin.com" /></div>
                <div className="fg"><label className="lbl">New Password</label><input className="inp" type="password" placeholder="••••••••" /></div>
              </div>
              <button className="btn-sm btn-sm-neon">Update Credentials</button>
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Vehicle Modal */}
      {showAddV && (
        <div className="mo" onClick={() => { setShowAddV(false); setEditVId(null) }}>
          <div className="mo-box" style={{ maxWidth: "800px" }} onClick={e => e.stopPropagation()}>
            <div className="mo-hd"><div className="mo-title">{editVId ? "Edit Vehicle" : "Add New Vehicle"}</div><button className="btn-sm btn-sm-ghost" onClick={() => { setShowAddV(false); setEditVId(null) }}>✕</button></div>
            <div className="mo-body">
              <div className="frow"><div className="fg"><label className="lbl">Brand</label><input className="inp" placeholder="e.g. BYD" value={newV.brand} onChange={e => setNewV({ ...newV, brand: e.target.value })} /></div><div className="fg"><label className="lbl">Model</label><input className="inp" placeholder="e.g. Han EV" value={newV.model} onChange={e => setNewV({ ...newV, model: e.target.value })} /></div></div>
              <div className="frow"><div className="fg"><label className="lbl">Year</label><input className="inp" type="number" value={newV.year} onChange={e => setNewV({ ...newV, year: +e.target.value })} /></div><div className="fg"><label className="lbl">Emoji Icon</label><input className="inp" value={newV.emoji} onChange={e => setNewV({ ...newV, emoji: e.target.value })} /></div></div>
              <div className="frow"><div className="fg"><label className="lbl">Vehicle Type</label><select className="inp" value={newV.type} onChange={e => setNewV({ ...newV, type: e.target.value })}>{["Saloon", "SUV", "4x4", "Hatchback", "MPV", "Pickup"].map(t => <option key={t}>{t}</option>)}</select></div><div className="fg"><label className="lbl">Fuel Type</label><select className="inp" value={newV.fuel} onChange={e => setNewV({ ...newV, fuel: e.target.value })}>{["Electric", "Hybrid", "Gasoline", "Diesel"].map(t => <option key={t}>{t}</option>)}</select></div></div>
              <div className="frow"><div className="fg"><label className="lbl">Drivetrain</label><select className="inp" value={newV.drivetrain} onChange={e => setNewV({ ...newV, drivetrain: e.target.value })}>{["2WD", "AWD", "4WD", "RWD"].map(t => <option key={t}>{t}</option>)}</select></div><div className="fg"><label className="lbl">Availability</label><select className="inp" value={newV.availability} onChange={e => setNewV({ ...newV, availability: e.target.value })}><option value="in_stock">In Stock — Ghana</option><option value="preorder">Pre-Order</option></select></div></div>
              <div className="frow"><div className="fg"><label className="lbl">FOB Price (USD)</label><input className="inp" type="number" value={newV.price} onChange={e => setNewV({ ...newV, price: e.target.value })} /></div><div className="fg"><label className="lbl">Ghana Duties (USD)</label><input className="inp" type="number" value={newV.duties} onChange={e => setNewV({ ...newV, duties: e.target.value })} /></div></div>
              <div className="fg"><label className="lbl">Total Ghana Price (USD)</label><input className="inp" type="number" value={newV.totalGhana} onChange={e => setNewV({ ...newV, totalGhana: e.target.value })} /></div>
              <div className="frow"><div className="fg"><label className="lbl">Range / Mileage</label><input className="inp" placeholder="e.g. 600km" value={newV.specs.range} onChange={e => setNewV({ ...newV, specs: { ...newV.specs, range: e.target.value } })} /></div><div className="fg"><label className="lbl">Power (HP)</label><input className="inp" placeholder="e.g. 300hp" value={newV.specs.power} onChange={e => setNewV({ ...newV, specs: { ...newV.specs, power: e.target.value } })} /></div></div>
              <div className="frow"><div className="fg"><label className="lbl">Acceleration</label><input className="inp" placeholder="e.g. 0–100 in 6.5s" value={newV.specs.acceleration} onChange={e => setNewV({ ...newV, specs: { ...newV.specs, acceleration: e.target.value } })} /></div><div className="fg"><label className="lbl">Engine / Battery</label><input className="inp" placeholder="e.g. 2.0T or 80kWh" value={newV.specs.engine || ""} onChange={e => setNewV({ ...newV, specs: { ...newV.specs, engine: e.target.value, battery: e.target.value } })} /></div></div>
              <div className="fg"><label className="lbl">Description</label><textarea className="inp" rows={3} value={newV.description} onChange={e => setNewV({ ...newV, description: e.target.value })} /></div>
              {/* Brand logo */}
              <ImgUp label="Brand / Vehicle Logo" images={newV.logo ? [newV.logo] : []} onChange={imgs => setNewV({ ...newV, logo: Array.isArray(imgs) ? (imgs[0] || null) : null })} single multiple={false} />
              {/* Multiple car images */}
              <div style={{ marginTop: "14px" }}>
                <ImgUp label="Vehicle Photos (Multiple)" images={newV.images || []} onChange={fn => setNewV(prev => ({ ...prev, images: typeof fn === "function" ? fn(prev.images) : fn }))} multiple single={false} />
              </div>
              <div style={{ display: "flex", gap: "20px", marginTop: "16px", flexWrap: "wrap" }}>
                <Tgl on={newV.featured} onChange={() => setNewV({ ...newV, featured: !newV.featured })} label="Feature on Homepage" />
                <Tgl on={newV.showPrice} onChange={() => setNewV({ ...newV, showPrice: !newV.showPrice })} label="Show Price Publicly" />
              </div>
            </div>
            <div className="mo-ft"><button className="btn-sm btn-sm-ghost" onClick={() => { setShowAddV(false); setEditVId(null) }}>Cancel</button><button className="btn-p" onClick={saveV}>{editVId ? "Save Changes →" : "Add Vehicle →"}</button></div>
          </div>
        </div>
      )}

      {/* Add Charger Modal */}
      {showAddC && (
        <div className="mo" onClick={() => setShowAddC(false)}>
          <div className="mo-box" onClick={e => e.stopPropagation()}>
            <div className="mo-hd"><div className="mo-title">Add Charging Station</div><button className="btn-sm btn-sm-ghost" onClick={() => setShowAddC(false)}>✕</button></div>
            <div className="mo-body">
              <div className="frow"><div className="fg"><label className="lbl">Name</label><input className="inp" value={newC.name} onChange={e => setNewC({ ...newC, name: e.target.value })} /></div><div className="fg"><label className="lbl">Brand</label><input className="inp" value={newC.brand} onChange={e => setNewC({ ...newC, brand: e.target.value })} /></div></div>
              <div className="frow"><div className="fg"><label className="lbl">Type</label><select className="inp" value={newC.type} onChange={e => setNewC({ ...newC, type: e.target.value })}><option>AC</option><option>DC Fast</option><option>DC Ultra</option></select></div><div className="fg"><label className="lbl">Power</label><input className="inp" placeholder="e.g. 22kW" value={newC.power} onChange={e => setNewC({ ...newC, power: e.target.value })} /></div></div>
              <div className="frow"><div className="fg"><label className="lbl">Price (USD)</label><input className="inp" type="number" value={newC.price} onChange={e => setNewC({ ...newC, price: e.target.value })} /></div><div className="fg"><label className="lbl">Installation (USD)</label><input className="inp" type="number" value={newC.installation} onChange={e => setNewC({ ...newC, installation: e.target.value })} /></div></div>
              <div className="fg"><label className="lbl">Emoji</label><input className="inp" value={newC.emoji} onChange={e => setNewC({ ...newC, emoji: e.target.value })} /></div>
            </div>
            <div className="mo-ft"><button className="btn-sm btn-sm-ghost" onClick={() => { setShowAddC(false) }}>Cancel</button><button className="btn-p" onClick={addCharger} disabled={saving}>{saving ? 'Saving…' : 'Add →'}</button></div>
          </div>
        </div>
      )}

      {/* Add Part Modal */}
      {showAddP && (
        <div className="mo" onClick={() => setShowAddP(false)}>
          <div className="mo-box" onClick={e => e.stopPropagation()}>
            <div className="mo-hd"><div className="mo-title">Add Spare Part</div><button className="btn-sm btn-sm-ghost" onClick={() => setShowAddP(false)}>✕</button></div>
            <div className="mo-body">
              <div className="fg"><label className="lbl">Part Name</label><input className="inp" value={newP.name} onChange={e => setNewP({ ...newP, name: e.target.value })} /></div>
              <div className="frow"><div className="fg"><label className="lbl">Category</label><input className="inp" value={newP.category} onChange={e => setNewP({ ...newP, category: e.target.value })} /></div><div className="fg"><label className="lbl">Price (USD)</label><input className="inp" type="number" value={newP.price} onChange={e => setNewP({ ...newP, price: e.target.value })} /></div></div>
              <div className="fg"><label className="lbl">Compatible Vehicles</label><input className="inp" value={newP.compatible} onChange={e => setNewP({ ...newP, compatible: e.target.value })} /></div>
              <div className="fg"><label className="lbl">Emoji Icon</label><input className="inp" value={newP.emoji} onChange={e => setNewP({ ...newP, emoji: e.target.value })} /></div>
            </div>
            <div className="mo-ft"><button className="btn-sm btn-sm-ghost" onClick={() => setShowAddP(false)}>Cancel</button><button className="btn-p" onClick={addPart} disabled={saving}>{saving ? 'Saving…' : 'Add →'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  ROOT APP
// ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("public");
  const [page, setPage] = useState("home");
  const [loggedIn, setLoggedIn] = useState(false);
  const [fbReady, setFbReady] = useState(false);
  const [annVisible, setAnnVisible] = useState(true);

  // ── Data state (populated from Firestore or fallback to local) ──
  const [vehicles, setVehicles] = useState(VEHICLES0);
  const [charging, setCharging] = useState(CHARGING0);
  const [parts, setParts] = useState(PARTS0);
  const [orders, setOrders] = useState(ORDERS0);
  const [inquiries, setInquiries] = useState(INQUIRIES0);
  const [settings, setSettings] = useState(SETTINGS0);

  // ── Firebase Auth observer ──
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) { setLoggedIn(true); setView(v => v === "admin-login" ? "admin" : v); }
      else { setLoggedIn(false); }
      setFbReady(true);
    });
    return () => unsub();
  }, []);

  // ── Firestore real-time listeners ──
  useEffect(() => {
    const u1 = onVehicles(setVehicles);
    const u2 = onCharging(setCharging);
    const u3 = onParts(setParts);
    const u4 = onOrders(setOrders);
    const u5 = onInquiries(setInquiries);
    // Settings (single doc)
    getSettings().then(s => { if (s) setSettings(prev => ({ ...prev, ...s })); });
    return () => { u1(); u2(); u3(); u4(); u5(); };
  }, []);

  const go = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }) };
  const goAdmin = () => { if (loggedIn) setView("admin"); else setView("admin-login") };

  // ── Wrap setters to also write to Firestore ──
  const handleSaveSettings = async (s) => {
    setSettings(s);
    try { await fsaveSettings(s); } catch (e) { console.warn("Settings save:", e); }
  };

  const renderPage = () => {
    if (page === "home") return <HomePage setPage={go} vehicles={vehicles} settings={settings} />;
    if (page === "garage") return <GaragePage vehicles={vehicles} setPage={go} settings={settings} />;
    if (page === "charging") return <ChargingPage charging={charging} />;
    if (page === "parts") return <PartsPage parts={parts} />;
    if (page === "track") return <TrackingPage orders={orders} />;
    if (page === "contact" || page === "services") return <ContactPage settings={settings} />;
    if (page.startsWith("vehicle-")) { const id = parseInt(page.replace("vehicle-", "")); return <VehicleDetailPage vehicle={vehicles.find(x => x.id === id)} setPage={go} settings={settings} /> }
    return <HomePage setPage={go} vehicles={vehicles} settings={settings} />;
  };

  if (!fbReady) return (
    <><GlobalStyles /><ThemeInjector theme={DEFAULT_THEME} />
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", flexDirection: "column", gap: "18px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "3px solid transparent", borderTopColor: "var(--neon)", animation: "spin .8s linear infinite" }} />
        <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
        <div style={{ fontSize: "13px", color: "var(--text2)" }}>Connecting to Firebase…</div>
      </div></>
  );

  if (view === "admin-login") return (
    <><GlobalStyles /><ThemeInjector theme={settings.theme || DEFAULT_THEME} /><Cursor /><div className="grain" />
      <AdminLogin onLogin={() => { setView("admin") }} /></>
  );

  if (view === "admin") return (
    <><GlobalStyles /><ThemeInjector theme={settings.theme || DEFAULT_THEME} /><Cursor /><div className="grain" />
      <AdminPanel
        vehicles={vehicles} setVehicles={setVehicles}
        charging={charging} setCharging={setCharging}
        parts={parts} setParts={setParts}
        orders={orders} setOrders={setOrders}
        inquiries={inquiries} setInquiries={setInquiries}
        settings={settings} setSettings={handleSaveSettings}
        onLogout={async () => { await signOut(auth); setLoggedIn(false); setView("public"); }}
        setView={setView}
        defaultData={{ VEHICLES0, CHARGING0, PARTS0, ORDERS0, SETTINGS0 }}
      /></>
  );

  const annOn = settings.annBarOn && annVisible;

  return (
    <>
      <GlobalStyles />
      <ThemeInjector theme={settings.theme || DEFAULT_THEME} />
      <Cursor />
      <div className="grain" />
      <AnnBar settings={{ ...settings, annBarOn: annOn }} setPage={go} onClose={() => setAnnVisible(false)} />
      <Nav setPage={go} settings={settings} annOn={annOn} />
      <main style={{ paddingTop: annOn ? '98px' : '60px' }}>{renderPage()}</main>
      <Footer setPage={go} onAdminClick={goAdmin} settings={settings} />
      <WAFloat whatsapp={settings.whatsapp} />
    </>
  );
}
