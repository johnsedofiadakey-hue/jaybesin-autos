import React from "react";
import { Car, Search } from "lucide-react";
import { VehicleCard } from "../components/marketplace/VehicleCard";

export function GaragePage({ vehicles = [], settings = {} }) {
  return (
    <div className="sec" style={{ paddingTop: "140px", minHeight: "100vh", background: "var(--bg)" }}>
      <div className="sec-chip" style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>
        Local Inventory
      </div>
      <h2 className="sec-h">Ready for <span style={{ color: "var(--accent)" }}>Collection</span></h2>
      <p className="sec-p" style={{ marginBottom: "60px", maxWidth: "700px" }}>
        Browse our premium selection of vehicles currently available or in transit. 
        Each unit is fully inspected and comes with complete documentation.
      </p>

      {vehicles.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "120px 20px", 
          background: "var(--bg-alt)", 
          border: "1px dashed var(--border)", 
          borderRadius: "24px",
          color: "var(--text-dim)"
        }}>
          <Car size={64} style={{ marginBottom: "24px", opacity: 0.2, margin: "0 auto" }} />
          <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px", color: "var(--text)" }}>Garage is currently empty</h3>
          <p style={{ maxWidth: "400px", margin: "0 auto" }}>
            We're currently sourcing new stock. You can still browse our global catalog 
            to import your dream car directly from China.
          </p>
          <div style={{ marginTop: "32px" }}>
            <a href="/browse" className="btn-p" style={{ padding: "0 32px", height: "48px" }}>Explore Global Browse</a>
          </div>
        </div>
      ) : (
        <div className="mk-grid">
          {vehicles.map((v, i) => (
            <div key={v.id} className="rv on" style={{ transitionDelay: `${i * 0.05}s` }}>
              <VehicleCard v={v} settings={settings} />
            </div>
          ))}
        </div>
      )}

      <style>{`
        .mk-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (max-width: 480px) {
          .mk-grid {
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
