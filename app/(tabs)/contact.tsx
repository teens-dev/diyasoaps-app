import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Linking,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BACKEND_URL, PHONE_NUMBER, WHATSAPP_NUMBER } from "../../constants/packages";

export default function ContactScreen() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!form.name || !form.email || !form.message) {
      Alert.alert("Missing Fields", "Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      await fetch(`${BACKEND_URL}/send-contact-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      Alert.alert("✅ Sent!", "We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      Alert.alert("Error", "Failed to send. Try WhatsApp instead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Title Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account & Help</Text>
        <Text style={styles.headerSub}>We're here to assist you with your orders</Text>
      </View>

      <View style={styles.content}>
        {/* Quick Contact Buttons */}
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: "#25D366" }]}
            onPress={() => Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}`)}
            activeOpacity={0.85}
          >
            <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
            <Text style={styles.quickText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: "#1F1B18" }]}
            onPress={() => Linking.openURL(`tel:${PHONE_NUMBER}`)}
            activeOpacity={0.85}
          >
            <Ionicons name="call-outline" size={20} color="#FFFFFF" />
            <Text style={styles.quickText}>Call Now</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Send a Message</Text>
          {[
            { key: "name", label: "Your Name", placeholder: "Enter full name" },
            { key: "email", label: "Email Address", placeholder: "your@email.com" },
            { key: "phone", label: "Phone (Optional)", placeholder: "Mobile number" },
          ].map((f) => (
            <View key={f.key} style={styles.inputGroup}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                style={styles.input}
                placeholder={f.placeholder}
                placeholderTextColor="#9E978F"
                value={(form as any)[f.key]}
                onChangeText={(v) => setForm({ ...form, [f.key]: v })}
              />
            </View>
          ))}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="How can we help you?"
              placeholderTextColor="#9E978F"
              multiline
              numberOfLines={4}
              value={form.message}
              onChangeText={(v) => setForm({ ...form, message: v })}
            />
          </View>
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={handleSend}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.sendBtnText}>Send Message</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Business Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Business Information</Text>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color="#1F1B18" />
            <Text style={styles.infoText}>support@diyasoaps.com</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color="#1F1B18" />
            <Text style={styles.infoText}>{PHONE_NUMBER}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color="#1F1B18" />
            <Text style={styles.infoText}>Mon – Sat, 9 AM – 6 PM</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF4EE" },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 36,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#FAF4EE",
    borderBottomWidth: 1,
    borderBottomColor: "#EAE2D8",
  },
  headerTitle: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "serif" }),
    color: "#1F1B18",
    fontSize: 24,
    fontWeight: "700",
  },
  headerSub: { color: "#8C7D73", fontSize: 13, marginTop: 4 },
  content: { padding: 16 },
  quickRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  quickBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 25,
  },
  quickText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EAE2D8",
  },
  formTitle: { fontSize: 16, fontWeight: "700", color: "#1F1B18", marginBottom: 14 },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 12, fontWeight: "600", color: "#4A4543", marginBottom: 4 },
  input: {
    backgroundColor: "#FAF4EE",
    borderWidth: 1,
    borderColor: "#EAE2D8",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: "#1F1B18",
  },
  textarea: { height: 100, textAlignVertical: "top" },
  sendBtn: {
    backgroundColor: "#231F20",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 4,
  },
  sendBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#EAE2D8",
  },
  infoTitle: { fontSize: 15, fontWeight: "700", color: "#1F1B18", marginBottom: 12 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  infoText: { fontSize: 13, color: "#4A4543" },
});