import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="register" options={{ presentation: "modal" }} />
        <Stack.Screen name="privacy" options={{ headerShown: true, title: "Privacy Policy" }} />
        <Stack.Screen name="terms" options={{ headerShown: true, title: "Terms & Conditions" }} />
        <Stack.Screen name="refund" options={{ headerShown: true, title: "Refund Policy" }} />
        <Stack.Screen name="shipping" options={{ headerShown: true, title: "Shipping Policy" }} />
      </Stack>
    </>
  );
}
