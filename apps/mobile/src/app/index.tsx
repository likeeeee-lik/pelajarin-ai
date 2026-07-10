import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { adaSesi } from "@/lib/auth";
import { tema } from "@/lib/tema";

/** Rute awal: arahkan ke tab bila ada sesi, atau ke masuk. */
export default function Index() {
  const [tujuan, setTujuan] = useState<"/beranda" | "/masuk" | null>(null);

  useEffect(() => {
    adaSesi().then((punya) => setTujuan(punya ? "/beranda" : "/masuk"));
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
