import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { HeaderNavbar } from "../../components/HeaderNavbar";
import {
  PHONE_NUMBER,
  WHATSAPP_NUMBER,
  PACK_CONFIG,
  formatPrice,
  type PackType,
} from "../../constants/packages";

const { width } = Dimensions.get("window");
// Real Diya Soaps product images
const IMG_SINGLE    = "https://www.diyasoaps.com/assets/soap-single-CZkjmFEz.png";
const IMG_GANESHA   = "https://www.diyasoaps.com/assets/soap-ganesha-BwnX0vi1.png";
const IMG_HAND      = "https://www.diyasoaps.com/assets/soap-hand-D6IhdUvB.png";
const IMG_WITH_BOX  = "https://www.diyasoaps.com/assets/soap-with-box-Lq7DmNyD.png";
const IMG_MAIN      = "https://www.diyasoaps.com/assets/diya-soap-CRomTGM1.png";
const IMG_INGR      = "https://www.diyasoaps.com/assets/key-ingredients-oxghDYWU.png";

const CATEGORIES = [
  {
    id: "NORMAL",
    title: "Starter Pack",
    subtitle: "1 Soap • ₹300",
    packType: "NORMAL" as PackType,
    image: IMG_SINGLE,
  },
  {
    id: "HALF_YEAR",
    title: "Value Pack",
    subtitle: "3 Soaps • ₹600",
    packType: "HALF_YEAR" as PackType,
    image: IMG_GANESHA,
  },
  {
    id: "ANNUAL",
    title: "Bumper Pack",
    subtitle: "6 Soaps • ₹900",
    packType: "ANNUAL" as PackType,
    image: IMG_HAND,
  },
  {
    id: "RED_SANDAL",
    title: "Red Sandal Kit",
    subtitle: "14 Products",
    packType: "RED_SANDAL" as PackType,
    image: IMG_WITH_BOX,
  },
];

