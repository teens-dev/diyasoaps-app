# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


# 📱 Diya Soaps — React Native (Expo) Setup Guide
# Step-by-step to get the app running on your phone

## ─────────────────────────────────────────
## STEP 1: Install Prerequisites
## ─────────────────────────────────────────

# Install Node.js (if not already installed)
# Download from: https://nodejs.org (LTS version)

# Install Expo CLI globally
npm install -g expo-cli

# Install EAS CLI (for future production builds)
npm install -g eas-cli


## ─────────────────────────────────────────
## STEP 2: Create Your Expo App
## ─────────────────────────────────────────

# Open terminal in your projects folder
cd C:\Users\Balaji Marpally

# Create a new Expo app (tabs template)
npx create-expo-app myApp --template tabs

# Go into the project
cd myApp


## ─────────────────────────────────────────
## STEP 3: Install Required Packages
## ─────────────────────────────────────────

# Run these one by one in your terminal inside myApp folder:

npx expo install expo-linear-gradient
npx expo install expo-status-bar
npx expo install @expo/vector-icons
npx expo install @react-native-async-storage/async-storage
npx expo install expo-linking

# Supabase client (for real-time grid)
npm install @supabase/supabase-js

# NOTE: For production Razorpay (not needed for Expo Go testing):
# npm install react-native-razorpay


## ─────────────────────────────────────────
## STEP 4: Copy the Files I Gave You
## ─────────────────────────────────────────

# DELETE everything inside these folders first:
#   myApp/app/
#   myApp/components/

# Then COPY these files exactly:

# app/_layout.tsx              ← Root layout
# app/(tabs)/_layout.tsx       ← Tab bar config
# app/(tabs)/index.tsx         ← Home screen
# app/(tabs)/shop.tsx          ← Shop screen
# app/(tabs)/luckydraw.tsx     ← Lucky Draw screen
# app/(tabs)/contact.tsx       ← Contact screen
# app/grid.tsx                 ← Box selection screen
# app/register.tsx             ← Registration + payment
# app/admin-login.tsx          ← Admin login
# app/admin.tsx                ← Admin panel
# constants/packages.ts        ← Package config (shared)


## ─────────────────────────────────────────
## STEP 5: Add Your Supabase Credentials
## ─────────────────────────────────────────

# Open: app/grid.tsx
# Find these lines (around line 12-13):
#   const SUPABASE_URL = "YOUR_SUPABASE_URL";
#   const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

# Replace with your actual values from:
# Supabase Dashboard → Project Settings → API
#   Project URL     → paste as SUPABASE_URL
#   anon public key → paste as SUPABASE_ANON_KEY


## ─────────────────────────────────────────
## STEP 6: Update app.json
## ─────────────────────────────────────────

# Open myApp/app.json and replace with:

{
  "expo": {
    "name": "Diya Soaps",
    "slug": "diya-soaps",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "diyasoaps",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1a1a1a"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#d97706"
      },
      "package": "com.diyasoaps.app"
    },
    "ios": {
      "bundleIdentifier": "com.diyasoaps.app"
    },
    "plugins": [
      "expo-router"
    ]
  }
}


## ─────────────────────────────────────────
## STEP 7: Run the App
## ─────────────────────────────────────────

# In terminal, inside myApp folder:
npx expo start

# You'll see a QR code in the terminal
# On your phone:
#   Android → Open Expo Go app → Scan QR code
#   iPhone  → Open Camera app → Scan QR code

# The app will load on your phone!


## ─────────────────────────────────────────
## STEP 8: Test Each Screen
## ─────────────────────────────────────────

# ✅ Home Tab      → Hero, features, WhatsApp/Call buttons
# ✅ Shop Tab      → 3 packages, tap "Buy Now" on any
# ✅ Grid Screen   → Opens after tapping Buy Now, select boxes
# ✅ Register      → Fill form, tap "Pay ₹600 Securely"
#                    (shows simulation alert in Expo Go)
# ✅ Lucky Draw    → Info screen
# ✅ Contact       → Send message form + WhatsApp/Call buttons
# ✅ Admin Login   → Tap shield icon on Home → enter credentials
#                    Username: diyasoaps | Password: diya@admin123
# ✅ Admin Panel   → See all members, pull to refresh


## ─────────────────────────────────────────
## STEP 9: Production Razorpay (Real Payments)
## ─────────────────────────────────────────

