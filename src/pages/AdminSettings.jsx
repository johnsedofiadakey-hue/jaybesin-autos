import React, { useState } from "react";
import { 
  Settings, Save, Palette, Image as ImageIcon, 
  Building, Phone, Globe, DollarSign, ShieldCheck, 
  MessageSquare, Star, Plus, Trash2, ArrowRight,
  Clock, Ship, Share2, Megaphone, Layout, Activity
} from "lucide-react";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { ColorPick } from "../components/common/ColorPick";
import { ImgUp } from "../components/common/ImgUp";
import { Tgl } from "../components/common/Tgl";
import { PRESETS, DEFAULT_THEME } from "../constants";

export function AdminSettings({ 
  settings = {}, 
  onSaveSettings, 
  onLogout 
}) {
  const [editS, setEditS] = useState(settings);
  const [saveOk, setSaveOk] = useState(false);
  const [activeTab, setActiveTab] = useState("branding");

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

  const adminTabs = [
    { id: "branding", label: "Branding & Hero", icon: Building },
    { id: "visuals", label: "Theme & Colors", icon: Palette },
    { id: "logistics", label: "Logistics & Finance", icon: Ship },
    { id: "contact", label: "Contact & Social", icon: Phone },
  ];

  return (
    <div className="adm-wrap">
      <AdminSidebar onLogout={onLogout} settings={settings} />
      
      <main className="adm-main">
        <AdminHeader title="Platform Intelligence Hub" icon={Settings} />
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "8px", background: "rgba(255,255,255,0.03)", padding: "4px", borderRadius: "12px", border: "1px solid var(--border)" }}>
            {adminTabs.map(t => (
              <button 
                key={t.id} 
                onClick={() => setActiveTab(t.id)}
                style={{ 
                  display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "8px", border: "none", fontSize: "12px", fontWeight: 700, cursor: "pointer",
                  background: activeTab === t.id ? "var(--accent)" : "transparent",
                  color: activeTab === t.id ? "#fff" : "var(--text-dim)"
                }}
              >
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>
          <button className="btn-p" onClick={handleSave} style={{ height: '44px', padding: '0 24px' }}>
            <Save size={16} /> Update Protocol
          </button>
        </div>

        {saveOk && <div className="alert al-ok" style={{ marginBottom: "20px" }}>✓ Operational parameters updated successfully!</div>}

        {/* ── BRANDING & HERO ── */}
        {activeTab === "branding" && (
          <div style={{ display: 'grid', gap: '20px' }}>
            <div className="adm-card">
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <Megaphone size={20} style={{ color: "var(--accent)" }} /> Hero & Announcements
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                <div>
                  <div className="fg"><label className="lbl">Hero Primary Heading</label><input className="inp" value={editS.heroTitle || ""} onChange={e => setEditS({ ...editS, heroTitle: e.target.value })} /></div>
                  <div className="fg"><label className="lbl">Hero Secondary Hook</label><textarea className="inp" rows={3} value={editS.heroSubtitle || ""} onChange={e => setEditS({ ...editS, heroSubtitle: e.target.value })} /></div>
                </div>
                <div>
                  <ImgUp label="Hero Dynamic Background" images={editS.heroBg ? [editS.heroBg] : []} onChange={imgs => setEditS({ ...editS, heroBg: Array.isArray(imgs) ? (imgs[0] || null) : imgs })} single />
                </div>
              </div>
              <div style={{ marginTop: '24px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div className="lbl" style={{ margin: 0 }}>Global Announcement Bar</div>
                  <Tgl on={editS.annBarOn} onChange={() => setEditS({ ...editS, annBarOn: !editS.annBarOn })} />
                </div>
                <input className="inp" placeholder="Current promotional transmission..." value={editS.annBarText || ""} onChange={e => setEditS({ ...editS, annBarText: e.target.value })} />
              </div>
            </div>

            <div className="adm-card">
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "18px", marginBottom: "20px" }}>Identity Artifacts</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px" }}>
                <div className="fg"><label className="lbl">Platform Name</label><input className="inp" value={editS.companyName || ""} onChange={e => setEditS({ ...editS, companyName: e.target.value })} /></div>
                <div className="fg"><label className="lbl">Brand Tagline</label><input className="inp" value={editS.tagline || ""} onChange={e => setEditS({ ...editS, tagline: e.target.value })} /></div>
                <div>
                  <ImgUp label="Primary Logo" images={editS.logo ? [editS.logo] : []} onChange={imgs => setEditS({ ...editS, logo: Array.isArray(imgs) ? (imgs[0] || null) : imgs })} single multiple={false} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── VISUALS & THEME ── */}
        {activeTab === "visuals" && (
          <div className="adm-card">
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Palette size={20} style={{ color: "var(--accent)" }} /> Color Matrix & Presets
            </div>

            <div style={{ marginBottom: "32px", padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <label className="lbl" style={{ marginBottom: '12px' }}>Operational Skin Selector</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {Object.keys(PRESETS).map(name => (
                  <button 
                    key={name} 
                    className="preset-btn" 
                    onClick={() => applyPreset(name)}
                    style={{ 
                      padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: '11px', fontWeight: 700,
                      borderColor: `color-mix(in srgb,${PRESETS[name].accent1} 40%,transparent)`
                    }}
                  >
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: PRESETS[name].accent1, display: "inline-block", marginRight: "8px" }} />
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              {colorGroups.map(grp => (
                <div key={grp.title}>
                  <div style={{ fontSize: "10px", letterSpacing: "1px", fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px', color: 'var(--accent)' }}>{grp.title}</div>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {grp.keys.map(([key, label]) => (
                      <ColorPick 
                        key={key} 
                        label={label}
                        value={editS.theme?.[key] || DEFAULT_THEME[key]}
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
          </div>
        )}

        {/* ── LOGISTICS & FINANCE ── */}
        {activeTab === "logistics" && (
          <div style={{ display: 'grid', gap: '20px' }}>
            <div className="adm-card">
              <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <Clock size={20} style={{ color: "var(--accent)" }} /> Operational Timeline Defaults
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="fg">
                  <label className="lbl">Default Global Lead Time (Days)</label>
                  <input className="inp" type="number" value={editS.importLeadTimeDays || ""} onChange={e => setEditS({ ...editS, importLeadTimeDays: Number(e.target.value) })} />
                </div>
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Activity size={20} style={{ color: 'var(--accent)' }} />
                  <div>
                    <div style={{ fontWeight: 800 }}>Lead Time Intelligence</div>
                    <div style={{ opacity: 0.6 }}>This value serves as the primary metric for vehicle acquisition dossiers.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="adm-split">
              <div className="adm-card">
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "18px", marginBottom: "20px" }}>Financial Oversight</div>
                <div style={{ marginBottom: "20px" }}>
                  <Tgl on={editS.showPricesGlobal} onChange={() => setEditS({ ...editS, showPricesGlobal: !editS.showPricesGlobal })} label="Public Marketplace Pricing" />
                </div>
                <div style={{ padding: '16px', background: 'rgba(0,113,227,0.05)', borderRadius: '12px', border: '1px solid rgba(0,113,227,0.2)', fontSize: '11px', color: 'var(--accent)' }}>
                  <strong>Currency Protocol:</strong> Platform remains locked to USD (United States Dollar) to mitigate volatility.
                </div>
              </div>

              <div className="adm-card">
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "18px", marginBottom: "20px" }}>Transactional Routing</div>
                <div className="fg"><label className="lbl">Bank Label</label><input className="inp" value={editS.bankName || ""} onChange={e => setEditS({ ...editS, bankName: e.target.value })} /></div>
                <div className="fg"><label className="lbl">Account Holder Identity</label><input className="inp" value={editS.accName || ""} onChange={e => setEditS({ ...editS, accName: e.target.value })} /></div>
                <div className="fg"><label className="lbl">Account Reference Number</label><input className="inp" value={editS.accNo || ""} onChange={e => setEditS({ ...editS, accNo: e.target.value })} /></div>
              </div>
            </div>
          </div>
        )}

        {/* ── CONTACT & SOCIAL ── */}
        {activeTab === "contact" && (
          <div className="adm-card">
            <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: "18px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Share2 size={20} style={{ color: "var(--accent)" }} /> Communication Channels
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div>
                <div className="fg"><label className="lbl">Primary Support Email</label><input className="inp" value={editS.email || ""} onChange={e => setEditS({ ...editS, email: e.target.value })} /></div>
                <div className="fg"><label className="lbl">Logistics Hot-line</label><input className="inp" value={editS.phone || ""} onChange={e => setEditS({ ...editS, phone: e.target.value })} /></div>
              </div>
              <div>
                <div className="fg"><label className="lbl">WhatsApp Business Terminal</label><input className="inp" value={editS.whatsapp || ""} onChange={e => setEditS({ ...editS, whatsapp: e.target.value })} /></div>
                <div className="fg"><label className="lbl">Physical Operational Base</label><input className="inp" value={editS.address || ""} onChange={e => setEditS({ ...editS, address: e.target.value })} /></div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
