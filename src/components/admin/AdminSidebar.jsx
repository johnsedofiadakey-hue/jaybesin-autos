import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Car, Zap, Wrench, 
  Package, MessageCircle, FileText, Settings, LogOut, Globe, Ship,
  Lock, ArrowUpRight
} from "lucide-react";

export function AdminSidebar({ onLogout, settings = {} }) {
  const location = useLocation();
  const parts = settings.companyName ? settings.companyName.split(" ") : ["Jaybesin", "Autos"];
  
  const menuItems = [
    { label: "Oversight", path: "/admin", icon: LayoutDashboard },
    { label: "Manage Fleet", path: "/admin/marketplace", icon: Car },
    { label: "Orders & Tracking", path: "/admin/orders", icon: Ship },
    { label: "Spare Parts & Charging", path: "/admin/infrastructure", icon: Zap },
    { label: "Customer Inquiries", path: "/admin/inquiries", icon: MessageCircle },
    { label: "Invoices", path: "/admin/invoices", icon: FileText },
    { label: "Global Settings", path: "/admin/settings", icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="adm-side" style={{ borderRight: '1px solid var(--border)' }}>
      <div className="adm-side-hd" style={{ padding: '32px 24px' }}>
        <Link to="/" className="adm-side-logo" style={{ textDecoration: 'none', color: 'inherit', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: '2px' }} />
          <span>{parts[0]}</span> {parts.slice(1).join(" ")}
        </Link>
        <div className="adm-side-tag" style={{ color: 'var(--text-muted)', fontSize: '9px', marginTop: '6px' }}>Verified Authority Panel</div>
      </div>
      
      <div style={{ flex: 1, padding: "12px 0" }}>
        <div className="adm-sec-lbl" style={{ padding: '0 24px 12px', fontSize: '10px' }}>Platform Domain</div>
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`adm-link${isActive(item.path) ? " act" : ""}`}
            style={{ 
              textDecoration: 'none', 
              padding: '12px 24px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              fontSize: '13px',
              borderLeft: isActive(item.path) ? '3px solid var(--accent)' : '3px solid transparent'
            }}
          >
            <item.icon size={16} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)" }}>
        <Link to="/" className="adm-link" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.7 }}>
          <Globe size={14} />
          <span>Public Interface</span>
          <ArrowUpRight size={12} />
        </Link>
        <button 
          className="adm-link" 
          onClick={onLogout} 
          style={{ 
            width: '100%', 
            marginTop: '8px', 
            color: '#FF4A5A', 
            background: 'rgba(255,74,90,0.05)', 
            borderRadius: '6px',
            padding: '10px 12px'
          }}
        >
          <LogOut size={14} />
          <span>Terminate Session</span>
        </button>
      </div>
    </aside>
  );
}
