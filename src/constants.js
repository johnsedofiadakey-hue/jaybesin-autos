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

export const VERSION = "1.1.0-" + Date.now();
export const DEFAULT_THEME = PRESETS["Dark Neon"];

export const VEHICLES0 = [];
export const CHARGING0 = [];
export const PARTS0 = [];
export const ORDERS0 = [];
export const INQUIRIES0 = [];

export const SETTINGS0 = {
  companyName: "Jaybesin Autos", 
  tagline: "China's Finest. West Africa's Pride.",
  email: "info@jaybesin.com", 
  phone: "+233 XX XXX XXXX", 
  whatsapp: "+233XXXXXXXXX",
  address: "Accra, Greater Accra, Ghana", 
  logo: null,
  showPricesGlobal: true,
  importTimeline: [
    { step: "Purchase Confirmation", days: 2 },
    { step: "Inspection & Report", days: 2 },
    { step: "Shipping to Ghana", days: 35 },
    { step: "Port Processing", days: 5 },
  ],
  importLeadTimeDays: 44,
  annBarText: "🚗 Now taking Pre-Orders for 2025 — Limited slots available. ", 
  annBarLink: "", 
  annBarOn: false,
  heroSlides: [{ id: 1, image: null, label: "Welcome to Jaybesin Autos" }],
  theme: DEFAULT_THEME,
  testimonials: [
    { id: 1, name: "Kwame Asante", role: "Accra, Ghana", text: "Jaybesin Autos made the whole process seamless. My BYD Han arrived in perfect condition, duties were handled professionally. Highly recommend!", stars: 5 },
    { id: 2, name: "Abena Mensah", role: "Kumasi, Ghana", text: "Fantastic service. The team guided me through every step.", stars: 5 },
    { id: 3, name: "Kofi Darko", role: "Takoradi, Ghana", text: "Tracking system kept me updated throughout. Arrived ahead of schedule.", stars: 5 },
  ],
};
