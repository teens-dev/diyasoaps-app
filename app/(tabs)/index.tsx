import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, Linking, Image, 
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { PHONE_NUMBER, WHATSAPP_NUMBER } from "../../constants/packages";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();

  const openWhatsApp = () => {
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I'm interested in Diya Soaps`);
  };

  const callNow = () => {
    Linking.openURL(`tel:${PHONE_NUMBER}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER BAR */}
      <LinearGradient colors={["#1a1a1a", "#2d2d2d"]} style={styles.header}>
        <Image
        style={styles.imageStylee}
        source={{ uri: 'https://www.diyasoaps.com/assets/logo-CeP7dR-J.png' }}
      />
        <Text style={styles.headerText}> Diya Soaps</Text>
        <View style={{ width: 38 }} />
      </LinearGradient>

      {/* TRUST BAR */}
      <View style={styles.trustBar}>
        <Text style={styles.trustText}>🔒 Secure Payment</Text>
        <Text style={styles.trustDivider}>|</Text>
        <Text style={styles.trustText}>🚚 Free Delivery</Text>
        <Text style={styles.trustDivider}>|</Text>
        <Text style={styles.trustText}>✨ Natural Ingredients</Text>
      </View>

      {/* HERO SECTION */}
      <LinearGradient colors={["#fef3c7", "#fde68a", "#fbbf24"]} style={styles.hero}>
        <Image
        style={styles.imageStyle}
        source={{ uri: 'https://www.diyasoaps.com/assets/logo-CeP7dR-J.png' }}
      />

        <Text style={styles.heroTitle}>Premium Natural Soaps</Text>
        <Text style={styles.heroSubtitle}>
          Handcrafted with love. Win Gold every 250 members!
        </Text>

        <View style={styles.heroBadgeRow}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>🥇 Gold Lucky Draw</Text>
          </View>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>🌱 Natural Ingredients</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.heroBtn}
          onPress={() => router.push("/(tabs)/shop")}
        >
          <Text style={styles.heroBtnText}>Shop Now →</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* FEATURES */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Why Diya Soaps?</Text>
        {[
          { icon: "leaf", title: "Natural Ingredients", desc: "Handmade soaps crafted with plant-based oils and gentle formulas." },
          { icon: "trophy", title: "Promotional Lucky Draw", desc: "Eligible orders may enter periodic draws for gold prizes. See Terms." },
          { icon: "shield-checkmark", title: "Trusted Quality", desc: "Small-batch handmade soaps made with care for everyday use." },
          { icon: "car", title: "Free Delivery", desc: "Delivered right to your doorstep across India." },
        ].map((f, i) => (
          <View key={i} style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name={f.icon as any} size={24} color="#d97706" />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* CTA SECTION */}
      <LinearGradient colors={["#d97706", "#b45309"]} style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>🎁 Join 15,000 Members!</Text>
        <Text style={styles.ctaSubtitle}>
          Book your slot now and be eligible for Gold Lucky Draw
        </Text>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => router.push("/(tabs)/shop")}
        >
          <Text style={styles.ctaBtnText}>Choose Your Package →</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* FLOATING ACTION BUTTONS */}
      <View style={styles.floatingRow}>
        <TouchableOpacity style={[styles.floatBtn, { backgroundColor: "#25D366" }]} onPress={openWhatsApp}>
          <Ionicons name="logo-whatsapp" size={20} color="#fff" />
          <Text style={styles.floatBtnText}>WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.floatBtn, { backgroundColor: "#d97706" }]} onPress={callNow}>
          <Ionicons name="call" size={20} color="#fff" />
          <Text style={styles.floatBtnText}>Call Us</Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerBrand}> Diya Soaps</Text>
        <View style={styles.footerLinks}>
          {[
            { label: "Privacy", route: "/privacy" },
            { label: "Terms", route: "/terms" },
            { label: "Refund", route: "/refund" },
            { label: "Shipping", route: "/shipping" },
          ].map((l) => (
            <TouchableOpacity key={l.label} onPress={() => router.push(l.route as any)}>
              <Text style={styles.footerLink}>{l.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.footerCopy}>© 2025 Diya Soaps. All rights reserved.</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Header
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 50, paddingBottom: 14 },
  headerText: { color: "#f5c518", fontSize: 22, fontWeight: "800" },
  // Trust bar
  trustBar: { flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#fef3c7", paddingVertical: 8, gap: 8 },
  trustText: { fontSize: 11, color: "#92400e", fontWeight: "600" },
  trustDivider: { color: "#d97706" },

   imageStyle: {
    // Manually specify dimensions for network images
    width: 100,
    height: 60,
  },

  imageStylee: {
    // Manually specify dimensions for network images
    width: 40,
    height: 40,
  },

  // Hero
  hero: { padding: 32, alignItems: "center" },
  heroEmoji: { fontSize: 60, marginBottom: 12 },
  heroTitle: { fontSize: 28, fontWeight: "900", color: "#1a1a1a", textAlign: "center", marginBottom: 10 },
  heroSubtitle: { fontSize: 15, color: "#44403c", textAlign: "center", lineHeight: 22, marginBottom: 20 },
  heroBadgeRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  heroBadge: { backgroundColor: "rgba(255,255,255,0.7)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  heroBadgeText: { fontSize: 12, fontWeight: "700", color: "#92400e" },
  heroBtn: { backgroundColor: "#1a1a1a", paddingHorizontal: 32, paddingVertical: 14, borderRadius: 30, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  heroBtnText: { color: "#f5c518", fontSize: 16, fontWeight: "800" },

  // Features
  featuresSection: { padding: 20 },
  sectionTitle: { fontSize: 22, fontWeight: "800", color: "#92400e", marginBottom: 16, textAlign: "center" },
  featureCard: { flexDirection: "row", alignItems: "flex-start", backgroundColor: "#fffbeb", borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#fde68a" },
  featureIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#fef3c7", justifyContent: "center", alignItems: "center", marginRight: 14 },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 15, fontWeight: "700", color: "#1a1a1a", marginBottom: 3 },
  featureDesc: { fontSize: 13, color: "#6b7280", lineHeight: 18 },

  // CTA
  ctaSection: { margin: 20, borderRadius: 20, padding: 28, alignItems: "center" },
  ctaTitle: { fontSize: 22, fontWeight: "900", color: "#fff", marginBottom: 8, textAlign: "center" },
  ctaSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.85)", textAlign: "center", marginBottom: 20, lineHeight: 19 },
  ctaBtn: { backgroundColor: "#fff", paddingHorizontal: 28, paddingVertical: 13, borderRadius: 25 },
  ctaBtnText: { color: "#d97706", fontWeight: "800", fontSize: 15 },

  // Floating row
  floatingRow: { flexDirection: "row", gap: 12, paddingHorizontal: 20, marginBottom: 20 },
  floatBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 13, borderRadius: 14 },
  floatBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  // Footer
  footer: { backgroundColor: "#1a1a1a", padding: 24, alignItems: "center" },
  footerBrand: { color: "#f5c518", fontSize: 18, fontWeight: "800", marginBottom: 12 },
  footerLinks: { flexDirection: "row", gap: 16, marginBottom: 12 },
  footerLink: { color: "#9ca3af", fontSize: 12, fontWeight: "600" },
  footerCopy: { color: "#6b7280", fontSize: 11 },
});