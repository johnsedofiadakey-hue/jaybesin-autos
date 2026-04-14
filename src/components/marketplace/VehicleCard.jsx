import React from "react";
import { Link } from "react-router-dom";
import { Car, Zap, Wrench, Package, ArrowUpRight, ShieldCheck } from "lucide-react";
import { fmtUSD } from "../../utils/theme";

export function VehicleCard({ v, delay = 0, settings }) {
  const isPremium = v.featured || v.tags?.includes("Verified");

  function fuelTag(f) {
    if (f === "Electric") return <span className="tag" style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}>EV PRO</span>;
    if (f === "Hybrid") return <span className="tag">HYBRID</span>;
    return <span className="tag">FUEL</span>;
  }

  function availTag(a) {
    return a === "in_stock" 
      ? <span className="tag" style={{ color: 'var(--accent)' }}>● IN STOCK</span> 
      : <span className="tag" style={{ opacity: 0.5 }}>TRANSIT</span>;
  }

  return (
    <div className="adm-card" style={{ padding: 0, overflow: 'hidden', transitionDelay: `${delay}s` }}>
      <Link to={`/car/${v.id}`} style={{ display: 'block', position: 'relative', height: '220px', background: 'var(--bg-3)', overflow: 'hidden', textDecoration: 'none' }}>
        {v.images && v.images[0] ? (
          <img src={v.images[0]} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.1 }}><Car size={48} /></div>
        )}
        
        {isPremium && (
          <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--accent)', color: 'var(--bg)', padding: '4px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Verified Authentic
          </div>
        )}
      </Link>

      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{v.brand}</div>
            <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>{v.model || v.name}</div>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent)' }}>{v.year}</div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {fuelTag(v.fuel)}
          {availTag(v.availability)}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, opacity: 0.5, textTransform: 'uppercase' }}>FOB (China Source)</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)' }}>
              {v.isPriceAvailable !== false ? fmtUSD(v.priceChina || v.price) : "Request Protocol"}
            </span>
          </div>
          <Link to={`/car/${v.id}`} className="btn-sm-ghost" style={{ padding: '8px 12px' }}>
            Inspect <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
