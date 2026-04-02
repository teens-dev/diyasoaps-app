// ============================================================
// PACKAGE DEFINITIONS — Single source of truth
// regular → 1 box  | 1 soap   | ₹300
// half    → 1 box  | 3 soaps  | ₹600   (Value Pack)
// annual  → 1 box  | 6 soaps  | ₹900   (Bumper Pack)
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
    label: "Starter Pack",
    boxes: 1,
    soaps: 1,
    price: 300,
    emoji: "📦",
    highlight: false,
  },
  half: {
    label: "Value Pack",
    boxes: 1,
    soaps: 3,
    price: 600,
    emoji: "⭐",
    highlight: false,
  },
  annual: {
    label: "Bumper Pack",
    boxes: 1,
    soaps: 6,
    price: 900,
    originalPrice: 1800,
    tag: "BEST OFFER",
    emoji: "🎉",
    highlight: true,
  },
};


const SUPABASE_URL = "https://ntazlpdxvdwkyguxbkpf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50YXpscGR4dmR3a3lndXhia3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNTMwMTIsImV4cCI6MjA4NDgyOTAxMn0.zasWIyTlyEA90jVdRnFe2SthU7HwcJ6Hrh5JUPjV7yk";

// export const BACKEND_URL = "http://192.168.1.28:10000"; 
export const BACKEND_URL = "https://diya-backenddiya-backend.onrender.com";
export const RAZORPAY_KEY = "rzp_live_SEoqwulgqrAXys";

export const PHONE_NUMBER = "+918125134699";
export const WHATSAPP_NUMBER = "918125134699";
export const TOTAL_MEMBERS = 250;
