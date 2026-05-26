import React, { useEffect, useState } from "react";
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
import { BACKEND_URL, PACKAGE_CONFIG, RAZORPAY_KEY, type PackageMode } from "../constants/packages";

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ boxes: string; mode: PackageMode }>();
  const mode = (params.mode as PackageMode) || "regular";
  const selectedBoxes = params.boxes?.split(",").map(Number) || [];
  const pkg = PACKAGE_CONFIG[mode];

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [razorpayHtml, setRazorpayHtml] = useState("");
  const [orderId, setOrderId] = useState("");
  const [currentOrderData, setCurrentOrderData] = useState<any>(null);
  const [newOrderId, setNewOrderId] = useState("");
  const [backendStatus, setBackendStatus] = useState<string>("");

  const [form, setForm] = useState({
    fullName: "", email: "", mobile: "",
    houseNo: "", street: "", city: "", pincode: "",
  });

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      console.log("Checking backend health...", BACKEND_URL);
      // create AbortController manually since AbortSignal.timeout isn't available in React Native
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      let response: Response | null = null;
      try {
        response = await fetch(`${BACKEND_URL}/health`, {
          method: "GET",
          signal: controller.signal,
        });
      } catch {
        // Keep startup health probe silent to avoid noisy red-screen logs in development.
        return;
      }

      // clear timeout regardless of outcome
      clearTimeout(timeoutId);

      if (response && response.ok) {
        console.log("Backend is healthy");
        // setBackendStatus("✅ Backend connected");
      } else if (response && response.status >= 500) {
        console.log("Backend returned status:", response.status);
        // setBackendStatus(`⚠️ Backend status: ${response.status}`);
      }
    } catch (err) {
      console.log("Backend health check skipped");
      // setBackendStatus("❌ Backend connection error");
    }
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    for (const [key, val] of Object.entries(form)) {
      if (!val.trim()) {
        Alert.alert("Missing Field", `Please fill in: ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`);
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

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!RAZORPAY_KEY) {
      Alert.alert("Configuration Error", "Payment is not configured. Please contact support.");
      return;
    }
    setLoading(true);

    try {
      // Step 1: Create Razorpay order (backend doesn't have reserve endpoint)
      console.log("📍 Step 1: Creating Razorpay order...");
      const packType = mode === "regular" ? "NORMAL" : mode === "half" ? "HALF_YEAR" : "ANNUAL";

      const orderRes = await fetch(`${BACKEND_URL}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boxes: selectedBoxes, packType }),
      });

      console.log("📍 Order response status:", orderRes.status);

      let orderText = "";
      try {
        orderText = await orderRes.text();
        console.log("📍 Order response body:", orderText.substring(0, 200));
      } catch (textErr) {
        console.error("Failed to read order response as text:", textErr);
        throw new Error("⚠️ Cannot read order response. Backend may be down.");
      }

      let orderData;
      try {
        orderData = JSON.parse(orderText);
      } catch (parseErr) {
        console.error("Failed to parse order response as JSON:", parseErr);
        console.error("Response text:", orderText);
        throw new Error(`⚠️ Backend returned invalid response. Status: ${orderRes.status}\n\nResponse: ${orderText.substring(0, 100)}`);
      }

      if (!orderRes.ok) {
        const errorMsg = orderData.error || orderData.message || "Order creation failed";
        console.error("Order creation failed:", errorMsg);
        Alert.alert("❌ Order Failed", errorMsg);
        setLoading(false);
        return;
      }

      console.log("✅ Order created successfully:", orderData);

      const generatedOrderId = "DSP" + Date.now().toString().slice(-8);

      setCurrentOrderData(orderData);
      setNewOrderId(generatedOrderId);
      setOrderId(generatedOrderId);

      // Step 2: Build Razorpay HTML and show WebView
      console.log("📍 Step 2: Building Razorpay HTML...");
      const html = buildRazorpayHTML(orderData, generatedOrderId, pkg, form);
      setRazorpayHtml(html);
      setShowWebView(true);
      setLoading(false);

    } catch (err: any) {
      console.error("❌ Payment error:", err);
      Alert.alert("❌ Error", err.message || "Something went wrong");
      setLoading(false);
    }
  };

  // ── Build Razorpay HTML Page ──
  const buildRazorpayHTML = (orderData: any, genOrderId: string, pkg: any, form: any) => {
    const escape = (val: any) => {
      if (!val) return "";
      const str = String(val);
      // Only escape for string context, not for JSON
      return str
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");
    };

    const razorpayKey = escape(RAZORPAY_KEY);
    const orderId = escape(orderData?.id || "");
    const amount = parseInt(String(orderData?.amount || 0)) || 0;
    const description = escape(`${pkg?.label || "Package"} - ${pkg?.soaps || 0} Soaps`);
    const nameVal = escape(form?.fullName || "");
    const emailVal = escape(form?.email || "");
    const contactVal = escape(form?.mobile || "");

    return `

<!DOCTYPE html>
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
    var scriptLoaded = false;

    function sendMessage(type, data) {
      try {
        if (typeof window.ReactNativeWebView !== 'undefined' && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: type,
            ...data
          }));
        } else {
          console.error('ReactNativeWebView not available');
        }
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }

    function handleScriptLoad() {
      scriptLoaded = true;
      initRazorpay();
    }

    function handleScriptError() {
      console.error('Razorpay script failed to load');
      document.getElementById("msg").innerHTML = '<span class="error">⚠️ Payment system failed to load</span>';
      setTimeout(() => {
        sendMessage('PAYMENT_FAILED', { error: 'Razorpay script failed to load. Please check your internet connection.' });
      }, 1000);
    }

    function initRazorpay() {
      if (typeof Razorpay === 'undefined') {
        if (retryCount < maxRetries) {
          retryCount++;
          console.log('Razorpay not loaded yet, retrying... (' + retryCount + '/' + maxRetries + ')');
          setTimeout(initRazorpay, 500);
          return;
        }
        console.error('Razorpay failed to load after max retries');
        document.getElementById("msg").innerHTML = '<span class="error">Payment system not available. Please try again.</span>';
        setTimeout(() => {
          sendMessage('PAYMENT_FAILED', { error: 'Payment system not available. Please try again later.' });
        }, 2000);
        return;
      }

      try {
        var options = {
          key: "${razorpayKey}",
          amount: ${amount},
          currency: "INR",
          order_id: "${orderId}",
          name: "Diya Soaps",
          description: "${description}",
          prefill: {
            name: "${nameVal}",
            email: "${emailVal}",
            contact: "${contactVal}"
          },
          theme: { 
            color: "#d97706",
            backdrop: true
          },
          handler: function(response) {
            console.log('Payment success:', response);
            sendMessage('PAYMENT_SUCCESS', {
              razorpay_order_id: response.razorpay_order_id || "",
              razorpay_payment_id: response.razorpay_payment_id || "",
              razorpay_signature: response.razorpay_signature || ""
            });
          },
          modal: {
            ondismiss: function() {
              console.log('Payment modal dismissed');
              sendMessage('PAYMENT_CANCELLED', {});
            }
          }
        };

        var rzp = new Razorpay(options);
        
        rzp.on("payment.failed", function(response) {
          console.error('Payment failed:', response);
          var errorMsg = response?.error?.description || 'Payment failed. Please try again.';
          sendMessage('PAYMENT_FAILED', { error: errorMsg });
        });

        rzp.on("payment.authorize", function(response) {
          console.log('Payment authorized:', response);
        });

        console.log('Opening Razorpay checkout');
        rzp.open();
        document.getElementById("msg").innerText = "Completing your payment...";
      } catch (err) {
        console.error('Error initializing Razorpay:', err);
        sendMessage('PAYMENT_FAILED', { error: 'Error initializing payment: ' + (err?.message || 'Unknown error') });
      }
    }

    // Monitor script loading
    var scriptTag = document.querySelector('script[src*="checkout.razorpay"]');
    if (scriptTag) {
      scriptTag.onload = handleScriptLoad;
      scriptTag.onerror = handleScriptError;
    }

    // Try to init on document load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initRazorpay);
    } else {
      setTimeout(initRazorpay, 100);
    }

    // Additional fallback timeout
    setTimeout(function() {
      if (!scriptLoaded && retryCount >= maxRetries) {
        handleScriptError();
      }
    }, 8000);
  </script>
