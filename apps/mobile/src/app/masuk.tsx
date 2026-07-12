import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Field, FieldPassword, Galat, Tombol } from "@/components/ui";
import { masuk } from "@/lib/auth";
import { tema } from "@/lib/tema";

export default function MasukScreen() {
  // Datang dari layar Daftar → tampilkan konfirmasi & isi emailnya.
  const params = useLocalSearchParams<{ baru?: string; email?: string }>();
  const baruDaftar = params.baru === "1";

  const [email, setEmail] = useState(params.email ?? "");
  const [password, setPassword] = useState("");
  const [galat, setGalat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function kirim() {
    setGalat(null);
    setLoading(true);
    try {
      await masuk(email.trim(), password);
      // Splash menampilkan logo lalu menentukan tujuan (wizard / dashboard).
      router.replace("/splash");
    } catch (e) {
      setGalat(e instanceof Error ? e.message : "Gagal masuk");
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 18, flexGrow: 1, justifyContent: "center" }}>
        <View style={{ gap: 4, marginBottom: 8 }}>
          <Text style={{ color: tema.teks, fontSize: 28, fontWeight: "800" }}>Masuk</Text>
          <Text style={{ color: tema.muted, fontSize: 14 }}>Lanjutkan belajar dengan AI</Text>
        </View>

        {baruDaftar ? (
          <View style={s.sukses}>
            <Ionicons name="checkmark-circle" size={18} color="#34D399" />
            <Text style={{ color: "#34D399", flex: 1, fontSize: 13 }}>
              Akun berhasil dibuat. Masuk untuk melanjutkan.
            </Text>
          </View>
        ) : null}

        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          textContentType="emailAddress"
          placeholder="name@example.com"
        />
        <FieldPassword
          label="Password"
          value={password}
          onChangeText={setPassword}
          textContentType="password"
          placeholder="Masukkan password"
        />

        <Galat pesan={galat} />
        <Tombol judul="Masuk" onPress={kirim} loading={loading} disabled={!email || !password} />

        <Pressable onPress={() => router.push("/daftar")} style={{ alignItems: "center", paddingTop: 6 }}>
          <Text style={{ color: tema.muted, fontSize: 14 }}>
            Belum punya akun? <Text style={{ color: tema.brand, fontWeight: "700" }}>Buat akun</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = {
  sukses: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    backgroundColor: "rgba(16,185,129,0.1)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.4)",
    borderRadius: 12,
    padding: 12,
  },
};
