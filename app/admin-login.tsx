import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ADMIN_USER = "diyasoaps";
const ADMIN_PASS = "diya@admin123";

export default function AdminLoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) { Alert.alert("Error", "Enter username and password"); return; }
    setLoading(true);
    setTimeout(async () => {
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        await AsyncStorage.setItem("admin_auth", "true");
        router.replace("/admin");
      } else {
        Alert.alert("Invalid Credentials", "Incorrect username or password");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <LinearGradient colors={["#1a1a1a", "#000"]} style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="shield" size={48} color="#f5c518" style={{ marginBottom: 12 }} />
        <Text style={styles.title}>Admin Login</Text>
        <Text style={styles.sub}>Diya Soaps Dashboard</Text>

        <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#9ca3af"
          value={username} onChangeText={setUsername} autoCapitalize="none" />

        <View style={styles.passRow}>
          <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]} placeholder="Password" placeholderTextColor="#9ca3af"
            value={password} onChangeText={setPassword} secureTextEntry={!showPass} />
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
            <Ionicons name={showPass ? "eye-off" : "eye"} size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#1a1a1a" /> : <Text style={styles.loginBtnText}>Login →</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back to App</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  card: { backgroundColor: "#1e1e1e", borderRadius: 20, padding: 28, width: "100%", alignItems: "center", borderWidth: 1, borderColor: "#333" },
  title: { fontSize: 24, fontWeight: "900", color: "#f5c518", marginBottom: 4 },
  sub: { fontSize: 13, color: "#9ca3af", marginBottom: 28 },
  input: { backgroundColor: "#2d2d2d", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: "#fff", width: "100%", marginBottom: 12, borderWidth: 1, borderColor: "#444" },
  passRow: { flexDirection: "row", alignItems: "center", gap: 8, width: "100%", marginBottom: 12 },
  eyeBtn: { padding: 12, backgroundColor: "#2d2d2d", borderRadius: 12, borderWidth: 1, borderColor: "#444" },
  loginBtn: { backgroundColor: "#f5c518", paddingVertical: 14, borderRadius: 14, width: "100%", alignItems: "center", marginTop: 8 },
  loginBtnText: { color: "#1a1a1a", fontWeight: "800", fontSize: 16 },
  backBtn: { marginTop: 16 },
  backText: { color: "#9ca3af", fontSize: 13 },
});