const BEST_SELLERS: { id: PackType; title: string; subtitle: string; discount: string; mrp: number | null; price: number; image: string }[] = [
  {
    id: "ANNUAL",
    title: "Bumper Pack (6 Soaps)",
    subtitle: "Maximum savings — 6 premium soaps",
    discount: "Save 50%",
    mrp: 1800,
    price: 900,
    image: IMG_HAND,
  },
  {
    id: "HALF_YEAR",
    title: "Value Pack (3 Soaps)",
    subtitle: "Great value — 3 premium soaps",
    discount: "Save 33%",
    mrp: 900,
    price: 600,
    image: IMG_GANESHA,
  },
  {
    id: "NORMAL",
    title: "Starter Pack (1 Soap)",
    subtitle: "Perfect for trying out Diya Soaps",
    discount: "Trial Pack",
    mrp: null,
    price: 300,
    image: IMG_SINGLE,
  },
  {
    id: "RED_SANDAL",
    title: "Red Sandal Premium Kit",
    subtitle: "14 premium products in one kit",
    discount: "Luxury Kit",
    mrp: null,
    price: 50000,
    image: IMG_WITH_BOX,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const openWhatsApp = () => {
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I'm interested in Diya Soaps`);
  };

  const callNow = () => {
    Linking.openURL(`tel:${PHONE_NUMBER}`);
  };

  return (
    <View style={styles.screenWrapper}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Navbar */}
        <HeaderNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          announcementText="Bringing The Comfort of Home to Your Daily Routine."
          cartCount={0}
        />

        {/* Category Circular Row */}
        <View style={styles.categorySection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                activeOpacity={0.8}
                onPress={() => router.push({ pathname: "/(tabs)/shop", params: { packType: cat.packType } })}
              >
                <View style={styles.categoryCircle}>
                  <Image source={{ uri: cat.image }} style={styles.categoryImage} resizeMode="cover" />
                </View>
                <Text style={styles.categoryLabel}>{cat.title}</Text>
                <Text style={styles.categorySubLabel}>{cat.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.dividerLine} />

        {/* Combo Hero Banner */}
        <View style={styles.bannerContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.heroBannerCard}
            onPress={() => router.push({ pathname: "/(tabs)/shop", params: { packType: "ANNUAL" } })}
          >
            <View style={styles.bannerTextCol}>
              <Text style={styles.bannerHeadline}>Grab your Biggest Savings with our</Text>
              <Text style={styles.bannerTitle}>Bumper Pack Combo!</Text>
              <Text style={styles.bannerSubtitle}>6 Premium Soaps for only ₹900 (MRP ₹1,800)</Text>

              <View style={styles.starburstBadge}>
                <Text style={styles.starburstSmall}>SAVE</Text>
                <Text style={styles.starburstBig}>50%</Text>
                <Text style={styles.starburstSmall}>OFF</Text>
              </View>
            </View>

            <View style={styles.bannerImageWrapper}>
              <Image
                source={{ uri: IMG_MAIN }}
                style={styles.bannerImage}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>

          {/* Carousel Dots */}
          <View style={styles.dotsRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        <View style={styles.dividerLine} />

        {/* Shop Best Seller Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>Shop Diya Soaps Packages</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/shop")}>
            <Text style={styles.viewAllLink}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Best Sellers Grid / Horizontal Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsScroll}
        >
          {BEST_SELLERS.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: "/(tabs)/shop", params: { packType: product.id } })}
            >
              <View style={styles.productImageContainer}>
                <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
                <View style={styles.discountTagPill}>
                  <Text style={styles.discountTagText}>{product.discount}</Text>
                </View>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={1}>
                  {product.title}
                </Text>
                <Text style={styles.productSubtitle} numberOfLines={2}>
                  {product.subtitle}
                </Text>
                <View style={styles.priceRow}>
                  {product.mrp && <Text style={styles.mrpText}>{formatPrice(product.mrp)}</Text>}
                  <Text style={styles.priceText}>{formatPrice(product.price)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.dividerLine} />

        {/* Why Diya Soaps Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.whyTitle}>Why Diya Soaps?</Text>
          <View style={styles.featuresGrid}>
            {[
              {
                icon: "leaf-outline",
                title: "100% Natural",
                desc: "Crafted with plant-based oils & gentle formula",
              },
              {
                icon: "heart-outline",
                title: "Skin Friendly",
                desc: "Gentle on all skin types — perfect for daily use",
              },
              {
                icon: "ribbon-outline",
                title: "Trusted Quality",
                desc: "Small-batch handmade soaps with care",
              },
              {
                icon: "car-outline",
                title: "Free Delivery",
                desc: "Delivered right to your doorstep across India",
              },
            ].map((item, idx) => (
              <View key={idx} style={styles.featureBox}>
                <View style={styles.featureIconWrap}>
                  <Ionicons name={item.icon as any} size={22} color="#1F1B18" />
                </View>
                <Text style={styles.featureBoxTitle}>{item.title}</Text>
                <Text style={styles.featureBoxDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Key Ingredients Banner */}
        <TouchableOpacity
          style={styles.ingredientsBanner}
          activeOpacity={0.9}
          onPress={() => router.push("/(tabs)/shop")}
        >
          <Image
            source={{ uri: IMG_INGR }}
            style={styles.ingredientsImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Quick WhatsApp / Call Bar */}
        <View style={styles.quickContactSection}>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: "#25D366" }]}
            onPress={openWhatsApp}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
            <Text style={styles.quickBtnText}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: "#1F1B18" }]}
            onPress={callNow}
            activeOpacity={0.8}
          >
            <Ionicons name="call-outline" size={18} color="#FFFFFF" />
            <Text style={styles.quickBtnText}>Call Us</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerBrand}>Diya Soaps</Text>
          <Text style={styles.footerTagline}>Pure, Handcrafted Soaps for Your Daily Routine.</Text>
          <View style={styles.footerLinksRow}>
            {[
              { label: "Privacy Policy", route: "/privacy" },
              { label: "Terms & Conditions", route: "/terms" },
              { label: "Refund Policy", route: "/refund" },
              { label: "Shipping Policy", route: "/shipping" },
            ].map((link) => (
              <TouchableOpacity
                key={link.label}
                onPress={() => router.push(link.route as any)}
              >
                <Text style={styles.footerLinkText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.copyrightText}>© 2026 Diya Soaps. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: "#FAF4EE",
  },
  container: {
    flex: 1,
  },
  categorySection: {
    paddingVertical: 16,
    backgroundColor: "#FAF4EE",
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 16,
  },
  categoryItem: {
    alignItems: "center",
    width: 82,
  },
  categoryCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#EAE2D8",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    padding: 10,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F1B18",
    textAlign: "center",
  },
  categorySubLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "#8C7D73",
    textAlign: "center",
    marginTop: 1,
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#EAE2D8",
    marginHorizontal: 16,
  },
  bannerContainer: {
    padding: 16,
    backgroundColor: "#FAF4EE",
  },
  heroBannerCard: {
    backgroundColor: "#F3EAE0",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#EAE2D8",
    overflow: "hidden",
  },
  bannerTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  bannerHeadline: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8C7D73",
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1F1B18",
    marginTop: 2,
    marginBottom: 2,
  },
  bannerSubtitle: {
    fontSize: 11,
    color: "#4A4543",
    marginBottom: 10,
  },
  starburstBadge: {
    backgroundColor: "#E63946",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  starburstSmall: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "800",
  },
  starburstBig: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 17,
  },
  bannerImageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 10,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#D9D0C7",
  },
  dotActive: {
    backgroundColor: "#1F1B18",
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F1B18",
  },
  viewAllLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F1B18",
    textDecorationLine: "underline",
  },
  productsScroll: {
    paddingHorizontal: 16,
    gap: 14,
    paddingBottom: 16,
  },
  productCard: {
    width: width * 0.44,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EAE2D8",
    overflow: "hidden",
  },
  productImageContainer: {
    width: "100%",
    height: 130,
    backgroundColor: "#FAF4EE",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  discountTagPill: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FAF4EE",
    borderWidth: 1,
    borderColor: "#E86C38",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  discountTagText: {
    color: "#E86C38",
    fontSize: 10,
    fontWeight: "800",
  },
  productInfo: {
    padding: 10,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F1B18",
    marginBottom: 2,
  },
  productSubtitle: {
    fontSize: 11,
    color: "#8C7D73",
    marginBottom: 6,
    height: 28,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  mrpText: {
    fontSize: 11,
    color: "#9E978F",
    textDecorationLine: "line-through",
  },
  priceText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1F1B18",
  },
  featuresSection: {
    padding: 20,
    backgroundColor: "#FAF4EE",
  },
  whyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F1B18",
    textAlign: "center",
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureBox: {
    width: (width - 52) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EAE2D8",
    alignItems: "center",
  },
  featureIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F7ECE5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  featureBoxTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F1B18",
    marginBottom: 2,
    textAlign: "center",
  },
  featureBoxDesc: {
    fontSize: 11,
    color: "#6E655F",
    textAlign: "center",
    lineHeight: 15,
  },
  quickContactSection: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  quickBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 25,
  },
  quickBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  footerContainer: {
    backgroundColor: "#1F1B18",
    padding: 24,
    alignItems: "center",
  },
  footerBrand: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "serif" }),
    color: "#FAF4EE",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  footerTagline: {
    color: "#9E978F",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 16,
  },
  footerLinksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
    marginBottom: 16,
  },
  footerLinkText: {
    color: "#D9D0C7",
    fontSize: 12,
    fontWeight: "500",
  },
  copyrightText: {
    color: "#736B63",
    fontSize: 11,
  },
  ingredientsBanner: {
    marginHorizontal: 16,
    marginBottom: 4,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EAE2D8",
  },
  ingredientsImage: {
    width: "100%",
    height: 180,
  },
});
