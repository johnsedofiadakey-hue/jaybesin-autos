import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

// Components & UI
import { Cursor } from "./components/common/Cursor";
import { Particles } from "./components/common/Particles";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { AdminProtectedRoute } from "./components/auth/AdminProtectedRoute";
import { AdminSidebar } from "./components/admin/AdminSidebar";
import { InvoiceModal, VehicleModal } from "./components/admin/Modals";
import { BottomTabNav } from "./components/marketplace/BottomTabNav";

// Pages
import { BrowsePage } from "./pages/BrowsePage";
import { CarDetailPage } from "./pages/CarDetailPage";
import { GaragePage } from "./pages/GaragePage";
import { ChargingPage } from "./pages/ChargingPage";
import { PartsPage } from "./pages/PartsPage";
import { TrackingPage } from "./pages/TrackingPage";
import { ContactPage } from "./pages/ContactPage";

// Admin Pages
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminInventory } from "./pages/AdminInventory";
import { AdminInquiries } from "./pages/AdminInquiries";
import { AdminOrders } from "./pages/AdminOrders";
import { AdminInvoices } from "./pages/AdminInvoices";
import { AdminSettings } from "./pages/AdminSettings";
import { AdminMarketplace } from "./pages/AdminMarketplace";
import { AdminChargingParts } from "./pages/AdminChargingParts";

// Marketplace Components (Legacy)
import { MarketplaceAccountPage, MarketplaceSimplePage } from "./marketplace";

// Utils & Config
import { 
  onVehicles, onCars, onCharging, onParts, onOrders, onInquiries,
  saveVehicle, saveCar, deleteVehicle, deleteCar, saveCharger, deleteCharger,
  savePart, deletePart, saveOrder, deleteOrder,
  updateInquiryStatus, deleteInquiry, 
  getSettings, saveSettings as fsaveSettings, uploadImage
} from "./firestore";
import { 
  VEHICLES0, CHARGING0, PARTS0, ORDERS0, INQUIRIES0, SETTINGS0, 
  DEFAULT_THEME, PRESETS 
} from "./constants";

// Global Styles & Theme
import "./index.css";
import { generateInvoiceHTML } from "./utils/invoiceGenerator";

