import { useEffect } from "react";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setOnSesiHabis } from "@/lib/api/http";
import { tema } from "@/lib/tema";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 60_000 } },
});

export default function RootLayout() {
  // Bila refresh token ditolak (kedaluwarsa/dicabut) di request mana pun,
  // bersihkan cache lalu lempar ke layar masuk.
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
            headerShadowVisible: false,
            contentStyle: { backgroundColor: tema.bg },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="masuk" options={{ headerShown: false }} />
          <Stack.Screen name="daftar" options={{ headerShown: false }} />
          <Stack.Screen name="splash" options={{ headerShown: false, animation: "fade" }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="catatan/[id]" options={{ title: "Catatan" }} />
          <Stack.Screen name="prediksi/[id]" options={{ title: "Prediksi" }} />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
