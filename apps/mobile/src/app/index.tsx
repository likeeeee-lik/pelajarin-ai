import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { adaSesi } from "@/lib/auth";
import { tema } from "@/lib/tema";

/**
 * Rute awal. Sesuai urutan referensi (docs/ss/app): pengunjung baru langsung
 * masuk wizard onboarding — akun dibuat SETELAH wizard, bukan sebelumnya.
 */
export default function Index() {
  const [tujuan, setTujuan] = useState<"/beranda" | "/onboarding" | null>(null);

  useEffect(() => {
    adaSesi().then((punya) => setTujuan(punya ? "/beranda" : "/onboarding"));
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
