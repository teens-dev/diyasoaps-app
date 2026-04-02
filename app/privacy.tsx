import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
export default function Privacy() {
  return <ScrollView style={styles.c}><Text style={styles.t}>Privacy Policy</Text><Text style={styles.b}>Diya Soaps respects your privacy. We collect your name, email, phone, and address only to process orders and deliver products. We do not sell your data to third parties. All payments are securely handled by Razorpay.</Text></ScrollView>;
}
const styles = StyleSheet.create({ c: { flex: 1, padding: 20, backgroundColor: "#fff" }, t: { fontSize: 22, fontWeight: "800", color: "#92400e", marginBottom: 12, marginTop: 40 }, b: { fontSize: 14, color: "#374151", lineHeight: 22 } });