import React, { useState, useEffect } from "react";
import { 
  TrendingUp, Users, Package, MessageCircle, 
  Car, Zap, Ship, DollarSign, Activity, Database, ShieldCheck
} from "lucide-react";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminHeader } from "../components/admin/AdminHeader";
import { fmtUSD } from "../utils/theme";

export function AdminDashboard({ 
  vehicles = [], 
  orders = [], 
  inquiries = [], 
  settings = {}, 
  onLogout 
}) {
  const stats = [
    { 
      label: "Gross Transaction Volume", 
      value: fmtUSD(orders.reduce((sum, o) => sum + (o.amount || 0), 0)), 
      icon: TrendingUp
    },
    { 
      label: "Active Import Pipelines", 
      value: orders.filter(o => o.status !== "delivered").length, 
      icon: Ship
    },
    { 
      label: "Priority Inquiries", 
      value: inquiries.filter(i => i.status === "new").length, 
      icon: MessageCircle
    },
    { 
      label: "Unit Inventory", 
      value: vehicles.length, 
      icon: Car
    }
  ];

  return (
    <div className="adm-wrap">
      <AdminSidebar onLogout={onLogout} settings={settings} />
      
      <main className="adm-main">
        <AdminHeader title="Platform Oversight" />
        
        {/* Quick Stats Grid */}
        <div className="dash-grid">
          {stats.map((s, i) => (
            <div key={i} className="dc">
              <div className="dc-icon"><s.icon size={20} /></div>
              <div className="dc-val">{s.value}</div>
              <div className="dc-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        {/* System & Welcome */}
        <div className="adm-split">
          <div className="adm-card">
            <h2>Operational Authority</h2>
            <p style={{ marginBottom: '20px' }}>
              Welcome to the Jaybesin Autos Management Cluster. All verified inventory changes are 
              propagated to the global marketplace in real-time.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
                System Version: 1.1.0-STABLE
              </div>
            </div>
          </div>

          <div className="adm-card">
            <h3>Infrastructure Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              {[
                { label: "Firestore Cluster", status: "Synchronized", icon: Database },
                { label: "Asset Storage", status: "High Availability", icon: ShieldCheck },
                { label: "Marketplace Runtime", status: "Operational", icon: Activity }
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)' }}>
                    <s.icon size={14} />
                    <span>{s.label}</span>
                  </div>
                  <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Configuration Info */}
        <div className="adm-card" style={{ marginTop: '16px' }}>
          <h3>Global Protocol Settings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px', marginTop: '16px' }}>
            <div>
              <div className="dc-lbl" style={{ marginBottom: '4px' }}>Base Currency</div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>USD (Strict)</div>
            </div>
            <div>
              <div className="dc-lbl" style={{ marginBottom: '4px' }}>Business Model</div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>China-to-Ghana Direct</div>
            </div>
            <div>
              <div className="dc-lbl" style={{ marginBottom: '4px' }}>Lead Time Protocol</div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>Standard ({settings.importLeadTimeDays || "44"} Days)</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
