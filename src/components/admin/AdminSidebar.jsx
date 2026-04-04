import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Car, Zap, Wrench, 
  Package, MessageCircle, FileText, Settings, LogOut, Globe, Ship
} from "lucide-react";

export function AdminSidebar({ onLogout, settings = {} }) {
  const location = useLocation();
  const parts = settings.companyName ? settings.companyName.split(" ") : ["Jaybesin", "Autos"];
  
  const menuItems = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Marketplace", path: "/admin/marketplace", icon: Car },
    { label: "Inventory", path: "/admin/inventory", icon: Package },
    { label: "Charging", path: "/admin/charging", icon: Zap },
    { label: "Spare Parts", path: "/admin/parts", icon: Wrench },
    { label: "Orders", path: "/admin/orders", icon: Ship },
    { label: "Inquiries", path: "/admin/inquiries", icon: MessageCircle },
    { label: "Invoices", path: "/admin/invoices", icon: FileText },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="adm-side">
      <div className="adm-side-hd">
        <Link to="/" className="adm-side-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span>{parts[0]}</span> {parts.slice(1).join(" ")}
        </Link>
        <div className="adm-side-tag">System Control</div>
      </div>
      
      <div style={{ flex: 1, padding: "10px 0" }}>
        <div className="adm-sec-lbl">Management</div>
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`adm-link${isActive(item.path) ? " act" : ""}`}
            style={{ textDecoration: 'none' }}
          >
            <item.icon size={16} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div style={{ padding: "10px 0", borderTop: "1px solid var(--border2)" }}>
        <Link to="/" className="adm-link" style={{ textDecoration: 'none' }}>
          <Globe size={16} />
          <span>View Website</span>
        </Link>
        <button className="adm-link" onClick={onLogout} style={{ width: '100%', color: 'var(--orange)' }}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
