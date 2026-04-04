// src/constants.js

export const PRESETS = {
  "Dark Neon": {
    accent1: "#00E5A0", accent2: "#00C4FF", accent3: "#FF6B35", accent4: "#7B2FFF",
    bgPrimary: "#080C14", bgSecondary: "#0D1220", bgTertiary: "#111827", bgCard: "#0F1929", bgInput: "#1A2235",
    textPrimary: "#F0F4FF", textSecondary: "#8B9CC8", textMuted: "#4A5878",
    borderHex: "#1A2E4A", navBg: "#080C14E8", footerBg: "#0D1220", btnText: "#050A0E",
  },
  "Gold Luxury": {
    accent1: "#C9A84C", accent2: "#E8C97A", accent3: "#FF6B35", accent4: "#8A6F2E",
    bgPrimary: "#060608", bgSecondary: "#0C0C10", bgTertiary: "#121215", bgCard: "#0E0E12", bgInput: "#18181F",
    textPrimary: "#F0EDE8", textSecondary: "#9B9698", textMuted: "#5A5760",
    borderHex: "#2A2520", navBg: "#060608E8", footerBg: "#0C0C10", btnText: "#060608",
  },
  "Ocean Blue": {
    accent1: "#3A86FF", accent2: "#00D4FF", accent3: "#FF006E", accent4: "#8338EC",
    bgPrimary: "#040B18", bgSecondary: "#071428", bgTertiary: "#0A1C35", bgCard: "#081525", bgInput: "#0E2040",
    textPrimary: "#E8F4FF", textSecondary: "#7AA8D8", textMuted: "#3A5878",
    borderHex: "#0E2A4A", navBg: "#040B18E8", footerBg: "#071428", btnText: "#040B18",
  },
  "Sunset Sport": {
    accent1: "#FF6B35", accent2: "#FFD60A", accent3: "#FF006E", accent4: "#7B2FFF",
    bgPrimary: "#0C0804", bgSecondary: "#1A1008", bgTertiary: "#221808", bgCard: "#180E06", bgInput: "#241806",
    textPrimary: "#FFF8F0", textSecondary: "#C49A78", textMuted: "#7A5A40",
    borderHex: "#3A2010", navBg: "#0C0804E8", footerBg: "#1A1008", btnText: "#0C0804",
  },
  "Deep Purple": {
    accent1: "#BF5FFF", accent2: "#7B2FFF", accent3: "#FF5CFF", accent4: "#00D4FF",
    bgPrimary: "#08040F", bgSecondary: "#100820", bgTertiary: "#160C2A", bgCard: "#120A1E", bgInput: "#1E1030",
    textPrimary: "#F4EEFF", textSecondary: "#9A82C8", textMuted: "#504870",
    borderHex: "#2A1850", navBg: "#08040FE8", footerBg: "#100820", btnText: "#08040F",
  },
  "Clean White": {
    accent1: "#0070F3", accent2: "#00B4D8", accent3: "#FF6B35", accent4: "#7B2FFF",
    bgPrimary: "#F8FAFF", bgSecondary: "#EEEEF8", bgTertiary: "#E4E4F0", bgCard: "#FFFFFF", bgInput: "#F0F0F8",
    textPrimary: "#0A0A1A", textSecondary: "#444466", textMuted: "#8888AA",
    borderHex: "#C8C8E0", navBg: "#F8FAFFF0", footerBg: "#EEEEF8", btnText: "#FFFFFF",
  },
};

export const DEFAULT_THEME = PRESETS["Dark Neon"];

export const VEHICLES0 = [
  { id: 1, brand: "Xiaomi", model: "SU7", year: 2024, type: "Saloon", fuel: "Electric", drivetrain: "AWD", price: 38500, duties: 9625, totalGhana: 48125, availability: "preorder", showPrice: true, description: "China's answer to the Tesla Model S. Ultra-sleek, loaded with tech, breathtakingly fast.", specs: { range: "730km", power: "495hp", acceleration: "0–100 in 2.78s", battery: "101kWh" }, images: [], logo: null, emoji: "⚡", featured: true },
  { id: 2, brand: "BYD", model: "Han EV", year: 2023, type: "Saloon", fuel: "Electric", drivetrain: "AWD", price: 29900, duties: 7475, totalGhana: 37375, availability: "preorder", showPrice: true, description: "BYD's flagship luxury sedan with Blade Battery technology and premium interior.", specs: { range: "605km", power: "517hp", acceleration: "0–100 in 3.9s", battery: "85.4kWh" }, images: [], logo: null, emoji: "🚗", featured: true },
  { id: 3, brand: "Haval", model: "H6 HEV", year: 2023, type: "SUV", fuel: "Hybrid", drivetrain: "2WD", price: 22500, duties: 5625, totalGhana: 28125, availability: "in_stock", showPrice: true, description: "China's best-selling SUV. Refined, spacious, incredibly fuel-efficient.", specs: { range: "1050km", power: "243hp", acceleration: "0–100 in 7.7s", engine: "1.5T+Motor" }, images: [], logo: null, emoji: "🚙", featured: false },
  { id: 4, brand: "Tank", model: "500 HEV", year: 2024, type: "4x4", fuel: "Hybrid", drivetrain: "4WD", price: 58000, duties: 14500, totalGhana: 72500, availability: "preorder", showPrice: true, description: "China's Range Rover — commanding, powerful, and lavish.", specs: { range: "900km", power: "342hp+Motor", acceleration: "0–100 in 5.8s", engine: "3.0T V6" }, images: [], logo: null, emoji: "🦁", featured: true },
  { id: 5, brand: "Chery", model: "Tiggo 8 Pro", year: 2023, type: "SUV", fuel: "Gasoline", drivetrain: "AWD", price: 18500, duties: 4625, totalGhana: 23125, availability: "in_stock", showPrice: true, description: "Seven-seater family SUV with Italian-designed interior.", specs: { range: "550km", power: "197hp", acceleration: "0–100 in 7.9s", engine: "1.6T" }, images: [], logo: null, emoji: "🚐", featured: false },
  { id: 6, brand: "Geely", model: "Monjaro", year: 2023, type: "SUV", fuel: "Gasoline", drivetrain: "AWD", price: 26000, duties: 6500, totalGhana: 32500, availability: "preorder", showPrice: true, description: "Premium crossover with Volvo-derived technology.", specs: { range: "600km", power: "238hp", acceleration: "0–100 in 7.6s", engine: "2.0T" }, images: [], logo: null, emoji: "🏔️", featured: false },
];

