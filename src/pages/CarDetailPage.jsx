import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CarDetailPageMarket } from "../marketplace";

export function CarDetailPage({ marketplaceCars = [], settings = {} }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = marketplaceCars.find(c => String(c.id) === String(id));

  // Use the existing CarDetailPageMarket but within the new layout
  return (
    <div className="car-detail-page" style={{ paddingTop: "80px" }}>
      <CarDetailPageMarket 
        car={car} 
        cars={marketplaceCars} 
        settings={settings} 
        setPage={(p) => {
          if (p.startsWith("car-")) {
            navigate("/car/" + p.replace("car-", ""));
          } else if (p === "home") {
            navigate("/");
          } else {
            navigate("/" + (p === "browse" ? "/" : p));
          }
        }}
        // Forward navigation to the router
        onBack={() => navigate(-1)}
      />
    </div>
  );
}
