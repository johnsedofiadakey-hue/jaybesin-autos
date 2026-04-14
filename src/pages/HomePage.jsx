import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, Sparkles, ShieldCheck, 
  Globe, Zap, Star, LayoutGrid, Ship 
} from "lucide-react";
import { VehicleCard } from "../components/marketplace/VehicleCard";
import { normalizeCar } from "../marketplace";

export function HomePage({ marketplaceCars = [], settings = {} }) {
  const navigate = useNavigate();

  // Logic: Exactly 8 cars. Use isFeatured first, then fallback to newest.
  const featuredCars = useMemo(() => {
    let list = marketplaceCars.map(normalizeCar);
    const manual = list.filter(c => c.isFeatured);
    
    if (manual.length >= 8) return manual.slice(0, 8);
    
    // If not enough manual, add newest cars that aren't already manual
    const newest = list
      .filter(c => !manual.find(m => m.id === c.id))
      .sort((a, b) => new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime());
    
    return [...manual, ...newest].slice(0, 8);
  }, [marketplaceCars]);

  const stats = [
    { label: "Cars Sourcing", value: "500+", icon: Ship },
    { label: "Happy Clients", value: "1.2k+", icon: Star },
    { label: "Global Partners", value: "50+", icon: Globe },
    { label: "Verified Imports", value: "100%", icon: ShieldCheck },
  ];

  return (
    <div className="home-page" style={{ background: "var(--bg)", paddingTop: "72px" }}>
      {/* --- FUN HERO SECTION --- */}
      <section style={{ 
        position: "relative", 
        padding: "100px 20px 80px", 
        textAlign: "center",
        background: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.9)), url('${settings.heroBg || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000"}') center/cover no-repeat`,
        overflow: "hidden"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "8px", 
            background: "var(--accent-dim)", 
            color: "var(--accent)", 
            padding: "8px 20px", 
            borderRadius: "100px", 
            fontSize: "13px", 
            fontWeight: 800, 
            marginBottom: "24px",
            animation: "slideIn 0.8s ease-out"
          }}>
            <Sparkles size={16} /> PREMIUM VEHICLE SOURCING
          </div>
          <h1 style={{ 
            fontSize: "clamp(48px, 8vw, 84px)", 
            fontWeight: 900, 
            letterSpacing: "-4px", 
            lineHeight: 0.9,
            marginBottom: "24px",
            color: "var(--text)"
          }}>
            {settings.heroTitle || "Find Your Dream Import"}
          </h1>
          <p style={{ 
            fontSize: "clamp(16px, 2vw, 20px)", 
            color: "var(--text-dim)", 
            maxWidth: "600px", 
            margin: "0 auto 40px",
            lineHeight: 1.6
          }}>
            {settings.heroSubtitle || "The most entertaining and professional way to buy cars from China. Verified quality, transparent pricing, and seamless shipping to Ghana."}
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button 
              className="btn-p" 
              style={{ height: "64px", padding: "0 40px", fontSize: "17px", borderRadius: "16px" }}
              onClick={() => navigate("/browse")}
            >
              Start Browsing <ArrowRight size={20} />
            </button>
            <button 
              className="btn-o" 
              style={{ height: "64px", padding: "0 40px", fontSize: "17px", borderRadius: "16px" }}
              onClick={() => navigate("/track")}
            >
              Track Order
            </button>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section style={{ padding: "40px 20px", background: "#FFFFFF" }}>
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "24px" 
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{ 
              padding: "24px", 
              borderRadius: "20px", 
              background: "var(--bg-alt)", 
              textAlign: "center",
              animation: `fadeIn 0.5s ease-out ${i * 0.1}s both`
            }}>
              <div style={{ color: "var(--accent)", marginBottom: "12px", display: "flex", justifyContent: "center" }}>
                <s.icon size={28} />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "var(--text)" }}>{s.value}</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURED SECTION --- */}
      <section style={{ padding: "80px 20px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>CURATED FOR YOU</div>
              <h2 style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-1px", color: "var(--text)" }}>The <span style={{ color: "var(--accent)" }}>Hot 8</span> Fleet</h2>
            </div>
            <button 
              style={{ 
                background: "none", 
                border: "none", 
                color: "var(--accent)", 
                fontWeight: 800, 
                fontSize: "16px", 
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
                cursor: "pointer"
              }}
              onClick={() => navigate("/browse")}
            >
              See Full Inventory <LayoutGrid size={20} />
            </button>
          </div>

          <div className="mk-grid">
            {featuredCars.length === 0 ? (
              <div style={{ gridColumn: "1/-1", padding: "60px", textAlign: "center", background: "var(--bg-alt)", borderRadius: "20px", border: "1px dashed var(--border)" }}>
                No units currently promoted. Check back soon!
              </div>
            ) : (
              featuredCars.map((car, i) => (
                <div key={car.id} onClick={() => navigate("/car/" + car.id)} style={{ cursor: "pointer" }}>
                  <VehicleCard v={car} delay={i * 0.05} settings={settings} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* --- FUN TESTIMONIALS --- */}
      <section style={{ padding: "80px 20px", background: "var(--bg-alt)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ marginBottom: "60px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "16px" }}>What Our Clients Say</h2>
            <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
              {[1,2,3,4,5].map(j => <Star key={j} size={20} style={{ color: "var(--gold)", fill: "var(--gold)" }} />)}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {(settings.testimonials || []).map((t, i) => (
              <div key={i} style={{ 
                padding: "40px", 
                background: "#FFFFFF", 
                borderRadius: "24px", 
                boxShadow: "0 10px 40px rgba(0,0,0,0.02)",
                textAlign: "left",
                position: "relative"
              }}>
                <div style={{ fontSize: "60px", color: "var(--accent)", opacity: 0.1, position: "absolute", top: "20px", left: "20px", fontFamily: "serif" }}>"</div>
                <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--text-dim)", marginBottom: "24px", position: "relative" }}>{t.text}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", background: "var(--accent)", color: "#FFF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>{t.name[0]}</div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 800, fontSize: "14px" }}>{t.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .mk-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (min-width: 981px) {
          .mk-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; }
        }
        @media (max-width: 768px) {
          .home-page section { padding: 60px 20px !important; }
        }
      `}</style>
    </div>
  );
}
