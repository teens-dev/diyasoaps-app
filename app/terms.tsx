import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SUPPORT_EMAIL } from "../constants/env";

const SECTIONS = [
  {
    title: "General terms",
    body:
      "By purchasing from Diya Soaps through this app, you agree to these Terms & Conditions. Each order includes physical soap products shipped to the address you provide. We may update packages, pricing, and promotions with reasonable notice where required.",
  },
  {
    title: "Products & delivery",
    body:
      "Orders include physical handmade soap products shipped to the address you provide. Delivery timelines and shipping terms are described in our Shipping Policy. Risk of loss passes to you upon delivery to the carrier unless otherwise required by law.",
  },
  {
    title: "Payments",
    body:
      "Payments are processed securely by Razorpay. Your order is confirmed only after successful payment verification on our servers. If verification fails after payment, contact support with your Order ID.",
  },
  {
    title: "Refunds",
    body:
      "Product refunds follow our Refund Policy. Refund requests must be submitted within the timeframe stated in that policy.",
  },
  {
    title: "Limitation of liability",
    body:
      "To the fullest extent permitted by law, Diya Soaps is not liable for indirect or consequential damages arising from use of the app. Our total liability for a given order is limited to the amount you paid for that order.",
  },
  {
    title: "Contact",
    body: `Questions about these terms: ${SUPPORT_EMAIL}`,
  },
];

export default function Terms() {
  return (
    <ScrollView style={styles.c} contentContainerStyle={styles.content}>
      <Text style={styles.t}>Terms & Conditions</Text>
      <Text style={styles.updated}>Last updated: June 2026</Text>
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
  updated: { fontSize: 12, color: "#9ca3af", marginBottom: 8 },
  h: { fontSize: 16, fontWeight: "800", color: "#92400e", marginTop: 16, marginBottom: 6 },
  b: { fontSize: 14, color: "#374151", lineHeight: 22 },
});
