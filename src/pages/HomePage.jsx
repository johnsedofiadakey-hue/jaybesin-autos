import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, Zap, Wrench, Package, MapPin, Phone, Mail, ArrowRight, Star } from "lucide-react";
import { HeroSlider } from "../components/home/HeroSlider";
import { VehicleCard } from "../components/marketplace/VehicleCard";

export function HomePage({ vehicles = [], settings = {} }) {
  const navigate = useNavigate();
  const featured = vehicles.filter(v => v.featured).slice(0, 3);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("on");
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".rv, .rvL, .rvR").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <HeroSlider 
          slides={settings.heroSlides} 
          onExplore={() => navigate("/browse")} 
          onQuote={() => navigate("/contact")} 
        />
      </section>

      {/* Stats */}
      <div className="stats-band">
        {[
          ["200+", "Vehicles Imported", "var(--neon)"],
          ["40%", "Avg Fuel Savings (EV)", "var(--neon2)"],
          ["4", "Countries Served", "var(--orange)"],
          ["100%", "Transparent Pricing", "var(--purple)"]
        ].map(([n, l, c]) => (
          <div key={l} className="stat-box rv">
            <div className="stat-n" style={{ color: c }}>{n}</div>
            <div className="stat-l">{l}</div>
          </div>
        ))}
      </div>

      {/* About Section */}
      <section className="sec" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "72px", alignItems: "center" }}>
        <div>
          <div className="sec-chip chip-1 rv">Our Story</div>
          <h2 className="sec-h rv" style={{ transitionDelay: ".1s" }}>
            Driving West Africa's<br /><span className="gt-neon">Automotive Future</span>
          </h2>
          <p className="sec-p rv" style={{ transitionDelay: ".2s" }}>
            We bridge the gap between China's world-class auto industry and Ghana's growing market. 
            From sleek electric saloons to powerful 4×4s — we source, ship, clear customs and deliver with full price transparency.
          </p>
          <div style={{ display: "flex", gap: "12px", marginTop: "32px" }} className="rv">
            <button className="btn-p" onClick={() => navigate("/browse")}>Browse Inventory</button>
            <button className="btn-o" onClick={() => navigate("/track")}><span>Track My Order</span></button>
          </div>
        </div>
        <div className="rvR">
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "16px", padding: "36px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "180px", height: "180px", borderRadius: "50%", background: "radial-gradient(circle,color-mix(in srgb,var(--neon) 8%,transparent),transparent 70%)" }} />
            {[
              { Icon: Car, name: "Vehicle Import", desc: "Saloons, SUVs, 4×4s, EVs, Hybrids" },
              { Icon: Zap, name: "EV Charging", desc: "Supply & professional installation" },
              { Icon: Wrench, name: "Spare Parts", desc: "OEM & quality aftermarket parts" },
              { Icon: Package, name: "Full Service", desc: "Sourcing → Shipping → Delivery" }
            ].map((item, i) => (
              <div key={item.name} style={{ display: "flex", gap: "14px", marginBottom: "20px", alignItems: "flex-start" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "color-mix(in srgb,var(--neon) 12%,transparent)", border: "1px solid color-mix(in srgb,var(--neon) 22%,transparent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                  <item.Icon size={20} strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "14px", marginBottom: "2px" }}>{item.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--text2)" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="sec" style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", paddingTop: "72px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px" }}>
          <div>
            <div className="sec-chip chip-2 rv">Hand-Picked</div>
            <h2 className="sec-h rv" style={{ transitionDelay: ".1s", marginBottom: 0 }}>
              Featured <span className="gt-orange">Collection</span>
            </h2>
          </div>
          <button className="btn-o rv" onClick={() => navigate("/browse")}><span>View All →</span></button>
        </div>
        <div className="car-grid">
          {featured.map((v, i) => (
            <VehicleCard key={v.id} v={v} delay={i * 0.08} settings={settings} />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="sec">
        <div className="sec-chip chip-3 rv">Everything You Need</div>
        <h2 className="sec-h rv" style={{ transitionDelay: ".1s" }}>
          Complete <span className="gt-purple">Automotive</span><br />Solutions
        </h2>
        <div className="svc-grid">
          {[
            { Icon: Car, name: "Vehicle Import", desc: "Premium Chinese vehicles — Electric, Hybrid, Gasoline. Saloons, SUVs, 4×4s and more.", chip: "chip-1", c: "var(--neon)", path: "/browse" },
            { Icon: Zap, name: "EV Charging Stations", desc: "AC home chargers, DC fast chargers, commercial EV infrastructure. Supply & professional install.", chip: "chip-4", c: "var(--neon2)", path: "/charging" },
            { Icon: Wrench, name: "Spare Parts", desc: "Genuine OEM and quality aftermarket spare parts for all major Chinese brands we supply.", chip: "chip-2", c: "var(--orange)", path: "/parts" }
          ].map((s, i) => (
            <div key={s.name} className="svc-card rv" style={{ transitionDelay: `${i * 0.1}s` }} onClick={() => navigate(s.path)}>
              <div className="svc-icon" style={{ background: `color-mix(in srgb,${s.c} 12%,transparent)`, border: `1px solid color-mix(in srgb,${s.c} 22%,transparent)` }}>
                <s.Icon size={20} strokeWidth={2} />
              </div>
              <div className="svc-name">{s.name}</div>
              <div className="svc-desc">{s.desc}</div>
              <div style={{ marginTop: "18px" }}>
                <div className={`sec-chip ${s.chip}`}>Explore →</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {settings.testimonials && settings.testimonials.length > 0 && (
        <section className="sec" style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", paddingTop: "72px" }}>
          <div className="sec-chip chip-1 rv">Real Clients</div>
          <h2 className="sec-h rv" style={{ transitionDelay: ".1s" }}>What Our <span className="gt-neon">Clients Say</span></h2>
          <div className="testi-grid">
            {settings.testimonials.map((t, i) => (
              <div key={t.id} className="testi-card rv" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="testi-stars">{"★".repeat(t.stars || 5)}</div>
                <div className="testi-text">"{t.text}"</div>
                <div className="testi-name">{t.name}</div>
                <div className="testi-role">{t.role}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
