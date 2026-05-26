import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function LuckyDrawScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#1a1a1a", "#2d2d2d"]} style={styles.header}>
        <Text style={styles.headerTitle}>🎁 Lucky Draw</Text>
        <Text style={styles.headerSub}>Win Gold. Every 250 Members!</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* ACTIVE DRAW */}
        <LinearGradient colors={["#f59e0b", "#d97706"]} style={styles.drawCard}>
          <Text style={styles.drawCardTitle}>🎰 Active Lucky Draw</Text>
          <Text style={styles.drawCardSub}>Every 250 Active Members</Text>
          <View style={styles.prizeBox}>
            <Text style={styles.prizeEmoji}>🥇</Text>
            <Text style={styles.prizeName}>1 Gram Gold Coin</Text>
            <Text style={styles.prizeNote}>Conducted LIVE for transparency</Text>
          </View>
          <TouchableOpacity style={styles.joinBtn} onPress={() => router.push("/(tabs)/shop")}>
            <Text style={styles.joinBtnText}>Join Now →</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* GRAND DRAW */}
        <View style={styles.grandCard}>
          <Text style={styles.grandTitle}>🏆 Grand Lucky Draw</Text>
          <Text style={styles.grandSub}>After all 15,000 orders are completed</Text>
          <View style={styles.grandPrizes}>
            {[
              { rank: "🥇 1st", weight: "10g", label: "Gold Coin" },
              { rank: "🥈 2nd", weight: "5g", label: "Gold Coin" },
            ].map((p) => (
              <View key={p.rank} style={styles.grandPrize}>
                <Text style={styles.grandRank}>{p.rank}</Text>
                <Text style={styles.grandWeight}>{p.weight}</Text>
                <Text style={styles.grandLabel}>{p.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* HOW IT WORKS */}
        <View style={styles.howCard}>
          <Text style={styles.howTitle}>📋 How It Works</Text>
          {[
            { step: "1", text: "Choose any package and book your box(es)" },
            { step: "2", text: "Every 250 members, a LIVE lucky draw is held" },
            { step: "3", text: "Winner gets 1 Gram Gold Coin delivered" },
            { step: "4", text: "Grand draw after 15,000 total orders" },
          ].map((s) => (
            <View key={s.step} style={styles.step}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>{s.step}</Text></View>
              <Text style={styles.stepText}>{s.text}</Text>
            </View>
          ))}
        </View>

        {/* TRUST */}
        <View style={styles.trustCard}>
          <Ionicons name="shield-checkmark" size={28} color="#16a34a" />
          <Text style={styles.trustTitle}>100% Transparent</Text>
          <Text style={styles.trustText}>All lucky draws are conducted LIVE on video call so every member can witness the fair selection. No manipulation. No bias.</Text>
        </View>

        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerTitle}>Promotional sweepstakes</Text>
          <Text style={styles.disclaimerText}>
            Lucky draws are optional sales promotions, not gambling. Eligibility, prizes, and draw rules are set out in our Terms & Conditions. Open to India residents 18+.
          </Text>
          <TouchableOpacity onPress={() => router.push("/terms")} style={styles.disclaimerLink}>
            <Text style={styles.disclaimerLinkText}>Read full contest rules →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fffbeb" },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, alignItems: "center" },
  headerTitle: { color: "#f5c518", fontSize: 24, fontWeight: "900" },
  headerSub: { color: "#aaa", fontSize: 13, marginTop: 4 },
  content: { padding: 16 },

  drawCard: { borderRadius: 20, padding: 24, marginBottom: 16, alignItems: "center" },
  drawCardTitle: { fontSize: 22, fontWeight: "900", color: "#fff", marginBottom: 4 },
  drawCardSub: { fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 20 },
  prizeBox: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 16, padding: 20, alignItems: "center", width: "100%", marginBottom: 20 },
  prizeEmoji: { fontSize: 48, marginBottom: 8 },
  prizeName: { fontSize: 20, fontWeight: "900", color: "#fff" },
  prizeNote: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 4 },
  joinBtn: { backgroundColor: "#fff", paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25 },
  joinBtnText: { color: "#d97706", fontWeight: "800", fontSize: 15 },

  grandCard: { backgroundColor: "#1a1a1a", borderRadius: 20, padding: 24, marginBottom: 16, alignItems: "center" },
  grandTitle: { fontSize: 20, fontWeight: "900", color: "#f5c518", marginBottom: 4 },
  grandSub: { fontSize: 12, color: "#9ca3af", marginBottom: 20 },
  grandPrizes: { flexDirection: "row", gap: 16 },
  grandPrize: { flex: 1, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 14, padding: 16, alignItems: "center" },
  grandRank: { fontSize: 14, color: "#9ca3af", marginBottom: 4 },
  grandWeight: { fontSize: 26, fontWeight: "900", color: "#f5c518" },
  grandLabel: { fontSize: 12, color: "#aaa", marginTop: 2 },

  howCard: { backgroundColor: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: "#fde68a" },
  howTitle: { fontSize: 17, fontWeight: "800", color: "#92400e", marginBottom: 14 },
  step: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 12 },
  stepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#fef3c7", borderWidth: 1.5, borderColor: "#fbbf24", justifyContent: "center", alignItems: "center" },
  stepNumText: { fontSize: 13, fontWeight: "800", color: "#d97706" },
  stepText: { flex: 1, fontSize: 13, color: "#374151", lineHeight: 19 },

  trustCard: { backgroundColor: "#f0fdf4", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#bbf7d0", alignItems: "center", marginBottom: 20 },
  trustTitle: { fontSize: 17, fontWeight: "800", color: "#16a34a", marginVertical: 8 },
  trustText: { fontSize: 13, color: "#374151", textAlign: "center", lineHeight: 20 },

  disclaimerCard: { backgroundColor: "#fff", borderRadius: 16, padding: 18, borderWidth: 1, borderColor: "#e5e7eb", marginBottom: 20 },
  disclaimerTitle: { fontSize: 14, fontWeight: "800", color: "#374151", marginBottom: 6 },
  disclaimerText: { fontSize: 12, color: "#6b7280", lineHeight: 18, marginBottom: 10 },
  disclaimerLink: { alignSelf: "flex-start" },
  disclaimerLinkText: { fontSize: 13, fontWeight: "700", color: "#d97706" },
});