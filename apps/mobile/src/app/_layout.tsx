import { useEffect, useState } from "react";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setOnSesiHabis } from "@/lib/api/http";
import { adaSesi } from "@/lib/auth";
import { tema } from "@/lib/tema";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 60_000 } },
});

export default function RootLayout() {
  const [siap, setSiap] = useState(false);

  // Rute awal ditentukan dari ada/tidaknya token tersimpan.
  useEffect(() => {
    adaSesi().then((punya) => {
      router.replace(punya ? "/beranda" : "/masuk");
      setSiap(true);
    });
  }, []);

  // Bila refresh token ditolak (kedaluwarsa/dicabut), lempar ke layar masuk.
  useEffect(() => {
    setOnSesiHabis(() => {
      queryClient.clear();
      router.replace("/masuk");
    });
    return () => setOnSesiHabis(null);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: tema.bg },
            headerTintColor: tema.teks,
            contentStyle: { backgroundColor: tema.bg },
            animation: siap ? "default" : "none",
          }}
        >
          <Stack.Screen name="masuk" options={{ title: "Masuk" }} />
          <Stack.Screen name="daftar" options={{ title: "Buat akun" }} />
          <Stack.Screen name="beranda" options={{ title: "Pelajarin.ai" }} />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
