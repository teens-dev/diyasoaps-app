// ============================================================
// PACKAGE DEFINITIONS — Single source of truth
// regular → 1 box  | 3 soaps  | ₹600
// half    → 1 box  | 6 soaps  | ₹900   (Half-Yearly Pack)
// annual  → 2 boxes| 12 soaps | ₹1,188 (Annual Pack)
// ============================================================

export type PackageMode = "regular" | "half" | "annual";

export interface PackageConfig {
  label: string;
  boxes: number;
  soaps: number;
  price: number;
  originalPrice?: number;
  tag?: string;
  emoji: string;
  highlight: boolean;
}

export const PACKAGE_CONFIG: Record<PackageMode, PackageConfig> = {
  regular: {
    label: "Regular Box",
    boxes: 1,
    soaps: 3,
    price: 600,
    emoji: "📦",
    highlight: false,
  },
  half: {
    label: "Half-Yearly Pack",
    boxes: 1,
    soaps: 6,
    price: 900,
    emoji: "⭐",
    highlight: false,
  },
  annual: {
    label: "Annual Pack",
    boxes: 2,
    soaps: 12,
    price: 1188,
    originalPrice: 2400,
    tag: "BEST OFFER",
    emoji: "🎉",
    highlight: true,
  },
};

// export const BACKEND_URL = "http://192.168.1.28:10000"; 
export const BACKEND_URL = "https://diya-backenddiya-backend.onrender.com";
export const RAZORPAY_KEY = "rzp_live_SEoqwulgqrAXys";

export const PHONE_NUMBER = "+918125134699";
export const WHATSAPP_NUMBER = "918125134699";
export const TOTAL_MEMBERS = 250;
