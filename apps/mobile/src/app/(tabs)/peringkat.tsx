import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { leaderboardApi } from "@/lib/api/resources";
import type { LeaderboardEntry, LeaderboardSort } from "@/lib/api/types";
import { Memuat, Screen } from "@/components/ui";
import { tema } from "@/lib/tema";

/**
 * Leaderboard (ss 28). Datanya NYATA — user diurutkan dari Profile.xp /
 * Streak.current yang memang ada di DB. Sistem yang MENAIKKAN XP belum dibangun,
 * jadi wajar bila semua bernilai 0; itu jujur, dan peringkat langsung hidup
 * begitu gamifikasi dinyalakan (tanpa mengubah layar ini).
 */

const PIALA: Record<number, string> = { 1: "#FACC15", 2: "#CBD5E1", 3: "#FB923C" };

/** Warna avatar diturunkan dari nama agar konsisten antar-render. */
function warnaAvatar(nama: string): string {
  const daftar = ["#14B8A6", "#8B5CF6", "#EC4899", "#F59E0B", "#3B82F6", "#22C55E", "#EF4444"];
  let h = 0;
  for (let i = 0; i < nama.length; i++) h = (h * 31 + nama.charCodeAt(i)) >>> 0;
  return daftar[h % daftar.length];
}

export default function PeringkatScreen() {
  const [sort, setSort] = useState<LeaderboardSort>("xp");
  const q = useQuery({ queryKey: ["leaderboard", sort], queryFn: () => leaderboardApi.top(sort) });

  if (q.isLoading) return <Screen><Memuat /></Screen>;

  const data = q.data;
  const entries = data?.entries ?? [];

  return (
    <Screen>
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 90, gap: 10 }}
        data={entries}
        keyExtractor={(e) => e.userId}
        ListHeaderComponent={
          <View style={{ gap: 16, marginBottom: 4 }}>
            <View>
              <Text style={{ color: tema.muted, fontSize: 12, letterSpacing: 1 }}>KOMUNITAS</Text>
              <Text style={{ color: tema.teks, fontSize: 26, fontWeight: "800" }}>Leaderboard</Text>
              <Text style={{ color: tema.muted, marginTop: 2 }}>
                Top {data?.total ?? 0} pelajar paling konsisten
              </Text>
            </View>

            <View style={s.toggle}>
              {(["xp", "streak"] as LeaderboardSort[]).map((k) => {
                const aktif = sort === k;
                return (
                  <Pressable
                    key={k}
                    onPress={() => setSort(k)}
                    style={[
                      s.toggleItem,
                      aktif && { backgroundColor: "rgba(249,115,22,0.15)", borderColor: tema.brand },
                    ]}
                  >
                    <Ionicons
                      name={k === "xp" ? "sparkles" : "flame"}
                      size={14}
                      color={aktif ? tema.brand : tema.muted}
                    />
                    <Text style={{ color: aktif ? tema.brand : tema.muted, fontWeight: "700", fontSize: 13 }}>
                      {k === "xp" ? "Total XP" : "Streak"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {data?.akuRank ? (
              <Text style={{ color: tema.muted, fontSize: 12 }}>
                Peringkat kamu:{" "}
                <Text style={{ color: tema.brand, fontWeight: "800" }}>#{data.akuRank}</Text> dari {data.total}
              </Text>
            ) : null}
          </View>
        }
        renderItem={({ item }) => <Baris e={item} sort={sort} />}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="trophy-outline" size={28} color={tema.brand} />
            <Text style={{ color: tema.teks, fontWeight: "700", marginTop: 8 }}>Belum ada peserta</Text>
          </View>
        }
        ListFooterComponent={
          <Text style={{ color: tema.muted, fontSize: 11, textAlign: "center", marginTop: 14, lineHeight: 16 }}>
            XP & streak belum bertambah otomatis — sistem gamifikasi belum dinyalakan.{"\n"}
            Daftar di atas memakai data asli, jadi akan langsung hidup begitu aktif.
          </Text>
        }
      />
    </Screen>
  );
}

function Baris({ e, sort }: { e: LeaderboardEntry; sort: LeaderboardSort }) {
  const piala = PIALA[e.rank];
  return (
    <View style={[s.baris, e.aku && { borderColor: tema.brand, backgroundColor: "rgba(249,115,22,0.08)" }]}>
      <View style={{ width: 28, alignItems: "center" }}>
        {piala ? (
          <Ionicons name="trophy" size={20} color={piala} />
        ) : (
          <Text style={{ color: tema.muted, fontWeight: "700" }}>{e.rank}</Text>
        )}
      </View>

      <View style={[s.avatar, { backgroundColor: warnaAvatar(e.nama) }]}>
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>{e.nama.charAt(0).toUpperCase()}</Text>
      </View>

      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ color: tema.teks, fontWeight: "700" }} numberOfLines={1}>
          {e.nama}
          {e.aku ? <Text style={{ color: tema.brand }}> · kamu</Text> : null}
        </Text>
        <Text style={{ color: tema.muted, fontSize: 12 }}>Level {e.level}</Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ color: tema.teks, fontWeight: "800" }}>{sort === "xp" ? e.xp : e.streak}</Text>
        <Text style={{ color: tema.muted, fontSize: 11 }}>{sort === "xp" ? "XP" : "hari"}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  toggle: { flexDirection: "row", gap: 8 },
  toggleItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: tema.border,
    backgroundColor: tema.card,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  baris: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 16,
    padding: 12,
  },
  avatar: { height: 40, width: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  empty: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: tema.border,
    borderStyle: "dashed",
    borderRadius: 18,
    padding: 28,
  },
});
