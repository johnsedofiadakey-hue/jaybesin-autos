import React, { useState } from "react";
import { Package, Plus, Search, Filter, Edit3, Trash2, Car, Zap, Wrench } from "lucide-react";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { fmtUSD } from "../utils/theme";

export function AdminInventory({ 
  vehicles = [], 
  cars = [], // Marketplace cars
  onSaveVehicle, 
  onDeleteVehicle, 
  onSaveCar, 
  onDeleteCar,
  onLogout, 
  settings = {} 
}) {
  const [tab, setTab] = useState("marketplace"); // marketplace | legacy
  const [search, setSearch] = useState("");

  const filteredCars = (tab === "marketplace" ? cars : vehicles).filter(c => 
    `${c.brand} ${c.model}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="adm-wrap">
      <AdminSidebar onLogout={onLogout} settings={settings} />
      
      <main className="adm-main">
        <AdminHeader 
          title="Vehicle Inventory" 
          icon={Package} 
          onAction={() => tab === "marketplace" ? onSaveCar({}) : onSaveVehicle({})}
          actionLabel={tab === "marketplace" ? "Add Marketplace Car" : "Add Legacy Vehicle"}
        />

        {/* Inventory Tabs */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", borderBottom: "1px solid var(--border2)", paddingBottom: "12px" }}>
          <button 
            className={`btn-sm ${tab === "marketplace" ? "btn-sm-neon" : "btn-sm-ghost"}`}
            onClick={() => setTab("marketplace")}
          >
            Marketplace Cars ({cars.length})
          </button>
          <button 
            className={`btn-sm ${tab === "legacy" ? "btn-sm-neon" : "btn-sm-ghost"}`}
            onClick={() => setTab("legacy")}
          >
            Legacy Inventory ({vehicles.length})
          </button>
        </div>

        {/* Search / Filter Bar */}
        <div className="adm-card" style={{ padding: "12px 18px", display: "flex", gap: "14px", alignItems: "center" }}>
          <Search size={18} style={{ color: "var(--text3)" }} />
          <input 
            className="inp" 
            placeholder="Search by brand or model..." 
            style={{ border: "none", background: "none", padding: 0 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Grid View */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", marginTop: "24px" }}>
          {filteredCars.map(c => (
            <div key={c.id} className="adm-card" style={{ padding: "0", overflow: "hidden" }}>
              <div style={{ position: "relative", height: "160px", background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {c.images && c.images[0] ? (
                  <img src={c.images[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                ) : (
                  <Car size={48} opacity={0.1} />
                )}
                <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "4px" }}>
                  <button 
                   className="btn-sm btn-sm-ghost" 
                   style={{ width: "28px", height: "28px", padding: 0, justifyContent: "center" }}
                   onClick={() => tab === "marketplace" ? onSaveCar(c) : onSaveVehicle(c)}
                  >
                    <Edit3 size={14} />
                  </button>
                  <button 
                   className="btn-sm btn-sm-red" 
                   style={{ width: "28px", height: "28px", padding: 0, justifyContent: "center" }}
                   onClick={() => tab === "marketplace" ? onDeleteCar(c.id) : onDeleteVehicle(c.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--neon)", fontWeight: 700, textTransform: "uppercase" }}>{c.brand}</div>
                    <div style={{ fontSize: "16px", fontWeight: 800, fontFamily: "Syne, sans-serif" }}>{c.model}</div>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--neon2)" }}>{c.year}</div>
                </div>
                
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                  <span className="tag tag-dim">{c.fuel}</span>
                  <span className="tag tag-dim">{c.transmission}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--border2)" }}>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--neon)" }}>{fmtUSD(c.priceChina || c.price)}</div>
                  {c.featured && <span className="tag tag-g">Featured</span>}
                </div>
              </div>
            </div>
          ))}
          
          {filteredCars.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px", opacity: 0.5 }}>
              No vehicles matching your search.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
