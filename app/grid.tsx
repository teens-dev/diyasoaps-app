// VITE_SUPABASE_URL=https://ntazlpdxvdwkyguxbkpf.supabase.co
// VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50YXpscGR4dmR3a3lndXhia3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNTMwMTIsImV4cCI6MjA4NDgyOTAxMn0.zasWIyTlyEA90jVdRnFe2SthU7HwcJ6Hrh5JUPjV7yk




import React, { useState, useEffect, useCallback } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, FlatList,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { createClient } from "@supabase/supabase-js";
import { PACKAGE_CONFIG, type PackageMode } from "../constants/packages";

// ⚠️ Replace with your actual Supabase credentials
const SUPABASE_URL = "https://ntazlpdxvdwkyguxbkpf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50YXpscGR4dmR3a3lndXhia3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNTMwMTIsImV4cCI6MjA4NDgyOTAxMn0.zasWIyTlyEA90jVdRnFe2SthU7HwcJ6Hrh5JUPjV7yk";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const BOXES_REQUIRED: Record<PackageMode, number> = {
  regular: 1,
  half: 1,
  annual: 2,
};

interface GridBox {
  box_number: number;
  status: "available" | "reserved" | "booked";
}

const PAGE_SIZE = 50;
const PHASE_LIMIT = 250;

