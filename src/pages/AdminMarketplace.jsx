import React from "react";
import { Car, Settings, Ship, Globe } from "lucide-react";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { MarketplaceAdminTab } from "../marketplace";

export function AdminMarketplace({ 
  cars = [], 
  onSaveCar, 
  onLogout, 
  settings = {},
  onImportTimelineChange,
  onImportLeadTimeChange,
  onSaveTimeline
}) {
  return (
    <div className="adm-wrap">
      <AdminSidebar onLogout={onLogout} settings={settings} />
      
      <main className="adm-main">
        <AdminHeader title="Marketplace Management" icon={Car} />
        
        <div style={{ marginTop: "20px" }}>
          <MarketplaceAdminTab 
            cars={cars} 
            onSaveCar={onSaveCar}
            importTimeline={settings.importTimeline}
            importLeadTimeDays={settings.importLeadTimeDays}
            onImportTimelineChange={onImportTimelineChange}
            onImportLeadTimeChange={onImportLeadTimeChange}
            onSaveTimeline={onSaveTimeline}
          />
        </div>
      </main>
    </div>
  );
}
