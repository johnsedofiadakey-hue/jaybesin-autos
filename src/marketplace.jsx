import { useMemo, useState } from "react";
import { ShieldCheck, Flame, Sparkles, MessageCircle, Phone, Clock3, CheckCircle2 } from "lucide-react";
import { addInquiry, saveOrder } from "./firestore";
import { MarketplaceHomepageLayout } from "./components/marketplace/HomepageLayout";
import { DynamicHead } from "./components/DynamicHead";
import { Share2, Link2, LucideShare } from "lucide-react";

const QUICK_TABS = ["All Cars", "SUV", "Sedan", "Pickup", "Truck", "Electric", "Cheap Deals", "New Arrivals", "Verified Cars"];
const SORTS = {
  newest: "Newest",
  priceAsc: "FOB Price",
  mileageAsc: "Mileage",
  totalAsc: "Lowest Estimate",
};
const PAGE_SIZE = 16;

const DEFAULT_TIMELINE = [
  { step: "Purchase Confirmation", days: 2 },
  { step: "Inspection & Report", days: 2 },
  { step: "Shipping to Ghana", days: 35 },
  { step: "Port Processing", days: 5 },
];

const usd = (v) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(v || 0));
const asNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const digitsOnly = (v = "") => String(v).replace(/\D/g, "");
const sendLeadToWhatsApp = (whatsapp, message) => {
  const phone = digitsOnly(whatsapp);
  if (!phone || !message) return false;
  const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
  const win = window.open(url, "_blank", "noopener,noreferrer");
  return Boolean(win);
};

const toDoc = (doc, idx) => {
  if (!doc) return null;
  if (typeof doc === "string") return { name: `Document ${idx + 1}`, url: doc, type: "report" };
  return { name: doc.name || `Document ${idx + 1}`, url: doc.url || doc.link || "", type: doc.type || "report" };
};

export const calcPurchaseCost = (car) => asNum(car.priceChina || car.price) + asNum(car.inspectionFee) + asNum(car.shippingFee);
export const calcEstimatedLandedCost = (car) => calcPurchaseCost(car) + asNum(car.clearingEstimate);

export const normalizeCar = (car = {}) => {
  const images = Array.isArray(car.images) ? car.images.filter(Boolean) : [];
  const documents = (Array.isArray(car.documents) ? car.documents : []).map(toDoc).filter((d) => d && d.url);
  const tags = Array.isArray(car.tags) ? car.tags.filter(Boolean) : [];
  const purchaseCost = asNum(car.purchaseCost) || calcPurchaseCost(car);
  const estimatedLandedCost = asNum(car.estimatedLandedCost || car.totalLandedCost) || calcEstimatedLandedCost(car);

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
    priceChina: asNum(car.priceChina) || asNum(car.price) || 0,
    inspectionFee: asNum(car.inspectionFee) || 0,
    shippingFee: asNum(car.shippingFee) || 3500, // Def estimate
    insuranceFee: asNum(car.insuranceFee) || 0,
    clearingEstimate: asNum(car.clearingEstimate) || asNum(car.duties) || 0,
    purchaseCost,
    estimatedLandedCost,
    totalLandedCost: estimatedLandedCost,
    isPriceAvailable: (asNum(car.priceChina) || asNum(car.price) || asNum(car.purchaseCost)) > 0,
    images,
    documents,
    tags,
    dateAdded: car.dateAdded || car.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
  };
};

export function MarketplaceBrowsePage({ cars, setPage, hero = false, settings = {} }) {
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
      if (filters.priceMin && c.estimatedLandedCost < asNum(filters.priceMin)) return false;
      if (filters.priceMax && c.estimatedLandedCost > asNum(filters.priceMax)) return false;

      if (quickTab === "SUV" && c.bodyType !== "SUV") return false;
      if (quickTab === "Sedan" && c.bodyType !== "Sedan") return false;
      if (quickTab === "Pickup" && c.bodyType !== "Pickup") return false;
      if (quickTab === "Truck" && c.bodyType !== "Truck") return false;
      if (quickTab === "Electric" && c.fuel !== "Electric") return false;
      if (quickTab === "Cheap Deals" && c.purchaseCost > 12000) return false;
      if (quickTab === "New Arrivals" && !c.tags.includes("new")) return false;
      if (quickTab === "Verified Cars" && !c.tags.includes("verified")) return false;
      return true;
    });

    if (sortBy === "priceAsc") list = list.sort((a, b) => a.priceChina - b.priceChina);
    if (sortBy === "mileageAsc") list = list.sort((a, b) => a.mileage - b.mileage);
    if (sortBy === "totalAsc") list = list.sort((a, b) => a.estimatedLandedCost - b.estimatedLandedCost);
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
      settings={settings}
    />
  );
}

