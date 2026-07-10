import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { predictionsApi } from "@/lib/api/resources";
import type { ExamPrediction, ExamType } from "@/lib/api/types";
import { Memuat, Screen, Tombol } from "@/components/ui";
import { tema } from "@/lib/tema";

const TIPE_LABEL: Record<ExamType, string> = { uts: "UTS", uas: "UAS", kuis: "Kuis", latihan: "Latihan" };

export default function UjianScreen() {
  const list = useQuery({ queryKey: ["predictions"], queryFn: predictionsApi.list });
  if (list.isLoading) return <Screen><Memuat /></Screen>;
  const items = list.data ?? [];

  return (
    <Screen>
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 90, gap: 14 }}
        data={items}
        keyExtractor={(x) => x.id}
        ListHeaderComponent={
          <View style={{ gap: 16 }}>
            <View>
              <Text style={{ color: tema.muted, fontSize: 12, letterSpacing: 1 }}>AI PREDIKSI</Text>
              <Text style={{ color: tema.teks, fontSize: 26, fontWeight: "800" }}>Prediksi Soal Ujian</Text>
              <Text style={{ color: tema.muted, marginTop: 2 }}>
                Upload soal ujian sebelumnya untuk dapat prediksi soal berikutnya
              </Text>
            </View>
            <Tombol
              judul="Buat Prediksi"
              ikonKiri={<Ionicons name="add" size={18} color="#fff" />}
              onPress={() => router.push("/buat-prediksi")}
            />
          </View>
        }
        renderItem={({ item }) => <PrediksiKartu item={item} />}
        ListEmptyComponent={
          <View style={s.empty}>
            <View style={s.emptyIkon}>
              <Ionicons name="sparkles" size={26} color={tema.brand} />
            </View>
            <Text style={{ color: tema.teks, fontWeight: "700", fontSize: 16, marginTop: 12 }}>
              Prediksi soal dengan AI
            </Text>
            <Text style={{ color: tema.muted, textAlign: "center", marginTop: 6 }}>
              Upload soal-soal ujian sebelumnya. AI akan menganalisis pola untuk memprediksi soal berikutnya.
            </Text>
          </View>
        }
      />
    </Screen>
  );
}

function PrediksiKartu({ item }: { item: ExamPrediction }) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: "/prediksi/[id]", params: { id: item.id } })}
      style={s.kartu}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={s.ikon}>
          <Ionicons name="sparkles" size={18} color={tema.brand} />
        </View>
        <View style={s.tipeBadge}>
          <Text style={{ color: tema.muted, fontSize: 11, fontWeight: "700" }}>{TIPE_LABEL[item.tipe]}</Text>
        </View>
      </View>
      <Text style={{ color: tema.teks, fontWeight: "700", marginTop: 10 }} numberOfLines={1}>
        {item.judul}
      </Text>
      <Text style={{ color: tema.muted, fontSize: 13 }}>{item.mapel ?? "Tanpa kategori"}</Text>
      <Text style={{ color: tema.muted, fontSize: 12, marginTop: 8 }}>
        {item.fileCount} file · {item.questions.length} soal
      </Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  kartu: { backgroundColor: tema.card, borderWidth: 1, borderColor: tema.border, borderRadius: 18, padding: 16 },
  ikon: {
    height: 40,
    width: 40,
    borderRadius: 12,
    backgroundColor: "rgba(249,115,22,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  tipeBadge: { borderWidth: 1, borderColor: tema.border, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  empty: {
    alignItems: "center",
    backgroundColor: "rgba(249,115,22,0.06)",
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.4)",
    borderRadius: 18,
    padding: 28,
  },
  emptyIkon: {
    height: 56,
    width: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
});
