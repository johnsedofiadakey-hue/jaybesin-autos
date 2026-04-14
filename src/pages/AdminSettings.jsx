import React, { useState } from "react";
import { 
  Settings, Save, Palette, Image as ImageIcon, 
  Building, Phone, Globe, DollarSign, ShieldCheck, 
  MessageSquare, Star, Plus, Trash2, ArrowRight
} from "lucide-react";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { ColorPick } from "../components/common/ColorPick";
import { ImgUp } from "../components/common/ImgUp";
import { Tgl } from "../components/common/Tgl";
import { PRESETS, DEFAULT_THEME } from "../constants";
import { PRESETS, DEFAULT_THEME, SETTINGS0 } from "../constants";

export function AdminSettings({ 
  settings = {}, 
  onSaveSettings, 
  onLogout 
}) {
  const [editS, setEditS] = useState(settings);
  const [saveOk, setSaveOk] = useState(false);

  const handleSave = async () => {
    await onSaveSettings(editS);
    setSaveOk(true);
    setTimeout(() => setSaveOk(false), 3000);
  };

  const applyPreset = (name) => {
    setEditS(prev => ({ 
      ...prev, 
      theme: { ...DEFAULT_THEME, ...PRESETS[name] } 
    }));
  };

  const colorGroups = [
    { title: "Brand & Primary", keys: [["accent1", "Primary Neon"], ["accent2", "Secondary Neon"], ["accent3", "Highlight Orange"], ["accent4", "Deep Purple"]] },
    { title: "Backgrounds", keys: [["bgPrimary", "Core BG"], ["bgSecondary", "Surface BG"], ["bgTertiary", "Input BG"], ["bgCard", "Card Surface"]] },
    { title: "Text & Interface", keys: [["textPrimary", "Heading Text"], ["textSecondary", "Body Text"], ["textMuted", "Muted Text"], ["borderHex", "Border Color"]] },
    { title: "Components", keys: [["navBg", "Navbar BG"], ["footerBg", "Footer BG"], ["btnText", "Button Text"]] },
  ];

  return (
    <div className="adm-wrap">
      <AdminSidebar onLogout={onLogout} settings={settings} />
      
      <main className="adm-main">
        <AdminHeader title="System Settings" icon={Settings} />
        
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <button className="btn-p" onClick={handleSave}>
            <Save size={16} /> Save All Changes
          </button>
        </div>

        {saveOk && <div className="alert al-ok" style={{ marginBottom: "20px" }}>✓ Settings saved successfully!</div>}

        {/* ── THEME ── */}
        <div className="adm-card">
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Palette size={20} style={{ color: "var(--accent)" }} /> Theme & Colors
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label className="lbl">Quick Presets</label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
              {Object.keys(PRESETS).map(name => (
                <button 
                  key={name} 
                  className="preset-btn" 
                  onClick={() => applyPreset(name)}
                  style={{ borderColor: `color-mix(in srgb,${PRESETS[name].accent1} 60%,transparent)` }}
                >
                  <span style={{ 
                    width: "12px", height: "12px", borderRadius: "50%", 
                    background: PRESETS[name].accent1, display: "inline-block", 
                    marginRight: "8px", verticalAlign: "middle" 
                  }} />
                  {name}
                </button>
              ))}
            </div>
          </div>

          {colorGroups.map(grp => (
            <div key={grp.title} className="theme-group" style={{ marginBottom: "20px" }}>
              <div className="theme-group-title" style={{ fontSize: "11px", letterSpacing: "1.5px" }}>{grp.title}</div>
              <div className="theme-color-row">
                {grp.keys.map(([key, label]) => (
                  <ColorPick 
                    key={key} 
                    label={label}
                    value={editS.theme?.[key] || DEFAULT_THEME[key] || "#000000"}
                    onChange={val => setEditS(prev => ({ 
                      ...prev, 
                      theme: { ...(prev.theme || DEFAULT_THEME), [key]: val } 
                    }))}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── BRANDING ── */}
        <div className="adm-split">
          <div className="adm-card">
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "16px", marginBottom: "18px" }}>
              <Building size={18} style={{ color: "var(--accent)" }} /> Brand Identity
            </div>
            <div className="fg">
              <label className="lbl">Company Name</label>
              <input className="inp" value={editS.companyName} onChange={e => setEditS({ ...editS, companyName: e.target.value })} />
            </div>
            <div className="fg">
              <label className="lbl">Tagline</label>
              <input className="inp" value={editS.tagline} onChange={e => setEditS({ ...editS, tagline: e.target.value })} />
            </div>
            <ImgUp 
              label="Company Logo" 
              images={editS.logo ? [editS.logo] : []} 
              onChange={imgs => setEditS({ ...editS, logo: Array.isArray(imgs) ? (imgs[0] || null) : imgs })} 
              single 
              multiple={false} 
            />
          </div>

          <div className="adm-card">
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "16px", marginBottom: "18px" }}>
              <Phone size={18} style={{ color: "var(--accent)" }} /> Contact Details
            </div>
            {[
              ["Email Address", "email"], 
              ["Phone Number", "phone"], 
              ["WhatsApp Business", "whatsapp"], 
              ["Physical Address", "address"]
            ].map(([l, k]) => (
              <div key={k} className="fg">
                <label className="lbl">{l}</label>
                <input className="inp" value={editS[k]} onChange={e => setEditS({ ...editS, [k]: e.target.value })} />
              </div>
            ))}
          </div>
        </div>

        {/* ── PRICING & LOGISTICS ── */}
        <div className="adm-split">
          <div className="adm-card">
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "16px", marginBottom: "18px" }}>
              <DollarSign size={18} style={{ color: "var(--accent)" }} /> Financial Protocols
            </div>
            <div style={{ marginBottom: "20px" }}>
              <Tgl on={editS.showPricesGlobal} onChange={() => setEditS({ ...editS, showPricesGlobal: !editS.showPricesGlobal })} label="Public Price Visibility" />
            </div>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '11px' }}>
              <strong>Policy:</strong> Strict USD billing enforced. All GHS conversions have been deprecated from the public interface to ensure pricing integrity.
            </div>
          </div>

          <div className="adm-card">
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "16px", marginBottom: "18px" }}>
              <ShieldCheck size={18} style={{ color: "var(--accent)" }} /> Settlement Details
            </div>
            <div className="fg"><label className="lbl">Financial Institution</label><input className="inp" value={editS.bankName} onChange={e => setEditS({ ...editS, bankName: e.target.value })} /></div>
            <div className="fg"><label className="lbl">Beneficiary Identity</label><input className="inp" value={editS.accName} onChange={e => setEditS({ ...editS, accName: e.target.value })} /></div>
            <div className="fg"><label className="lbl">Account Reference</label><input className="inp" value={editS.accNo} onChange={e => setEditS({ ...editS, accNo: e.target.value })} /></div>
          </div>
        </div>
      </main>
    </div>
  );
}
