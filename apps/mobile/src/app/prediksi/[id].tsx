import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { predictionsApi } from "@/lib/api/resources";
import type { Tingkat } from "@/lib/api/types";
import { Memuat, Screen } from "@/components/ui";
import { tema } from "@/lib/tema";

const KES_LABEL: Record<Tingkat, string> = { mudah: "Mudah", sedang: "Sedang", sulit: "Sulit" };
const KES_WARNA: Record<Tingkat, { fg: string; bg: string }> = {
  mudah: { fg: "#34D399", bg: "rgba(16,185,129,0.15)" },
  sedang: { fg: "#FACC15", bg: "rgba(234,179,8,0.15)" },
  sulit: { fg: "#FB7185", bg: "rgba(244,63,94,0.15)" },
};
const norm = (x: string) => x.trim().toLowerCase();

export default function PrediksiDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const q = useQuery({ queryKey: ["prediction", id], queryFn: () => predictionsApi.get(id), enabled: !!id });
  const [jawaban, setJawaban] = useState<Record<number, string>>({});

  if (q.isLoading) return <Screen><Memuat /></Screen>;
  const item = q.data;
  if (!item) {
    return (
      <Screen>
        <Stack.Screen options={{ title: "Prediksi" }} />
        <View style={{ padding: 24 }}>
          <Text style={{ color: tema.teks, fontWeight: "700", fontSize: 18 }}>Prediksi tidak ditemukan</Text>
        </View>
      </Screen>
    );
  }

  const dijawab = Object.keys(jawaban).length;
  const benar = item.questions.reduce(
    (s, qq, i) => (jawaban[i] && qq.jawaban && norm(jawaban[i]) === norm(qq.jawaban) ? s + 1 : s),
    0,
  );

  return (
    <Screen>
      <Stack.Screen options={{ title: item.judul }} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 32 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {item.mapel ? <Meta ikon="book-outline" teks={item.mapel} /> : null}
          <Meta ikon="document-text-outline" teks={`${item.fileCount} soal sumber`} />
          <View style={s.selesai}>
            <Ionicons name="checkmark-circle" size={13} color="#34D399" />
            <Text style={{ color: "#34D399", fontSize: 12, fontWeight: "700" }}>Selesai</Text>
          </View>
        </View>

        {dijawab > 0 ? (
          <View style={s.skor}>
            <Text style={{ color: tema.brand, fontWeight: "800" }}>
              Benar {benar} dari {dijawab} dijawab
            </Text>
            <Pressable onPress={() => setJawaban({})} hitSlop={8}>
              <Text style={{ color: tema.muted, fontWeight: "700" }}>Ulangi</Text>
            </Pressable>
          </View>
        ) : (
          <Text style={{ color: tema.muted }}>Pilih salah satu jawaban untuk melihat apakah kamu benar.</Text>
        )}

        {item.questions.map((qq, idx) => {
          const dipilih = jawaban[idx];
          const sudah = dipilih !== undefined;
          const punyaOpsi = !!qq.opsi?.length;
          const benarSoal = sudah && qq.jawaban && norm(dipilih) === norm(qq.jawaban);
          const kes = KES_WARNA[qq.tingkat];
          return (
            <View key={idx} style={s.kartu}>
              <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <View style={s.nomor}>
                  <Text style={{ color: tema.brand, fontWeight: "800" }}>{idx + 1}</Text>
                </View>
                <View style={[s.kesBadge, { backgroundColor: kes.bg }]}>
                  <Text style={{ color: kes.fg, fontSize: 11, fontWeight: "800" }}>{KES_LABEL[qq.tingkat]}</Text>
                </View>
                <View style={s.topikBadge}>
                  <Text style={{ color: tema.muted, fontSize: 11, fontWeight: "700" }}>{qq.topik}</Text>
                </View>
              </View>

              <Text style={{ color: tema.teks, marginTop: 12, lineHeight: 22 }}>{qq.pertanyaan}</Text>

              {punyaOpsi ? (
                <View style={{ gap: 10, marginTop: 12 }}>
                  {qq.opsi!.map((opt, i) => {
                    const iniPilih = dipilih === opt;
                    const iniKunci = qq.jawaban ? norm(opt) === norm(qq.jawaban) : false;
                    let border: string = tema.border;
                    let bg: string = tema.card2;
                    if (sudah) {
                      if (iniKunci) {
                        border = "#22C55E";
                        bg = "rgba(34,197,94,0.1)";
                      } else if (iniPilih) {
                        border = tema.merah;
                        bg = "rgba(244,63,94,0.1)";
                      }
                    }
                    return (
                      <Pressable
                        key={i}
                        disabled={sudah}
                        onPress={() => setJawaban((a) => ({ ...a, [idx]: opt }))}
                        style={[s.opsi, { borderColor: border, backgroundColor: bg }]}
                      >
                        <Text style={{ color: tema.teks, flex: 1 }}>{opt}</Text>
                        {sudah && iniKunci ? <Ionicons name="checkmark" size={16} color="#22C55E" /> : null}
                        {sudah && iniPilih && !iniKunci ? <Ionicons name="close" size={16} color={tema.merah} /> : null}
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}

              {sudah ? (
                <View style={s.pembahasan}>
                  <Text style={{ color: benarSoal ? "#34D399" : tema.merah, fontWeight: "700" }}>
                    {benarSoal ? "Benar!" : `Jawaban benar: ${qq.jawaban ?? "—"}`}
                  </Text>
                  {qq.pembahasan ? (
                    <Text style={{ color: tema.muted, marginTop: 4, lineHeight: 20 }}>{qq.pembahasan}</Text>
                  ) : null}
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

function Meta({ ikon, teks }: { ikon: React.ComponentProps<typeof Ionicons>["name"]; teks: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
      <Ionicons name={ikon} size={14} color={tema.muted} />
      <Text style={{ color: tema.muted, fontSize: 12 }}>{teks}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  selesai: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.4)",
    backgroundColor: "rgba(16,185,129,0.1)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  skor: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.4)",
    backgroundColor: "rgba(249,115,22,0.1)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  kartu: { backgroundColor: tema.card, borderWidth: 1, borderColor: tema.border, borderRadius: 18, padding: 16 },
  nomor: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: "rgba(249,115,22,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  kesBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  topikBadge: { borderWidth: 1, borderColor: tema.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  opsi: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  pembahasan: { backgroundColor: tema.card2, borderRadius: 12, padding: 12, marginTop: 12 },
});