export const CHARGING0 = [
  { id: 1, name: "AC Home 7kW", brand: "BYD", type: "AC", power: "7kW", price: 850, installation: 350, emoji: "🔌" },
  { id: 2, name: "DC Fast 60kW", brand: "CATL", type: "DC Fast", power: "60kW", price: 8500, installation: 2200, emoji: "⚡" },
  { id: 3, name: "AC Commercial 22kW", brand: "Huawei", type: "AC", power: "22kW", price: 2400, installation: 800, emoji: "🏢" },
];

export const PARTS0 = [
  { id: 1, name: "BYD Blade Battery Cell", compatible: "BYD Han / Atto 3", category: "Battery", price: 1200, emoji: "🔋" },
  { id: 2, name: "Haval H6 Front Bumper", compatible: "Haval H6 2020-2023", category: "Body", price: 380, emoji: "🚗" },
  { id: 3, name: "Geely Brake Pads Set", compatible: "Geely Coolray / Monjaro", category: "Brakes", price: 95, emoji: "🛑" },
  { id: 4, name: "Universal TPMS Sensors 4pc", compatible: "Universal", category: "Electronics", price: 120, emoji: "📡" },
];

export const ORDERS0 = [
  { id: "ACG-2024-001", customer: "Kwame Mensah", email: "kwame@example.com", phone: "+233 244 123 456", item: "Tank 500 HEV", type: "vehicle", amount: 72500, status: "ocean_freight", date: "2024-11-15", tracking: [{ step: "Order Confirmed", done: true, date: "Nov 15, 2024" }, { step: "Payment Received", done: true, date: "Nov 16, 2024" }, { step: "Sourcing in China", done: true, date: "Nov 20, 2024" }, { step: "Port Clearance (China)", done: true, date: "Dec 02, 2024" }, { step: "Ocean Freight", done: false, active: true, date: "Est. Dec 20, 2024" }, { step: "Arrival at Tema Port", done: false, date: "Est. Jan 08, 2025" }, { step: "Ghana Customs & Duties", done: false, date: "Est. Jan 14, 2025" }, { step: "Ready for Collection", done: false, date: "Est. Jan 20, 2025" }] },
];

export const INQUIRIES0 = [
  { id: 1, name: "Ama Owusu", email: "ama@gmail.com", phone: "+233 20 555 1234", subject: "BYD Han EV availability", message: "I'd love to know when the BYD Han EV will be in stock. What are the financing options?", date: "2024-12-01", status: "new", type: "vehicle" },
  { id: 2, name: "Kwabena Boateng", email: "kb@corp.com", phone: "+233 54 888 9999", subject: "EV Charging for Office", message: "We need 3 × 22kW chargers installed at our corporate HQ.", date: "2024-12-03", status: "replied", type: "charging" },
];

export const SETTINGS0 = {
  companyName: "Jaybesin Autos", tagline: "China's Finest. West Africa's Pride.",
  email: "info@jaybesin.com", phone: "+233 XX XXX XXXX", whatsapp: "+233XXXXXXXXX",
  address: "Accra, Greater Accra, Ghana", logo: null,
  showPricesGlobal: true, ghsRate: 16.2,
  showGhsPrice: true,
  importTimeline: [
    { step: "Purchase Confirmation", days: 2 },
    { step: "Inspection & Report", days: 2 },
    { step: "Shipping to Ghana", days: 35 },
    { step: "Port Processing", days: 5 },
  ],
  importLeadTimeDays: 44,
  annBarText: "🚗 Now taking Pre-Orders for 2025 — Limited slots available. ", annBarLink: "", annBarOn: true,
  heroSlides: [{ id: 1, image: null, label: "Welcome to Jaybesin Autos" }],
  theme: DEFAULT_THEME,
  testimonials: [
    { id: 1, name: "Kwame Asante", role: "Accra, Ghana", text: "Jaybesin Autos made the whole process seamless. My BYD Han arrived in perfect condition, duties were handled professionally. Highly recommend!", stars: 5 },
    { id: 2, name: "Abena Mensah", role: "Kumasi, Ghana", text: "Fantastic service. The team guided me through every step. I'm now driving a Haval H6 and saving 40% on fuel costs versus my old petrol car.", stars: 5 },
    { id: 3, name: "Kofi Darko", role: "Takoradi, Ghana", text: "Pre-ordered my Tank 500 and the tracking system kept me updated throughout. Arrived ahead of schedule. Exceptional business.", stars: 5 },
  ],
};
