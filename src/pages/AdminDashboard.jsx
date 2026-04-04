import React, { useState, useEffect } from "react";
import { 
  TrendingUp, Users, Package, MessageCircle, 
  Car, Zap, Ship, DollarSign 
} from "lucide-react";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminHeader } from "../components/admin/AdminHeader";
import { fmtUSD } from "../utils/theme";

export function AdminDashboard({ 
  vehicles = [], 
  orders = [], 
  inquiries = [], 
  parts = [], 
  charging = [], 
  settings = {}, 
  onLogout 
}) {
  const stats = [
    { 
      label: "Total Sales", 
      value: fmtUSD(orders.reduce((sum, o) => sum + (o.amount || 0), 0)), 
      icon: TrendingUp, 
      color: "var(--neon)" 
    },
    { 
      label: "Active Orders", 
      value: orders.filter(o => o.status !== "delivered").length, 
      icon: Ship, 
      color: "var(--neon2)" 
    },
    { 
      label: "New Inquiries", 
      value: inquiries.filter(i => i.status === "new").length, 
      icon: MessageCircle, 
      color: "var(--orange)" 
    },
    { 
      label: "Total Inventory", 
      value: vehicles.length, 
      icon: Car, 
      color: "var(--purple)" 
    }
  ];

  return (
    <div className="adm-wrap">
      <AdminSidebar onLogout={onLogout} settings={settings} />
      
      <main className="adm-main">
        <AdminHeader title="Overview" />
        
        {/* Quick Stats Grid */}
        <div className="dash-grid">
          {stats.map((s, i) => (
            <div key={i} className="dc">
              <div className="dc-icon"><s.icon size={22} style={{ color: s.color }} /></div>
              <div className="dc-val">{s.value}</div>
              <div className="dc-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity / Welcome */}
        <div className="adm-card">
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", marginBottom: "12px" }}>
            Welcome back, Administrator
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.6 }}>
            Use the sidebar to manage your inventory, process orders, and respond to inquiries. 
            All changes are live on the marketplace immediately after saving.
          </p>
        </div>

        {/* Quick Help / Info */}
        <div className="adm-split">
          <div className="adm-card">
            <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "14px", textTransform: 'uppercase', letterSpacing: '1px' }}>
              System Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: "Database", status: "Connected", icon: "✓" },
                { label: "Storage", status: "Active", icon: "✓" },
                { label: "Email Service", status: "Ready", icon: "✓" },
                { label: "Marketplace", status: "Live", icon: "✓" }
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text2)' }}>{s.label}</span>
                  <span style={{ color: 'var(--neon)', fontWeight: 700 }}>{s.icon} {s.status}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="adm-card">
            <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "14px", textTransform: 'uppercase', letterSpacing: '1px' }}>
              Quick Info
            </h3>
            <p style={{ fontSize: "12px", color: "var(--text3)", lineHeight: 1.6 }}>
              Marketplace Currency: <strong>USD</strong><br />
              Display Exchange Rate: <strong>GHS {settings.ghsRate || "10.0"}</strong><br />
              Business WhatsApp: <strong>{settings.whatsapp || "Not Set"}</strong>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