// ─────────────────────────────────────────────────────────────────
// Primary Application Component
// ─────────────────────────────────────────────────────────────────
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [fbReady, setFbReady] = useState(false);
  const [annVisible, setAnnVisible] = useState(true);

  // ── Data state ──
  const [vehicles, setVehicles] = useState([]);
  const [cars, setCars] = useState([]);
  const [charging, setCharging] = useState([]);
  const [parts, setParts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [settings, setSettings] = useState({ 
    ...SETTINGS0
  });

  // ── Modal States ──
  const [activeOrder, setActiveOrder] = useState(null); 
  const [activeVehicle, setActiveVehicle] = useState(null); 
  const [activeCar, setActiveCar] = useState(null); 

  // ── Firebase Auth observer ──
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
      setFbReady(true);
      console.log("[Auth] State changed. LoggedIn:", !!user);
    });
    return () => unsub();
  }, []);

  // ── Firestore real-time listeners ──
  useEffect(() => {
    const errorLog = (name) => (err) => console.error(`CRITICAL: [Firestore] ${name} load error:`, err.code, err.message);

    const u1 = onVehicles((data) => {
      console.log(`[Firestore] Loaded ${data.length} vehicles.`);
      if (data.length > 0) {
        console.log("[Firestore] FIRST VEHICLE KEYS:", Object.keys(data[0]).join(", "));
        console.log("[Firestore] FIRST VEHICLE DATA:", JSON.stringify(data[0]));
      }
      setVehicles(data);
    }, errorLog("Vehicles"));

    const uCars = onCars((data) => {
      console.log(`[Firestore] Loaded ${data.length} cars successfully.`);
      if (data.length > 0) {
        const sample = data[0];
        console.log("[Firestore] FIRST CAR DATA:", JSON.stringify({
          id: sample.id,
          brand: sample.brand,
          model: sample.model,
          priceChina: sample.priceChina || sample.price || "MISSING",
          purchaseCost: sample.purchaseCost || "MISSING",
          hasLanded: !!sample.estimatedLandedCost
        }, null, 2));
      }
      setCars(data);
    }, errorLog("Cars"));

    const u2 = onCharging((data) => {
      console.log(`[Firestore] Loaded ${data.length} chargers.`);
      setCharging(data);
    }, errorLog("Charging"));

    const u3 = onParts((data) => {
      console.log(`[Firestore] Loaded ${data.length} parts.`);
      setParts(data);
    }, errorLog("Parts"));

    const u4 = onOrders((data) => {
      console.log(`[Firestore] Loaded ${data.length} orders.`);
      setOrders(data);
    }, errorLog("Orders"));
    
    getSettings().then(s => { 
      if (s) {
        setSettings(prev => ({ ...prev, ...s }));
        console.log("[Firestore] Global settings loaded.");
      } else {
        console.warn("[Firestore] No settings document found.");
      }
    }).catch(err => {
      console.error("CRITICAL: [Firestore] SETTINGS load error:", err.code, err.message);
    });

    return () => { u1(); uCars(); u2(); u3(); u4(); };
  }, []);

  // ── Admin-only listeners ──
  useEffect(() => {
    if (!loggedIn) return;
    const u5 = onInquiries(setInquiries);
    return () => u5();
  }, [loggedIn]);

  // ── Handlers ──
  const handleSaveSettings = async (s) => {
    setSettings(s);
    try { await fsaveSettings(s); } catch (e) { console.warn("Settings save:", e); }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleSaveVehicleWithUpload = async (v) => {
    setFbReady(false); 
    try {
      let finalV = { ...v };
      if (v.images && v.images.length) {
        const uploaded = await Promise.all(v.images.map(async (img, i) => {
          if (img && img.startsWith("data:")) {
            return await uploadImage(img, `vehicles/${v.id || Date.now()}_${i}`);
          }
          return img;
        }));
        finalV.images = uploaded.filter(Boolean);
      }
      await saveVehicle(finalV);
      setActiveVehicle(null);
    } catch (e) {
      console.error("Vehicle save failed:", e);
    } finally {
      setFbReady(true);
    }
  };

  const handleInquiryToOrder = async (inq) => {
    const newOrder = {
      id: `ACG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: inq.name,
      email: inq.email || "",
      phone: inq.phone || "",
      item: inq.subject || "Custom Vehicle Request",
      type: "vehicle",
      amount: 0,
      status: "order_confirmed",
      date: new Date().toISOString().slice(0, 10),
      tracking: [
        { step: "Order Confirmed", done: true, date: new Date().toLocaleDateString() },
        { step: "Payment Received", done: false, active: true },
        { step: "Sourcing in China", done: false },
        { step: "Port Clearance (China)", done: false },
        { step: "Ocean Freight", done: false },
        { step: "Arrival at Tema Port", done: false },
        { step: "Ready for Collection", done: false }
      ]
    };
    try {
      await saveOrder(newOrder);
      await updateInquiryStatus(inq.id, "replied");
    } catch (e) {
      console.error("Convert to Order failed:", e);
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const order = orders.find(o => o.id === id);
      if (!order) return;
      const newOrder = { ...order, status };
      await saveOrder(newOrder);
    } catch (e) {
      console.error("Order update failed:", e);
    }
  };

  const handleSendOrderUpdate = (order) => {
    const msg = `Hello ${order.customer}, your order ${order.id} update: ${order.status.replace(/_/g, " ").toUpperCase()}`;
    const phone = order.phone.replace(/\D/g, "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleSaveInvoice = async (form) => {
    if (!activeOrder) return;
    const updatedOrder = { ...activeOrder, invoice: form };
    await saveOrder(updatedOrder);
    setActiveOrder(null);
    const html = generateInvoiceHTML(updatedOrder, settings, form);
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
  };

  const handleOpenInvoiceDoc = (order, idx, printNow = false) => {
    if (!order.invoice) return;
    const html = generateInvoiceHTML(order, settings, order.invoice);
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    if (printNow) setTimeout(() => win.print(), 500);
  };

  const marketplaceCars = [...cars, ...vehicles];
  const isMarketplaceSurface = location.pathname === "/" || location.pathname.startsWith("/browse") || location.pathname.startsWith("/car/");
  const isAdminPath = location.pathname.startsWith("/admin");
  const annOn = settings.annBarOn && annVisible && !isAdminPath;

  if (!fbReady) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0b", flexDirection: "column", gap: "18px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#00E564", animation: "spin .8s linear infinite" }} />
        <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Cursor />
      <div className="grain" />
      
      {!isAdminPath && (
        <>
          <Navbar settings={settings} annOn={annOn} onAdminClick={() => navigate("/admin")} />
          {annOn && (
            <div className="ann-bar">
              {settings.annBarText}
              {settings.annBarLink && <a href="/browse" onClick={e => { e.preventDefault(); navigate("/browse") }}>{settings.annBarLink}</a>}
              <button className="ann-close" onClick={() => setAnnVisible(false)}>×</button>
            </div>
          )}
        </>
      )}

      <main style={{ 
        paddingTop: isAdminPath ? 0 : (isMarketplaceSurface ? 0 : (annOn ? "98px" : "60px")),
        paddingBottom: (isMarketplaceSurface && !isAdminPath) ? "80px" : 0
      }}>
        <Routes>
          <Route path="/" element={<BrowsePage marketplaceCars={marketplaceCars} settings={settings} />} />
          <Route path="/browse" element={<BrowsePage marketplaceCars={marketplaceCars} settings={settings} />} />
          <Route path="/car/:id" element={<CarDetailPage marketplaceCars={marketplaceCars} settings={settings} />} />
          <Route path="/garage" element={<GaragePage vehicles={vehicles} settings={settings} />} />
          <Route path="/charging" element={<ChargingPage charging={charging} />} />
          <Route path="/parts" element={<PartsPage parts={parts} />} />
          <Route path="/track" element={<TrackingPage orders={orders} />} />
          <Route path="/contact" element={<ContactPage settings={settings} />} />
          
          <Route path="/import" element={<MarketplaceSimplePage title="Import From China" subtitle="Tell us your preferred brand, model, and budget." ctaLabel="Start Request" onCta={() => navigate("/contact")} onBack={() => navigate("/")} />} />
          <Route path="/sell" element={<MarketplaceSimplePage title="Sell Car" subtitle="List your car with Jaybesin Autos." ctaLabel="List My Car" onCta={() => navigate("/contact")} onBack={() => navigate("/")} />} />
          <Route path="/account" element={<MarketplaceAccountPage settings={settings} setPage={(p) => navigate(`/${p}`)} />} />

          <Route path="/admin/login" element={<AdminLogin onLogin={() => navigate("/admin")} onBack={() => navigate("/")} />} />
          
          <Route path="/admin" element={
            <AdminProtectedRoute loading={!fbReady}>
              <AdminDashboard 
                vehicles={vehicles} orders={orders} inquiries={inquiries} 
                parts={parts} charging={charging} settings={settings} 
                onLogout={handleLogout} 
              />
            </AdminProtectedRoute>
          } />

          <Route path="/admin/inventory" element={
            <AdminProtectedRoute loading={!fbReady}>
              <AdminInventory 
                vehicles={vehicles} cars={cars} settings={settings} onLogout={handleLogout}
                onSaveCar={saveCar} onDeleteCar={deleteCar}
                onSaveVehicle={v => setActiveVehicle(v || true)} onDeleteVehicle={deleteVehicle}
              />
            </AdminProtectedRoute>
          } />

          <Route path="/admin/inquiries" element={
            <AdminProtectedRoute loading={!fbReady}>
              <AdminInquiries 
                inquiries={inquiries} settings={settings} onLogout={handleLogout}
                onUpdateStatus={updateInquiryStatus} onDeleteInquiry={deleteInquiry}
                onConvertOrder={handleInquiryToOrder}
              />
            </AdminProtectedRoute>
          } />

          <Route path="/admin/orders" element={
            <AdminProtectedRoute loading={!fbReady}>
              <AdminOrders 
                orders={orders} settings={settings} onLogout={handleLogout}
                onUpdateStatus={handleUpdateOrderStatus}
                onGenerateInvoice={(id) => setActiveOrder(orders.find(o => o.id === id))}
                onSendUpdate={handleSendOrderUpdate}
              />
            </AdminProtectedRoute>
          } />

          <Route path="/admin/invoices" element={
            <AdminProtectedRoute loading={!fbReady}>
              <AdminInvoices 
                orders={orders} settings={settings} onLogout={handleLogout}
                onGenerateInvoice={(id) => setActiveOrder(orders.find(o => o.id === id))}
                onOpenInvoice={handleOpenInvoiceDoc}
              />
            </AdminProtectedRoute>
          } />

          <Route path="/admin/settings" element={
            <AdminProtectedRoute loading={!fbReady}>
              <AdminSettings settings={settings} onSaveSettings={handleSaveSettings} onLogout={handleLogout} />
            </AdminProtectedRoute>
          } />

          <Route path="/admin/marketplace" element={
            <AdminProtectedRoute loading={!fbReady}>
              <AdminMarketplace 
                cars={cars} onSaveCar={saveCar} settings={settings} onLogout={handleLogout}
                onImportTimelineChange={(t) => handleSaveSettings({...settings, importTimeline: t})}
                onImportLeadTimeChange={(d) => handleSaveSettings({...settings, importLeadTimeDays: d})}
                onSaveTimeline={() => handleSaveSettings(settings)}
              />
            </AdminProtectedRoute>
          } />

          <Route path="/admin/charging" element={
            <AdminProtectedRoute loading={!fbReady}>
               <AdminChargingParts 
                 charging={charging} parts={parts} settings={settings} onLogout={handleLogout}
                 onSaveCharger={saveCharger} onDeleteCharger={deleteCharger}
                 onSavePart={savePart} onDeletePart={deletePart}
               />
            </AdminProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {activeOrder && (
        <InvoiceModal 
          order={activeOrder} settings={settings} 
          onSave={handleSaveInvoice} onClose={() => setActiveOrder(null)} 
        />
      )}
      {activeVehicle && (
        <VehicleModal 
          vehicle={typeof activeVehicle === "object" ? activeVehicle : null} 
          onSave={handleSaveVehicleWithUpload} onClose={() => setActiveVehicle(null)} 
        />
      )}

      {!isAdminPath && isMarketplaceSurface && (
        <BottomTabNav 
          activeTab={
            location.pathname === "/" ? "home" : 
            location.pathname.startsWith("/browse") ? "browse" :
            location.pathname.startsWith("/sell") ? "sell" :
            location.pathname.startsWith("/deals") ? "deals" :
            location.pathname.startsWith("/admin") ? "account" : "home"
          }
          onTabChange={(tab) => {
            if (tab === "home") navigate("/");
            if (tab === "browse") navigate("/browse");
            if (tab === "sell") navigate("/sell");
            if (tab === "deals") navigate("/deals");
            if (tab === "account") navigate("/admin/login");
          }}
        />
      )}
      {!isAdminPath && !isMarketplaceSurface && <Footer onAdminClick={() => navigate("/admin")} settings={settings} />}
    </HelmetProvider>
  );
}
