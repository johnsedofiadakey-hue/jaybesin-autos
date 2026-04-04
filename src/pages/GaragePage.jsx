import React from "react";
import { Link } from "react-router-dom";
import { Car, Zap, Wrench, ShieldCheck } from "lucide-react";
import { VehicleCard } from "../components/marketplace/VehicleCard";
import { fmtUSD } from "../utils/theme";

export function GaragePage({ vehicles = [], settings = {} }) {
  return (
    <div className="sec" style={{ paddingTop: "120px" }}>
      <div className="sec-chip chip-1 rv on">Official Garage</div>
      <h2 className="sec-h rv on">Browse Our <span className="gt-neon">Full Inventory</span></h2>
      <p className="sec-p rv on" style={{ marginBottom: "40px" }}>
        Premium second-hand vehicles sourced directly from China's best manufacturers. 
        Fully inspected, documented, and ready for shipping or collection.
      </p>

      <div className="car-grid">
        {vehicles.map((v, i) => (
          <VehicleCard key={v.id} v={v} delay={i * 0.05} settings={settings} />
        ))}
      </div>

      {vehicles.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px", opacity: 0.5 }}>
          <Car size={64} style={{ marginBottom: "20px" }} />
          <div>No vehicles currently listed in the garage.</div>
        </div>
      )}
    </div>
  );
}
