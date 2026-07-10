import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { meApi, statsApi } from "@/lib/api/resources";
import { keluar } from "@/lib/auth";
import { Field, Memuat, Screen, Tombol } from "@/components/ui";
import { tema } from "@/lib/tema";

const PLAN_LABEL: Record<string, string> = { free: "Free Plan", pro: "Pro", institusi: "Institusi" };

export default function ProfilScreen() {
  const qc = useQueryClient();
  const me = useQuery({ queryKey: ["me"], queryFn: meApi.get });
  const stats = useQuery({ queryKey: ["stats"], queryFn: statsApi.get });

  const [nama, setNama] = useState("");
  const [tersimpan, setTersimpan] = useState(false);

  useEffect(() => {
    if (me.data) setNama(me.data.nama);
  }, [me.data]);

  const simpan = useMutation({
    mutationFn: () => meApi.update({ nama: nama.trim() || "Pengguna" }),
    onSuccess: (p) => {
      qc.setQueryData(["me"], p);
      setTersimpan(true);
      setTimeout(() => setTersimpan(false), 2000);
    },
  });

  function konfirmasiKeluar() {
    Alert.alert("Keluar dari akun?", "Kamu perlu masuk lagi untuk akses materi belajar.", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: async () => {
          await keluar();
          qc.clear();
          router.replace("/masuk");
        },
      },
    ]);
  }

  if (me.isLoading || !me.data) return <Screen><Memuat /></Screen>;
  const p = me.data;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 90, gap: 16 }}>
        {/* header profil */}
        <View style={s.headerCard}>
          <View style={s.avatar}>
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 24 }}>
              {p.nama.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={{ color: tema.teks, fontSize: 18, fontWeight: "800", marginTop: 8 }}>{p.nama}</Text>
          <Text style={{ color: tema.muted }}>{p.email}</Text>
          <View style={s.badge}>
            <Text style={{ color: tema.muted, fontSize: 12, fontWeight: "600" }}>{PLAN_LABEL[p.plan]}</Text>
          </View>
        </View>

        {/* Pengaturan Profil */}
        <View style={s.card}>
          <BarisJudul ikon="settings" judul="Pengaturan Profil" sub="Perbarui informasi akun kamu" />
          <View style={{ gap: 14, marginTop: 14 }}>
            <Field label="Nama lengkap" value={nama} onChangeText={setNama} autoCapitalize="words" />
            <View style={{ gap: 6 }}>
              <Text style={{ color: tema.muted, fontSize: 13 }}>Email</Text>
              <View style={[s.inputMati]}>
                <Text style={{ color: tema.muted }}>{p.email}</Text>
              </View>
              <Text style={{ color: tema.muted, fontSize: 11 }}>
                Email terikat dengan akun dan tidak dapat diubah{p.emailVerified ? " · terverifikasi" : ""}
              </Text>
            </View>
            <Tombol
              judul={tersimpan ? "Tersimpan ✓" : simpan.isPending ? "Menyimpan…" : "Simpan"}
              onPress={() => simpan.mutate()}
              disabled={simpan.isPending}
            />
          </View>
        </View>

        {/* Langganan */}
        <View style={s.card}>
          <BarisJudul ikon="sparkles" judul="Langganan" sub="Status & penggunaan" />
          <View style={s.kuota}>
            <Text style={{ color: tema.muted }}>Kuota mata pelajaran</Text>
            <Text style={{ color: tema.teks, fontWeight: "700" }}>{stats.data?.subjects ?? 0}</Text>
          </View>
          <View style={s.kuota}>
            <Text style={{ color: tema.muted }}>Total catatan</Text>
            <Text style={{ color: tema.teks, fontWeight: "700" }}>{stats.data?.materials ?? 0}</Text>
          </View>
          <View style={{ marginTop: 12 }}>
            <Tombol
              judul="Upgrade ke Pro"
              ikonKiri={<Ionicons name="sparkles" size={16} color="#fff" />}
              onPress={() => router.push("/pricing")}
            />
          </View>
        </View>

        <Pressable onPress={konfirmasiKeluar} style={s.keluar}>
          <Ionicons name="log-out-outline" size={18} color={tema.merah} />
          <Text style={{ color: tema.merah, fontWeight: "700" }}>Keluar</Text>
        </Pressable>

        <Text style={{ color: tema.muted, textAlign: "center", fontSize: 12 }}>Pelajarin.ai</Text>
      </ScrollView>
    </Screen>
  );
}

function BarisJudul({
  ikon,
  judul,
  sub,
}: {
  ikon: React.ComponentProps<typeof Ionicons>["name"];
  judul: string;
  sub: string;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <View style={s.judulIkon}>
        <Ionicons name={ikon} size={18} color={tema.brand} />
      </View>
      <View>
        <Text style={{ color: tema.teks, fontWeight: "700", fontSize: 16 }}>{judul}</Text>
        <Text style={{ color: tema.muted, fontSize: 12 }}>{sub}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  headerCard: {
    alignItems: "center",
    backgroundColor: "rgba(249,115,22,0.08)",
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.25)",
    borderRadius: 20,
    padding: 20,
  },
  avatar: {
    height: 72,
    width: 72,
    borderRadius: 36,
    backgroundColor: tema.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    marginTop: 8,
    backgroundColor: tema.card2,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  card: { backgroundColor: tema.card, borderWidth: 1, borderColor: tema.border, borderRadius: 18, padding: 16 },
  judulIkon: {
    height: 40,
    width: 40,
    borderRadius: 12,
    backgroundColor: "rgba(249,115,22,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  inputMati: {
    backgroundColor: tema.card2,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    opacity: 0.7,
  },
  kuota: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: tema.card2,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 12,
  },
  keluar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(244,63,94,0.4)",
    borderRadius: 16,
    paddingVertical: 15,
  },
});
