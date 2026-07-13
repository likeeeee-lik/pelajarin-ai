import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { materialsApi, meApi, statsApi } from "@/lib/api/resources";
import type { MaterialSummary, MaterialType } from "@/lib/api/types";
import { Memuat, Screen } from "@/components/ui";
import { aksen, tema } from "@/lib/tema";

const FILTER: { key: "semua" | MaterialType; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "file", label: "Dokumen" },
  { key: "youtube", label: "YouTube" },
  { key: "audio", label: "Audio" },
  { key: "video", label: "Video" },
];

const IKON_TIPE: Record<MaterialType, React.ComponentProps<typeof Ionicons>["name"]> = {
  file: "document-text",
  youtube: "logo-youtube",
  audio: "mic",
  video: "videocam",
  note: "create",
};

function salam() {
  const j = new Date().getHours();
  if (j < 11) return "Selamat Pagi";
  if (j < 15) return "Selamat Siang";
  if (j < 19) return "Selamat Sore";
  return "Selamat Malam";
}

export default function BerandaScreen() {
  const me = useQuery({ queryKey: ["me"], queryFn: meApi.get });
  const stats = useQuery({ queryKey: ["stats"], queryFn: statsApi.get });
  const materials = useQuery({ queryKey: ["materials"], queryFn: materialsApi.list });

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"semua" | MaterialType>("semua");

  const daftar = useMemo(() => {
    const src = materials.data ?? [];
    return src.filter((m) => {
      const cocokFilter = filter === "semua" || m.tipe === filter;
      const cocokCari = !q.trim() || m.judul.toLowerCase().includes(q.trim().toLowerCase());
      return cocokFilter && cocokCari;
    });
  }, [materials.data, filter, q]);

  if (me.isLoading) return <Screen><Memuat /></Screen>;

  const s2 = stats.data;
  // XP ke level berikutnya (kurva sederhana; gamifikasi nyata menyusul).
  const xp = me.data?.xp ?? 0;
  const xpTarget = (me.data?.level ?? 1) * 174;
  const xpPct = Math.min(100, Math.round((xp / xpTarget) * 100));

  const kartu = [
    { label: "Flashcard", nilai: String(s2?.flashcards ?? 0), sub: "kartu", ...aksen.brand },
    { label: "Streak", nilai: `${me.data?.streakCurrent ?? 0}`, sub: "hari", ...aksen.merah },
    { label: "Total XP", nilai: `${me.data?.xp ?? 0}`, sub: "XP", ...aksen.biru },
    { label: "Kuis", nilai: String(s2?.quizzes ?? 0), sub: "dibuat", ...aksen.kuning },
  ];

  return (
    <Screen>
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 130, gap: 16 }}
        data={daftar}
        keyExtractor={(m) => m.id}
        ListHeaderComponent={
          <View style={{ gap: 16 }}>
            {/* header: chip streak/level/xp + search */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Chip ikon="flame" teks={`${me.data?.streakCurrent ?? 0} hari`} />
                <Chip ikon="star" teks={`Lvl ${me.data?.level ?? 1}`} />
                <Chip ikon="sparkles" teks={`${me.data?.xp ?? 0} XP`} />
              </View>
              <View style={s.searchBtn}>
                <Ionicons name="search" size={18} color="#fff" />
              </View>
            </View>

            <Text style={{ color: tema.teks, fontSize: 24, fontWeight: "800" }}>
              {salam()}, {me.data?.nama} 👋
            </Text>

            {/* Fokus AI hari ini + progres XP */}
            <View style={s.fokusCard}>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Ionicons name="sparkles" size={16} color={tema.brand} />
                    <Text style={{ color: tema.brand, fontWeight: "800", fontSize: 12, letterSpacing: 1 }}>
                      FOKUS AI HARI INI
                    </Text>
                  </View>
                  <Text style={{ color: tema.teks, fontSize: 18, fontWeight: "800", marginTop: 8 }}>
                    Satu sesi kecil, progres terasa.
                  </Text>
                  <Text style={{ color: tema.muted, marginTop: 4, fontSize: 13 }}>
                    Upload file, audio, video, atau YouTube. Materi akan dirapikan jadi catatan belajar.
                  </Text>
                </View>
                <View style={s.xpRing}>
                  <Text style={{ color: tema.teks, fontWeight: "800", fontSize: 15 }}>{xpPct}%</Text>
                  <Text style={{ color: tema.muted, fontSize: 10 }}>XP</Text>
                </View>
              </View>
              <View style={{ marginTop: 12 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ color: tema.muted, fontSize: 11 }}>ke level berikutnya</Text>
                  <Text style={{ color: tema.brand, fontSize: 11, fontWeight: "700" }}>
                    {xp} / {xpTarget} XP
                  </Text>
                </View>
                <View style={s.xpBarBg}>
                  <View style={[s.xpBarFg, { width: `${xpPct}%` }]} />
                </View>
              </View>
            </View>

            {/* Banner upgrade */}
            <Pressable onPress={() => router.push("/pricing")} style={s.upgradeBanner}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: tema.teks, fontWeight: "800", fontSize: 15 }}>
                  Buka mode belajar tanpa batas
                </Text>
                <Text style={{ color: tema.muted, fontSize: 12, marginTop: 2 }}>
                  Chat AI, chapter, dan prediksi ujian lebih lega.
                </Text>
              </View>
              <View style={s.upgradePanah}>
                <Ionicons name="chevron-forward" size={18} color={tema.kuning} />
              </View>
            </Pressable>

            {/* 4 kartu statistik */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {kartu.map((k) => (
                <View key={k.label} style={s.statCard}>
                  <View style={[s.statIkon, { backgroundColor: k.bg }]}>
                    <Ionicons name="ellipse" size={10} color={k.fg} />
                  </View>
                  <Text style={{ color: tema.teks, fontSize: 22, fontWeight: "800" }}>{k.nilai}</Text>
                  <Text style={{ color: tema.muted, fontSize: 12 }}>
                    {k.label} · {k.sub}
                  </Text>
                </View>
              ))}
            </View>

            {/* Koleksi Kamu */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
              <Ionicons name="library" size={18} color={tema.brand} />
              <Text style={{ color: tema.teks, fontSize: 16, fontWeight: "700" }}>Koleksi Kamu</Text>
              <Text style={{ color: tema.muted, fontSize: 12 }}>{materials.data?.length ?? 0} catatan</Text>
            </View>

            <View style={s.search}>
              <Ionicons name="search" size={16} color={tema.muted} />
              <TextInput
                value={q}
                onChangeText={setQ}
                placeholder="Cari catatan..."
                placeholderTextColor={tema.muted}
                style={{ flex: 1, color: tema.teks, fontSize: 14 }}
              />
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {FILTER.map((f) => {
                const aktif = filter === f.key;
                return (
                  <Pressable
                    key={f.key}
                    onPress={() => setFilter(f.key)}
                    style={[s.filterChip, aktif && { backgroundColor: tema.brand, borderColor: tema.brand }]}
                  >
                    <Text style={{ color: aktif ? "#fff" : tema.muted, fontSize: 13, fontWeight: "600" }}>
                      {f.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        renderItem={({ item }) => <MateriBaris item={item} />}
        ListEmptyComponent={
          materials.isLoading ? null : (
            <Pressable onPress={() => router.push("/buat-materi")} style={s.emptyCard}>
              <Ionicons name="documents-outline" size={28} color={tema.brand} />
              <Text style={{ color: tema.teks, fontWeight: "700", marginTop: 8 }}>Mulai dari satu materi</Text>
              <Text style={{ color: tema.muted, textAlign: "center", marginTop: 4, fontSize: 13 }}>
                Upload file, audio, video, atau YouTube. Materi dirapikan jadi catatan belajar.
              </Text>
            </Pressable>
          )
        }
      />

      {/* FAB buat materi */}
      <Pressable onPress={() => router.push("/buat-materi")} style={s.fab}>
        <Ionicons name="add" size={30} color="#fff" />
      </Pressable>
    </Screen>
  );
}

function MateriBaris({ item }: { item: MaterialSummary }) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: "/catatan/[id]", params: { id: item.id } })}
      style={s.materiBaris}
    >
      <View style={s.materiIkon}>
        <Ionicons name={IKON_TIPE[item.tipe]} size={20} color={tema.brand} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: tema.teks, fontWeight: "600" }} numberOfLines={1}>
          {item.judul}
        </Text>
        <Text style={{ color: tema.muted, fontSize: 12 }}>
          {item.subject?.nama ?? "Tanpa kategori"} · {item._count.chapters} bab
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={tema.muted} />
    </Pressable>
  );
}