</body>
</html>`;
  };

  // ── Handle messages from WebView ──
  const handleWebViewMessage = async (event: any) => {
    try {
      let data;
      try {
        data = JSON.parse(event.nativeEvent.data);
      } catch (parseErr) {
        console.error("Failed to parse WebView message:", event.nativeEvent.data);
        Alert.alert("Error", "Failed to process payment response");
        return;
      }

      console.log("WebView message received:", data.type);

      if (data.type === "PAYMENT_CANCELLED") {
        setShowWebView(false);
        Alert.alert("❌ Cancelled", "Payment was cancelled. You can try again whenever you're ready.");
        return;
      }

      if (data.type === "PAYMENT_FAILED") {
        setShowWebView(false);
        const errorMsg = data.error || "Payment failed. Please try again or use another payment method.";
        Alert.alert("❌ Payment Failed", errorMsg);
        return;
      }

      if (data.type === "PAYMENT_SUCCESS") {
        setShowWebView(false);

        // Validate response data
        if (!data.razorpay_order_id || !data.razorpay_payment_id) {
          Alert.alert("⚠️ Incomplete Response", "Payment data incomplete. Please contact support.");
          return;
        }

        setLoading(true);

        // Step 3: Verify payment with backend
        try {
          const packType = mode === "regular" ? "NORMAL" : mode === "half" ? "HALF_YEAR" : "ANNUAL";

          const verifyRes = await fetch(`${BACKEND_URL}/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: data.razorpay_order_id,
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_signature: data.razorpay_signature || "",
              boxes: selectedBoxes,
              packType: packType,
              fullName: form.fullName,
              email: form.email,
              mobile: form.mobile,
              houseNo: form.houseNo,
              street: form.street,
              city: form.city,
              pincode: form.pincode,
              orderId: newOrderId,
            }),
          });

          let verifyData;
          try {
            verifyData = await verifyRes.json();
          } catch (parseErr) {
            throw new Error("Backend returned invalid response");
          }

          setLoading(false);

          if (verifyRes.ok && verifyData.success) {
            console.log("Payment verified successfully");
            setSuccess(true);
          } else {
            const errorMsg = verifyData.message || verifyData.error || "Verification failed";
            console.error("Payment verification failed:", errorMsg);
            Alert.alert(
              "⚠️ Verification Issue",
              `Payment received but verification failed: ${errorMsg}\n\nOrder ID: ${newOrderId}\n\nPlease contact support.`
            );
          }
        } catch (verifyErr: any) {
          setLoading(false);
          console.error("Verification error:", verifyErr);
          Alert.alert(
            "⚠️ Network Error",
            `Payment done but couldn't verify: ${verifyErr.message}\n\nOrder ID: ${newOrderId}\n\nPlease contact support with this ID.`
          );
        }
      }
    } catch (err: any) {
      setShowWebView(false);
      setLoading(false);
      console.error("WebView message handler error:", err);
      Alert.alert("❌ Error", `Something went wrong: ${err.message || "Unknown error"}`);
    }
  };

  // ── SUCCESS SCREEN ──
  if (success) {
    return (
      <View style={styles.successContainer}>
        <LinearGradient colors={["#d1fae5", "#fff"]} style={StyleSheet.absoluteFill} />
        <Ionicons name="checkmark-circle" size={80} color="#16a34a" />
        <Text style={styles.successTitle}>🎉 Booking Confirmed!</Text>
        <Text style={styles.successSub}>Your payment was successful</Text>

        <View style={styles.successCard}>
          <Row label="Order ID" value={orderId} />
          <Row label="Package" value={pkg.label} />
          <Row label="No. of Soaps" value={`${pkg.soaps} soaps`} />
          <Row label="Box(es)" value={selectedBoxes.join(", ")} />
          <Row label="Amount Paid" value={`₹${pkg.price}`} />
          <View style={styles.divider} />
          <Text style={styles.addressLabel}>📍 Delivery Address</Text>
          <Text style={styles.addressText}>{form.houseNo}, {form.street}</Text>
          <Text style={styles.addressText}>{form.city} - {form.pincode}</Text>
        </View>

        <Text style={styles.emailNote}>📧 Confirmation email sent to {form.email}</Text>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => router.replace("/(tabs)/shop")}
        >
          <Text style={styles.homeBtnText}>Back to Shop</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── RAZORPAY WEBVIEW MODAL ──
  if (showWebView) {
    return (
      <Modal visible animationType="slide" onRequestClose={() => setShowWebView(false)}>
        <View style={{ flex: 1, backgroundColor: "#1a1a1a" }}>
          <View style={styles.webviewHeader}>
            <TouchableOpacity onPress={() => setShowWebView(false)} style={styles.webviewClose}>
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.webviewTitle}>Secure Payment — ₹{pkg.price}</Text>
            <View style={{ width: 36 }} />
          </View>
          <WebView
            source={{ html: razorpayHtml }}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            originWhitelist={[
              "about:blank",
              "https://checkout.razorpay.com",
              "https://*.razorpay.com",
              "https://*.razorpay.io",
            ]}
            mixedContentMode="never"
            javaScriptCanOpenWindowsAutomatically={true}
            setSupportMultipleWindows={true}
            useWebKit={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            scrollEnabled={true}
            allowFileAccessFromFileURLs={false}
            allowUniversalAccessFromFileURLs={false}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error("WebView error:", nativeEvent);
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error("WebView HTTP error:", nativeEvent);
            }}
            onShouldStartLoadWithRequest={(event) => {
              const { url } = event;

              // Allow Razorpay domains
              if (
                url.includes("razorpay.com") ||
                url.includes("razorpay.io") ||
                url.includes("checkout.razorpay")
              ) {
                return true;
              }

              // Handle UPI and intent URLs
              if (
                url.startsWith("upi://") ||
                url.startsWith("intent://") ||
                url.startsWith("tel:") ||
                url.startsWith("smsto:")
              ) {
                Linking.openURL(url).catch((err) => {
                  console.error("Error opening URL:", url, err);
                });
                return false;
              }

              // Allow data URIs
              if (url.startsWith("data:") || url.startsWith("about:")) {
                return true;
              }

              console.log("Blocking URL:", url);
              return false;
            }}
          />
        </View>
      </Modal>
    );
  }

  // ── FORM ──
  const fields = [
    { key: "fullName", label: "Full Name", placeholder: "Enter your full name", keyboard: "default" },
    { key: "email", label: "Email Address", placeholder: "Enter your email", keyboard: "email-address" },
    { key: "mobile", label: "Mobile Number", placeholder: "10-digit mobile number", keyboard: "phone-pad" },
    { key: "houseNo", label: "House / Flat No.", placeholder: "House number or flat", keyboard: "default" },
    { key: "street", label: "Street / Area", placeholder: "Street or area name", keyboard: "default" },
    { key: "city", label: "City", placeholder: "Your city", keyboard: "default" },
    { key: "pincode", label: "Pincode", placeholder: "6-digit pincode", keyboard: "numeric" },
  ];

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <LinearGradient colors={["#1a1a1a", "#2d2d2d"]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#f5c518" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complete Order</Text>
        <View style={{ width: 38 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        {/* ORDER SUMMARY */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📦 Order Summary</Text>
          <Row label="Package" value={pkg.label} />
          <Row label="Soaps" value={`${pkg.soaps} soaps`} />
          <Row label="Boxes" value={selectedBoxes.join(", ")} />
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalVal}>₹{pkg.price}</Text>
          </View>
        </View>

        {/* FORM FIELDS */}
        <Text style={styles.formTitle}>📝 Your Details</Text>
        {fields.map((f) => (
          <View key={f.key} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{f.label}</Text>
            <TextInput
              style={styles.input}
              placeholder={f.placeholder}
              placeholderTextColor="#9ca3af"
              keyboardType={f.keyboard as any}
              value={(form as any)[f.key]}
              onChangeText={(v) => update(f.key, v)}
              autoCapitalize={f.keyboard === "email-address" ? "none" : "words"}
            />
          </View>
        ))}

        {/* DEBUG INFO */}
        {backendStatus && (
          <View style={[styles.debugInfo, backendStatus.includes("❌") ? styles.debugError : backendStatus.includes("⚠️") ? styles.debugWarning : styles.debugSuccess]}>
            <Text style={styles.debugText}>{backendStatus}</Text>
            {backendStatus.includes("error") && (
              <Text style={styles.debugSmallText}>Backend URL: {BACKEND_URL}</Text>
            )}
          </View>
        )}

        {/* PAY BUTTON */}
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
              <Text style={styles.payBtnText}>Pay ₹{pkg.price} Securely</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.secureNote}>
          🔒 Secured by Razorpay • UPI, Cards, Net Banking, Wallets
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
  container: { flex: 1, backgroundColor: "#fffbeb" },
  header: { paddingTop: 50, paddingBottom: 14, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { padding: 6, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 20 },
  headerTitle: { color: "#f5c518", fontSize: 18, fontWeight: "800" },
  scrollContent: { padding: 16, paddingBottom: 40 },

  summaryCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1.5, borderColor: "#fde68a" },
  summaryTitle: { fontSize: 16, fontWeight: "800", color: "#92400e", marginBottom: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  summaryLabel: { fontSize: 13, color: "#6b7280" },
  summaryVal: { fontSize: 13, fontWeight: "600", color: "#374151" },
  totalRow: { borderTopWidth: 1, borderTopColor: "#fde68a", paddingTop: 8, marginTop: 4 },
  totalLabel: { fontSize: 15, fontWeight: "800", color: "#1a1a1a" },
  totalVal: { fontSize: 20, fontWeight: "900", color: "#d97706" },

  formTitle: { fontSize: 16, fontWeight: "800", color: "#92400e", marginBottom: 12 },
  inputGroup: { marginBottom: 12 },
  inputLabel: { fontSize: 12, fontWeight: "700", color: "#374151", marginBottom: 4 },
  input: { backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#fde68a", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: "#1a1a1a" },

  // Debug info
  debugInfo: { borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1 },
  debugSuccess: { backgroundColor: "#f0fdf4", borderColor: "#86efac" },
  debugWarning: { backgroundColor: "#fffbeb", borderColor: "#fbbf24" },
  debugError: { backgroundColor: "#fee2e2", borderColor: "#fca5a5" },
  debugText: { fontSize: 12, fontWeight: "600", color: "#374151" },
  debugSmallText: { fontSize: 10, color: "#6b7280", marginTop: 4, fontFamily: "monospace" },

  payBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#d97706", paddingVertical: 16, borderRadius: 16, marginTop: 8, shadowColor: "#d97706", shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 },
  payBtnDisabled: { opacity: 0.6 },
  payBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  secureNote: { textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 10, marginBottom: 20 },

  // WebView modal header
  webviewHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12, backgroundColor: "#1a1a1a" },
  webviewClose: { padding: 6, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 20 },
  webviewTitle: { color: "#f5c518", fontSize: 15, fontWeight: "700" },

  // Success
  successContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  successTitle: { fontSize: 26, fontWeight: "900", color: "#16a34a", marginTop: 16, marginBottom: 8 },
  successSub: { fontSize: 14, color: "#6b7280", marginBottom: 24 },
  successCard: { backgroundColor: "#fff", borderRadius: 16, padding: 20, width: "100%", borderWidth: 1, borderColor: "#d1fae5", marginBottom: 16 },
  divider: { height: 1, backgroundColor: "#e5e7eb", marginVertical: 10 },
  addressLabel: { fontSize: 13, fontWeight: "700", color: "#374151", marginBottom: 6 },
  addressText: { fontSize: 13, color: "#6b7280" },
  emailNote: { fontSize: 12, color: "#6b7280", marginBottom: 24, textAlign: "center" },
  homeBtn: { backgroundColor: "#d97706", paddingHorizontal: 32, paddingVertical: 14, borderRadius: 25 },
  homeBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});