# Expo Go cannot use native Razorpay SDK.
# For real payments, you need a production build:

# Step 9a: Install Razorpay native module
npm install react-native-razorpay

# Step 9b: In register.tsx, replace the openRazorpay function with:
#
# import RazorpayCheckout from "react-native-razorpay";
#
# const openRazorpay = async (orderData, newOrderId) => {
#   const options = {
#     description: pkg.label,
#     image: "https://your-logo-url.png",
#     currency: "INR",
#     key: RAZORPAY_KEY,
#     amount: orderData.amount,
#     order_id: orderData.id,
#     name: "Diya Soaps",
#     prefill: {
#       email: form.email,
#       contact: form.mobile,
#       name: form.fullName,
#     },
#     theme: { color: "#d97706" },
#   };
#   const data = await RazorpayCheckout.open(options);
#   // Then call verify-payment API with data
# };

# Step 9c: Build APK for Android
eas build --platform android --profile preview


## ─────────────────────────────────────────
## STEP 10: Build Production APK
## ─────────────────────────────────────────

# Login to Expo account (free)
eas login

# Configure build
eas build:configure

# Build Android APK (takes 10-15 mins on Expo servers)
eas build --platform android

# Download APK → install on phone
# Share APK link with users to install directly


## ─────────────────────────────────────────
## FILE STRUCTURE AFTER SETUP
## ─────────────────────────────────────────

# myApp/
# ├── app/
# │   ├── _layout.tsx          ← Root layout
# │   ├── grid.tsx             ← Box selection
# │   ├── register.tsx         ← Payment form
# │   ├── admin-login.tsx      ← Admin login
# │   ├── admin.tsx            ← Admin dashboard
# │   └── (tabs)/
# │       ├── _layout.tsx      ← Tab bar
# │       ├── index.tsx        ← Home
# │       ├── shop.tsx         ← Shop
# │       ├── luckydraw.tsx    ← Lucky Draw
# │       └── contact.tsx      ← Contact
# ├── constants/
# │   └── packages.ts          ← Shared config
# ├── assets/
# └── app.json


## ─────────────────────────────────────────
## COMMON ERRORS & FIXES
## ─────────────────────────────────────────

# Error: "expo-linear-gradient not found"
# Fix: npx expo install expo-linear-gradient

# Error: "Cannot find module @react-native-async-storage"
# Fix: npx expo install @react-native-async-storage/async-storage

# Error: "Metro bundler error" 
# Fix: npx expo start --clear

# Error: Supabase grid not loading
# Fix: Check SUPABASE_URL and SUPABASE_ANON_KEY in grid.tsx

# Error: Members not showing in admin
# Fix: Make sure backend index.js is running on Render
#      Check BACKEND_URL in constants/packages.ts




npx expo start --clear


# # Copy to .env and fill in values. Do not commit .env.
# # If keys were ever committed to git, rotate them in Razorpay/Supabase dashboards.
# /**
#  * Public client config — set values in .env (see .env.example).
#  * Never commit live keys; rotate any keys that were previously in source control.
#  */
# export const BACKEND_URL =
#   process.env.EXPO_PUBLIC_BACKEND_URL ?? "https://diya-backenddiya-backend.onrender.com";

# export const RAZORPAY_KEY = process.env.EXPO_PUBLIC_RAZORPAY_KEY ?? "";

# export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";

# export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

# export const PRIVACY_POLICY_URL =
#   process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL ?? "https://www.diyasoaps.com/privacy-policy";

# export const SUPPORT_EMAIL = "support@diyasoaps.com";

# EXPO_PUBLIC_BACKEND_URL=https://diya-backenddiya-backend.onrender.com
# EXPO_PUBLIC_RAZORPAY_KEY=rzp_live_SEoqwulgqrAXys
# EXPO_PUBLIC_SUPABASE_URL=https://ntazlpdxvdwkyguxbkpf.supabase.co
# EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50YXpscGR4dmR3a3lndXhia3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNTMwMTIsImV4cCI6MjA4NDgyOTAxMn0.zasWIyTlyEA90jVdRnFe2SthU7HwcJ6Hrh5JUPjV7yk
# EXPO_PUBLIC_PRIVACY_POLICY_URL=https://www.diyasoaps.com/privacy-policy



EXPO_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
EXPO_PUBLIC_RAZORPAY_KEY=rzp_live_your_key_here
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_PRIVACY_POLICY_URL=https://www.diyasoaps.com/privacy-policy
