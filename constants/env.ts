/**
 * Public client config — set values in .env (see .env.example).
 * Never commit live keys; rotate any keys that were previously in source control.
 */
export const BACKEND_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL ?? "https://diya-backenddiya-backend.onrender.com";

export const RAZORPAY_KEY = process.env.EXPO_PUBLIC_RAZORPAY_KEY ?? "";

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";

export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const PRIVACY_POLICY_URL =
  process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL ?? "https://www.diyasoaps.com/privacy-policy";

export const SUPPORT_EMAIL = "support@diyasoaps.com";
