import React from "react";
import { Link } from "react-router-dom";
import { Car, Zap, Wrench, Package } from "lucide-react";
import { fmtUSD, fmtGHS } from "../../utils/theme";

export function VehicleCard({ v, delay = 0, settings }) {
  const rate = settings.ghsRate || 16.2;
  const showGHS = settings.showGhsPrice;

  function fuelTag(f) {
    if (f === "Electric") return <span className="tag tag-2">⚡ Electric</span>;
    if (f === "Hybrid") return <span className="tag tag-1">🔋 Hybrid</span>;
    return <span className="tag tag-3">⛽ Gasoline</span>;
  }

  function availTag(a) {
    return a === "in_stock" ? <span className="tag tag-g">✓ In Stock</span> : <span className="tag tag-dim">Pre-Order</span>;
  }

  return (
    <div className="v-card rv" style={{ transitionDelay: `${delay}s` }}>
      <Link to={`/car/${v.id}`} className="v-card-img" style={{ cursor: 'none' }}>
        {v.images && v.images[0] ? (
          <img src={v.images[0]} alt={v.name} />
        ) : (
          <div className="v-card-img-ph"><Car size={48} opacity={0.2} /></div>
        )}
      </Link>
      <div className="v-card-body">
        <div className="v-card-brand">{v.brand}</div>
        <div className="v-card-name">{v.name}</div>
        <div className="v-card-tags">
          {fuelTag(v.fuel)}
          {availTag(v.availability)}
        </div>
        <div className="v-card-price">{fmtUSD(v.estimatedLandedCost || v.price)}</div>
        {showGHS && (v.estimatedLandedCost || v.price) && <div className="v-card-ghs">{fmtGHS(v.estimatedLandedCost || v.price, rate)}</div>}
      </div>
      <div className="v-card-footer">
        <Link to={`/car/${v.id}`} className="btn-sm btn-sm-neon" style={{ cursor: 'none' }}>Details →</Link>
        <button className="btn-sm btn-sm-ghost" style={{ cursor: 'none' }}>Inquire</button>
      </div>
    </div>
  );
}
