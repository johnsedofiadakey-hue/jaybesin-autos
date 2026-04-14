import React from "react";
import { Search, ChevronDown } from "lucide-react";

export function FilterConsole({ filters, update, resultCount }) {
  return (
    <div className="filter-console">
      <div className="filter-row">
        <div className="fg-mobile">
          <input 
            className="inp-mobile" 
            placeholder="Year min" 
            value={filters.yearMin} 
            onChange={(e) => update("yearMin", e.target.value)}
          />
        </div>
        <div className="fg-mobile">
          <input 
            className="inp-mobile" 
            placeholder="Price max" 
            value={filters.priceMax} 
            onChange={(e) => update("priceMax", e.target.value)}
          />
        </div>
      </div>

      <div className="results-header">
        <span className="count-text">{resultCount} cars</span>
      </div>

      <style>{`
        .filter-console {
          padding: 16px 0;
          background: #FFFFFF;
        }
        
        .filter-row {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        
        .fg-mobile {
          flex: 1;
        }
        
        .inp-mobile {
          width: 100%;
          height: 48px;
          background: #F5F5F7;
          border: 1px solid #E8E8ED;
          border-radius: 10px;
          padding: 0 16px;
          font-size: 15px;
          font-weight: 500;
          color: #1D1D1F;
          outline: none;
          transition: all 0.2s ease;
        }
        
        .inp-mobile:focus {
          background: #FFFFFF;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
        }
        
        .inp-mobile::placeholder {
          color: #86868B;
        }
        
        .results-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .count-text {
          font-size: 14px;
          font-weight: 600;
          color: #86868B;
          letter-spacing: -0.2px;
        }
      `}</style>
    </div>
  );
}
