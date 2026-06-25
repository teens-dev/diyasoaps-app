// Package definitions — aligned with backend PACK_CONFIG

export type PackType = "NORMAL" | "HALF_YEAR" | "ANNUAL" | "RED_SANDAL";

export interface PackageConfig {
  label: string;
  soapsPerBox: number;
  pricePerBox: number;
  mrpPerBox: number | null;
  isKit: boolean;
  emoji: string;
  highlight: boolean;
  tag?: string;
  description: string;
}

export const PACK_CONFIG: Record<PackType, PackageConfig> = {
  NORMAL: {
    label: "Starter Pack",
    soapsPerBox: 1,
    pricePerBox: 300,
    mrpPerBox: null,
    isKit: false,
    emoji: "📦",
    highlight: false,
    description: "Perfect for trying out",
  },
  HALF_YEAR: {
    label: "Value Pack",
    soapsPerBox: 3,
    pricePerBox: 600,
    mrpPerBox: 900,
    isKit: false,
    emoji: "⭐",
    highlight: false,
    description: "Great value — 3 premium soaps",
  },
  ANNUAL: {
    label: "Bumper Pack",
    soapsPerBox: 6,
    pricePerBox: 900,
    mrpPerBox: 1800,
    isKit: false,
    emoji: "🎉",
    highlight: true,
    tag: "BEST OFFER",
    description: "Maximum savings — 6 premium soaps",
  },
  RED_SANDAL: {
    label: "Red Sandal Premium Kit",
    soapsPerBox: 14,
    pricePerBox: 50000,
    mrpPerBox: null,
    isKit: true,
    emoji: "🌿",
    highlight: false,
    description: "14 premium products in one kit",
  },
};

export interface PackageDetails {
  label: string;
  soaps: number;
  price: number;
  mrp: number | null;
  savings: number;
  isKit: boolean;
}

export function getPackageDetails(qty: number, packType: PackType): PackageDetails {
  const cfg = PACK_CONFIG[packType];
  const count = qty || 1;

  if (cfg.isKit) {
    return {
      label: cfg.label,
      soaps: cfg.soapsPerBox * count,
      price: cfg.pricePerBox * count,
      mrp: null,
      savings: 0,
      isKit: true,
    };
  }

  const price = cfg.pricePerBox * count;
  const mrp = cfg.mrpPerBox ? cfg.mrpPerBox * count : null;
  const savings = mrp ? mrp - price : 0;

  return {
    label: cfg.label,
    soaps: cfg.soapsPerBox * count,
    price,
    mrp,
    savings,
    isKit: false,
  };
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export { BACKEND_URL, RAZORPAY_KEY, PRIVACY_POLICY_URL, SUPPORT_EMAIL } from "./env";

export const PHONE_NUMBER = "+918125134699";
export const WHATSAPP_NUMBER = "918125134699";
