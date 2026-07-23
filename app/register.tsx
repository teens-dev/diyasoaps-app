import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import {
  BACKEND_URL,
  RAZORPAY_KEY,
  getPackageDetails,
  formatPrice,
  type PackType,
} from "../constants/packages";

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ packType: string; qty: string }>();
  const packType = (params.packType as PackType) || "NORMAL";
  const qty = Math.max(1, parseInt(params.qty || "1", 10) || 1);
  const pkg = getPackageDetails(qty, packType);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [razorpayHtml, setRazorpayHtml] = useState("");
  const [orderId, setOrderId] = useState("");
  const [newOrderId, setNewOrderId] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    houseNo: "",
    street: "",
    city: "",
    pincode: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    for (const [key, val] of Object.entries(form)) {
      if (!val.trim()) {
        Alert.alert(
          "Missing Field",
          `Please fill in: ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`
        );
        return false;
      }
    }
    if (form.mobile.length !== 10) {
      Alert.alert("Invalid Mobile", "Enter a 10-digit mobile number");
      return false;
    }
    if (form.pincode.length !== 6) {
      Alert.alert("Invalid Pincode", "Enter a 6-digit pincode");
      return false;
    }
    return true;
  };

  const buildCustomerPayload = () => ({
    customer: {
      name: form.fullName,
      phone: form.mobile,
      email: form.email,
      houseNo: form.houseNo,
      street: form.street,
      city: form.city,
      pincode: form.pincode,
    },
    fullName: form.fullName,
    email: form.email,
    mobile: form.mobile,
    houseNo: form.houseNo,
    street: form.street,
    city: form.city,
    pincode: form.pincode,
  });

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!RAZORPAY_KEY) {
      Alert.alert("Configuration Error", "Payment is not configured. Please contact support.");
      return;
    }
    setLoading(true);

    try {
      const orderRes = await fetch(`${BACKEND_URL}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qty,
          packType,
          ...buildCustomerPayload(),
        }),
      });

      const orderText = await orderRes.text();
      let orderData;
      try {
        orderData = JSON.parse(orderText);
      } catch {
        throw new Error("Unable to process order. Please try again.");
      }

      if (!orderRes.ok) {
        const errorMsg = orderData.message || orderData.error || "Order creation failed";
        Alert.alert("Order Failed", errorMsg);
        setLoading(false);
        return;
      }

      const generatedOrderId = "DSP" + Date.now().toString().slice(-8);
      setNewOrderId(generatedOrderId);
      setOrderId(generatedOrderId);

      const html = buildRazorpayHTML(orderData, form);
      setRazorpayHtml(html);
      setShowWebView(true);
      setLoading(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      Alert.alert("Error", message);
      setLoading(false);
    }
  };

  const buildRazorpayHTML = (orderData: { id?: string; amount?: number }, formData: typeof form) => {
    const escape = (val: string) =>
      String(val || "")
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");

    const razorpayKey = escape(RAZORPAY_KEY);
    const razorpayOrderId = escape(orderData?.id || "");
    const amount = parseInt(String(orderData?.amount || 0), 10) || 0;
    const description = escape(`${pkg.label} — ${pkg.isKit ? `${qty} kit(s)` : `${pkg.soaps} soaps`}`);
    const nameVal = escape(formData.fullName);
    const emailVal = escape(formData.email);
    const contactVal = escape(formData.mobile);

    return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta charset="UTF-8">
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <style>
    body { margin: 0; background: #1a1a1a; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; }
    .container { text-align: center; color: #fff; }
    .msg { color: #f5c518; font-size: 16px; padding: 20px; }
    .error { color: #ff6b6b; }
    .spinner { display: inline-block; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="container">
    <div class="msg" id="msg"><span class="spinner">⏳</span> Opening secure payment...</div>
  </div>
  <script>
    var retryCount = 0;
    var maxRetries = 5;

    function sendMessage(type, data) {
      try {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, ...data }));
        }
      } catch (err) {}
    }

    function initRazorpay() {
      if (typeof Razorpay === 'undefined') {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(initRazorpay, 500);
          return;
        }
        document.getElementById("msg").innerHTML = '<span class="error">Payment system not available. Please try again.</span>';
        setTimeout(function() { sendMessage('PAYMENT_FAILED', { error: 'Payment system not available.' }); }, 2000);
        return;
      }

      try {
        var rzp = new Razorpay({
          key: "${razorpayKey}",
          amount: ${amount},
          currency: "INR",
          order_id: "${razorpayOrderId}",
          name: "Diya Soaps",
          description: "${description}",
          prefill: { name: "${nameVal}", email: "${emailVal}", contact: "${contactVal}" },
          theme: { color: "#d97706", backdrop: true },
          handler: function(response) {
            sendMessage('PAYMENT_SUCCESS', {
              razorpay_order_id: response.razorpay_order_id || "",
              razorpay_payment_id: response.razorpay_payment_id || "",
              razorpay_signature: response.razorpay_signature || ""
            });
          },
          modal: {
            ondismiss: function() { sendMessage('PAYMENT_CANCELLED', {}); }
          }
        });

        rzp.on("payment.failed", function(response) {
          sendMessage('PAYMENT_FAILED', { error: response?.error?.description || 'Payment failed.' });
        });

        rzp.open();
        document.getElementById("msg").innerText = "Completing your payment...";
      } catch (err) {
        sendMessage('PAYMENT_FAILED', { error: 'Error initializing payment.' });
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initRazorpay);
    } else {
      setTimeout(initRazorpay, 100);
    }
  </script>
</body>
</html>`;
  };

  const handleWebViewMessage = async (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === "PAYMENT_CANCELLED") {
        setShowWebView(false);
        Alert.alert("Cancelled", "Payment was cancelled. You can try again whenever you're ready.");
        return;
      }

      if (data.type === "PAYMENT_FAILED") {
        setShowWebView(false);
        Alert.alert("Payment Failed", data.error || "Payment failed. Please try again.");
        return;
      }

      if (data.type === "PAYMENT_SUCCESS") {
        setShowWebView(false);

        if (!data.razorpay_payment_id) {
          Alert.alert("Incomplete Response", "Payment data incomplete. Please contact support.");
          return;
        }

        setLoading(true);

        try {
          const verifyRes = await fetch(`${BACKEND_URL}/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: data.razorpay_order_id,
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_signature: data.razorpay_signature || "",
              qty,
              packType,
              ...buildCustomerPayload(),
              orderId: newOrderId,
            }),
          });

          let verifyData;
          try {
            verifyData = await verifyRes.json();
          } catch {
            throw new Error("Backend returned invalid response");
          }

          setLoading(false);

          if (verifyRes.ok && verifyData.success) {
            setSuccess(true);
          } else {
            const errorMsg = verifyData.message || verifyData.error || "Verification failed";
            Alert.alert(
              "Verification Issue",
              `Payment received but verification failed: ${errorMsg}\n\nOrder ID: ${newOrderId}\n\nPlease contact support.`
            );
          }
        } catch (verifyErr: unknown) {
          setLoading(false);
          const message = verifyErr instanceof Error ? verifyErr.message : "Network error";
          Alert.alert(
            "Network Error",
            `Payment done but couldn't verify: ${message}\n\nOrder ID: ${newOrderId}\n\nPlease contact support with this ID.`
          );
        }
      }
    } catch {
      setShowWebView(false);
      setLoading(false);
      Alert.alert("Error", "Something went wrong processing your payment.");
    }
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <LinearGradient colors={["#d1fae5", "#fff"]} style={StyleSheet.absoluteFill} />
        <Ionicons name="checkmark-circle" size={80} color="#16a34a" />
        <Text style={styles.successTitle}>Order Confirmed!</Text>
        <Text style={styles.successSub}>Your payment was successful</Text>

        <View style={styles.successCard}>
          <Row label="Order ID" value={orderId} />
          <Row label="Package" value={pkg.label} />
          <Row
            label={pkg.isKit ? "Quantity" : "No. of Soaps"}
            value={pkg.isKit ? `${qty} kit(s)` : `${pkg.soaps} soaps`}
          />
          <Row label="Amount Paid" value={formatPrice(pkg.price)} />
          {pkg.savings > 0 && <Row label="You Saved" value={formatPrice(pkg.savings)} />}
          <View style={styles.divider} />
          <Text style={styles.addressLabel}>Delivery Address</Text>
          <Text style={styles.addressText}>
            {form.houseNo}, {form.street}
          </Text>
          <Text style={styles.addressText}>
            {form.city} - {form.pincode}
          </Text>
        </View>

        <Text style={styles.emailNote}>Confirmation email sent to {form.email}</Text>

        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace("/(tabs)/shop")}>
          <Text style={styles.homeBtnText}>Back to Shop</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showWebView) {
    return (
      <Modal visible animationType="slide" onRequestClose={() => setShowWebView(false)}>
        <View style={{ flex: 1, backgroundColor: "#1a1a1a" }}>
          <View style={styles.webviewHeader}>
            <TouchableOpacity onPress={() => setShowWebView(false)} style={styles.webviewClose}>
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.webviewTitle}>Secure Payment — {formatPrice(pkg.price)}</Text>
            <View style={{ width: 36 }} />
          </View>
          <WebView
            source={{ html: razorpayHtml }}
            onMessage={handleWebViewMessage}
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={[
              "about:blank",
              "https://checkout.razorpay.com",
              "https://*.razorpay.com",
              "https://*.razorpay.io",
            ]}
            mixedContentMode="never"
            javaScriptCanOpenWindowsAutomatically
            setSupportMultipleWindows
            useWebKit
            startInLoadingState
            onShouldStartLoadWithRequest={(event) => {
              const { url } = event;
              if (
                url.includes("razorpay.com") ||
                url.includes("razorpay.io") ||
                url.includes("checkout.razorpay")
              ) {
                return true;
              }
              if (
                url.startsWith("upi://") ||
                url.startsWith("intent://") ||
                url.startsWith("tel:") ||
                url.startsWith("smsto:")
              ) {
                Linking.openURL(url).catch(() => {});
                return false;
              }
              if (url.startsWith("data:") || url.startsWith("about:")) {
                return true;
              }
              return false;
            }}
          />
        </View>
      </Modal>
    );
  }

  const fields = [
    { key: "fullName", label: "Full Name", placeholder: "Enter your full name", keyboard: "default" },
    { key: "email", label: "Email Address", placeholder: "Enter your email", keyboard: "email-address" },
    { key: "mobile", label: "Mobile Number", placeholder: "10-digit mobile number", keyboard: "phone-pad" },
    { key: "houseNo", label: "House / Door No.", placeholder: "House number or flat", keyboard: "default" },
    { key: "street", label: "Street / Area", placeholder: "Street or area name", keyboard: "default" },
    { key: "city", label: "City", placeholder: "Your city", keyboard: "default" },
    { key: "pincode", label: "Pincode", placeholder: "6-digit pincode", keyboard: "numeric" },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#1a1a1a", "#2d2d2d"]} style={styles.header}>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.push("/(tabs)"))}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#f5c518" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complete Order</Text>
        <View style={{ width: 38 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <Row label="Package" value={pkg.label} />
          <Row
            label={pkg.isKit ? "Quantity" : "Soaps"}
            value={pkg.isKit ? `${qty} kit(s)` : `${pkg.soaps} soaps`}
          />
          {pkg.mrp && <Row label="MRP" value={formatPrice(pkg.mrp)} />}
          {pkg.savings > 0 && <Row label="Savings" value={formatPrice(pkg.savings)} />}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalVal}>{formatPrice(pkg.price)}</Text>
          </View>
        </View>

        <Text style={styles.formTitle}>Your Details</Text>
        {fields.map((f) => (
          <View key={f.key} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{f.label}</Text>
            <TextInput
              style={styles.input}
              placeholder={f.placeholder}
              placeholderTextColor="#9ca3af"
              keyboardType={f.keyboard as "default" | "email-address" | "phone-pad" | "numeric"}
              value={form[f.key as keyof typeof form]}
              onChangeText={(v) => update(f.key, v)}
              autoCapitalize={f.keyboard === "email-address" ? "none" : "words"}
            />
          </View>
        ))}

        <TouchableOpacity
          style={[styles.payBtn, loading && styles.payBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="lock-closed" size={18} color="#fff" />
              <Text style={styles.payBtnText}>Pay {formatPrice(pkg.price)} Securely</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.secureNote}>
          Secured by Razorpay • UPI, Cards, Net Banking, Wallets
        </Text>
      </ScrollView>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryVal}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF4EE" },
  header: {
    paddingTop: 50,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1F1B18",
  },
  backBtn: { padding: 6, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 20 },
  headerTitle: { color: "#FAF4EE", fontSize: 18, fontWeight: "700" },
  scrollContent: { padding: 16, paddingBottom: 40 },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EAE2D8",
  },
  summaryTitle: { fontSize: 16, fontWeight: "700", color: "#1F1B18", marginBottom: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  summaryLabel: { fontSize: 13, color: "#8C7D73" },
  summaryVal: { fontSize: 13, fontWeight: "600", color: "#1F1B18" },
  totalRow: { borderTopWidth: 1, borderTopColor: "#EAE2D8", paddingTop: 8, marginTop: 4 },
  totalLabel: { fontSize: 15, fontWeight: "800", color: "#1F1B18" },
  totalVal: { fontSize: 20, fontWeight: "900", color: "#1F1B18" },

  formTitle: { fontSize: 16, fontWeight: "700", color: "#1F1B18", marginBottom: 12 },
  inputGroup: { marginBottom: 12 },
  inputLabel: { fontSize: 12, fontWeight: "600", color: "#4A4543", marginBottom: 4 },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EAE2D8",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1F1B18",
  },

  payBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#231F20",
    paddingVertical: 16,
    borderRadius: 25,
    marginTop: 8,
    elevation: 3,
  },
  payBtnDisabled: { opacity: 0.6 },
  payBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  secureNote: { textAlign: "center", fontSize: 12, color: "#8C7D73", marginTop: 10, marginBottom: 20 },

  webviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#1F1B18",
  },
  webviewClose: { padding: 6, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 20 },
  webviewTitle: { color: "#FAF4EE", fontSize: 15, fontWeight: "700" },

  successContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#FAF4EE" },
  successTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#2D7D46",
    marginTop: 16,
    marginBottom: 8,
  },
  successSub: { fontSize: 14, color: "#8C7D73", marginBottom: 24 },
  successCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: "#EAE2D8",
    marginBottom: 16,
  },
  divider: { height: 1, backgroundColor: "#EAE2D8", marginVertical: 10 },
  addressLabel: { fontSize: 13, fontWeight: "700", color: "#1F1B18", marginBottom: 6 },
  addressText: { fontSize: 13, color: "#4A4543" },
  emailNote: { fontSize: 12, color: "#8C7D73", marginBottom: 24, textAlign: "center" },
  homeBtn: { backgroundColor: "#231F20", paddingHorizontal: 32, paddingVertical: 14, borderRadius: 25 },
  homeBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
});
