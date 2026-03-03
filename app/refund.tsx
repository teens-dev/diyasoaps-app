import { ScrollView, StyleSheet, Text } from "react-native";
export default function Refund() {
  return <ScrollView style={styles.c}><Text style={styles.t}>Refund Policy</Text><Text style={styles.b}>Refunds are accepted within 7 days of delivery if the product is damaged or defective. To request a refund, contact us at support@diyasoaps.com with your Order ID and photos of the issue. Lucky draw slots are non-refundable once the draw has been conducted.</Text></ScrollView>;
}
const styles = StyleSheet.create({ c: { flex: 1, padding: 20, backgroundColor: "#fff" }, t: { fontSize: 22, fontWeight: "800", color: "#92400e", marginBottom: 12, marginTop: 40 }, b: { fontSize: 14, color: "#374151", lineHeight: 22 } });