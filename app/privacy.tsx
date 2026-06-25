import React from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PRIVACY_POLICY_URL, SUPPORT_EMAIL } from "../constants/env";

const SECTIONS = [
  {
    title: "Overview",
    body:
      "Diya Soaps (“we”, “us”) operates this mobile app to sell handmade soap products. This policy explains what data we collect, how we use it, and your choices.",
  },
  {
    title: "Information we collect",
    body:
      "• Account & order details: name, email, mobile number, delivery address (house, street, city, pincode).\n" +
      "• Order metadata: package type, quantity, order ID, payment status.\n" +
      "• Contact form: name, email, phone (optional), and message.\n" +
      "• Technical data: basic app usage and API requests needed to process orders.",
  },
  {
    title: "How we use your data",
    body:
      "We use your information to:\n" +
      "• Process and deliver product orders\n" +
      "• Verify payments and confirm orders\n" +
      "• Respond to support and contact requests\n" +
      "We do not sell your personal data to third parties.",
  },
  {
    title: "Third-party services",
    body:
      "• Razorpay — payment processing (card, UPI, net banking, wallets). Razorpay handles payment credentials; we receive payment status and order references only.\n" +
      "• Our backend (hosted on Render) — order creation, payment verification, and member records.\n" +
      "Each provider has its own privacy policy. We share only the data needed to complete your transaction.",
  },
  {
    title: "Data retention",
    body:
      "We retain order and contact records as long as needed for delivery, accounting, dispute resolution, and legal compliance. You may request deletion when no longer required for these purposes.",
  },
  {
    title: "Your rights & data deletion",
    body:
      `You may request access, correction, or deletion of your personal data by emailing ${SUPPORT_EMAIL} with your Order ID and registered email. We will respond within a reasonable time (typically within 30 days). Deleting order data may not be possible where retention is required by law.`,
  },
  {
    title: "Security",
    body:
      "We use HTTPS for API calls and rely on Razorpay for secure payment handling. No payment card numbers are stored in the app.",
  },
  {
    title: "Children",
    body:
      "This app is not directed at children under 13. We do not knowingly collect data from children.",
  },
  {
    title: "Changes",
    body:
      "We may update this policy. The in-app version and the web URL below will reflect the latest version.",
  },
  {
    title: "Contact",
    body: `Questions: ${SUPPORT_EMAIL}`,
  },
];

export default function Privacy() {
  const openWebPolicy = () => {
    Linking.openURL(PRIVACY_POLICY_URL).catch(() => {});
  };

  return (
    <ScrollView style={styles.c} contentContainerStyle={styles.content}>
      <Text style={styles.t}>Privacy Policy</Text>
      <Text style={styles.updated}>Last updated: June 2026</Text>

      <TouchableOpacity onPress={openWebPolicy} style={styles.linkBtn}>
        <Text style={styles.linkText}>View full policy on diyasoaps.com →</Text>
      </TouchableOpacity>

      {SECTIONS.map((s) => (
        <View key={s.title}>
          <Text style={styles.h}>{s.title}</Text>
          <Text style={styles.b}>{s.body}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 40 },
  t: { fontSize: 22, fontWeight: "800", color: "#92400e", marginTop: 8, marginBottom: 4 },
  updated: { fontSize: 12, color: "#9ca3af", marginBottom: 12 },
  linkBtn: {
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fffbeb",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  linkText: { fontSize: 13, fontWeight: "700", color: "#d97706" },
  h: { fontSize: 16, fontWeight: "800", color: "#92400e", marginTop: 16, marginBottom: 6 },
  b: { fontSize: 14, color: "#374151", lineHeight: 22 },
});
