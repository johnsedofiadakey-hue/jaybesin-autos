import { useMemo, useState } from "react";
import { ShieldCheck, Flame, Sparkles, MessageCircle, Phone } from "lucide-react";
import { addInquiry } from "./firestore";
import { MarketplaceHomepageLayout } from "./components/marketplace/HomepageLayout";

const QUICK_TABS = ["All Cars", "SUV", "Sedan", "Pickup", "Truck", "Electric", "Cheap Deals", "New Arrivals", "Verified Cars"];
const SORTS = {
  newest: "Newest",
  priceAsc: "Price",
  mileageAsc: "Mileage",
  totalAsc: "Lowest Total",
};
const PAGE_SIZE = 16;

const usd = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(v || 0));
const asNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const toDoc = (doc, idx) => {
  if (!doc) return null;
  if (typeof doc === "string") return { name: `Document ${idx + 1}`, url: doc, type: "report" };
  return { name: doc.name || `Document ${idx + 1}`, url: doc.url || doc.link || "", type: doc.type || "report" };
};

export const calcTotalLandedCost = (car) => asNum(car.priceChina) + asNum(car.inspectionFee) + asNum(car.shippingFee) + asNum(car.insuranceFee) + asNum(car.clearingEstimate);

export const normalizeCar = (car = {}) => {
  const images = Array.isArray(car.images) ? car.images.filter(Boolean) : [];
  const documents = (Array.isArray(car.documents) ? car.documents : []).map(toDoc).filter((d) => d && d.url);
  const tags = Array.isArray(car.tags) ? car.tags.filter(Boolean) : [];
  const totalLandedCost = asNum(car.totalLandedCost || car.totalGhana || calcTotalLandedCost(car));

  return {
    ...car,
    id: String(car.id || ""),
    brand: car.brand || "Unknown",
    model: car.model || "Model",
    year: asNum(car.year || 0),
    mileage: asNum(car.mileage || car.km),
    fuel: car.fuel || "Petrol",
    transmission: car.transmission || "Automatic",
    bodyType: car.bodyType || car.type || "SUV",
    seats: asNum(car.seats || 5),
    engine: car.engine || car.specs?.engine || "N/A",
    description: car.description || "",
    locationChina: car.locationChina || car.location || "China",
    priceChina: asNum(car.priceChina || car.price || 0),
    inspectionFee: asNum(car.inspectionFee || 0),
    shippingFee: asNum(car.shippingFee || 0),
    insuranceFee: asNum(car.insuranceFee || 0),
    clearingEstimate: asNum(car.clearingEstimate || car.duties || 0),
    totalLandedCost,
    images,
    documents,
    tags,
    dateAdded: car.dateAdded || car.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
  };
};

export function MarketplaceBrowsePage({ cars, setPage, hero = false }) {
  const carRows = useMemo(() => cars.map(normalizeCar), [cars]);
  const [quickTab, setQuickTab] = useState("All Cars");
  const [sortBy, setSortBy] = useState("newest");
  const [pageNum, setPageNum] = useState(1);
  const [filters, setFilters] = useState({ q: "", brand: "", model: "", bodyType: "", fuel: "", transmission: "", yearMin: "", yearMax: "", mileageMax: "", priceMin: "", priceMax: "" });
  const [showFilters, setShowFilters] = useState(false);

  const options = useMemo(() => {
    const uniq = (key) => [...new Set(carRows.map((c) => c[key]).filter(Boolean))];
    return { brand: uniq("brand"), model: uniq("model"), bodyType: uniq("bodyType"), fuel: uniq("fuel"), transmission: uniq("transmission") };
  }, [carRows]);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    let list = carRows.filter((c) => {
      if (q && !`${c.brand} ${c.model} ${c.bodyType}`.toLowerCase().includes(q)) return false;
      if (filters.brand && c.brand !== filters.brand) return false;
      if (filters.model && c.model !== filters.model) return false;
      if (filters.bodyType && c.bodyType !== filters.bodyType) return false;
      if (filters.fuel && c.fuel !== filters.fuel) return false;
      if (filters.transmission && c.transmission !== filters.transmission) return false;
      if (filters.yearMin && c.year < asNum(filters.yearMin)) return false;
      if (filters.yearMax && c.year > asNum(filters.yearMax)) return false;
      if (filters.mileageMax && c.mileage > asNum(filters.mileageMax)) return false;
      if (filters.priceMin && c.totalLandedCost < asNum(filters.priceMin)) return false;
      if (filters.priceMax && c.totalLandedCost > asNum(filters.priceMax)) return false;

      if (quickTab === "SUV" && c.bodyType !== "SUV") return false;
      if (quickTab === "Sedan" && c.bodyType !== "Sedan") return false;
      if (quickTab === "Pickup" && c.bodyType !== "Pickup") return false;
      if (quickTab === "Truck" && c.bodyType !== "Truck") return false;
      if (quickTab === "Electric" && c.fuel !== "Electric") return false;
      if (quickTab === "Cheap Deals" && c.totalLandedCost > 12000) return false;
      if (quickTab === "New Arrivals" && !c.tags.includes("new")) return false;
      if (quickTab === "Verified Cars" && !c.tags.includes("verified")) return false;
      return true;
    });

    if (sortBy === "priceAsc") list = list.sort((a, b) => a.priceChina - b.priceChina);
    if (sortBy === "mileageAsc") list = list.sort((a, b) => a.mileage - b.mileage);
    if (sortBy === "totalAsc") list = list.sort((a, b) => a.totalLandedCost - b.totalLandedCost);
    if (sortBy === "newest") list = list.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    return list;
  }, [carRows, filters, quickTab, sortBy]);

  const update = (key, value) => {
    setPageNum(1);
    setFilters((f) => ({ ...f, [key]: value }));
  };

  return (
    <MarketplaceHomepageLayout
      hero={hero}
      quickTabs={QUICK_TABS}
      quickTab={quickTab}
      setQuickTab={setQuickTab}
      filters={filters}
      update={update}
      showFilters={showFilters}
      setShowFilters={setShowFilters}
      sortBy={sortBy}
      setSortBy={setSortBy}
      sortOptions={SORTS}
      options={options}
      filteredCars={filtered}
      pageNum={pageNum}
      setPageNum={setPageNum}
      pageSize={PAGE_SIZE}
      setPage={setPage}
      usd={usd}
    />
  );
}