export default function GridScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode: PackageMode }>();
  const mode = (params.mode as PackageMode) || "regular";
  const pkg = PACKAGE_CONFIG[mode];
  const required = BOXES_REQUIRED[mode];

  const [boxes, setBoxes] = useState<GridBox[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchBoxes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("grid_boxes")
        .select("*")
        .lte("box_number", PHASE_LIMIT)
        .order("box_number", { ascending: true });
      if (error) throw error;
      setBoxes((data ?? []) as GridBox[]);
    } catch {
      Alert.alert("Error", "Failed to load boxes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBoxes(); }, [fetchBoxes]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("grid-live-rn")
      .on("postgres_changes", { event: "*", schema: "public", table: "grid_boxes" },
        (payload: any) => {
          if (!payload?.new) return;
          const updated = payload.new as GridBox;
          if (updated.box_number > PHASE_LIMIT) return;
          setBoxes((prev) =>
            prev.map((b) => b.box_number === updated.box_number ? updated : b)
          );
        }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleBoxPress = (boxNumber: number) => {
    if (selected.includes(boxNumber)) {
      setSelected(selected.filter((b) => b !== boxNumber));
      return;
    }
    if (selected.length >= required) {
      Alert.alert("Limit Reached", `You can only select ${required} box${required > 1 ? "es" : ""} for this package.`);
      return;
    }
    const updated = [...selected, boxNumber];
    setSelected(updated);

    if (updated.length === required) {
      // Navigate to registration with selected boxes + mode
      setTimeout(() => {
        router.push({
          pathname: "/register",
          params: { boxes: updated.join(","), mode },
        });
        setSelected([]);
      }, 300);
    }
  };

  const getBoxStyle = (box: GridBox) => {
    if (selected.includes(box.box_number)) return [styles.box, styles.boxSelected];
    if (box.status === "booked") return [styles.box, styles.boxBooked];
    if (box.status === "reserved") return [styles.box, styles.boxReserved];
    return [styles.box, styles.boxAvailable];
  };

  const getBoxTextStyle = (box: GridBox) => {
    if (selected.includes(box.box_number)) return styles.boxTextSelected;
    if (box.status === "booked") return styles.boxTextBooked;
    if (box.status === "reserved") return styles.boxTextReserved;
    return styles.boxTextAvailable;
  };

  const totalPages = Math.max(1, Math.ceil(boxes.length / PAGE_SIZE));
  const pageData = boxes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d97706" />
        <Text style={styles.loadingText}>Loading boxes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={["#1a1a1a", "#2d2d2d"]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#f5c518" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.headerTitle}>Select Your Box</Text>
          <Text style={styles.headerSub}>{pkg.label} • {pkg.soaps} Soaps • ₹{pkg.price}</Text>
        </View>
        <View style={{ width: 38 }} />
      </LinearGradient>

      {/* INSTRUCTION BANNER */}
      <LinearGradient colors={["#f59e0b", "#d97706"]} style={styles.instruction}>
        <Ionicons name="hand-left" size={18} color="#fff" />
        <Text style={styles.instructionText}>
          Tap to select {required} box{required > 1 ? "es" : ""}  •  Selected: {selected.length}/{required}
        </Text>
      </LinearGradient>

      {/* LEGEND */}
      <View style={styles.legend}>
        {[
          { color: "#fef3c7", border: "#fbbf24", label: "Available" },
          { color: "#f59e0b", border: "#d97706", label: "Selected" },
          { color: "#fecaca", border: "#f87171", label: "Reserved" },
          { color: "#22c55e", border: "#16a34a", label: "Booked" },
        ].map((l) => (
          <View key={l.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: l.color, borderColor: l.border }]} />
            <Text style={styles.legendLabel}>{l.label}</Text>
          </View>
        ))}
      </View>

      {/* GRID */}
      <FlatList
        data={pageData}
        keyExtractor={(item) => item.box_number.toString()}
        numColumns={5}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          const disabled = item.status !== "available" && !selected.includes(item.box_number);
          return (
            <TouchableOpacity
              style={getBoxStyle(item)}
              onPress={() => !disabled && handleBoxPress(item.box_number)}
              disabled={item.status === "booked" || item.status === "reserved"}
              activeOpacity={0.7}
            >
              <Text style={getBoxTextStyle(item)}>
                {String(item.box_number).padStart(3, "0")}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* PAGINATION */}
      <View style={styles.pagination}>
        <TouchableOpacity
          disabled={page === 1}
          onPress={() => setPage((p) => p - 1)}
          style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
        >
          <Ionicons name="chevron-back" size={20} color={page === 1 ? "#ccc" : "#d97706"} />
        </TouchableOpacity>
        <Text style={styles.pageText}>Page {page} / {totalPages}</Text>
        <TouchableOpacity
          disabled={page === totalPages}
          onPress={() => setPage((p) => p + 1)}
          style={[styles.pageBtn, page === totalPages && styles.pageBtnDisabled]}
        >
          <Ionicons name="chevron-forward" size={20} color={page === totalPages ? "#ccc" : "#d97706"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  loadingText: { fontSize: 14, color: "#6b7280" },

  header: { paddingTop: 50, paddingBottom: 14, paddingHorizontal: 16, flexDirection: "row", alignItems: "center" },
  backBtn: { padding: 6, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 20 },
  headerTitle: { color: "#f5c518", fontSize: 18, fontWeight: "800" },
  headerSub: { color: "#aaa", fontSize: 12, marginTop: 2 },

  instruction: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  instructionText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  legend: { flexDirection: "row", justifyContent: "center", gap: 16, paddingVertical: 10, backgroundColor: "#fffbeb", borderBottomWidth: 1, borderBottomColor: "#fde68a" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 12, height: 12, borderRadius: 3, borderWidth: 1.5 },
  legendLabel: { fontSize: 11, color: "#374151", fontWeight: "500" },

  grid: { padding: 12, gap: 6 },
  box: { width: "18%", aspectRatio: 1, margin: "1%", borderRadius: 8, borderWidth: 1.5, justifyContent: "center", alignItems: "center" },
  boxAvailable: { backgroundColor: "#fef3c7", borderColor: "#fbbf24" },
  boxSelected: { backgroundColor: "#f59e0b", borderColor: "#d97706" },
  boxReserved: { backgroundColor: "#fecaca", borderColor: "#f87171" },
  boxBooked: { backgroundColor: "#22c55e", borderColor: "#16a34a" },
  boxTextAvailable: { fontSize: 10, fontWeight: "700", color: "#92400e" },
  boxTextSelected: { fontSize: 10, fontWeight: "700", color: "#fff" },
  boxTextReserved: { fontSize: 10, fontWeight: "700", color: "#b91c1c" },
  boxTextBooked: { fontSize: 10, fontWeight: "700", color: "#fff" },

  pagination: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 20, padding: 12, borderTopWidth: 1, borderTopColor: "#f3f4f6" },
  pageBtn: { padding: 8, backgroundColor: "#fef3c7", borderRadius: 20 },
  pageBtnDisabled: { backgroundColor: "#f3f4f6" },
  pageText: { fontSize: 14, fontWeight: "700", color: "#92400e" },
});