import React from "react";
import { Plus, LayoutDashboard } from "lucide-react";

export function AdminHeader({ title, icon: Icon = LayoutDashboard, onAction, actionLabel }) {
  return (
    <div className="adm-hd">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Icon size={24} style={{ color: "var(--neon)" }} />
        <h1 className="adm-pg-title">{title}</h1>
      </div>
      {onAction && actionLabel && (
        <button className="btn-p" onClick={onAction}>
          <Plus size={16} strokeWidth={3} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