export function CarDetailPageMarket({ car, cars = [], setPage, settings = {} }) {
  if (!car) return <div style={{ paddingTop: 120, textAlign: "center" }}>Car not found.</div>;

  const [active, setActive] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [buyer, setBuyer] = useState({ name: "", phone: "", email: "", note: "" });
  const row = normalizeCar(car);

  const timeline = resolveTimeline(settings);
  const leadDays = computeLeadDays(settings, timeline);

  const specs = [
    ["Brand", row.brand],
    ["Model", row.model],
    ["Year", row.year || "N/A"],
    ["Mileage", `${row.mileage.toLocaleString()} km`],
    ["Fuel", row.fuel],
    ["Transmission", row.transmission],
    ["Body Type", row.bodyType],
    ["Seats", row.seats || "N/A"],
    ["Engine", row.engine || "N/A"],
  ];

  const shareOnWhatsApp = () => {
    const text = `Check out this ${row.brand} ${row.model} (${row.year}) on Jaybesin Autos: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setFeedback({ type: "success", message: "Link copied to clipboard!" });
    setTimeout(() => setFeedback({ type: "", message: "" }), 3000);
  };

  const suggestions = useMemo(() => {
    const all = (cars || []).map(normalizeCar).filter((c) => c.id !== row.id);
    return all
      .map((c) => {
        let score = 0;
        if (c.brand === row.brand) score += 5;
        if (c.bodyType === row.bodyType) score += 3;
        if (c.fuel === row.fuel) score += 2;
        score += Math.max(0, 1 - Math.abs(c.year - row.year) / 10);
        return { ...c, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [cars, row]);

  const submitInquiry = async (type) => {
    if (!buyer.name.trim() || !buyer.phone.trim()) {
      setFeedback({ type: "error", message: "Please enter at least your name and phone number." });
      return;
    }

    setSubmitting(true);
    setFeedback({ type: "", message: "" });
    try {
      const leadMessage =
        type + " Request\n" +
        "Customer: " + buyer.name.trim() + "\n" +
        "Phone: " + buyer.phone.trim() + "\n" +
        (buyer.email.trim() ? "Email: " + buyer.email.trim() + "\n" : "") +
        "Car: " + row.brand + " " + row.model + " (" + row.year + ")\n" +
        (row.isPriceAvailable ? (
          "FOB: " + usd(row.priceChina) + "\n" +
          "Purchase Cost: " + usd(row.purchaseCost) + "\n" +
          "Est. Landed: " + usd(row.estimatedLandedCost) + "\n"
        ) : "Price: Request Quote\n") +
        "Note: " + (buyer.note || "N/A");

      const trackingId = "REQ-" + String(Date.now()).slice(-8);
      const orderPayload = {
        id: trackingId,
        customer: buyer.name.trim(),
        email: buyer.email.trim(),
        phone: buyer.phone.trim(),
        item: row.brand + " " + row.model,
        type: "vehicle",
        amount: row.purchaseCost,
        status: "confirmed",
        date: new Date().toISOString().slice(0, 10),
        tracking: [
          { step: "Order Request Received", done: true, date: new Date().toLocaleDateString() },
          { step: "Agent Review", done: false, active: true, date: "Pending" },
          { step: "Payment Confirmation", done: false, date: "Pending" },
          { step: "Shipping to Ghana", done: false, date: "Pending" },
          { step: "Ready for Collection", done: false, date: "Pending" },
        ],
      };

      await Promise.all([
        addInquiry({
          name: buyer.name.trim(),
          email: buyer.email.trim(),
          phone: buyer.phone.trim(),
          subject: type + " - " + row.brand + " " + row.model,
          message: leadMessage + "\nTracking ID: " + trackingId,
          type: "vehicle",
        }),
        saveOrder(orderPayload),
      ]);

      const whatsappSent = sendLeadToWhatsApp(settings?.whatsapp, leadMessage + "\nTracking ID: " + trackingId);
      setFeedback({
        type: "ok",
        message: (whatsappSent
          ? type + " request sent. WhatsApp lead alert opened for your agent."
          : type + " request sent successfully. WhatsApp alert could not open on this device.") + " Tracking ID: " + trackingId,
      });
    } catch (e) {
      setFeedback({ type: "error", message: `Could not send request. Please try WhatsApp or call us. (${e.message})` });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cd-page" style={{ paddingTop: 72, maxWidth: 1200, margin: "0 auto", paddingInline: 14, paddingBottom: 96 }}>
      <DynamicHead 
        title={`${row.year} ${row.brand} ${row.model} - ${usd(row.purchaseCost)}`}
        description={`Import this ${row.year} ${row.brand} ${row.model} from China to Ghana. Full inspection report and shipping included.`}
        image={row.images?.[0]}
        url={window.location.href}
      />
      
      {/* Sticky Mobile CTA */}
      <div className="sticky-cta mobile-only">
        <button className="btn-wa-full" onClick={() => sendLeadToWhatsApp(settings.whatsapp, `I'm interested in the ${row.brand} ${row.model} (${row.year}). Reference: ${row.id}`)}>
          <MessageCircle size={20} /> Inquiry via WhatsApp
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <button className="btn-sm btn-sm-ghost" onClick={() => setPage("browse")}>← Back</button>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-sm btn-sm-ghost" onClick={shareOnWhatsApp} title="Share to WhatsApp"><Share2 size={16} /> <span className="desktop-only">Share</span></button>
          <button className="btn-sm btn-sm-ghost" onClick={copyLink} title="Copy Link"><Link2 size={16} /> <span className="desktop-only">Copy</span></button>
        </div>
      </div>

      <div className="mk-detail-grid" style={{ marginTop: 8 }}>
        <section style={{ background: "var(--bg-card, #fff)", border: "1px solid var(--border, #eaecf0)", borderRadius: 12, padding: 10 }}>
          <div style={{ aspectRatio: "4/3", borderRadius: 10, overflow: "hidden", background: "#f2f4f7", marginBottom: 8 }}>{row.images[active] ? <img src={row.images[active]} alt={row.model} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(86px,1fr))", gap: 6 }}>
            {(row.images.length ? row.images : [""]).map((img, i) => <button key={i} onClick={() => setActive(i)} style={{ border: active === i ? "1px solid #f97316" : "1px solid #eaecf0", borderRadius: 8, overflow: "hidden", aspectRatio: "4/3", background: "#f9fafb" }}>{img ? <img src={img} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}</button>)}
          </div>
        </section>

        <section style={{ display: "grid", gap: 10 }}>
          <div style={{ background: "var(--bg-card, #fff)", border: "1px solid var(--border, #eaecf0)", borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text, #101828)" }}>{row.brand} {row.model}</div>
            <div style={{ color: "#667085", fontSize: 13 }}>{row.year} · {row.mileage.toLocaleString()} km · {row.locationChina}</div>
          </div>

          {row.documents.length > 0 && (
            <div style={{ background: "linear-gradient(135deg, #17b26a 0%, #079455 100%)", borderRadius: 12, padding: "12px 16px", color: "#fff", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 12px rgba(23,178,106,0.2)" }}>
              <div style={{ background: "rgba(255,255,255,0.2)", padding: 8, borderRadius: "50%" }}><ShieldCheck size={20} /></div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>Verified Inspection Report</div>
                <div style={{ fontSize: 12, opacity: 0.9 }}>This vehicle has been fully inspected at source.</div>
              </div>
            </div>
          )}

          {feedback.message && (
            <div style={{ background: feedback.type === "ok" ? "#ecfdf3" : "#fef3f2", color: feedback.type === "ok" ? "#027a48" : "#b42318", border: `1px solid ${feedback.type === "ok" ? "#abefc6" : "#fecdca"}`, borderRadius: 10, padding: "10px 12px", fontSize: 13 }}>
              {feedback.message}
            </div>
          )}

          <div style={{ background: "#101828", border: "1px solid #1d2939", borderRadius: 12, padding: 16, color: "#fff" }}>
            <div style={{ fontWeight: 800, marginBottom: 12, fontSize: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Financial Transparency</span>
              <span style={{ fontSize: 10, background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: 4 }}>USD</span>
            </div>
            {row.isPriceAvailable ? (
              <div style={{ display: "grid", gap: 8 }}>
                {[ ["Vehicle Price (FOB)", row.priceChina], ["Inspection & Report", row.inspectionFee], ["Shipping to Ghana", row.shippingFee] ].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "#98a2b3" }}>{l}</span><span style={{ fontWeight: 600 }}>{usd(v)}</span></div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ fontWeight: 800, color: "#f97316" }}>Total Purchase Cost</span>
                  <span style={{ fontWeight: 800, fontSize: 20, color: "#f97316" }}>{usd(row.purchaseCost)}</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 10, marginTop: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 2 }}><span style={{ color: "#98a2b3" }}>Est. Duty & Clearance</span><span style={{ fontWeight: 600 }}>{usd(row.clearingEstimate)}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}><span style={{ color: "#fff", fontWeight: 700 }}>Est. Total Landed</span><span style={{ fontWeight: 800, color: "#fff" }}>{usd(row.estimatedLandedCost)}*</span></div>
                </div>
                <div style={{ fontSize: 10, color: "#667085", lineHeight: 1.4, fontStyle: "italic" }}>
                  * Duty and clearance are Ghanaian government estimates only. Final costs determined at Tema/Takoradi port.
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#f97316", marginBottom: 4 }}>Price on Request</div>
                <div style={{ fontSize: 12, color: "#98a2b3" }}>Contact our agents for the latest FOB & landed cost estimates for this vehicle.</div>
              </div>
            )}
          </div>

          <div style={{ background: "var(--bg-card, #fff)", border: "1px solid var(--border, #eaecf0)", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Vehicle Specifications</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 6 }}>
              {specs.map(([k, v]) => (
                <div key={k} style={{ border: "1px solid var(--border, #eaecf0)", borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 11, color: "#667085" }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#101828" }}>{v}</div>
                </div>
              ))}
            </div>
            {row.description && <div style={{ marginTop: 8, color: "#475467", fontSize: 13, lineHeight: 1.5 }}>{row.description}</div>}
          </div>

          <div style={{ background: "var(--bg-card, #fff)", border: "1px solid var(--border, #eaecf0)", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}><Clock3 size={14} /> Import Timeline</div>
            {timeline.map((item, idx) => <div key={`${item.step}-${idx}`} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}><span>{item.step}</span><span>{item.days} day{item.days === 1 ? "" : "s"}</span></div>)}
            <div style={{ color: "#17b26a", fontWeight: 700, fontSize: 13, marginTop: 4 }}>Total Lead Time: ~{leadDays} days</div>
          </div>

          <div style={{ background: "var(--bg-card, #fff)", border: "1px solid var(--border, #eaecf0)", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Inspection & Report Documents</div>
            {row.documents.length ? row.documents.map((d, i) => (
              <a key={`${d.url}-${i}`} href={d.url} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", border: "1px solid #eaecf0", borderRadius: 8, marginBottom: 6, textDecoration: "none", color: "#175cd3", fontSize: 13 }}>
                <CheckCircle2 size={14} /> {d.name || `Report ${i + 1}`}
              </a>
            )) : <div style={{ fontSize: 12, color: "#667085" }}>No documents uploaded yet.</div>}
          </div>

          <div style={{ background: "var(--bg-card, #fff)", border: "1px solid var(--border, #eaecf0)", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Reserve / Import Request</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <input className="inp" placeholder="Your name *" value={buyer.name} onChange={(e) => setBuyer((b) => ({ ...b, name: e.target.value }))} />
              <input className="inp" placeholder="Phone *" value={buyer.phone} onChange={(e) => setBuyer((b) => ({ ...b, phone: e.target.value }))} />
              <input className="inp" placeholder="Email (optional)" value={buyer.email} onChange={(e) => setBuyer((b) => ({ ...b, email: e.target.value }))} />
              <input className="inp" placeholder="Message (optional)" value={buyer.note} onChange={(e) => setBuyer((b) => ({ ...b, note: e.target.value }))} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button className="btn-p" disabled={submitting} onClick={() => submitInquiry("Reserve This Car")}>{submitting ? "Sending..." : "Reserve This Car"}</button>
              <button className="btn-o" disabled={submitting} onClick={() => submitInquiry("Import For Me")}><span>Import For Me</span></button>
              <button className="btn-sm btn-sm-neon" onClick={() => window.open(`tel:${(settings.phone || "").replace(/\s+/g, "")}`)}><Phone size={14} /> Talk To Agent</button>
              <button className="btn-sm btn-sm-ghost" onClick={() => window.open(`https://wa.me/${(settings.whatsapp || "").replace(/\D/g, "")}`)}><MessageCircle size={14} /> WhatsApp</button>
            </div>
          </div>
        </section>
      </div>

      <section style={{ marginTop: 14, background: "var(--bg-card, #fff)", border: "1px solid var(--border, #eaecf0)", borderRadius: 12, padding: 12 }}>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>You may also like</div>
        <div className="mk-suggest-grid">
          {suggestions.length ? suggestions.map((s) => (
            <button key={s.id} onClick={() => setPage(`car-${s.id}`)} style={{ textAlign: "left", border: "1px solid var(--border, #eaecf0)", borderRadius: 10, background: "var(--bg-card, #fff)", padding: 8, cursor: "pointer" }}>
              <div style={{ aspectRatio: "4/3", borderRadius: 8, overflow: "hidden", background: "#f2f4f7", marginBottom: 6 }}>{s.images?.[0] ? <img src={s.images[0]} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#101828" }}>{s.brand} {s.model}</div>
              <div style={{ fontSize: 12, color: "#667085" }}>{s.year} · {s.mileage.toLocaleString()} km</div>
              <div style={{ fontSize: 13, color: "#f97316", fontWeight: 800 }}>{s.isPriceAvailable ? usd(s.purchaseCost) : "Price on Request"}</div>
            </button>
          )) : <div style={{ fontSize: 12, color: "#667085" }}>No similar cars available yet.</div>}
        </div>
      </section>

      <style>{`
        .mk-detail-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:12px}
        .mk-suggest-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
        .sticky-cta{position:fixed;bottom:20px;left:20px;right:20px;z-index:100;box-shadow:0 10px 40px rgba(0,0,0,0.25)}
        .btn-wa-full{width:100%;background:#25d366;color:#fff;border:0;border-radius:12px;padding:16px;font-weight:800;font-size:16px;display:flex;align-items:center;justify-content:center;gap:10px;cursor:pointer}
        @media (max-width: 980px){
          .mk-detail-grid{grid-template-columns:1fr !important}
          .mk-suggest-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
        }
        @media (min-width: 769px){ .mobile-only{display:none !important} }
        @media (max-width: 768px){ .desktop-only{display:none !important} }
      `}</style>
    </div>
  );
}

export function MarketplaceSimplePage({ title, subtitle, ctaLabel, onCta, onBack }) {
  return (
    <div style={{ paddingTop: 72, maxWidth: 920, margin: "0 auto", paddingInline: 18, paddingBottom: 96 }}>
      <div style={{ background: "var(--bg-card, #fff)", border: "1px solid var(--border, #eaecf0)", borderRadius: 14, padding: 20 }}><div style={{ marginBottom: 10 }}>{onBack && <button className="btn-sm btn-sm-ghost" onClick={onBack}>← Back</button>}</div>
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, fontSize: 30, marginBottom: 6, color: "var(--text, #101828)" }}>{title}</div>
        <div style={{ color: "#667085", marginBottom: 16 }}>{subtitle}</div>
        {ctaLabel && <button className="btn-p" onClick={onCta}>{ctaLabel}</button>}
      </div>
    </div>
  );
}

export function MarketplaceAccountPage({ settings = {}, setPage }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", tracking: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const submit = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      setStatus("Protocol Error: Identity and Contact Frequency required.");
      return;
    }
    setLoading(true);
    setStatus("");
    try {
      const leadMessage =
        "Jaybesin Protocol: Account Request\n" +
        "Operator: " + form.name.trim() + "\n" +
        "Frequency: " + form.phone.trim() + "\n" +
        (form.email.trim() ? "Credential: " + form.email.trim() + "\n" : "") +
        (form.tracking.trim() ? "Ref Target: " + form.tracking.trim() + "\n" : "") +
        "Payload: " + (form.message || "Standard support request initiated.");

      await addInquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        subject: form.tracking ? "Dossier Tracking - " + form.tracking : "Registry Enrollment",
        message: leadMessage,
        type: "account",
      });

      sendLeadToWhatsApp(settings?.whatsapp, leadMessage);
      setStatus("Transmission Logged. Protocol initiated.");
      setForm({ name: "", phone: "", email: "", tracking: "", message: "" });
    } catch (e) {
      setStatus(`Transmission Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sec" style={{ paddingTop: "100px", maxWidth: "1000px", margin: "0 auto", paddingInline: "20px" }}>
      <button className="btn-sm-ghost" onClick={() => setPage("home")} style={{ marginBottom: '32px' }}>← Operational Home</button>
      
      <div className="adm-split" style={{ alignItems: 'start' }}>
        <div className="adm-card" style={{ padding: '32px' }}>
          <div className="section-label" style={{ marginBottom: '24px' }}>Registry Enrollment</div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>Account & <span style={{ color: 'var(--accent)' }}>Tracking</span></h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px', lineHeight: 1.6 }}>
            Initialize a tracking protocol for your vehicle imports. 
            Logged users receive prioritized updates on port status and shipping logistics.
          </p>
          
          <div style={{ marginTop: '32px', display: 'grid', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '12px' }}>
              <strong>Sync Active:</strong> Real-time Firestore synchronization enabled for all verified accounts.
            </div>
          </div>
        </div>

        <div className="adm-card" style={{ padding: '32px' }}>
          <div className="section-label" style={{ marginBottom: '24px' }}>Submission Dossier</div>
          
          <div className="frow" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="fg"><label className="lbl">Identity</label><input className="inp" placeholder="Full Name *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
            <div className="fg"><label className="lbl">Frequency</label><input className="inp" placeholder="Phone *" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></div>
          </div>
          
          <div className="frow" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <div className="fg"><label className="lbl">Secure Email</label><input className="inp" placeholder="Optional" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></div>
            <div className="fg"><label className="lbl">Tracking ID</label><input className="inp" placeholder="Optional" value={form.tracking} onChange={(e) => setForm((f) => ({ ...f, tracking: e.target.value }))} /></div>
          </div>

          <div className="fg" style={{ marginTop: '16px' }}>
            <label className="lbl">Payload Description</label>
            <textarea className="inp" rows={3} placeholder="How can our logistics team assist you?" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', marginTop: '24px' }}>
            <button className="btn-p" onClick={submit} disabled={loading} style={{ height: '48px', justifyContent: 'center' }}>
              {loading ? "Transmitting..." : "Initialize Request"}
            </button>
            <button className="btn-sm-ghost" onClick={() => setPage("browse")} style={{ height: '48px', justifyContent: 'center' }}>
              Browse Marketplace
            </button>
          </div>
          
          {status && <div style={{ marginTop: '16px', fontSize: '11px', fontWeight: 700, textAlign: 'center', color: status.includes('Error') ? '#FF4A5A' : 'var(--accent)' }}>{status}</div>}
        </div>
      </div>
    </div>
  );
}

export function MarketplaceAdminTab({ cars, onSaveCar, saving, importTimeline = DEFAULT_TIMELINE, importLeadTimeDays = 45, onImportTimelineChange, onImportLeadTimeChange, onSaveTimeline }) {
  const blankForm = { id: "", brand: "", model: "", year: "", mileage: "", fuel: "Petrol", transmission: "Automatic", bodyType: "SUV", seats: "5", engine: "", priceChina: "", inspectionFee: "", shippingFee: "", clearingEstimate: "", imagesText: "", documentsText: "", description: "", locationChina: "", tagsText: "" };
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState("");

  const timelineRows = Array.isArray(importTimeline) && importTimeline.length ? importTimeline : DEFAULT_TIMELINE;
  const purchaseTotal = asNum(form.priceChina) + asNum(form.inspectionFee) + asNum(form.shippingFee);
  const estimatedLanded = purchaseTotal + asNum(form.clearingEstimate);

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

  const clearEditor = () => {
    setEditingId("");
    setForm(blankForm);
  };

  const loadCarIntoForm = (row) => {
    const c = normalizeCar(row);
    setEditingId(String(c.id || ""));
    setForm({
      id: String(c.id || ""),
      brand: c.brand || "",
      model: c.model || "",
      year: String(c.year || ""),
      mileage: String(c.mileage || ""),
      fuel: c.fuel || "Petrol",
      transmission: c.transmission || "Automatic",
      bodyType: c.bodyType || "SUV",
      seats: String(c.seats || 5),
      engine: c.engine || "",
      priceChina: String(c.priceChina || 0),
      inspectionFee: String(c.inspectionFee || 0),
      shippingFee: String(c.shippingFee || 0),
      clearingEstimate: String(c.clearingEstimate || 0),
      imagesText: (c.images || []).join("\n"),
      documentsText: (c.documents || []).map((d) => d?.url).filter(Boolean).join("\n"),
      description: c.description || "",
      locationChina: c.locationChina || "",
      tagsText: (c.tags || []).join(", "),
    });
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    const images = form.imagesText.split("\n").map((s) => s.trim()).filter(Boolean);
    const documents = form.documentsText.split("\n").map((s) => s.trim()).filter(Boolean).map((url, idx) => ({ name: "Report " + (idx + 1), url, type: "report" }));
    const tags = form.tagsText.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

    await onSaveCar({
      id: editingId || form.id || undefined,
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
      clearingEstimate: asNum(form.clearingEstimate),
      purchaseCost: purchaseTotal,
      estimatedLandedCost: estimatedLanded,
      totalLandedCost: estimatedLanded,
      images,
      documents,
      description: form.description,
      locationChina: form.locationChina,
      tags,
      dateAdded: new Date().toISOString(),
    });

    clearEditor();
  };

  const updateTimeline = (index, key, value) => {
    if (!onImportTimelineChange) return;
    const next = timelineRows.map((row, idx) => idx === index ? { ...row, [key]: key === "days" ? asNum(value) : value } : row);
    onImportTimelineChange(next);
  };

  const addTimelineStep = () => {
    if (!onImportTimelineChange) return;
    onImportTimelineChange([...(timelineRows || []), { step: "New Step", days: 1 }]);
  };

  const removeTimelineStep = (index) => {
    if (!onImportTimelineChange) return;
    onImportTimelineChange(timelineRows.filter((_, idx) => idx !== index));
  };

  const sortedCars = [...cars].sort((a, b) => new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime());

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="adm-card">
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, marginBottom: 12 }}>Import Timeline (Global)</div>
        <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
          {timelineRows.map((row, idx) => (
            <div key={row.step + "-" + idx} style={{ display: "grid", gridTemplateColumns: "1fr 120px auto", gap: 8 }}>
              <input className="inp" value={row.step} onChange={(e) => updateTimeline(idx, "step", e.target.value)} placeholder="Step name" />
              <input className="inp" type="number" min="0" value={row.days} onChange={(e) => updateTimeline(idx, "days", e.target.value)} placeholder="days" />
              <button className="btn-sm btn-sm-red" onClick={() => removeTimelineStep(idx)} disabled={timelineRows.length <= 1}>Del</button>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "end" }}>
          <div>
            <label className="lbl">Total Lead Time (days)</label>
            <input className="inp" type="number" min="1" value={importLeadTimeDays} onChange={(e) => onImportLeadTimeChange && onImportLeadTimeChange(asNum(e.target.value))} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn-sm btn-sm-neon" onClick={addTimelineStep}>+ Add Step</button>
            <button className="btn-sm btn-sm-ghost" onClick={onSaveTimeline}>Save Timeline</button>
          </div>
        </div>
      </div>

      <div className="adm-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800 }}>{editingId ? "Edit Marketplace Car" : "Upload Marketplace Car"}</div>
          {editingId && <button className="btn-sm btn-sm-ghost" onClick={clearEditor}>Cancel Edit</button>}
        </div>

        <div className="adm-form-grid">
          {[
            ["id", "id (optional)"],
            ["brand", "brand"],
            ["model", "model"],
            ["year", "year"],
            ["mileage", "mileage (km)"],
            ["seats", "seats"],
            ["engine", "engine"],
            ["priceChina", "vehicle price FOB (USD)"],
            ["inspectionFee", "inspection & report (USD)"],
            ["shippingFee", "shipping to Ghana (USD)"],
            ["clearingEstimate", "estimated duty & clearance (USD)"],
            ["locationChina", "location in China"],
          ].map(([key, label]) => (
            <div className="fg" key={key}><label className="lbl">{label}</label><input className="inp" value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} /></div>
          ))}
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
          <div style={{ fontSize: 13, color: "var(--text2)", display: "grid", gap: 3 }}>
            <span>FOB: <strong style={{ color: "var(--text)" }}>{usd(form.priceChina)}</strong></span>
            <span>Inspection: <strong style={{ color: "var(--text)" }}>{usd(form.inspectionFee)}</strong></span>
            <span>Shipping: <strong style={{ color: "var(--text)" }}>{usd(form.shippingFee)}</strong></span>
            <span>Estimated Duty/Clearance: <strong style={{ color: "var(--text)" }}>{usd(form.clearingEstimate)}</strong></span>
            <span>Total Purchase Cost: <strong style={{ color: "var(--neon)" }}>{usd(purchaseTotal)}</strong></span>
            <span>Estimated Landed (guide): <strong style={{ color: "var(--orange)" }}>{usd(estimatedLanded)}</strong></span>
          </div>
          <button className="btn-p" onClick={save} disabled={saving || !form.brand || !form.model}>{saving ? "Saving..." : (editingId ? "Update Car" : "Save Car")}</button>
        </div>
      </div>

      <div className="adm-card">
        <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 800, marginBottom: 10 }}>Marketplace Cars ({cars.length})</div>
        <div style={{ display: "grid", gap: 8 }}>
          {sortedCars.slice(0, 20).map((row) => {
            const c = normalizeCar(row);
            return (
              <div key={c.id} style={{ border: "1px solid var(--border2)", borderRadius: 8, padding: "10px", display: "grid", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{c.brand} {c.model} ({c.year})</div>
                    <div style={{ fontSize: 12, color: "var(--text2)" }}>{c.bodyType} · {c.fuel} · {c.transmission} · Seats: {c.seats} · Engine: {c.engine || "N/A"}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>Docs: {(c.documents || []).length} · Tags: {(c.tags || []).join(", ") || "-"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-sm btn-sm-neon" onClick={() => loadCarIntoForm(c)}>Edit</button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 8 }}>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>FOB: <strong style={{ color: "var(--text)" }}>{usd(c.priceChina)}</strong></div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>Inspection: <strong style={{ color: "var(--text)" }}>{usd(c.inspectionFee)}</strong></div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>Shipping: <strong style={{ color: "var(--text)" }}>{usd(c.shippingFee)}</strong></div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>Est Duty: <strong style={{ color: "var(--text)" }}>{usd(c.clearingEstimate)}</strong></div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>Purchase: <strong style={{ color: "var(--neon)" }}>{usd(c.purchaseCost)}</strong></div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>Est Landed: <strong style={{ color: "var(--orange)" }}>{usd(c.estimatedLandedCost)}</strong></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="adm-card" style={{ fontSize: 12, color: "var(--text2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text)", fontWeight: 700, marginBottom: 8 }}><ShieldCheck size={14} /> Firestore \`cars\` schema</div>
        <div>id, brand, model, year, mileage, fuel, transmission, bodyType, seats, engine, priceChina (FOB), inspectionFee, shippingFee, clearingEstimate (estimate only), purchaseCost, estimatedLandedCost, images[], documents[], description, locationChina, dateAdded, tags[].</div>
      </div>
    </div>
  );
}


export function MarketplaceHighlights() {
  const items = [{ icon: <Flame size={14} />, text: "Hot Listings" }, { icon: <ShieldCheck size={14} />, text: "Verified Cars" }, { icon: <Sparkles size={14} />, text: "Transparent Costing" }];
  return <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "0 2px 6px" }}>{items.map((i) => <span key={i.text} style={{ fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6, background: "var(--bg-card, #fff)", border: "1px solid var(--border, #eaecf0)", borderRadius: 999, color: "var(--text2, #344054)", padding: "6px 10px" }}>{i.icon}{i.text}</span>)}</div>;
}
