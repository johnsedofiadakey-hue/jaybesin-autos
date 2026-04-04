import React, { useState } from "react";
import { Zap, Wrench, Plus, Edit3, Trash2, Search } from "lucide-react";
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
  const [tab, setTab] = useState("charging"); // charging | parts
  const [search, setSearch] = useState("");

  const filteredItems = (tab === "charging" ? charging : parts).filter(item => 
    (item.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="adm-wrap">
      <AdminSidebar onLogout={onLogout} settings={settings} />
      
      <main className="adm-main">
        <AdminHeader 
          title={tab === "charging" ? "EV Charging Stations" : "Spare Parts"} 
          icon={tab === "charging" ? Zap : Wrench} 
          onAction={() => tab === "charging" ? onSaveCharger({}) : onSavePart({})}
          actionLabel={tab === "charging" ? "Add Charger" : "Add Spare Part"}
        />

        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", borderBottom: "1px solid var(--border2)", paddingBottom: "12px" }}>
          <button 
            className={`btn-sm ${tab === "charging" ? "btn-sm-neon" : "btn-sm-ghost"}`}
            onClick={() => setTab("charging")}
          >
            <Zap size={14} /> Charging Stations ({charging.length})
          </button>
          <button 
            className={`btn-sm ${tab === "parts" ? "btn-sm-neon" : "btn-sm-ghost"}`}
            onClick={() => setTab("parts")}
          >
            <Wrench size={14} /> Spare Parts ({parts.length})
          </button>
        </div>

        <div className="adm-card" style={{ padding: "12px 18px", display: "flex", gap: "14px", alignItems: "center" }}>
          <Search size={18} style={{ color: "var(--text3)" }} />
          <input 
            className="inp" 
            placeholder="Search items..." 
            style={{ border: "none", background: "none", padding: 0 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="adm-card" style={{ marginTop: "24px" }}>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category / Type</th>
                  <th>Price</th>
                  <th>Info</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "20px" }}>{item.emoji || (tab === "charging" ? "🔌" : "⚙️")}</span>
                        <div style={{ fontWeight: 700 }}>{item.name}</div>
                      </div>
                    </td>
                    <td><span className="tag tag-dim">{item.category || item.brand || item.type}</span></td>
                    <td><div style={{ color: "var(--neon)", fontWeight: 800 }}>{fmtUSD(item.price)}</div></td>
                    <td style={{ fontSize: "11px", color: "var(--text3)" }}>
                      {tab === "charging" ? `${item.power || ""} · Install: ${fmtUSD(item.installation)}` : item.compatible}
                    </td>
                    <td style={{ display: "flex", gap: "6px" }}>
                      <button className="btn-sm btn-sm-ghost" onClick={() => tab === "charging" ? onSaveCharger(item) : onSavePart(item)}>
                        <Edit3 size={12} />
                      </button>
                      <button className="btn-sm btn-sm-red" onClick={() => tab === "charging" ? onDeleteCharger(item.id) : onDeletePart(item.id)}>
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredItems.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px", opacity: 0.5 }}>
              No items matching your search.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
