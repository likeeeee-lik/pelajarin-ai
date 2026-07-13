import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { adaSesi } from "@/lib/auth";
import { tema } from "@/lib/tema";

/**
 * Rute awal. Urutan referensi: AUTH DULU (Welcome → Daftar/Masuk), wizard
 * dikerjakan setelah login. Lihat docs/ai-memory/mobile-app-spec.md.
 */
export default function Index() {
  const [tujuan, setTujuan] = useState<"/beranda" | "/welcome" | null>(null);

  useEffect(() => {
    adaSesi().then((punya) => setTujuan(punya ? "/beranda" : "/welcome"));
  }, []);

  if (!tujuan) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: tema.bg }}>
        <ActivityIndicator color={tema.brand} size="large" />
      </View>
    );
  }
  return <Redirect href={tujuan} />;
}
