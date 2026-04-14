import React, { useState } from "react";
import { Zap, Wrench, Plus, Edit3, Trash2, Search, Package, Hash, Activity } from "lucide-react";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { fmtUSD } from "../utils/theme";

export function AdminChargingParts({ 
  charging = [], 
  parts = [], 
  onSaveCharger, 
  onDeleteCharger, 
  onSavePart, 
  onDeletePart,
  onLogout, 
  settings = {} 
}) {
  const [tab, setTab] = useState("charging"); 
  const [search, setSearch] = useState("");

  const filteredItems = (tab === "charging" ? charging : parts).filter(item => 
    (item.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="adm-wrap">
      <AdminSidebar onLogout={onLogout} settings={settings} />
      
      <main className="adm-main">
        <AdminHeader 
          title="Infrastructure & Components" 
          icon={tab === "charging" ? Zap : Wrench} 
        />

        {/* Protocol Tabs */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <button 
            className="adm-card"
            style={{ 
              flex: 1, padding: '20px', textAlign: 'left', cursor: 'pointer',
              border: `2px solid ${tab === 'charging' ? 'var(--accent)' : 'var(--border)'}`,
              background: tab === 'charging' ? 'rgba(255,255,255,0.02)' : 'var(--bg)'
            }}
            onClick={() => setTab("charging")}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <Zap size={20} color={tab === 'charging' ? 'var(--accent)' : 'var(--text-dim)'} />
              <span style={{ fontSize: '10px', fontWeight: 800, opacity: 0.5 }}>ACTIVE STATIONS</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800 }}>Charging Infrastructure</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>{charging.length} Registered Units</div>
          </button>

          <button 
            className="adm-card"
            style={{ 
              flex: 1, padding: '20px', textAlign: 'left', cursor: 'pointer',
              border: `2px solid ${tab === 'parts' ? 'var(--accent)' : 'var(--border)'}`,
              background: tab === 'parts' ? 'rgba(255,255,255,0.02)' : 'var(--bg)'
            }}
            onClick={() => setTab("parts")}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <Wrench size={20} color={tab === 'parts' ? 'var(--accent)' : 'var(--text-dim)'} />
              <span style={{ fontSize: '10px', fontWeight: 800, opacity: 0.5 }}>COMPONENT INVENTORY</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800 }}>Spare Parts Arsenal</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>{parts.length} Logged Items</div>
          </button>
        </div>

        {/* Action Bar */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <div className="adm-card" style={{ flex: 1, padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Search size={18} style={{ opacity: 0.3 }} />
            <input 
              className="inp" 
              placeholder="Search registry by item name or category..." 
              style={{ border: 'none', background: 'none' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-p" style={{ padding: '0 24px', height: '52px' }} onClick={() => tab === "charging" ? onSaveCharger({}) : onSavePart({})}>
            <Plus size={18} /> Add {tab === 'charging' ? 'Station' : 'Component'}
          </button>
        </div>

        <div className="adm-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Identity / Class</th>
                  <th>Categorization</th>
                  <th>Valuation (USD)</th>
                  <th>Specifications</th>
                  <th style={{ textAlign: 'right' }}>Management</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div className="dc-icon" style={{ width: '36px', height: '36px', fontSize: '18px' }}>
                          {item.emoji || (tab === "charging" ? "🔌" : "⚙️")}
                        </div>
                        <div style={{ fontWeight: 800 }}>{item.name}</div>
                      </div>
                    </td>
                    <td><span className="tag">{item.category || item.brand || item.type}</span></td>
                    <td><div style={{ fontWeight: 800, color: "var(--accent)" }}>{fmtUSD(item.price)}</div></td>
                    <td style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-dim)" }}>
                      {tab === "charging" ? `${item.power || "N/A Power"} · Install: ${fmtUSD(item.installation)}` : item.compatible}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn-sm-ghost" style={{ padding: '8px' }} onClick={() => tab === "charging" ? onSaveCharger(item) : onSavePart(item)}>
                          <Edit3 size={14} />
                        </button>
                        <button 
                          style={{ padding: '8px', background: 'rgba(255,74,90,0.05)', border: '1px solid #FF4A5A', borderRadius: '6px', color: '#FF4A5A', cursor: 'pointer' }}
                          onClick={() => tab === "charging" ? onDeleteCharger(item.id) : onDeletePart(item.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
