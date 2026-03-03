import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BACKEND_URL } from "../constants/packages";

interface Member {
  id: number;
  order_id: string;
  full_name: string;
  email: string;
  mobile: string;
  box_number: string;
  package_type: string;
  no_of_soaps: number;
  amount_paid: number;
  payment_status: string;
  city: string;
  created_at: string;
}

export default function AdminScreen() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchMembers();
  }, []);

  const checkAuth = async () => {
    const auth = await AsyncStorage.getItem("admin_auth");
    if (!auth) router.replace("/admin-login");
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/members`);
      const data = await res.json();
      setMembers(data);
    } catch {
      Alert.alert("Error", "Failed to load members");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("admin_auth");
    router.replace("/admin-login");
  };

  const renderMember = ({ item }: { item: Member }) => (
    <View style={styles.memberCard}>
      <View style={styles.memberHeader}>
        <View style={styles.memberAvatar}>
          <Text style={styles.memberAvatarText}>{item.full_name?.[0] || "?"}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.memberName}>{item.full_name}</Text>
          <Text style={styles.memberOrder}>#{item.order_id}</Text>
        </View>
        <View style={[styles.statusBadge, item.payment_status === "success" ? styles.statusSuccess : styles.statusPending]}>
          <Text style={styles.statusText}>{item.payment_status === "success" ? "✅ Paid" : "⏳ Pending"}</Text>
        </View>
      </View>

      <View style={styles.memberDetails}>
        <DetailRow icon="bag" label="Package" value={item.package_type || "—"} />
        <DetailRow icon="sparkles" label="Soaps" value={`${item.no_of_soaps || "—"} soaps`} />
        <DetailRow icon="grid" label="Box(es)" value={item.box_number} />
        <DetailRow icon="cash" label="Amount" value={`₹${item.amount_paid}`} />
        <DetailRow icon="call" label="Mobile" value={item.mobile} />
        <DetailRow icon="mail" label="Email" value={item.email} />
        <DetailRow icon="location" label="City" value={item.city} />
        <DetailRow icon="calendar" label="Date" value={new Date(item.created_at).toLocaleDateString("en-IN")} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#1a1a1a", "#2d2d2d"]} style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🛡️ Admin Panel</Text>
          <Text style={styles.headerSub}>{members.length} Total Members</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out" size={20} color="#f5c518" />
        </TouchableOpacity>
      </LinearGradient>

      {/* STATS */}
      <View style={styles.statsRow}>
        {[
          { label: "Total Members", value: members.length, color: "#d97706" },
          { label: "Revenue", value: `₹${members.reduce((s, m) => s + (m.amount_paid || 0), 0).toLocaleString()}`, color: "#16a34a" },
          { label: "Paid", value: members.filter((m) => m.payment_status === "success").length, color: "#2563eb" },
        ].map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Text style={[styles.statVal, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d97706" />
          <Text style={styles.loadingText}>Loading members...</Text>
        </View>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderMember}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchMembers(); }} colors={["#d97706"]} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No members yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon as any} size={13} color="#9ca3af" style={{ marginRight: 4 }} />
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: { paddingTop: 50, paddingBottom: 16, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { color: "#f5c518", fontSize: 20, fontWeight: "900" },
  headerSub: { color: "#9ca3af", fontSize: 12 },
  logoutBtn: { padding: 10, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 20 },

  statsRow: { flexDirection: "row", padding: 12, gap: 8 },
  statCard: { flex: 1, backgroundColor: "#fff", borderRadius: 12, padding: 12, alignItems: "center", borderWidth: 1, borderColor: "#e5e7eb" },
  statVal: { fontSize: 16, fontWeight: "900", marginBottom: 2 },
  statLabel: { fontSize: 10, color: "#6b7280", textAlign: "center" },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10 },
  loadingText: { color: "#6b7280", fontSize: 14 },

  list: { padding: 12, gap: 12 },
  memberCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#e5e7eb", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  memberHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  memberAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#fef3c7", justifyContent: "center", alignItems: "center" },
  memberAvatarText: { fontSize: 18, fontWeight: "800", color: "#d97706" },
  memberName: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },
  memberOrder: { fontSize: 11, color: "#9ca3af", marginTop: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  statusSuccess: { backgroundColor: "#d1fae5" },
  statusPending: { backgroundColor: "#fef3c7" },
  statusText: { fontSize: 11, fontWeight: "700" },

  memberDetails: { gap: 6 },
  detailRow: { flexDirection: "row", alignItems: "center" },
  detailLabel: { fontSize: 12, color: "#9ca3af", width: 60, marginRight: 4 },
  detailValue: { fontSize: 12, color: "#374151", fontWeight: "500", flex: 1 },

  empty: { alignItems: "center", paddingVertical: 40 },
  emptyText: { color: "#9ca3af", fontSize: 15 },
});