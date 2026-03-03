import { ScrollView, StyleSheet, Text } from "react-native";
export default function Terms() {
  return <ScrollView style={styles.c}><Text style={styles.t}>Terms & Conditions</Text><Text style={styles.b}>By purchasing from Diya Soaps, you agree to our terms. Each order is for one box slot. Lucky draw participation is automatic with every purchase. Winners are selected randomly via LIVE draw. Diya Soaps reserves the right to modify packages and pricing at any time.</Text></ScrollView>;
}
const styles = StyleSheet.create({ c: { flex: 1, padding: 20, backgroundColor: "#fff" }, t: { fontSize: 22, fontWeight: "800", color: "#92400e", marginBottom: 12, marginTop: 40 }, b: { fontSize: 14, color: "#374151", lineHeight: 22 } });