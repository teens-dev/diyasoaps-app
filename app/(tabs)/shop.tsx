import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Share,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  PACK_CONFIG,
  getPackageDetails,
  formatPrice,
  type PackType,
} from "../../constants/packages";

const { width } = Dimensions.get("window");

const PACK_ORDER: PackType[] = ["NORMAL", "HALF_YEAR", "ANNUAL", "RED_SANDAL"];

const DIYA_LOGO    = "https://www.diyasoaps.com/assets/logo-CeP7dR-J.png";
const IMG_SINGLE   = "https://www.diyasoaps.com/assets/soap-single-CZkjmFEz.png";
const IMG_GANESHA  = "https://www.diyasoaps.com/assets/soap-ganesha-BwnX0vi1.png";
const IMG_HAND     = "https://www.diyasoaps.com/assets/soap-hand-D6IhdUvB.png";
const IMG_WITH_BOX = "https://www.diyasoaps.com/assets/soap-with-box-Lq7DmNyD.png";
const IMG_MAIN     = "https://www.diyasoaps.com/assets/diya-soap-CRomTGM1.png";

// Gallery images per pack type — real Diya Soaps product photos
const PACK_IMAGES: Record<PackType, string[]> = {
  NORMAL:    [IMG_SINGLE, IMG_HAND, IMG_MAIN],
  HALF_YEAR: [IMG_GANESHA, IMG_SINGLE, IMG_HAND],
  ANNUAL:    [IMG_HAND, IMG_GANESHA, IMG_MAIN],
  RED_SANDAL: [IMG_WITH_BOX, IMG_HAND, IMG_GANESHA],
};

