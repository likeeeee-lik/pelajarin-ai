import { Pressable, Text, View } from "react-native";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LogoMark } from "@/components/logo";
import { Screen, Tombol } from "@/components/ui";
import { tema } from "@/lib/tema";

/**
 * Welcome (ss 21) — LAYAR PERTAMA saat app dibuka tanpa sesi.
 * Urutan: Welcome → Daftar → Masuk → Splash → Wizard → Dashboard.
 *
 * Referensi menampilkan "Daftar dengan Google", tapi OAuth belum dibangun
 * (ikut hilang saat Logto dilepas). Tombol yang error saat ditekan lebih buruk
 * daripada tidak ada, jadi sengaja hanya email. TODO: tambah setelah /auth/google.
 */
export default function WelcomeScreen() {
  return (
    <Screen edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={{ flex: 1, justifyContent: "center", padding: 28, gap: 28 }}>
        <View style={{ alignItems: "center", gap: 12 }}>
          <LogoMark size={64} color="#FFFFFF" />
          <Text style={{ color: tema.teks, fontSize: 26, fontWeight: "800", letterSpacing: -0.5 }}>
            pelajarin.ai
          </Text>
        </View>

        <View style={{ alignItems: "center", gap: 4 }}>
          <Text style={{ color: tema.teks, fontSize: 19, fontWeight: "800" }}>Buat akun baru</Text>
          <Text style={{ color: tema.muted, textAlign: "center" }}>
            Mulai belajar dengan AI di Pelajarin.ai
          </Text>
        </View>

        <View style={{ gap: 14 }}>
          <Tombol
            judul="Daftar dengan Email"
            ikonKiri={<Ionicons name="mail-outline" size={18} color="#fff" />}
            onPress={() => router.push("/daftar")}
          />

          <Pressable onPress={() => router.push("/masuk")} style={{ alignItems: "center", paddingVertical: 6 }}>
            <Text style={{ color: tema.brand, fontWeight: "700" }}>Sudah punya akun? Masuk</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
