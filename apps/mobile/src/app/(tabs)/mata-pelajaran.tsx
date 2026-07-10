import { useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { materialsApi, subjectsApi } from "@/lib/api/resources";
import type { Subject } from "@/lib/api/types";
import { Field, Memuat, Screen, Tombol } from "@/components/ui";
import { tema } from "@/lib/tema";

export default function MataPelajaranScreen() {
  const qc = useQueryClient();
  const subjects = useQuery({ queryKey: ["subjects"], queryFn: subjectsApi.list });
  const materials = useQuery({ queryKey: ["materials"], queryFn: materialsApi.list });

  const [nama, setNama] = useState("");
  const [buka, setBuka] = useState(false);

  const tambah = useMutation({
    mutationFn: () => subjectsApi.create(nama.trim()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subjects"] });
      setNama("");
      setBuka(false);
    },
  });

  const hapus = useMutation({
    mutationFn: (id: string) => subjectsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subjects"] }),
  });

  if (subjects.isLoading) return <Screen><Memuat /></Screen>;

  const list = subjects.data ?? [];
  const totalCatatan = materials.data?.length ?? 0;
  const tanpaKategori = materials.data?.filter((m) => !m.subjectId).length ?? 0;

  function konfirmasiHapus(sub: Subject) {
    Alert.alert("Hapus mata pelajaran?", `"${sub.nama}" akan dihapus. Catatan di dalamnya tidak ikut terhapus.`, [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => hapus.mutate(sub.id) },
    ]);
  }

  return (
    <Screen>
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 90, gap: 16 }}
        data={list}
        keyExtractor={(x) => x.id}
        ListHeaderComponent={
          <View style={{ gap: 16 }}>
            <View>
              <Text style={{ color: tema.muted, fontSize: 12, letterSpacing: 1 }}>PELAJARIN.AI</Text>
              <Text style={{ color: tema.teks, fontSize: 26, fontWeight: "800" }}>Mata Pelajaran</Text>
              <Text style={{ color: tema.muted, marginTop: 2 }}>
                Kelola daftar mata pelajaran untuk mengorganisir catatan kamu
              </Text>
            </View>

            {/* Tambah */}
            <View style={styles.card}>
              <Text style={{ color: tema.teks, fontWeight: "700", fontSize: 16, marginBottom: 12 }}>
                Tambah Mata Pelajaran
              </Text>
              {buka ? (
                <View style={{ gap: 12 }}>
                  <Field
                    label="Nama mata pelajaran"
                    value={nama}
                    onChangeText={setNama}
                    autoCapitalize="words"
                    placeholder="Contoh: Matematika"
                    autoFocus
                  />
                  {tambah.isError ? (
                    <Text style={{ color: tema.merah, fontSize: 13 }}>Gagal menambahkan. Coba lagi.</Text>
                  ) : null}
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <Pressable onPress={() => setBuka(false)} style={{ justifyContent: "center", paddingHorizontal: 12 }}>
                      <Text style={{ color: tema.muted, fontWeight: "700" }}>Batal</Text>
                    </Pressable>
                    <View style={{ flex: 1 }}>
                      <Tombol
                        judul="Tambah"
                        warna={tema.hijau}
                        loading={tambah.isPending}
                        disabled={!nama.trim()}
                        onPress={() => tambah.mutate()}
                      />
                    </View>
                  </View>
                </View>
              ) : (
                <Tombol
                  judul="Tambah"
                  warna={tema.hijau}
                  ikonKiri={<Ionicons name="add" size={18} color="#fff" />}
                  onPress={() => setBuka(true)}
                />
              )}
            </View>

            {/* Statistik */}
            <View style={styles.card}>
              <Text style={{ color: tema.teks, fontWeight: "700", fontSize: 16, marginBottom: 12 }}>Statistik</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Stat nilai={list.length} label="Total mata pelajaran" warna={tema.brand} />
                <Stat nilai={totalCatatan} label="Total catatan" warna={tema.teks} />
                <Stat nilai={tanpaKategori} label="Tanpa kategori" warna={tema.muted} />
              </View>
            </View>

            <Text style={{ color: tema.teks, fontWeight: "700", fontSize: 16 }}>Daftar Mata Pelajaran</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.baris}>
            <View style={styles.ikon}>
              <Ionicons name="folder" size={20} color={tema.brand} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: tema.teks, fontWeight: "600" }}>{item.nama}</Text>
              <Text style={{ color: tema.muted, fontSize: 12 }}>{item._count?.materials ?? 0} catatan</Text>
            </View>
            <Pressable onPress={() => konfirmasiHapus(item)} hitSlop={10}>
              <Ionicons name="trash-outline" size={18} color={tema.muted} />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="folder-outline" size={28} color={tema.brand} />
            <Text style={{ color: tema.teks, fontWeight: "700", marginTop: 8 }}>Belum ada mata pelajaran</Text>
            <Text style={{ color: tema.muted, textAlign: "center", marginTop: 4, fontSize: 13 }}>
              Tambahkan di atas untuk mulai mengorganisir catatan.
            </Text>
          </View>
        }
      />
    </Screen>
  );
}

function Stat({ nilai, label, warna }: { nilai: number; label: string; warna: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={{ color: warna, fontSize: 22, fontWeight: "800" }}>{nilai}</Text>
      <Text style={{ color: tema.muted, fontSize: 11 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: tema.card, borderWidth: 1, borderColor: tema.border, borderRadius: 18, padding: 16 },
  statBox: {
    flex: 1,
    backgroundColor: tema.card2,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  baris: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 16,
    padding: 14,
  },
  ikon: {
    height: 40,
    width: 40,
    borderRadius: 12,
    backgroundColor: "rgba(249,115,22,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: tema.border,
    borderStyle: "dashed",
    borderRadius: 18,
    padding: 28,
  },
});
