import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
export default function Shipping() {
  return <ScrollView style={styles.c}><Text style={styles.t}>Shipping Policy</Text><Text style={styles.b}>We deliver across India within 5–7 business days after order confirmation. Shipping is free on all orders. You will receive a tracking link via email once your order is dispatched. For delivery issues, contact support@diyasoaps.com with your Order ID.</Text></ScrollView>;
}
const styles = StyleSheet.create({ c: { flex: 1, padding: 20, backgroundColor: "#fff" }, t: { fontSize: 22, fontWeight: "800", color: "#92400e", marginBottom: 12, marginTop: 40 }, b: { fontSize: 14, color: "#374151", lineHeight: 22 } });