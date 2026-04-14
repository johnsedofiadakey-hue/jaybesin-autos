import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Sparkles, Percent, ShieldCheck } from "lucide-react";
import { VehicleCard } from "../components/marketplace/VehicleCard";
import { normalizeCar } from "../marketplace";

export function DealsPage({ marketplaceCars = [], settings = {} }) {
  const navigate = useNavigate();

  // Show cars marked as special or with price drop tags
  const dealCars = useMemo(() => {
    return marketplaceCars
      .map(normalizeCar)
      .filter(c => c.isSpecial || c.tags.includes("deal") || c.tags.includes("discount"));
  }, [marketplaceCars]);

  return (
    <div className="deals-page" style={{ background: "var(--bg)", paddingTop: "140px", minHeight: "100vh" }}>
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <div style={{ maxWidth: "800px", marginBottom: "60px" }}>
          <div className="sec-chip" style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>
            Limited Offers
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: "20px", color: "var(--text)" }}>
            Special <span style={{ color: "var(--accent)" }}>Deals & Clearances</span>
          </h1>
          <p style={{ fontSize: "18px", color: "var(--text-dim)", lineHeight: 1.6 }}>
            Exclusive opportunities to import verified high-quality vehicles at discounted rates. 
            These units are hand-picked for their exceptional value.
          </p>
        </div>

        {dealCars.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "100px 20px", 
            background: "var(--bg-alt)", 
            borderRadius: "24px", 
            border: "1px dashed var(--border)" 
          }}>
            <div style={{ 
              width: "72px", height: "72px", background: "#FFFFFF", borderRadius: "50%", 
              display: "flex", alignItems: "center", justifyContent: "center", 
              margin: "0 auto 24px", color: "var(--text-muted)"
            }}>
              <Flame size={32} />
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text)", marginBottom: "12px" }}>No active flash deals</h3>
            <p style={{ color: "var(--text-dim)", maxWidth: "400px", margin: "0 auto" }}>
              Our procurement team is currently negotiating the next batch of special imports. 
              Check back soon or browse our full catalog.
            </p>
            <div style={{ marginTop: "32px" }}>
              <button 
                className="btn-p" 
                style={{ padding: "0 32px", height: "52px" }}
                onClick={() => navigate("/browse")}
              >
                Browse Standard Fleet
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
              gap: "24px", 
              marginBottom: "80px" 
            }}>
              {dealCars.map((car, i) => (
                <div key={car.id} onClick={() => navigate("/car/" + car.id)} style={{ cursor: "pointer", position: "relative" }}>
                  <div style={{ 
                    position: "absolute", 
                    top: "12px", 
                    right: "12px", 
                    zIndex: 10, 
                    background: "var(--accent)", 
                    color: "#FFF", 
                    padding: "6px 14px", 
                    borderRadius: "50px", 
                    fontSize: "12px", 
                    fontWeight: 900,
                    boxShadow: "0 4px 12px rgba(0,113,227,0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    <Sparkles size={14} /> SPECIAL DEAL
                  </div>
                  <VehicleCard v={car} delay={i * 0.05} settings={settings} />
                </div>
              ))}
            </div>

            <div style={{ 
              background: "linear-gradient(135deg, var(--accent) 0%, #00B4D8 100%)", 
              borderRadius: "32px", 
              padding: "64px 40px", 
              color: "#FFFFFF", 
              textAlign: "center",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{ position: "absolute", top: "-20px", right: "-20px", opacity: 0.1 }}><Percent size={200} /></div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <ShieldCheck size={48} style={{ marginBottom: "24px", margin: "0 auto 24px" }} />
                <h2 style={{ fontSize: "32px", fontWeight: 900, marginBottom: "16px" }}>Bespoke Deal Sourcing</h2>
                <p style={{ maxWidth: "600px", margin: "0 auto 32px", fontSize: "18px", opacity: 0.9 }}>
                  Looking for a specific vehicle but want a better price? Our agents directly 
                  negotiate with terminal managers in China to find the best market opportunities.
                </p>
                <a 
                  href={`https://wa.me/${(settings.whatsapp || "").replace(/\D/g, "")}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-p" 
                  style={{ background: "#FFFFFF", color: "var(--accent)", padding: "0 40px", height: "60px", fontSize: "16px" }}
                >
                  Contact Deal Desk
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
