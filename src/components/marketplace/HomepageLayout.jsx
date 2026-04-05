import { Search, SlidersHorizontal, Home, CarFront, Tag, UserCircle2, Flame, ShieldCheck, Ship, Headphones, Star, ChevronLeft, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import { useState, useEffect } from "react";

function TagBadge({ tag }) {
  const palette = { hot: "#ff4d30", verified: "#17b26a", new: "#1d9bf0", clearance: "#ff6f00" };
  const labels = { hot: "🔥 HOT DEAL", verified: "✅ VERIFIED", new: "✨ NEW", clearance: "🏷️ CLEARANCE" };
  const c = palette[tag] || "#7b8190";
  return <span style={{ fontSize: 9, background: c, color: "#fff", borderRadius: 4, padding: "2px 6px", fontWeight: 800, textTransform: "uppercase" }}>{labels[tag] || tag}</span>;
}

function CarFeedCard({ car, setPage, usd }) {
  const img = car.images?.[0];
  return (
    <div onClick={() => setPage(`car-${car.id}`)} style={{ cursor: "pointer", borderRadius: 10, background: "#fff", border: "1px solid #eceff3", overflow: "hidden", boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}>
      <div style={{ aspectRatio: "4/3", background: "#f2f4f7", position: "relative" }}>
        {img ? <img src={img} alt={`${car.brand} ${car.model}`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ display: "grid", placeItems: "center", height: "100%", color: "#98a2b3" }}>No image</div>}
        <div style={{ position: "absolute", left: 8, bottom: 8, fontSize: 11, color: "#fff", background: "rgba(16,24,40,.45)", borderRadius: 999, padding: "2px 8px" }}>{car.locationChina}</div>
      </div>
      <div style={{ padding: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.28, color: "#101828", marginBottom: 5 }}>{car.brand} {car.model}</div>
        <div style={{ fontSize: 12, color: "#667085", marginBottom: 5 }}>{car.year} / {(car.mileage / 10000).toFixed(1)}万公里</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>{(car.tags || []).slice(0, 2).map((t) => <TagBadge key={t} tag={t} />)}</div>
        <div style={{ display: "grid", gap: 2 }}>
          {car.isPriceAvailable ? (
            <>
              <div style={{ fontSize: 12, color: "#667085" }}>Vehicle Price (FOB): <strong style={{ color: "#101828" }}>{usd(car.priceChina)}</strong></div>
              <div style={{ fontSize: 12, color: "#667085" }}>Shipping: <strong style={{ color: "#101828" }}>{usd(car.shippingFee)}</strong></div>
              <div style={{ fontSize: 22, color: "#f97316", fontWeight: 800, letterSpacing: "-0.02em" }}>{usd(car.purchaseCost)}</div>
            </>
          ) : (
            <div style={{ fontSize: 18, color: "#2563eb", fontWeight: 700, margin: "10px 0" }}>Request Price</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MarketplaceMobileNav({ setPage, activePage }) {
  const items = [
    { label: "Home", page: "home", Icon: Home },
    { label: "Buy", page: "browse", Icon: CarFront },
    { label: "Sell", page: "sell", Icon: Tag },
    { label: "Deals", page: "deals", Icon: Flame },
    { label: "Account", page: "account", Icon: UserCircle2 },
  ];

  return (
    <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, background: "#fff", borderTop: "1px solid #eaecf0", display: "grid", gridTemplateColumns: "repeat(5,1fr)", zIndex: 80, padding: "6px 4px calc(6px + env(safe-area-inset-bottom))" }}>
      {items.map(({ label, page, Icon }) => {
        const active = activePage === page || (page === "browse" && String(activePage || "").startsWith("car-"));
        return (
          <button key={label} onClick={() => setPage(page)} style={{ border: 0, background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: active ? "#2563eb" : "#667085", fontSize: 11, fontWeight: active ? 700 : 500 }}>
            <Icon size={18} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

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
    <div className="mk-wrap">
      <div className="mk-content">
        {/* Category Cards Navigation */}
        <div className="cat-nav-grid">
          {quickTabs.map((tab) => {
            const active = quickTab === tab;
            return (
              <button key={tab} className={`cat-card${active ? " active" : ""}`} onClick={() => { setQuickTab(tab); setPageNum(1); }}>
                <div className="cat-card-label">{tab}</div>
              </button>
            );
          })}
        </div>

        <div className="mk-search-row">
          <div className="mk-search-box">
            <Search size={16} color="#98a2b3" />
            <input placeholder="Search brand, model, body..." value={filters.q} onChange={(e) => update("q", e.target.value)} />
          </div>
          <button className="mk-filter-btn" onClick={() => setShowFilters((v) => !v)}>
            <SlidersHorizontal size={16} /> Filters
          </button>
          <select className="mk-sort" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPageNum(1); }}>
            {Object.entries(sortOptions).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>

        {Object.values(filters).some(v => v !== "") && (
          <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#667085", fontWeight: 600 }}>Active Filters:</span>
            <button className="btn-sm btn-sm-neon" style={{ fontSize: 10, padding: "2px 8px" }} onClick={() => {
              Object.keys(filters).forEach(k => update(k, ""));
              setQuickTab("All Cars");
            }}>Clear All ✕</button>
          </div>
        )}

        {(showFilters || hero) && (
          <div className="mk-filters">
            <select className="inp" value={filters.brand} onChange={(e) => update("brand", e.target.value)}><option value="">Brand</option>{options.brand.map((o) => <option key={o}>{o}</option>)}</select>
            <select className="inp" value={filters.model} onChange={(e) => update("model", e.target.value)}><option value="">Model</option>{options.model.map((o) => <option key={o}>{o}</option>)}</select>
            <select className="inp" value={filters.bodyType} onChange={(e) => update("bodyType", e.target.value)}><option value="">Body Type</option>{options.bodyType.map((o) => <option key={o}>{o}</option>)}</select>
            <select className="inp" value={filters.fuel} onChange={(e) => update("fuel", e.target.value)}><option value="">Fuel</option>{options.fuel.map((o) => <option key={o}>{o}</option>)}</select>
            <input className="inp" placeholder="Year min" value={filters.yearMin} onChange={(e) => update("yearMin", e.target.value)} />
            <input className="inp" placeholder="Price max" value={filters.priceMax} onChange={(e) => update("priceMax", e.target.value)} />
          </div>
        )}

        <div style={{ fontSize: 12, color: "#667085", marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
          <span>Showing {filteredCars.length} vehicles</span>
          {quickTab !== "All Cars" && <span style={{ fontWeight: 700, color: "#2563eb" }}>Category: {quickTab}</span>}
        </div>

        <div className="mk-grid">
          {pageCars.map((car) => <CarFeedCard key={car.id} car={car} setPage={setPage} usd={usd} />)}
        </div>

        {filteredCars.length === 0 && <div style={{ color: "#667085", padding: "48px 0", textAlign: "center", background: "#fff", borderRadius: 12, border: "1px dashed #eaecf0" }}>No vehicles match these filters.</div>}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
          <span style={{ fontSize: 12, color: "#98a2b3" }}>Page {pageNum} / {totalPages}</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn-sm btn-sm-ghost" disabled={pageNum <= 1} onClick={() => setPageNum((p) => Math.max(1, p - 1))}>Prev</button>
            <button className="btn-p btn-sm" disabled={pageNum >= totalPages} onClick={() => setPageNum((p) => Math.min(totalPages, p + 1))}>Next Page →</button>
          </div>
        </div>
      </div>

      {hero && (
        <div style={{ padding: "48px 0", background: "#f9fafb", borderTop: "1px solid #eaecf0", marginTop: 48 }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 12px" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#101828", marginBottom: 8 }}>The Gold Standard in Car Imports</h2>
              <p style={{ fontSize: 14, color: "#667085" }}>Why business owners and individuals trust Jaybesin Autos</p>
            </div>
            
            {/* USP Grid */}
            <div className="usp-grid">
              {[
                { icon: ShieldCheck, title: "Verified Sourcing", desc: "Every car is inspected at source in China before shipping." },
                { icon: Ship, title: "Transparent Shipping", desc: "Track your vehicle from Tema port arrival to final delivery." },
                { icon: Headphones, title: "Local Support", desc: "Our Accra-based team handles all clearing and documentation." }
              ].map((u, i) => (
                <div key={i} className="usp-item">
                  <div className="usp-icon"><u.icon size={20} /></div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#101828" }}>{u.title}</div>
                    <div style={{ fontSize: 11, color: "#667085" }}>{u.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial Slider */}
            {tests.length > 0 && (
              <div className="test-slider">
                <div className="test-card">
                  <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 12 }}>
                    {[...Array(tests[tIdx].stars || 5)].map((_, i) => <Star key={i} size={14} fill="#f97316" color="#f97316" />)}
                  </div>
                  <div style={{ fontSize: 16, fontStyle: "italic", color: "#344054", lineHeight: 1.6, marginBottom: 16 }}>"{tests[tIdx].text}"</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#101828" }}>— {tests[tIdx].name} <span style={{ fontWeight: 400, color: "#667085" }}>({tests[tIdx].role})</span></div>
                </div>
              </div>
            )}
          </div>

          <div style={{ background: "#fff", padding: "48px 12px", marginTop: 48 }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#101828", marginBottom: 8 }}>4 Step Import Process</h2>
                <p style={{ fontSize: 14, color: "#667085" }}>Transparent, reliable, and stress-free</p>
              </div>
              <div className="proc-grid">
                {[
                  { step: "01", title: "Select & Inspect", desc: "Pick your car and receive a detailed condition report." },
                  { step: "02", title: "Secure Payment", desc: "Pay via bank transfer or dedicated payment links." },
                  { step: "03", title: "Ocean Freight", desc: "Vehicles are shipped in secure containers to Tema." },
                  { step: "04", title: "Clear & Collect", desc: "We handle port clearance; you drive away in Accra." }
                ].map((p, i) => (
                  <div key={i} className="proc-item">
                    <div className="proc-num">{p.step}</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#101828", marginBottom: 6 }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: "#667085", lineHeight: 1.5 }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .mk-wrap{background:#f2f4f7;min-height:100vh;padding-top:48px;padding-bottom:96px}
        .mk-top-tabs{display:flex;gap:14px;overflow-x:auto;padding:0 12px 8px;background:#fff;border-bottom:1px solid #eaecf0;position:sticky;top:48px;z-index:25}
        .mk-top-tab{border:0;background:transparent;padding:12px 0;font-size:16px;color:#344054;font-weight:500;white-space:nowrap}
        .mk-top-tab.act{color:#101828;font-weight:800;position:relative}
        .mk-top-tab.act::after{content:'';position:absolute;left:8px;right:8px;bottom:2px;height:3px;background:#3b82f6;border-radius:4px}
        .mk-content{padding:6px 12px}
        .mk-search-row{display:grid;grid-template-columns:1fr auto auto;gap:8px;margin-bottom:10px}
        .mk-search-box{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #eaecf0;border-radius:10px;padding:0 10px;height:40px}
        .mk-search-box input{border:0;outline:0;background:transparent;width:100%;font-size:13px;color:#101828}
        .mk-filter-btn,.mk-sort{height:40px;border:1px solid #eaecf0;background:#fff;border-radius:10px;padding:0 10px;font-size:12px;color:#344054}
        .mk-filters{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:10px}
        .mk-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
        @media (max-width: 640px){
          .mk-wrap{padding-top:44px}
          .mk-top-tabs{top:44px}
          .mk-content{padding:6px 10px}
          .mk-search-row{grid-template-columns:1fr;gap:7px}
          .mk-filter-btn,.mk-sort{width:100%}
          .mk-filters{grid-template-columns:1fr 1fr}
          .mk-grid{gap:8px}
        }
        @media (max-width: 420px){
          .mk-filters{grid-template-columns:1fr}
          .mk-grid{grid-template-columns:1fr 1fr;gap:8px}
        }
        @media (min-width: 1024px){
          .mk-content{max-width:1280px;margin:0 auto}
          .mk-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
          .mk-filters{grid-template-columns:repeat(6,minmax(0,1fr))}
        }
        .usp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:32px}
        .usp-item{display:flex;gap:12px;align-items:flex-start;background:#f9fafb;padding:16px;border-radius:12px;border:1px solid #f2f4f7}
        .usp-icon{background:#eff6ff;color:#2563eb;padding:8px;border-radius:8px}
        .test-slider{max-width:600px;margin:0 auto}
        .test-card{background:#fff;border:1px solid #eaecf0;padding:24px;border-radius:16px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.03)}
        .proc-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
        .proc-item{text-align:center;position:relative}
        .proc-num{width:32px;height:32px;background:#2563eb;color:#fff;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:800;margin:0 auto 12px}
        @media (max-width: 768px){
          .usp-grid{grid-template-columns:1fr;gap:10px}
          .proc-grid{grid-template-columns:1fr 1fr;gap:20px}
        }
        .cat-nav-grid{display:flex;gap:12px;overflow-x:auto;padding:12px 2px 20px;scrollbar-width:none}
        .cat-nav-grid::-webkit-scrollbar{display:none}
        .cat-card{flex:0 0 auto;background:#fff;border:1px solid #eaecf0;border-radius:12px;padding:14px 24px;min-width:110px;text-align:center;cursor:pointer;transition:0.2s;display:grid;place-items:center}
        .cat-card.active{background:#101828;border-color:#101828;box-shadow:0 8px 24px rgba(0,0,0,0.12)}
        .cat-card-label{font-size:13px;font-weight:700;color:#475467}
        .cat-card.active .cat-card-label{color:#fff}
        @media (max-width: 640px){
          .cat-card{padding:10px 14px;min-width:90px}
          .cat-card-icon{font-size:18px}
          .cat-card-label{font-size:11px}
        }
      `}</style>
    </div>
  );
}
