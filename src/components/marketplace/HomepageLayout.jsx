import { 
  Search, SlidersHorizontal, Home, CarFront, Tag, UserCircle2, 
  Flame, ShieldCheck, Ship, Headphones, Star, ChevronLeft, 
  ChevronRight, CheckCircle2, Clock, Globe, ArrowRight, Activity
} from "lucide-react";
import { useState, useEffect } from "react";
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

  const [tIdx, setTIdx] = useState(0);
  const tests = settings.testimonials || [];

  useEffect(() => {
    if (!tests.length) return;
    const itv = setInterval(() => setTIdx(p => (p + 1) % tests.length), 5000);
    return () => clearInterval(itv);
  }, [tests.length]);

  return (
    <div className="mk-wrap" style={{ background: 'var(--bg)', paddingTop: '100px' }}>
      <div className="container" style={{ maxWidth: '1440px' }}>
        
        {/* Advanced Search & Filtering Console */}
        <div style={{ marginBottom: '48px' }}>
          <div className="section-label" style={{ marginBottom: '16px' }}>Filter Control Center</div>
          <div className="mk-search-row">
            <div className="mk-search-box">
              <Search size={18} color="var(--text-dim)" />
              <input 
                placeholder="Search dossiers by brand, model or specification..." 
                value={filters.q} 
                onChange={(e) => update("q", e.target.value)} 
                style={{ fontWeight: 600 }}
              />
            </div>
            <button className={`mk-filter-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters((v) => !v)}>
              <SlidersHorizontal size={18} /> <span>{showFilters ? 'Hide Protocols' : 'All Protocols'}</span>
            </button>
            <select className="mk-sort" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPageNum(1); }}>
              {Object.entries(sortOptions).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </div>

          {(showFilters || hero) && (
            <div className="adm-card" style={{ padding: '24px', marginTop: '16px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div className="fg"><label className="lbl">Brand Affinity</label><select className="inp" value={filters.brand} onChange={(e) => update("brand", e.target.value)}><option value="">Global Fleet</option>{options.brand.map((o) => <option key={o}>{o}</option>)}</select></div>
                <div className="fg"><label className="lbl">Model Variant</label><select className="inp" value={filters.model} onChange={(e) => update("model", e.target.value)}><option value="">All Variants</option>{options.model.map((o) => <option key={o}>{o}</option>)}</select></div>
                <div className="fg"><label className="lbl">Architecture</label><select className="inp" value={filters.bodyType} onChange={(e) => update("bodyType", e.target.value)}><option value="">Any Body Type</option>{options.bodyType.map((o) => <option key={o}>{o}</option>)}</select></div>
                <div className="fg"><label className="lbl">Power Unit</label><select className="inp" value={filters.fuel} onChange={(e) => update("fuel", e.target.value)}><option value="">Any Energy</option>{options.fuel.map((o) => <option key={o}>{o}</option>)}</select></div>
                <div className="fg"><label className="lbl">Minimum Year</label><input className="inp" placeholder="YYYY" value={filters.yearMin} onChange={(e) => update("yearMin", e.target.value)} /></div>
                <div className="fg"><label className="lbl">Max Capital (USD)</label><input className="inp" placeholder="Target Price" value={filters.priceMax} onChange={(e) => update("priceMax", e.target.value)} /></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button className="btn-sm-ghost" onClick={() => { Object.keys(filters).forEach(k => update(k, "")); setQuickTab("All Cars"); }}>
                  System Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Global Inventory Grid */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <div className="section-label">Verified Marketplace</div>
              <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Search <span style={{ color: 'var(--accent)' }}>Results</span></h2>
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, opacity: 0.5, textTransform: 'uppercase' }}>
              Logged Entities: {filteredCars.length} Unit(s)
            </div>
          </div>

          {pageCars.length === 0 ? (
            <div style={{ padding: '100px 0', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
              <Globe size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
              <div style={{ fontSize: '16px', fontWeight: 700 }}>No Units Located</div>
              <p style={{ opacity: 0.5, fontSize: '13px' }}>Adjust your filters to locate relevant vehicle dossiers.</p>
            </div>
          ) : (
            <div className="mk-grid">
              {pageCars.map((car, i) => (
                <VehicleCard key={car.id} v={car} delay={i * 0.05} settings={settings} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "48px", paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: "11px", fontWeight: 800, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px' }}>Dossier {pageNum} of {totalPages}</span>
              <div style={{ display: "flex", gap: "12px" }}>
                <button className="btn-sm-ghost" disabled={pageNum <= 1} onClick={() => setPageNum((p) => Math.max(1, p - 1))}>Previous Batch</button>
                <button className="btn-p" style={{ padding: '8px 24px', height: '40px' }} disabled={pageNum >= totalPages} onClick={() => setPageNum((p) => Math.min(totalPages, p + 1))}>Next Batch</button>
              </div>
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
        .mk-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:24px}
        
        @media (max-width: 980px){
          .mk-search-row{grid-template-columns:1fr;gap:8px}
          .mk-filter-btn, .mk-sort{width:100%;justify-content:center}
          .mk-grid{grid-template-columns:repeat(auto-fill, minmax(280px, 1fr))}
        }
      `}</style>
    </div>
  );
}
