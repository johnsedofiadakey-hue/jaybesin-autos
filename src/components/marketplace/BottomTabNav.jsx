import React from "react";
import { Home, Search, Tag, Flame, UserCircle2 } from "lucide-react";

export function BottomTabNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "browse", label: "Buy", icon: Search },
    { id: "sell", label: "Sell", icon: Tag },
    { id: "deals", label: "Deals", icon: Flame },
    { id: "account", label: "Account", icon: UserCircle2 },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button 
            key={tab.id} 
            className={`nav-tab ${active ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            <div className="nav-icon-wrap">
              <Icon size={24} strokeWidth={active ? 2.5 : 2} />
            </div>
            <span className="nav-label">{tab.label}</span>
          </button>
        );
      })}

      <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 72px;
          background: #FFFFFF;
          border-top: 1px solid #E8E8ED;
          display: flex;
          justify-content: space-around;
          align-items: center;
          z-index: 1000;
          padding-bottom: env(safe-area-inset-bottom);
        }
        
        .nav-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          padding: 8px 0;
          color: #86868B;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .nav-tab.active {
          color: #0071E3;
        }
        
        .nav-icon-wrap {
          margin-bottom: 4px;
        }
        
        .nav-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: -0.2px;
        }
        
        @media (min-width: 769px) {
          .bottom-nav {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}
