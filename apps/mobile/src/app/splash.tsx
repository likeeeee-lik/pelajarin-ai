import { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { router, Stack } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { meApi } from "@/lib/api/resources";
import { LogoMark } from "@/components/logo";
import { tema } from "@/lib/tema";

/** Tampil minimal selama ini, supaya splash tidak berkedip. */
const MINIMAL_MS = 1400;

/**
 * Splash setelah login berhasil (ss 24). Sambil logo tampil, profil diambil
 * untuk menentukan tujuan: wizard onboarding (user baru) atau dashboard.
 */
export default function SplashScreen() {
  const qc = useQueryClient();
  const fade = useRef(new Animated.Value(0)).current;
  const skala = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(skala, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
    ]).start();

    let batal = false;
    const tunggu = new Promise((r) => setTimeout(r, MINIMAL_MS));

    (async () => {
      let tujuan: "/onboarding" | "/beranda" = "/beranda";
      try {
        const p = await meApi.get();
        qc.setQueryData(["me"], p);
        if (!p.onboardingCompleted) tujuan = "/onboarding";
      } catch {
        /* biarkan; gate di tab akan menangani */
      }
      await tunggu; // jangan lompat sebelum logo sempat terlihat
      if (!batal) router.replace(tujuan);
    })();

    return () => {
      batal = true;
    };
  }, [fade, skala, qc]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: tema.bg }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.View style={{ opacity: fade, transform: [{ scale: skala }], alignItems: "center", gap: 16 }}>
        <LogoMark size={92} color="#FFFFFF" />
        <Text style={{ color: tema.teks, fontSize: 24, fontWeight: "800", letterSpacing: -0.5 }}>
          pelajarin.ai
        </Text>
      </Animated.View>
    </View>
  );
}
