import { useNavigate } from "react-router-dom";
import { MarketplaceBrowsePage } from "../marketplace";

export function BrowsePage({ marketplaceCars = [], settings = {} }) {
  const navigate = useNavigate();
  
  // Use the existing MarketplaceBrowsePage but within the new layout
  return (
    <div className="browse-page" style={{ paddingTop: "80px" }}>
      <MarketplaceBrowsePage 
        cars={marketplaceCars} 
        hero={false} 
        settings={settings} 
        setPage={(p) => {
          if (p.startsWith("car-")) {
            navigate("/car/" + p.replace("car-", ""));
          } else if (p === "home") {
            navigate("/");
          } else {
            navigate("/" + p);
          }
        }}
      />
    </div>
  );
}
