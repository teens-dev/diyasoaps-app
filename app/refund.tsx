import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function Refund() {
  return (
    <ScrollView style={styles.c}>
      <Text style={styles.t}>Refund Policy</Text>
      <Text style={styles.b}>
        Refunds are accepted within 7 days of delivery if the product is damaged or defective. To
        request a refund, contact us at support@diyasoaps.com with your Order ID and photos of the
        issue. Refunds are processed within 5–7 business days after approval.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: "#fff", padding: 20 },
  t: { fontSize: 22, fontWeight: "800", color: "#92400e", marginTop: 8, marginBottom: 12 },
  b: { fontSize: 14, color: "#374151", lineHeight: 22 },
});
