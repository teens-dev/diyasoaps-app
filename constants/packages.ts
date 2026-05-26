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

export { BACKEND_URL, RAZORPAY_KEY, PRIVACY_POLICY_URL, SUPPORT_EMAIL } from "./env";

export const PHONE_NUMBER = "+918125134699";
export const WHATSAPP_NUMBER = "918125134699";
export const TOTAL_MEMBERS = 250;
