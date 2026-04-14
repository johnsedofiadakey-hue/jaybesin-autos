import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Car, Ship, MessageCircle, FileText, Settings, Zap 
} from "lucide-react";

export function AdminMobileNav() {
  const location = useLocation();

  const menuItems = [
    { label: "Oversight", path: "/admin", icon: LayoutDashboard },
    { label: "Fleet", path: "/admin/marketplace", icon: Car },
    { label: "Orders", path: "/admin/orders", icon: Ship },
    { label: "Infras", path: "/admin/infrastructure", icon: Zap },
    { label: "Leads", path: "/admin/inquiries", icon: MessageCircle },
    { label: "Docs", path: "/admin/invoices", icon: FileText },
    { label: "Setup", path: "/admin/settings", icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="adm-mobile-nav">
      {menuItems.map((item) => (
        <Link 
          key={item.path} 
          to={item.path} 
          className={`adm-mob-btn${isActive(item.path) ? " act" : ""}`}
        >
          <div className="adm-mob-btn-ico">
            <item.icon size={20} />
          </div>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
