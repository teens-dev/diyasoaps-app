import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SUPPORT_EMAIL } from "../constants/env";

const SECTIONS = [
  {
    title: "General terms",
    body:
      "By purchasing from Diya Soaps through this app, you agree to these Terms & Conditions. Each order reserves one or more box slots for soap delivery as described in your selected package. We may update packages, pricing, and promotions with reasonable notice where required.",
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
    title: "Promotional lucky draw (sweepstakes)",
    body:
      "Eligible purchases may include entry into periodic promotional draws for prizes (e.g. gold coins) as described in the app. This is a sales promotion, not gambling:\n\n" +
      "• Entry: Automatic with qualifying package purchases during an active promotion period.\n" +
      "• Draw timing: Periodic draws (e.g. every 250 paid members) and a grand draw after the stated order milestone.\n" +
      "• Selection: Winners are chosen at random during a live session announced in advance.\n" +
      "• Prizes: As displayed in the app (e.g. 1g / 5g / 10g gold coins). Prizes are non-transferable; substitutes of equal value may apply if a prize is unavailable.\n" +
      "• Eligibility: Open to residents of India aged 18+ with a valid delivery address. Employees of Diya Soaps and immediate family may be excluded.\n" +
      "• No purchase alternative: Where required by applicable law, equivalent free entry details will be published on our website.\n" +
      "• Taxes & duties: Any taxes on prizes are the winner’s responsibility unless stated otherwise.\n" +
      "• Disputes: Diya Soaps’s decision on draw administration is final, subject to applicable law.",
  },
  {
    title: "Refunds & draw entries",
    body:
      "Product refunds follow our Refund Policy. Lucky draw entries tied to a refunded or cancelled order may be void. Draw entries are non-refundable once the draw for that period has been conducted.",
  },
  {
    title: "Limitation of liability",
    body:
      "To the fullest extent permitted by law, Diya Soaps is not liable for indirect or consequential damages arising from use of the app or promotions. Our total liability for a given order is limited to the amount you paid for that order.",
  },
  {
    title: "Contact",
    body: `Questions about these terms or promotions: ${SUPPORT_EMAIL}`,
  },
];

export default function Terms() {
  return (
    <ScrollView style={styles.c} contentContainerStyle={styles.content}>
      <Text style={styles.t}>Terms & Conditions</Text>
      <Text style={styles.updated}>Last updated: May 2025</Text>
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
