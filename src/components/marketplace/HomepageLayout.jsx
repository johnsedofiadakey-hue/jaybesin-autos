import { FilterConsole } from "./FilterConsole";
import { VehicleCard } from "./VehicleCard";

export function MarketplaceHomepageLayout({
  hero,
  quickTabs,
  quickTab,
  setQuickTab,
  filters,
  update,
  showFilters,
  setShowFilters,
  sortBy,
  setSortBy,
  sortOptions,
  options,
  filteredCars,
  pageNum,
  setPageNum,
  pageSize,
  setPage,
  usd,
  settings = {}
}) {
  const totalPages = Math.max(1, Math.ceil(filteredCars.length / pageSize));
  const start = (pageNum - 1) * pageSize;
  const pageCars = filteredCars.slice(start, start + pageSize);

  return (
    <div className="mk-wrap" style={{ background: '#FFFFFF', paddingTop: '72px' }}>
      <div className="container" style={{ maxWidth: '1200px', paddingInline: '16px' }}>
        
        {/* Mobile Search & Filter Console */}
        <FilterConsole 
          filters={filters} 
          update={update} 
          resultCount={filteredCars.length} 
        />

        {/* Global Inventory Grid */}
        <div style={{ marginBottom: '64px', marginTop: '12px' }}>
          {pageCars.length === 0 ? (
            <div style={{ padding: '100px 0', textAlign: 'center', background: '#F5F5F7', borderRadius: '16px', border: '1px dashed #E8E8ED' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#86868B' }}>No Units Located</div>
            </div>
          ) : (
            <div className="mk-grid">
              {pageCars.map((car, i) => (
                <div key={car.id} onClick={() => setPage(`car-${car.id}`)}>
                  <VehicleCard v={car} delay={i * 0.03} settings={settings} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "32px", gap: '12px' }}>
              <button 
                className="pag-btn" 
                disabled={pageNum <= 1} 
                onClick={() => setPageNum((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#86868B' }}>Page {pageNum}/{totalPages}</div>
              <button 
                className="pag-btn act" 
                disabled={pageNum >= totalPages} 
                onClick={() => setPageNum((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Informational Clusters (Hero equivalent) */}
        {hero && (
          <div style={{ padding: "80px 0", borderTop: "1px solid var(--border)" }}>
            <div className="adm-split" style={{ alignItems: 'center', marginBottom: '80px' }}>
              <div>
                <div className="section-label">Protocol Integrity</div>
                <h2 style={{ fontSize: '42px', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '24px' }}>The Gold Standard in <br />Automotive <span style={{ color: 'var(--accent)' }}>Acquisition</span></h2>
                <div style={{ display: 'grid', gap: '24px' }}>
                  {[
                    { icon: ShieldCheck, title: "Verified Sourcing", desc: "Absolute condition audits performed at source terminals." },
                    { icon: Ship, title: "Secure Transit", desc: "Continuous dossier tracking through the global pipeline." },
                    { icon: Activity, title: "Operational Support", desc: "Local expertise managing all Tema/Takoradi clearance protocols." }
                  ].map((u, i) => (
                    <div key={i} style={{ display: 'flex', gap: '16px' }}>
                      <div className="dc-icon"><u.icon size={18} /></div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '15px' }}>{u.title}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: '4px' }}>{u.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="adm-card" style={{ padding: '48px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, opacity: 0.5, marginBottom: '16px' }}>REAL-TIME CLEARANCE STATUS</div>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {['Customs Protocol', 'Valuation Sync', 'Duty Assessment', 'Port Exit Authorization'].map((s, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700 }}>{s}</span>
                      <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 800 }}>ACTIVE</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .mk-wrap{min-height:100vh;padding-bottom:120px}
        .mk-search-row{display:grid;grid-template-columns:1fr auto auto;gap:12px}
        .mk-search-box{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.02);border:1px solid var(--border);border-radius:12px;padding:0 20px;height:52px}
        .mk-search-box input{border:0;outline:0;background:transparent;width:100%;font-size:14px;color:var(--text)}
        .mk-filter-btn,.mk-sort{height:52px;border:1px solid var(--border);background:var(--bg);border-radius:12px;padding:0 20px;font-size:13px;font-weight:700;color:var(--text-dim);display:flex;align-items:center;gap:8px;cursor:pointer}
        .mk-filter-btn.active{border-color:var(--accent);color:var(--text)}
        
        /* NEW MOBILE-FIRST GRID */
        .mk-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          padding: 8px;
        }
        
        @media (max-width: 480px) {
          .mk-grid {
            gap: 8px;
            padding: 4px;
          }
        }
        
        @media (min-width: 981px) {
          .mk-grid {
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 24px;
          }
        }
        
        @media (max-width: 980px){
          .mk-search-row{grid-template-columns:1fr;gap:8px}
          .mk-filter-btn, .mk-sort{width:100%;justify-content:center}
        }
      `}</style>
    </div>
  );
}
