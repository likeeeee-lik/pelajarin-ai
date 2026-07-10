import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Field, Galat, Tombol } from "@/components/ui";
import { masuk } from "@/lib/auth";
import { tema } from "@/lib/tema";

export default function MasukScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [galat, setGalat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function kirim() {
    setGalat(null);
    setLoading(true);
    try {
      await masuk(email.trim(), password);
      router.replace("/beranda");
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

        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          textContentType="emailAddress"
          placeholder="name@example.com"
        />
        <Field
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
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
