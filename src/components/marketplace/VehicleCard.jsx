import React from "react";
import { ShieldCheck, Flame, LucideZap } from "lucide-react";

export function VehicleCard({ v, delay = 0, settings = {} }) {
  const usd = (val) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
  
  // Logic for the price manifest as seen in the mockup
  const fobPrice = v.priceChina ?? 0;
  const shippingCharge = v.shippingFee ?? 0;
  const totalPurchase = v.purchaseCost || (fobPrice + shippingCharge + (v.inspectionFee ?? 0));

  return (
    <div 
      className="card-mobile rv on" 
      style={{ 
        animationDelay: `${delay}s`,
        background: '#FFFFFF',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #E8E8ED',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Image Sleeve with Badge */}
      <div style={{ position: 'relative', aspectRatio: '4/3', width: '100%', overflow: 'hidden', background: '#F5F5F7' }}>
        {v.images?.[0] ? (
          <img 
            src={v.images[0]} 
            alt={v.brand} 
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1 }}>
            <LucideZap size={48} />
          </div>
        )}
        <div style={{ 
          position: 'absolute', left: '8px', bottom: '8px', 
          background: v.isAvailableInGhana ? '#10B981' : 'rgba(0,113,227,0.9)', 
          color: '#FFF', 
          fontSize: '10px', fontWeight: 900, padding: '4px 10px', 
          borderRadius: '4px', backdropFilter: 'blur(4px)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {v.isAvailableInGhana ? 'Available in Ghana' : 'Pre-order from China'}
        </div>
      </div>

      {/* Content Sleeve */}
      <div style={{ padding: '12px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 4px', color: '#1D1D1F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {v.brand} {v.model}
        </h3>
        
        <div style={{ fontSize: '13px', color: '#86868B', marginBottom: '12px', fontWeight: 500 }}>
          {v.year} / {(v.mileage / 10000).toFixed(1)}万公里
        </div>

        <div style={{ display: 'grid', gap: '4px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#86868B', fontWeight: 600 }}>
            <span>Vehicle Price (FOB):</span>
            <span style={{ color: '#1D1D1F' }}>{usd(fobPrice)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#86868B", fontWeight: 600 }}>
            <span>Shipping:</span>
            <span style={{ color: "#1D1D1F" }}>{shippingCharge > 0 ? usd(shippingCharge) : "Included"}</span>
          </div>
        </div>

        <div style={{ 
          fontSize: '24px', 
          fontWeight: 900, 
          color: 'var(--accent)', 
          letterSpacing: '-1px',
          marginTop: 'auto'
        }}>
          {usd(totalPurchase)}
        </div>
      </div>

      <style>{`
        .card-mobile {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
          cursor: pointer;
        }
        .card-mobile:active {
          transform: scale(0.97);
        }
        @media (min-width: 981px) {
          .inp-mobile:focus {
          background: #FFFFFF;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
        }
  }
        .card-mobile:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
      `}</style>
    </div>
  );
}
