import React, { useState } from "react";
import { 
  Package, Plus, Search, Filter, Edit3, Trash2, 
  Car, Zap, Wrench, Database, Globe, Archive,
  ArrowRight, Hash, Activity
} from "lucide-react";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { fmtUSD } from "../utils/theme";

export function AdminInventory({ 
  vehicles = [], 
  cars = [], 
  onSaveVehicle, 
  onDeleteVehicle, 
  onSaveCar, 
  onDeleteCar,
  onLogout, 
  settings = {} 
}) {
  const [tab, setTab] = useState("marketplace"); 
  const [search, setSearch] = useState("");

  const filteredCars = (tab === "marketplace" ? cars : vehicles).filter(c => 
    `${c.brand} ${c.model}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="adm-wrap">
      <AdminSidebar onLogout={onLogout} settings={settings} />
      
      <main className="adm-main">
        <AdminHeader 
          title="Vehicle Asset Registry" 
          icon={Package} 
        />

        {/* Protocol Selection */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          <button 
            className="adm-card"
            style={{ 
              flex: 1, padding: '20px', textAlign: 'left', cursor: 'pointer',
              border: `2px solid ${tab === 'marketplace' ? 'var(--accent)' : 'var(--border)'}`,
              background: tab === 'marketplace' ? 'rgba(255,255,255,0.02)' : 'var(--bg)'
            }}
            onClick={() => setTab("marketplace")}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <Globe size={20} color={tab === 'marketplace' ? 'var(--accent)' : 'var(--text-dim)'} />
              <span style={{ fontSize: '10px', fontWeight: 800, opacity: 0.5 }}>ACTIVE INVENTORY</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800 }}>Marketplace Assets</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>{cars.length} Operational Units</div>
          </button>

          <button 
            className="adm-card"
            style={{ 
              flex: 1, padding: '20px', textAlign: 'left', cursor: 'pointer',
              border: `2px solid ${tab === 'legacy' ? 'var(--accent)' : 'var(--border)'}`,
              background: tab === 'legacy' ? 'rgba(255,255,255,0.02)' : 'var(--bg)'
            }}
            onClick={() => setTab("legacy")}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <Archive size={20} color={tab === 'legacy' ? 'var(--accent)' : 'var(--text-dim)'} />
              <span style={{ fontSize: '10px', fontWeight: 800, opacity: 0.5 }}>TRANSITION STATUS</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800 }}>Legacy Archive</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>{vehicles.length} Recorded Units</div>
          </button>
        </div>

        {/* Global Action Bar */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <div className="adm-card" style={{ flex: 1, padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Search size={18} style={{ opacity: 0.3 }} />
            <input 
              className="inp" 
              placeholder="Filter assets by brand, model or SKU..." 
              style={{ border: 'none', background: 'none' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-p" style={{ padding: '0 24px', height: '52px' }} onClick={() => tab === "marketplace" ? onSaveCar({}) : onSaveVehicle({})}>
            <Plus size={18} /> Add New Unit
          </button>
        </div>

        {/* Asset Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
          {filteredCars.map(c => (
            <div key={c.id} className="adm-card" style={{ padding: "0", overflow: "hidden" }}>
              <div style={{ position: "relative", height: "180px", background: "var(--bg-3)", overflow: 'hidden' }}>
                {c.images && c.images[0] ? (
                  <img src={c.images[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.1 }}><Car size={48} /></div>
                )}
                
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => tab === "marketplace" ? onSaveCar(c) : onSaveVehicle(c)} style={{ padding: '8px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer' }}><Edit3 size={14} /></button>
                  <button onClick={() => tab === "marketplace" ? onDeleteCar(c.id) : onDeleteVehicle(c.id)} style={{ padding: '8px', background: 'rgba(255,74,90,0.1)', border: '1px solid #FF4A5A', borderRadius: '6px', color: '#FF4A5A', cursor: 'pointer' }}><Trash2 size={14} /></button>
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, opacity: 0.5, textTransform: 'uppercase' }}>{c.brand}</div>
                    <div style={{ fontSize: '18px', fontWeight: 800 }}>{c.model}</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent)' }}>{c.year}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                  <span className="tag">{c.fuel}</span>
                  <span className="tag">{c.transmission}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800 }}>{fmtUSD(c.priceChina || c.price)}</div>
                  {c.featured && <span className="tag" style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}>FEATURED</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 0', opacity: 0.5 }}>
            <Database size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
            <div style={{ fontSize: '16px', fontWeight: 700 }}>Zero Units Detected</div>
            <p style={{ fontSize: '13px' }}>Adjust search parameters or initiate a new entry protocol.</p>
          </div>
        )}
      </main>
    </div>
  );
}
