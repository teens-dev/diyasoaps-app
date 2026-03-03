import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Linking, Alert, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BACKEND_URL, PHONE_NUMBER, WHATSAPP_NUMBER } from "../../constants/packages";

export default function ContactScreen() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!form.name || !form.email || !form.message) {
      Alert.alert("Missing Fields", "Please fill all required fields"); return;
    }
    setLoading(true);
    try {
      await fetch(`${BACKEND_URL}/send-contact-mail`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      Alert.alert("✅ Sent!", "We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      Alert.alert("Error", "Failed to send. Try WhatsApp instead.");
    } finally { setLoading(false); }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#1a1a1a", "#2d2d2d"]} style={styles.header}>
        <Text style={styles.headerTitle}>📞 Contact Us</Text>
        <Text style={styles.headerSub}>We're here to help you</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* QUICK CONTACTS */}
        <View style={styles.quickRow}>
          <TouchableOpacity style={[styles.quickBtn, { backgroundColor: "#25D366" }]}
            onPress={() => Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}`)}>
            <Ionicons name="logo-whatsapp" size={22} color="#fff" />
            <Text style={styles.quickText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.quickBtn, { backgroundColor: "#d97706" }]}
            onPress={() => Linking.openURL(`tel:${PHONE_NUMBER}`)}>
            <Ionicons name="call" size={22} color="#fff" />
            <Text style={styles.quickText}>Call Now</Text>
          </TouchableOpacity>
        </View>

        {/* CONTACT FORM */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>📝 Send a Message</Text>
          {[
            { key: "name", label: "Your Name", placeholder: "Full name" },
            { key: "email", label: "Email", placeholder: "your@email.com" },
            { key: "phone", label: "Phone (Optional)", placeholder: "Mobile number" },
          ].map((f) => (
            <View key={f.key} style={styles.inputGroup}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput style={styles.input} placeholder={f.placeholder} placeholderTextColor="#9ca3af"
                value={(form as any)[f.key]} onChangeText={(v) => setForm({ ...form, [f.key]: v })} />
            </View>
          ))}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput style={[styles.input, styles.textarea]} placeholder="Your message..." placeholderTextColor="#9ca3af"
              multiline numberOfLines={4} value={form.message} onChangeText={(v) => setForm({ ...form, message: v })} />
          </View>
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendBtnText}>Send Message</Text>}
          </TouchableOpacity>
        </View>

        {/* INFO */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>📍 Business Info</Text>
          <Text style={styles.infoText}>📧 support@diyasoaps.com</Text>
          <Text style={styles.infoText}>📱 {PHONE_NUMBER}</Text>
          <Text style={styles.infoText}>🕐 Mon–Sat, 9 AM – 6 PM</Text>
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
  quickRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  quickBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 14 },
  quickText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  formCard: { backgroundColor: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: "#fde68a" },
  formTitle: { fontSize: 17, fontWeight: "800", color: "#92400e", marginBottom: 14 },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 12, fontWeight: "700", color: "#374151", marginBottom: 4 },
  input: { backgroundColor: "#fffbeb", borderWidth: 1.5, borderColor: "#fde68a", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: "#1a1a1a" },
  textarea: { height: 100, textAlignVertical: "top" },
  sendBtn: { backgroundColor: "#d97706", paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  sendBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  infoCard: { backgroundColor: "#fff", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#fde68a" },
  infoTitle: { fontSize: 16, fontWeight: "800", color: "#92400e", marginBottom: 12 },
  infoText: { fontSize: 14, color: "#374151", marginBottom: 8, lineHeight: 20 },
});