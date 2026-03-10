import { Search, SlidersHorizontal, Home, CarFront, Tag, UserCircle2, Flame } from "lucide-react";

function TagBadge({ tag }) {
  const palette = { hot: "#ff4d30", verified: "#17b26a", new: "#1d9bf0", clearance: "#ff6f00" };
  const c = palette[tag] || "#7b8190";
  return <span style={{ fontSize: 10, background: `${c}1a`, border: `1px solid ${c}55`, color: c, borderRadius: 4, padding: "2px 6px", fontWeight: 700 }}>{tag}</span>;
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
          <div style={{ fontSize: 12, color: "#667085" }}>Vehicle Price: <strong style={{ color: "#101828" }}>{usd(car.priceChina)}</strong></div>
          <div style={{ fontSize: 12, color: "#667085" }}>Shipping: <strong style={{ color: "#101828" }}>{usd(car.shippingFee)}</strong></div>
          <div style={{ fontSize: 22, color: "#f97316", fontWeight: 800, letterSpacing: "-0.02em" }}>{usd(car.totalLandedCost)}</div>
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
}) {
  const totalPages = Math.max(1, Math.ceil(filteredCars.length / pageSize));
  const start = (pageNum - 1) * pageSize;
  const pageCars = filteredCars.slice(start, start + pageSize);

  return (
    <div className="mk-wrap">
      <div className="mk-top-tabs">
        {quickTabs.map((tab) => (
          <button key={tab} className={`mk-top-tab${quickTab === tab ? " act" : ""}`} onClick={() => { setQuickTab(tab); setPageNum(1); }}>{tab}</button>
        ))}
      </div>

      <div className="mk-content">
        <div className="mk-search-row">
          <div className="mk-search-box">
            <Search size={16} color="#98a2b3" />
            <input placeholder="Brand, model, body type" value={filters.q} onChange={(e) => update("q", e.target.value)} />
          </div>
          <button className="mk-filter-btn" onClick={() => setShowFilters((v) => !v)}>
            <SlidersHorizontal size={16} /> Filters
          </button>
          <select className="mk-sort" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPageNum(1); }}>
            {Object.entries(sortOptions).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>

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

        <div style={{ fontSize: 12, color: "#667085", marginBottom: 8 }}>{filteredCars.length} cars</div>

        <div className="mk-grid">
          {pageCars.map((car) => <CarFeedCard key={car.id} car={car} setPage={setPage} usd={usd} />)}
        </div>

        {filteredCars.length === 0 && <div style={{ color: "#667085", padding: "28px 0" }}>No cars match this filter.</div>}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <span style={{ fontSize: 12, color: "#98a2b3" }}>Page {pageNum} / {totalPages}</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn-sm btn-sm-ghost" disabled={pageNum <= 1} onClick={() => setPageNum((p) => Math.max(1, p - 1))}>Prev</button>
            <button className="btn-sm btn-sm-neon" disabled={pageNum >= totalPages} onClick={() => setPageNum((p) => Math.min(totalPages, p + 1))}>Next</button>
          </div>
        </div>
      </div>

      <style>{`
        .mk-wrap{background:#f2f4f7;min-height:100vh;padding-top:${hero ? 86 : 96}px;padding-bottom:96px}
        .mk-top-tabs{display:flex;gap:14px;overflow-x:auto;padding:0 12px 8px;background:#fff;border-bottom:1px solid #eaecf0;position:sticky;top:58px;z-index:25}
        .mk-top-tab{border:0;background:transparent;padding:12px 0;font-size:16px;color:#344054;font-weight:500;white-space:nowrap}
        .mk-top-tab.act{color:#101828;font-weight:800;position:relative}
        .mk-top-tab.act::after{content:'';position:absolute;left:8px;right:8px;bottom:2px;height:3px;background:#3b82f6;border-radius:4px}
        .mk-content{padding:10px 12px}
        .mk-search-row{display:grid;grid-template-columns:1fr auto auto;gap:8px;margin-bottom:10px}
        .mk-search-box{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #eaecf0;border-radius:10px;padding:0 10px;height:40px}
        .mk-search-box input{border:0;outline:0;background:transparent;width:100%;font-size:13px;color:#101828}
        .mk-filter-btn,.mk-sort{height:40px;border:1px solid #eaecf0;background:#fff;border-radius:10px;padding:0 10px;font-size:12px;color:#344054}
        .mk-filters{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:10px}
        .mk-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
        @media (min-width: 1024px){
          .mk-content{max-width:1280px;margin:0 auto}
          .mk-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
          .mk-filters{grid-template-columns:repeat(6,minmax(0,1fr))}
        }
      `}</style>
    </div>
  );
}