export function CarDetailPageMarket({ car, setPage, settings }) {
  const [active, setActive] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const row = normalizeCar(car);
  if (!car) return <div style={{ paddingTop: 120, textAlign: "center" }}>Car not found.</div>;

  const timeline = [["Purchase Confirmation", "2 days"], ["Inspection", "2 days"], ["Shipping to Ghana", "35 days"], ["Port Clearance", "5 days"]];

  const submitInquiry = async (type) => {
    try {
      setSubmitting(true);
      await addInquiry({ name: "Marketplace User", email: "", phone: "", subject: `${type} - ${row.brand} ${row.model}`, message: `${type} request for ${row.brand} ${row.model} (${row.year})`, type: "vehicle" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ paddingTop: 96, maxWidth: 1200, margin: "0 auto", paddingInline: 14, paddingBottom: 96 }}>
      <button className="btn-sm btn-sm-ghost" onClick={() => setPage("browse")}>← Back</button>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 12, marginTop: 8 }}>
        <section style={{ background: "#fff", border: "1px solid #eaecf0", borderRadius: 12, padding: 10 }}>
          <div style={{ aspectRatio: "4/3", borderRadius: 10, overflow: "hidden", background: "#f2f4f7", marginBottom: 8 }}>{row.images[active] ? <img src={row.images[active]} alt={row.model} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(86px,1fr))", gap: 6 }}>
            {(row.images.length ? row.images : [""]).map((img, i) => <button key={i} onClick={() => setActive(i)} style={{ border: active === i ? "1px solid #f97316" : "1px solid #eaecf0", borderRadius: 8, overflow: "hidden", aspectRatio: "4/3", background: "#f9fafb" }}>{img ? <img src={img} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}</button>)}
          </div>
        </section>

        <section style={{ display: "grid", gap: 10 }}>
          <div style={{ background: "#fff", border: "1px solid #eaecf0", borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#101828" }}>{row.brand} {row.model}</div>
            <div style={{ color: "#667085", fontSize: 13 }}>{row.year} · {row.mileage.toLocaleString()} km · {row.locationChina}</div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #eaecf0", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Cost Breakdown</div>
            {[["Vehicle Price (China)", row.priceChina], ["Inspection Fee", row.inspectionFee], ["Shipping Fee", row.shippingFee], ["Insurance", row.insuranceFee], ["Estimated Clearing", row.clearingEstimate]].map(([l, v]) => <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}><span style={{ color: "#667085" }}>{l}</span><strong>{usd(v)}</strong></div>)}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, paddingTop: 6, borderTop: "1px solid #eaecf0", color: "#f97316", fontWeight: 800 }}><span>Total Landed</span><span>{usd(row.totalLandedCost)}</span></div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #eaecf0", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Import Timeline</div>
            {timeline.map(([s, d]) => <div key={s} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}><span>{s}</span><span>{d}</span></div>)}
            <div style={{ color: "#17b26a", fontWeight: 700, fontSize: 13, marginTop: 4 }}>Total Delivery Time: ~45 days</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button className="btn-p" disabled={submitting} onClick={() => submitInquiry("Reserve This Car")}>{submitting ? "Sending..." : "Reserve"}</button>
            <button className="btn-o" onClick={() => submitInquiry("Import For Me")}><span>Import For Me</span></button>
            <button className="btn-sm btn-sm-neon" onClick={() => window.open(`tel:${(settings.phone || "").replace(/\s+/g, "")}`)}><Phone size={14} /> Agent</button>
            <button className="btn-sm btn-sm-ghost" onClick={() => window.open(`https://wa.me/${(settings.whatsapp || "").replace(/\D/g, "")}`)}><MessageCircle size={14} /> WhatsApp</button>
          </div>
        </section>
      </div>
      <style>{`@media (max-width: 980px){div[style*="grid-template-columns: 1.1fr 1fr"]{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}

export function MarketplaceSimplePage({ title, subtitle, ctaLabel, onCta }) {
  return (
    <div style={{ paddingTop: 110, maxWidth: 920, margin: "0 auto", paddingInline: 18, paddingBottom: 96 }}>
      <div style={{ background: "#fff", border: "1px solid #eaecf0", borderRadius: 14, padding: 20 }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 30, marginBottom: 6, color: "#101828" }}>{title}</div>
        <div style={{ color: "#667085", marginBottom: 16 }}>{subtitle}</div>
        {ctaLabel && <button className="btn-p" onClick={onCta}>{ctaLabel}</button>}
      </div>
    </div>
  );
}

export function MarketplaceAdminTab({ cars, onSaveCar, saving }) {
  const [form, setForm] = useState({ id: "", brand: "", model: "", year: "", mileage: "", fuel: "Petrol", transmission: "Automatic", bodyType: "SUV", seats: "5", engine: "", priceChina: "", inspectionFee: "", shippingFee: "", insuranceFee: "", clearingEstimate: "", imagesText: "", documentsText: "", description: "", locationChina: "", tagsText: "" });

  const total = asNum(form.priceChina) + asNum(form.inspectionFee) + asNum(form.shippingFee) + asNum(form.insuranceFee) + asNum(form.clearingEstimate);

  const readFilesAsDataUrls = async (fileList) => {
    const files = Array.from(fileList || []);
    return Promise.all(files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result || "");
      reader.onerror = () => reject(new Error("File read failed"));
      reader.readAsDataURL(file);
    })));
  };

  const addImageFiles = async (fileList) => {
    const values = await readFilesAsDataUrls(fileList);
    setForm((f) => ({ ...f, imagesText: [f.imagesText, ...values].filter(Boolean).join("\n") }));
  };

  const addDocumentFiles = async (fileList) => {
    const values = await readFilesAsDataUrls(fileList);
    setForm((f) => ({ ...f, documentsText: [f.documentsText, ...values].filter(Boolean).join("\n") }));
  };

  const save = async () => {
    const images = form.imagesText.split("\n").map((s) => s.trim()).filter(Boolean);
    const documents = form.documentsText.split("\n").map((s) => s.trim()).filter(Boolean).map((url, idx) => ({ name: `Report ${idx + 1}`, url, type: "report" }));
    const tags = form.tagsText.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

    await onSaveCar({
      id: form.id || undefined,
      brand: form.brand,
      model: form.model,
      year: asNum(form.year),
      mileage: asNum(form.mileage),
      fuel: form.fuel,
      transmission: form.transmission,
      bodyType: form.bodyType,
      seats: asNum(form.seats),
      engine: form.engine,
      priceChina: asNum(form.priceChina),
      inspectionFee: asNum(form.inspectionFee),
      shippingFee: asNum(form.shippingFee),
      insuranceFee: asNum(form.insuranceFee),
      clearingEstimate: asNum(form.clearingEstimate),
      totalLandedCost: total,
      images,
      documents,
      description: form.description,
      locationChina: form.locationChina,
      tags,
      dateAdded: new Date().toISOString(),
    });

    setForm({ id: "", brand: "", model: "", year: "", mileage: "", fuel: "Petrol", transmission: "Automatic", bodyType: "SUV", seats: "5", engine: "", priceChina: "", inspectionFee: "", shippingFee: "", insuranceFee: "", clearingEstimate: "", imagesText: "", documentsText: "", description: "", locationChina: "", tagsText: "" });
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="adm-card">
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, marginBottom: 12 }}>Upload Marketplace Car</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {["brand", "model", "year", "mileage", "seats", "engine", "priceChina", "inspectionFee", "shippingFee", "insuranceFee", "clearingEstimate", "locationChina"].map((k) => <div className="fg" key={k}><label className="lbl">{k}</label><input className="inp" value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} /></div>)}
          <div className="fg"><label className="lbl">fuel</label><select className="inp" value={form.fuel} onChange={(e) => setForm((f) => ({ ...f, fuel: e.target.value }))}><option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option></select></div>
          <div className="fg"><label className="lbl">transmission</label><select className="inp" value={form.transmission} onChange={(e) => setForm((f) => ({ ...f, transmission: e.target.value }))}><option>Automatic</option><option>Manual</option></select></div>
          <div className="fg"><label className="lbl">bodyType</label><select className="inp" value={form.bodyType} onChange={(e) => setForm((f) => ({ ...f, bodyType: e.target.value }))}><option>SUV</option><option>Sedan</option><option>Pickup</option><option>Truck</option><option>Hatchback</option></select></div>
          <div className="fg"><label className="lbl">tags (comma)</label><input className="inp" value={form.tagsText} onChange={(e) => setForm((f) => ({ ...f, tagsText: e.target.value }))} placeholder="hot, verified, new" /></div>
        </div>
        <div className="fg"><label className="lbl">description</label><textarea className="inp" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></div>
        <div className="fg"><label className="lbl">images (URL/base64 per line)</label><textarea className="inp" rows={3} value={form.imagesText} onChange={(e) => setForm((f) => ({ ...f, imagesText: e.target.value }))} /></div>
        <div className="fg"><label className="lbl">upload image files</label><input className="inp" type="file" accept="image/*" multiple onChange={(e) => addImageFiles(e.target.files)} /></div>
        <div className="fg"><label className="lbl">inspection docs (URL/base64 per line)</label><textarea className="inp" rows={3} value={form.documentsText} onChange={(e) => setForm((f) => ({ ...f, documentsText: e.target.value }))} /></div>
        <div className="fg"><label className="lbl">upload document files</label><input className="inp" type="file" accept=".pdf,image/*" multiple onChange={(e) => addDocumentFiles(e.target.files)} /></div>

        <div style={{ borderTop: "1px solid var(--border2)", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{ fontSize: 13, color: "var(--text2)" }}>Total Landed Cost: <strong style={{ color: "var(--neon)" }}>{usd(total)}</strong></div>
          <button className="btn-p" onClick={save} disabled={saving || !form.brand || !form.model}>{saving ? "Saving..." : "Save Car"}</button>
        </div>
      </div>

      <div className="adm-card">
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, marginBottom: 10 }}>Marketplace Cars ({cars.length})</div>
        <div style={{ display: "grid", gap: 8 }}>
          {cars.slice(0, 12).map((row) => {
            const c = normalizeCar(row);
            return <div key={c.id} style={{ border: "1px solid var(--border2)", borderRadius: 8, padding: "8px 10px", display: "flex", justifyContent: "space-between", gap: 8 }}><div><div style={{ fontWeight: 700 }}>{c.brand} {c.model} ({c.year})</div><div style={{ fontSize: 12, color: "var(--text2)" }}>{c.bodyType} · {c.fuel} · {c.transmission}</div></div><div style={{ fontWeight: 800, color: "var(--neon)" }}>{usd(c.totalLandedCost)}</div></div>;
          })}
        </div>
      </div>

      <div className="adm-card" style={{ fontSize: 12, color: "var(--text2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text)", fontWeight: 700, marginBottom: 8 }}><ShieldCheck size={14} /> Firestore `cars` schema</div>
        <div>id, brand, model, year, mileage, fuel, transmission, bodyType, seats, priceChina, inspectionFee, shippingFee, insuranceFee, clearingEstimate, images[], documents[], description, locationChina, dateAdded, tags[].</div>
      </div>
    </div>
  );
}

export function MarketplaceHighlights() {
  const items = [{ icon: <Flame size={14} />, text: "Hot Listings" }, { icon: <ShieldCheck size={14} />, text: "Verified Cars" }, { icon: <Sparkles size={14} />, text: "Transparent Costing" }];
  return <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "0 2px 6px" }}>{items.map((i) => <span key={i.text} style={{ fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #eaecf0", borderRadius: 999, color: "#344054", padding: "6px 10px" }}>{i.icon}{i.text}</span>)}</div>;
}
