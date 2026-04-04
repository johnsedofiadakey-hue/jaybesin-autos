import React from "react";
import { MarketplaceBrowsePage } from "../marketplace";

export function BrowsePage({ marketplaceCars = [], settings = {} }) {
  // Use the existing MarketplaceBrowsePage but within the new layout
  return (
    <div className="browse-page" style={{ paddingTop: "80px" }}>
      <MarketplaceBrowsePage 
        cars={marketplaceCars} 
        hero={false} 
        settings={settings} 
      />
    </div>
  );
}
