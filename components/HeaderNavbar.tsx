import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface HeaderNavbarProps {
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  announcementText?: string;
  onCartPress?: () => void;
  onWishlistPress?: () => void;
  cartCount?: number;
}

export function HeaderNavbar({
  searchQuery,
  onSearchChange,
  announcementText = "Bringing The Comfort of Home to Your Daily Routine.",
  onCartPress,
  onWishlistPress,
  cartCount = 0,
}: HeaderNavbarProps) {
  const router = useRouter();

  const handleCartClick = () => {
    if (onCartPress) {
      onCartPress();
    } else {
      router.push("/(tabs)/shop");
    }
  };

  const handleWishlistClick = () => {
    if (onWishlistPress) {
      onWishlistPress();
    } else {
      router.push("/(tabs)/shop");
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header Row */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.brandContainer}
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)")}
        >
          <Image
            style={styles.logoImage}
            source={{ uri: "https://www.diyasoaps.com/assets/logo-CeP7dR-J.png" }}
            resizeMode="contain"
          />
          <View style={styles.brandTitleCol}>
            <Text style={styles.brandName}>Diya</Text>
            <Text style={styles.brandTagline}>AYURVEDA + SCIENCE</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={handleWishlistClick}
            accessibilityLabel="Wishlist"
          >
            <Ionicons name="heart-outline" size={24} color="#1F1B18" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={handleCartClick}
            accessibilityLabel="Cart"
          >
            <Ionicons name="bag-outline" size={24} color="#1F1B18" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#8C7D73" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="WHAT ARE YOU LOOKING FOR?"
            placeholderTextColor="#8C7D73"
            value={searchQuery}
            onChangeText={onSearchChange}
            autoCapitalize="characters"
          />
        </View>
      </View>

      {/* Announcement Strip */}
      {announcementText ? (
        <View style={styles.announcementStrip}>
          <Text style={styles.announcementText}>{announcementText}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAF4EE",
    paddingTop: Platform.OS === "ios" ? 50 : 36,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoImage: {
    width: 32,
    height: 32,
    borderRadius: 6,
  },
  brandTitleCol: {
    justifyContent: "center",
  },
  brandName: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "serif" }),
    fontSize: 22,
    fontWeight: "700",
    color: "#1F1B18",
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  brandTagline: {
    fontSize: 7,
    fontWeight: "800",
    color: "#8C7D73",
    letterSpacing: 1.2,
    marginTop: -1,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconBtn: {
    padding: 4,
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: 0,
    right: -2,
    backgroundColor: "#E63946",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7ECE5",
    borderRadius: 4,
    paddingHorizontal: 14,
    height: 44,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#1F1B18",
    letterSpacing: 0.5,
  },
  announcementStrip: {
    backgroundColor: "#1F1B18",
    paddingVertical: 9,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  announcementText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.3,
    textAlign: "center",
  },
});