function Chip({ ikon, teks }: { ikon: React.ComponentProps<typeof Ionicons>["name"]; teks: string }) {
  return (
    <View style={s.chip}>
      <Ionicons name={ikon} size={13} color={tema.brand} />
      <Text style={{ color: tema.teks, fontSize: 12, fontWeight: "600" }}>{teks}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  searchBtn: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: tema.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  fokusCard: {
    backgroundColor: "rgba(249,115,22,0.08)",
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.3)",
    borderRadius: 18,
    padding: 16,
  },
  xpRing: {
    height: 62,
    width: 62,
    borderRadius: 31,
    borderWidth: 3,
    borderColor: "rgba(249,115,22,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  xpBarBg: { height: 6, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" },
  xpBarFg: { height: 6, backgroundColor: tema.brand, borderRadius: 3 },
  upgradeBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(234,179,8,0.08)",
    borderWidth: 1,
    borderColor: "rgba(234,179,8,0.35)",
    borderRadius: 18,
    padding: 16,
  },
  upgradePanah: {
    height: 34,
    width: 34,
    borderRadius: 17,
    backgroundColor: "rgba(234,179,8,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  statCard: {
    flexGrow: 1,
    flexBasis: "47%",
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  statIkon: { height: 32, width: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: tema.border,
    backgroundColor: tema.card,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  emptyCard: {
    alignItems: "center",
    backgroundColor: "rgba(249,115,22,0.06)",
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.4)",
    borderStyle: "dashed",
    borderRadius: 18,
    padding: 28,
  },
  materiBaris: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 16,
    padding: 14,
  },
  materiIkon: {
    height: 40,
    width: 40,
    borderRadius: 12,
    backgroundColor: "rgba(249,115,22,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 104,
    height: 58,
    width: 58,
    borderRadius: 29,
    backgroundColor: tema.brand,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