export default function ShopScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ packType?: string }>();
  
  const [selectedPack, setSelectedPack] = useState<PackType>(
    (params.packType as PackType) && PACK_ORDER.includes(params.packType as PackType)
      ? (params.packType as PackType)
      : "ANNUAL"
  );

  useEffect(() => {
    if (params.packType && PACK_ORDER.includes(params.packType as PackType)) {
      setSelectedPack(params.packType as PackType);
    }
  }, [params.packType]);

  const [quantities, setQuantities] = useState<Record<PackType, number>>({
    NORMAL: 1,
    HALF_YEAR: 1,
    ANNUAL: 1,
    RED_SANDAL: 1,
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = PACK_IMAGES[selectedPack] ?? [IMG_MAIN];

  // Reset gallery index when pack changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedPack]);

  const currentConfig = PACK_CONFIG[selectedPack];
  const currentQty = quantities[selectedPack] || 1;
  const details = getPackageDetails(currentQty, selectedPack);

  const updateQty = (delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [selectedPack]: Math.max(1, Math.min(10, (prev[selectedPack] || 1) + delta)),
    }));
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(tabs)");
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${currentConfig.label} on Diya Soaps! Handcrafted natural soaps made with plant-based oils: https://www.diyasoaps.com`,
      });
    } catch {
      // ignore
    }
  };

  const handleBuy = () => {
    router.push({
      pathname: "/register",
      params: { packType: selectedPack, qty: String(currentQty) },
    });
  };

  return (
    <View style={styles.screenWrapper}>
      {/* Top Header Bar with Back Navigation */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#1F1B18" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {currentConfig.label} — Diya Soaps
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push("/(tabs)/contact")}>
            <Ionicons name="call-outline" size={22} color="#1F1B18" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleBuy}>
            <Ionicons name="bag-outline" size={22} color="#1F1B18" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Product Image Gallery */}
        <View style={styles.imageGalleryBox}>
          <Image
            source={{ uri: images[selectedImageIndex] ?? images[0] }}
            style={styles.mainProductImage}
            resizeMode="cover"
          />

          {/* Dot / Thumbnail Navigation */}
          <View style={styles.dotsRow}>
            {images.map((_, idx) => (
              <TouchableOpacity key={idx} onPress={() => setSelectedImageIndex(idx)}>
                <View style={[styles.dot, selectedImageIndex === idx && styles.dotActive]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Product Details Section */}
        <View style={styles.productDetailsBox}>
          <View style={styles.titleShareRow}>
            <View style={{ flex: 1 }}>
              {currentConfig.tag && (
                <View style={styles.offerTagBadge}>
                  <Text style={styles.offerTagText}>🏆 {currentConfig.tag}</Text>
                </View>
              )}
              <Text style={styles.productTitleText}>{currentConfig.label}</Text>
              <Text style={styles.productDescText}>{currentConfig.description}</Text>
            </View>

            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <Ionicons name="share-outline" size={22} color="#1F1B18" />
            </TouchableOpacity>
          </View>

          {/* Pricing Row */}
          <View style={styles.priceRow}>
            {details.mrp && (
              <Text style={styles.mrpText}>{formatPrice(details.mrp)}</Text>
            )}
            <Text style={styles.priceText}>{formatPrice(details.price)}</Text>
            {details.savings > 0 && (
              <Text style={styles.saveBadgeText}>
                Save {formatPrice(details.savings)}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.dividerLine} />

        {/* Select Package Selector Cards */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Select Package:</Text>
          <View style={styles.packsGrid}>
            {PACK_ORDER.map((packKey) => {
              const cfg = PACK_CONFIG[packKey];
              const isSelected = selectedPack === packKey;
              return (
                <TouchableOpacity
                  key={packKey}
                  style={[styles.packCard, isSelected && styles.packCardSelected]}
                  onPress={() => setSelectedPack(packKey)}
                  activeOpacity={0.8}
                >
                  <View style={styles.packHeaderRow}>
                    <Text style={styles.packEmoji}>{cfg.emoji}</Text>
                    <Text style={[styles.packLabelText, isSelected && styles.packLabelSelected]}>
                      {cfg.label}
                    </Text>
                  </View>
                  <Text style={styles.packSubText}>
                    {cfg.isKit
                      ? `${cfg.soapsPerBox} products per kit`
                      : `${cfg.soapsPerBox} soap${cfg.soapsPerBox > 1 ? "s" : ""} per box`}
                  </Text>
                  <Text style={[styles.packPriceText, isSelected && styles.packPriceSelected]}>
                    {formatPrice(cfg.pricePerBox)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Product Details Card */}
        <View style={styles.detailsListCard}>
          <Text style={styles.detailsCardTitle}>What's Included in {currentConfig.label}:</Text>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={18} color="#2D7D46" />
            <Text style={styles.featureItemText}>
              {currentConfig.isKit
                ? `${currentConfig.soapsPerBox} Premium Diya Soaps Skincare Products`
                : `${details.soaps} Handcrafted Premium Soap${details.soaps > 1 ? "s" : ""}`}
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={18} color="#2D7D46" />
            <Text style={styles.featureItemText}>100% Plant-Based Oils & Gentle Formula</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={18} color="#2D7D46" />
            <Text style={styles.featureItemText}>Skin-Friendly — Perfect for Everyday Use</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={18} color="#2D7D46" />
            <Text style={styles.featureItemText}>Free Delivery Across India</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Footer Action Bar */}
      <View style={styles.bottomFooterBar}>
        <View style={styles.qtySelectorPill}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(-1)}>
            <Text style={styles.qtyBtnSymbol}>-</Text>
          </TouchableOpacity>

          <Text style={styles.qtyValueText}>{currentQty}</Text>

          <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(1)}>
            <Text style={styles.qtyBtnSymbol}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addToCartPillBtn} activeOpacity={0.85} onPress={handleBuy}>
          <Text style={styles.addToCartBtnText}>Buy Now • {formatPrice(details.price)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: "#FAF4EE",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#FAF4EE",
    borderBottomWidth: 1,
    borderBottomColor: "#EAE2D8",
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#1F1B18",
    marginHorizontal: 8,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconBtn: {
    padding: 4,
  },
  container: {
    flex: 1,
    marginBottom: 74,
  },
  imageGalleryBox: {
    width: "100%",
    height: 270,
    backgroundColor: "#FAF4EE",
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: "#EAE2D8",
  },
  mainProductImage: {
    width: "100%",
    height: 240,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D9D0C7",
  },
  dotActive: {
    backgroundColor: "#1F1B18",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  productDetailsBox: {
    padding: 18,
    backgroundColor: "#FAF4EE",
  },
  titleShareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10,
  },
  offerTagBadge: {
    backgroundColor: "#F7ECE5",
    borderWidth: 1,
    borderColor: "#E86C38",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  offerTagText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#E86C38",
  },
  productTitleText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F1B18",
    lineHeight: 26,
  },
  productDescText: {
    fontSize: 13,
    color: "#8C7D73",
    marginTop: 2,
  },
  shareBtn: {
    padding: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  mrpText: {
    fontSize: 14,
    color: "#9E978F",
    textDecorationLine: "line-through",
  },
  priceText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F1B18",
  },
  saveBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2D7D46",
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#EAE2D8",
  },
  sectionContainer: {
    padding: 16,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F1B18",
    marginBottom: 12,
  },
  packsGrid: {
    gap: 10,
  },
  packCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EAE2D8",
  },
  packCardSelected: {
    borderColor: "#1F1B18",
    borderWidth: 2,
    backgroundColor: "#F7ECE5",
  },
  packHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  packEmoji: {
    fontSize: 18,
  },
  packLabelText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F1B18",
  },
  packLabelSelected: {
    color: "#1F1B18",
  },
  packSubText: {
    fontSize: 12,
    color: "#8C7D73",
    marginLeft: 26,
    marginBottom: 4,
  },
  packPriceText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F1B18",
    marginLeft: 26,
  },
  packPriceSelected: {
    color: "#1F1B18",
  },
  detailsListCard: {
    margin: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EAE2D8",
  },
  detailsCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F1B18",
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  featureItemText: {
    fontSize: 13,
    color: "#4A4543",
    fontWeight: "500",
  },
  bottomFooterBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FAF4EE",
    borderTopWidth: 1,
    borderTopColor: "#EAE2D8",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  qtySelectorPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EAE2D8",
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: 6,
    width: 100,
  },
  qtyBtn: {
    paddingHorizontal: 4,
  },
  qtyBtnSymbol: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F1B18",
  },
  qtyValueText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1F1B18",
  },
  addToCartPillBtn: {
    flex: 1,
    backgroundColor: "#231F20",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  addToCartBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
