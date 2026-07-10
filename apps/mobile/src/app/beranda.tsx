import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { materialsApi, meApi, statsApi } from "@/lib/api/resources";
import { keluar } from "@/lib/auth";
import { tema } from "@/lib/tema";

export default function BerandaScreen() {
  const qc = useQueryClient();
  const me = useQuery({ queryKey: ["me"], queryFn: meApi.get });
  const stats = useQuery({ queryKey: ["stats"], queryFn: statsApi.get });
  const materials = useQuery({ queryKey: ["materials"], queryFn: materialsApi.list });

  async function onKeluar() {
    await keluar();
    qc.clear();
    router.replace("/masuk");
  }

  if (me.isLoading) {
    return (
      <View style={s.tengah}>
        <ActivityIndicator color={tema.brand} size="large" />
      </View>
    );
  }

  if (me.isError) {
    return (
      <View style={[s.tengah, { padding: 24, gap: 12 }]}>
        <Text style={{ color: tema.merah, textAlign: "center" }}>
          Tidak dapat terhubung ke API.{"\n"}Pastikan EXPO_PUBLIC_API_URL memakai IP jaringan
          lokal, bukan localhost.
        </Text>
        <Pressable onPress={() => me.refetch()}>
          <Text style={{ color: tema.brand, fontWeight: "700" }}>Coba lagi</Text>
        </Pressable>
      </View>
    );
  }

  const s2 = stats.data;
  const kartu = [
    { label: "Catatan", nilai: s2?.materials ?? 0 },
    { label: "Flashcard", nilai: s2?.flashcards ?? 0 },
    { label: "Kuis", nilai: s2?.quizzes ?? 0 },
    { label: "Prediksi", nilai: s2?.predictions ?? 0 },
  ];

  return (
    <FlatList
      style={{ backgroundColor: tema.bg }}
      contentContainerStyle={{ padding: 20, gap: 14 }}
      data={materials.data ?? []}
      keyExtractor={(m) => m.id}
      ListHeaderComponent={
        <View style={{ gap: 18, marginBottom: 4 }}>
          <View>
            <Text style={{ color: tema.teks, fontSize: 24, fontWeight: "800" }}>
              Halo, {me.data?.nama}!
            </Text>
            <Text style={{ color: tema.muted, fontSize: 13 }}>{me.data?.email}</Text>
          </View>

          {me.data && !me.data.emailVerified ? (
            <View style={s.peringatan}>
              <Text style={{ color: "#FCD34D", fontSize: 13 }}>
                Email belum diverifikasi. Buka aplikasi web untuk memasukkan kodenya.
              </Text>
            </View>
          ) : null}

          <View style={{ flexDirection: "row", gap: 10 }}>
            {kartu.map((k) => (
              <View key={k.label} style={s.kartu}>
                <Text style={{ color: tema.teks, fontSize: 20, fontWeight: "800" }}>{k.nilai}</Text>
                <Text style={{ color: tema.muted, fontSize: 11 }}>{k.label}</Text>
              </View>
            ))}
          </View>

          <Text style={{ color: tema.teks, fontSize: 16, fontWeight: "700", marginTop: 4 }}>Catatan</Text>
        </View>
      }
      ListEmptyComponent={
        materials.isLoading ? (
          <ActivityIndicator color={tema.brand} />
        ) : (
          <Text style={{ color: tema.muted, textAlign: "center", paddingVertical: 24 }}>
            Belum ada catatan. Buat dari aplikasi web dulu.
          </Text>
        )
      }
      renderItem={({ item }) => (
        <View style={s.baris}>
          <Text style={{ color: tema.teks, fontWeight: "600" }} numberOfLines={1}>
            {item.judul}
          </Text>
          <Text style={{ color: tema.muted, fontSize: 12 }}>
            {item.subject?.nama ?? "Tanpa kategori"} · {item._count.chapters} bab
          </Text>
        </View>
      )}
      ListFooterComponent={
        <Pressable onPress={onKeluar} style={{ paddingVertical: 24, alignItems: "center" }}>
          <Text style={{ color: tema.merah, fontWeight: "700" }}>Keluar</Text>
        </Pressable>
      }
    />
  );
}

const s = StyleSheet.create({
  tengah: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: tema.bg },
  kartu: {
    flex: 1,
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    gap: 2,
  },
  baris: {
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  peringatan: {
    backgroundColor: "rgba(245,158,11,0.1)",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.4)",
    borderRadius: 12,
    padding: 12,
  },
});
