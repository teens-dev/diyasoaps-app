import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  PACK_CONFIG,
  getPackageDetails,
  formatPrice,
  type PackType,
} from "../../constants/packages";

const PACK_ORDER: PackType[] = ["NORMAL", "HALF_YEAR", "ANNUAL", "RED_SANDAL"];

export default function ShopScreen() {
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<PackType, number>>({
    NORMAL: 1,
    HALF_YEAR: 1,
    ANNUAL: 1,
    RED_SANDAL: 1,
  });

  const updateQty = (packType: PackType, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [packType]: Math.max(1, Math.min(10, (prev[packType] || 1) + delta)),
    }));
  };

  const handleBuy = (packType: PackType) => {
    const qty = quantities[packType] || 1;
    router.push({ pathname: "/register", params: { packType, qty: String(qty) } });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#1a1a1a", "#2d2d2d"]} style={styles.header}>
        <Text style={styles.headerTitle}>🛍️ Shop</Text>
        <Text style={styles.headerSub}>Premium Handmade Soaps</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionLabel}>Choose Your Package</Text>

        {PACK_ORDER.map((packType) => {
          const cfg = PACK_CONFIG[packType];
          const qty = quantities[packType];
          const details = getPackageDetails(qty, packType);
          const isHighlight = cfg.highlight;

          const cardContent = (
            <>
              {cfg.tag && (
                <View style={styles.bestOfferBadge}>
                  <Text style={styles.bestOfferText}>🏆 {cfg.tag}</Text>
                </View>
              )}
              <View style={styles.cardHeader}>
                <Text style={styles.cardEmoji}>{cfg.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, isHighlight && styles.cardTitleWhite]}>
                    {cfg.label}
                  </Text>
                  <Text style={[styles.cardSub, isHighlight && styles.cardSubWhite]}>
                    {cfg.description}
                  </Text>
                </View>
              </View>

              <View style={styles.cardFeatures}>
                {cfg.isKit ? (
                  <FeatureRow
                    text={`${cfg.soapsPerBox} Premium Products per Kit`}
                    white={isHighlight}
                  />
                ) : (
                  <>
                    <FeatureRow
                      text={`${cfg.soapsPerBox} Premium Soap${cfg.soapsPerBox > 1 ? "s" : ""} per box`}
                      white={isHighlight}
                    />
                    <FeatureRow text="Natural Ingredients" white={isHighlight} />
                    <FeatureRow text="Skin Friendly Formula" white={isHighlight} />
                  </>
                )}
                <FeatureRow text="Free Delivery across India" white={isHighlight} />
              </View>

              <View style={styles.qtyRow}>
                <Text style={[styles.qtyLabel, isHighlight && styles.qtyLabelWhite]}>
                  Quantity
                </Text>
                <View style={styles.qtyControls}>
                  <TouchableOpacity
                    style={[styles.qtyBtn, isHighlight && styles.qtyBtnWhite]}
                    onPress={() => updateQty(packType, -1)}
                  >
                    <Ionicons name="remove" size={18} color={isHighlight ? "#d97706" : "#374151"} />
                  </TouchableOpacity>
                  <Text style={[styles.qtyVal, isHighlight && styles.qtyValWhite]}>{qty}</Text>
                  <TouchableOpacity
                    style={[styles.qtyBtn, isHighlight && styles.qtyBtnWhite]}
                    onPress={() => updateQty(packType, 1)}
                  >
                    <Ionicons name="add" size={18} color={isHighlight ? "#d97706" : "#374151"} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View>
                  {details.mrp && (
                    <Text style={[styles.strikePrice, isHighlight && styles.strikePriceWhite]}>
                      {formatPrice(details.mrp)}
                    </Text>
                  )}
                  <Text style={[styles.price, isHighlight && styles.priceWhite]}>
                    {formatPrice(details.price)}
                  </Text>
                  {details.savings > 0 && (
                    <Text style={[styles.savings, isHighlight && styles.savingsWhite]}>
                      Save {formatPrice(details.savings)}
                    </Text>
                  )}
                  {!cfg.isKit && qty > 1 && (
                    <Text style={[styles.soapNote, isHighlight && styles.soapNoteWhite]}>
                      {details.soaps} soaps total
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={isHighlight ? styles.buyBtnWhite : styles.buyBtn}
                  onPress={() => handleBuy(packType)}
                >
                  <Text style={isHighlight ? styles.buyBtnWhiteText : styles.buyBtnText}>
                    Buy Now
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={isHighlight ? "#d97706" : "#fff"}
                  />
                </TouchableOpacity>
              </View>
            </>
          );

          if (isHighlight) {
            return (
              <LinearGradient
                key={packType}
                colors={["#f59e0b", "#d97706"]}
                style={styles.cardHighlight}
              >
                {cardContent}
              </LinearGradient>
            );
          }

          return (
            <View key={packType} style={styles.card}>
              {cardContent}
            </View>
          );
        })}

        <View style={styles.trustCard}>
          <Ionicons name="shield-checkmark" size={24} color="#16a34a" />
          <Text style={styles.trustTitle}>Secure Checkout</Text>
          <Text style={styles.trustText}>
            Payments secured by Razorpay. UPI, Cards, Net Banking & Wallets accepted.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function FeatureRow({ text, white }: { text: string; white?: boolean }) {
  return (
    <View style={styles.featureRow}>
      <Ionicons name="checkmark-circle" size={16} color={white ? "#fff" : "#16a34a"} />
      <Text style={[styles.featureText, white && styles.featureTextWhite]}>{text}</Text>
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

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#fde68a",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHighlight: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#d97706",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  cardEmoji: { fontSize: 32 },
  cardTitle: { fontSize: 17, fontWeight: "800", color: "#1a1a1a" },
  cardTitleWhite: { color: "#fff" },
  cardSub: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  cardSubWhite: { color: "rgba(255,255,255,0.85)" },
  cardFeatures: { marginBottom: 14 },
  featureRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  featureText: { marginLeft: 8, fontSize: 13, color: "#374151", fontWeight: "500" },
  featureTextWhite: { color: "#fff" },

  qtyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  qtyLabel: { fontSize: 13, fontWeight: "700", color: "#374151" },
  qtyLabelWhite: { color: "#fff" },
  qtyControls: { flexDirection: "row", alignItems: "center", gap: 12 },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fef3c7",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnWhite: { backgroundColor: "#fff" },
  qtyVal: { fontSize: 16, fontWeight: "800", color: "#1a1a1a", minWidth: 24, textAlign: "center" },
  qtyValWhite: { color: "#fff" },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
    paddingTop: 12,
  },
  price: { fontSize: 24, fontWeight: "900", color: "#d97706" },
  priceWhite: { color: "#fff" },
  strikePrice: { fontSize: 13, color: "#9ca3af", textDecorationLine: "line-through" },
  strikePriceWhite: { color: "rgba(255,255,255,0.6)" },
  savings: { fontSize: 12, color: "#16a34a", fontWeight: "700", marginTop: 2 },
  savingsWhite: { color: "rgba(255,255,255,0.9)" },
  soapNote: { fontSize: 11, color: "#6b7280", marginTop: 2 },
  soapNoteWhite: { color: "rgba(255,255,255,0.75)" },
  buyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#d97706",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buyBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  buyBtnWhite: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buyBtnWhiteText: { color: "#d97706", fontWeight: "700", fontSize: 14 },
  bestOfferBadge: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  bestOfferText: { fontSize: 11, fontWeight: "800", color: "#d97706" },

  trustCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    alignItems: "center",
    marginBottom: 20,
  },
  trustTitle: { fontSize: 16, fontWeight: "800", color: "#16a34a", marginVertical: 8 },
  trustText: { fontSize: 13, color: "#374151", textAlign: "center", lineHeight: 20 },
});
