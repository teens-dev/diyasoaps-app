import React, { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { PACKAGE_CONFIG, BACKEND_URL, TOTAL_MEMBERS, type PackageMode } from "../../constants/packages";

export default function ShopScreen() {
  const router = useRouter();
  const [members, setMembers] = useState(0);
  const [loading, setLoading] = useState(true);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    fetchMembers();
    startPulse();
  }, []);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/slots`);
      const data = await res.json();
      const booked = Array.isArray(data)
        ? data.filter((b: any) => b.status === "booked").length
        : 0;
      setMembers(booked);
    } catch {
      setMembers(0);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = (mode: PackageMode) => {
    router.push({ pathname: "/grid", params: { mode } });
  };

  const remainder = members % TOTAL_MEMBERS;
  const nextDraw = remainder === 0 ? TOTAL_MEMBERS : TOTAL_MEMBERS - remainder;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <LinearGradient colors={["#1a1a1a", "#2d2d2d"]} style={styles.header}>
        <Text style={styles.headerTitle}>🛍️ Shop & Rewards</Text>
        <Text style={styles.headerSub}>Premium Soaps + Gold Lucky Draw</Text>
      </LinearGradient>

      <View style={styles.content}>

        {/* PACKAGES */}
        <Text style={styles.sectionLabel}>Choose Your Package</Text>

        {/* REGULAR BOX */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>📦</Text>
            <View>
              <Text style={styles.cardTitle}>Regular Box</Text>
              <Text style={styles.cardSub}>Perfect for trying out</Text>
            </View>
          </View>
          <View style={styles.cardFeatures}>
            <FeatureRow text="1 Box" />
            <FeatureRow text="3 Premium Handmade Soaps" />
            <FeatureRow text="Natural Ingredients" />
            <FeatureRow text="Skin Friendly Formula" />
            <FeatureRow text="Lucky Draw Entry 🎁" />
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.price}>₹600</Text>
            <TouchableOpacity style={styles.buyBtn} onPress={() => handleBuy("regular")}>
              <Text style={styles.buyBtnText}>Buy Now</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* HALF-YEARLY PACK */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>⭐</Text>
            <View>
              <Text style={styles.cardTitle}>Half-Yearly Pack</Text>
              <Text style={styles.cardSub}>Great value for 6 months</Text>
            </View>
          </View>
          <View style={styles.cardFeatures}>
            <FeatureRow text="1 Box" />
            <FeatureRow text="6 Premium Soaps" />
            <FeatureRow text="Natural Ingredients" />
            <FeatureRow text="Extra Lucky Draw Entry 🎁" />
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.price}>₹900</Text>
            <TouchableOpacity style={styles.buyBtn} onPress={() => handleBuy("half")}>
              <Text style={styles.buyBtnText}>Buy Now</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ANNUAL PACK — highlighted */}
        <LinearGradient colors={["#f59e0b", "#d97706"]} style={styles.cardHighlight}>
          <View style={styles.bestOfferBadge}>
            <Text style={styles.bestOfferText}>🏆 BEST OFFER</Text>
          </View>
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>🎉</Text>
            <View>
              <Text style={[styles.cardTitle, { color: "#fff" }]}>Annual Pack</Text>
              <Text style={[styles.cardSub, { color: "rgba(255,255,255,0.8)" }]}>Maximum savings!</Text>
            </View>
          </View>
          <View style={styles.cardFeatures}>
            <FeatureRow text="2 Boxes" white />
            <FeatureRow text="12 Premium Soaps" white />
            <FeatureRow text="Maximum Savings" white />
            <FeatureRow text="2× Lucky Draw Entries 🎁" white />
          </View>
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.strikePrice}>₹2,400</Text>
              <Text style={[styles.price, { color: "#fff" }]}>₹1,188</Text>
            </View>
            <TouchableOpacity style={styles.buyBtnWhite} onPress={() => handleBuy("annual")}>
              <Text style={styles.buyBtnWhiteText}>Buy Now</Text>
              <Ionicons name="arrow-forward" size={16} color="#d97706" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* LUCKY DRAW COUNTER */}
        <Animated.View style={[styles.luckyDrawCard, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.ldTitle}>🎁 Gold Lucky Draw</Text>
          <Text style={styles.ldDesc}>
            Every <Text style={styles.ldBold}>250 members</Text> → 1 Winner gets <Text style={styles.ldBold}>1g Gold Coin!</Text>
          </Text>
          <View style={styles.ldStats}>
            <View style={styles.ldStat}>
              <Text style={styles.ldStatNum}>{loading ? "..." : members}</Text>
              <Text style={styles.ldStatLabel}>Members Joined</Text>
            </View>
            <View style={styles.ldDivider} />
            <View style={styles.ldStat}>
              <Text style={styles.ldStatNum}>{loading ? "..." : nextDraw}</Text>
              <Text style={styles.ldStatLabel}>Until Next Draw</Text>
            </View>
          </View>
          <Text style={styles.ldNote}>🔴 LIVE draw for transparency</Text>
        </Animated.View>

        {/* GRAND DRAW INFO */}
        <View style={styles.grandDrawCard}>
          <Text style={styles.gdTitle}>🏆 Grand Lucky Draw</Text>
          <Text style={styles.gdDesc}>After all 15,000 orders complete</Text>
          <View style={styles.gdPrizes}>
            <View style={styles.gdPrize}>
              <Text style={styles.gdPrizeEmoji}>🥇</Text>
              <Text style={styles.gdPrizeLabel}>1st Prize</Text>
              <Text style={styles.gdPrizeVal}>10g Gold</Text>
            </View>
            <View style={styles.gdPrize}>
              <Text style={styles.gdPrizeEmoji}>🥈</Text>
              <Text style={styles.gdPrizeLabel}>2nd Prize</Text>
              <Text style={styles.gdPrizeVal}>5g Gold</Text>
            </View>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

function FeatureRow({ text, white }: { text: string; white?: boolean }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
      <Ionicons name="checkmark-circle" size={16} color={white ? "#fff" : "#16a34a"} />
      <Text style={{ marginLeft: 8, fontSize: 13, color: white ? "#fff" : "#374151", fontWeight: "500" }}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fffbeb" },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, alignItems: "center" },
  headerTitle: { color: "#f5c518", fontSize: 24, fontWeight: "900" },
  headerSub: { color: "#aaa", fontSize: 13, marginTop: 4 },
  content: { padding: 16 },
  sectionLabel: { fontSize: 18, fontWeight: "800", color: "#92400e", marginBottom: 14, marginTop: 4 },

  card: { backgroundColor: "#fff", borderRadius: 18, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: "#fde68a", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardHighlight: { borderRadius: 18, padding: 18, marginBottom: 14, shadowColor: "#d97706", shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  cardEmoji: { fontSize: 32 },
  cardTitle: { fontSize: 17, fontWeight: "800", color: "#1a1a1a" },
  cardSub: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  cardFeatures: { marginBottom: 14 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "#f3f4f6", paddingTop: 12 },
  price: { fontSize: 26, fontWeight: "900", color: "#d97706" },
  strikePrice: { fontSize: 13, color: "rgba(255,255,255,0.6)", textDecorationLine: "line-through" },
  buyBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#d97706", paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20 },
  buyBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  buyBtnWhite: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#fff", paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20 },
  buyBtnWhiteText: { color: "#d97706", fontWeight: "700", fontSize: 14 },
  bestOfferBadge: { backgroundColor: "#fff", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginBottom: 10 },
  bestOfferText: { fontSize: 11, fontWeight: "800", color: "#d97706" },

  luckyDrawCard: { backgroundColor: "#fff", borderRadius: 18, padding: 20, marginBottom: 14, borderWidth: 2, borderColor: "#fbbf24", alignItems: "center" },
  ldTitle: { fontSize: 20, fontWeight: "900", color: "#92400e", marginBottom: 8 },
  ldDesc: { fontSize: 14, color: "#374151", textAlign: "center", lineHeight: 20, marginBottom: 16 },
  ldBold: { fontWeight: "800", color: "#d97706" },
  ldStats: { flexDirection: "row", width: "100%", marginBottom: 12 },
  ldStat: { flex: 1, alignItems: "center" },
  ldDivider: { width: 1, backgroundColor: "#fde68a" },
  ldStatNum: { fontSize: 28, fontWeight: "900", color: "#d97706" },
  ldStatLabel: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  ldNote: { fontSize: 12, color: "#ef4444", fontWeight: "600" },

  grandDrawCard: { backgroundColor: "#1a1a1a", borderRadius: 18, padding: 20, marginBottom: 20, alignItems: "center" },
  gdTitle: { fontSize: 20, fontWeight: "900", color: "#f5c518", marginBottom: 4 },
  gdDesc: { fontSize: 13, color: "#9ca3af", marginBottom: 16 },
  gdPrizes: { flexDirection: "row", gap: 20 },
  gdPrize: { alignItems: "center", backgroundColor: "rgba(255,255,255,0.07)", padding: 16, borderRadius: 14, minWidth: 100 },
  gdPrizeEmoji: { fontSize: 28, marginBottom: 4 },
  gdPrizeLabel: { fontSize: 11, color: "#9ca3af" },
  gdPrizeVal: { fontSize: 16, fontWeight: "800", color: "#f5c518" },
});