import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Field, FieldPassword, Galat, Tombol } from "@/components/ui";
import { hapusToken } from "@/lib/api/tokens";
import { daftar } from "@/lib/auth";
import { tema } from "@/lib/tema";

export default function DaftarScreen() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [galat, setGalat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function kirim() {
    setGalat(null);
    setLoading(true);
    try {
      await daftar(nama.trim(), email.trim(), password);
      // Registrasi mengembalikan token, tapi alurnya sengaja lewat login dulu:
      // buang tokennya supaya user benar-benar masuk lewat layar Masuk.
      await hapusToken();
      router.replace({ pathname: "/masuk", params: { baru: "1", email: email.trim() } });
    } catch (e) {
      setGalat(e instanceof Error ? e.message : "Gagal mendaftar");
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 18, flexGrow: 1, justifyContent: "center" }}>
        <View style={{ gap: 4, marginBottom: 8 }}>
          <Text style={{ color: tema.teks, fontSize: 28, fontWeight: "800" }}>Buat akun</Text>
          <Text style={{ color: tema.muted, fontSize: 14 }}>Mulai belajar dengan AI</Text>
        </View>

        <Field label="Nama" value={nama} onChangeText={setNama} autoCapitalize="words" placeholder="Nama lengkap" />
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
          textContentType="newPassword"
          placeholder="Min. 8 karakter, ada huruf & angka"
        />

        <Galat pesan={galat} />
        <Tombol judul="Buat akun" onPress={kirim} loading={loading} disabled={!nama || !email || !password} />

        <Pressable onPress={() => router.back()} style={{ alignItems: "center", paddingTop: 6 }}>
          <Text style={{ color: tema.muted, fontSize: 14 }}>
            Sudah punya akun? <Text style={{ color: tema.brand, fontWeight: "700" }}>Masuk</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
