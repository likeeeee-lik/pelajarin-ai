import { useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subjectsApi } from "@/lib/api/resources";
import { tema } from "@/lib/tema";

/**
 * Pemilih mata pelajaran yang juga bisa MEMBUAT baru dari kotak pencarian —
 * cerminan `SubjectCombobox` di web. Dipakai di form buat-materi & buat-prediksi.
 */
export function PilihMapel({
  value,
  onChange,
  label = "Mata Pelajaran (opsional)",
}: {
  value: string;
  onChange: (id: string) => void;
  label?: string;
}) {
  const qc = useQueryClient();
  const subjects = useQuery({ queryKey: ["subjects"], queryFn: subjectsApi.list });

  const [buka, setBuka] = useState(false);
  const [q, setQ] = useState("");

  const list = subjects.data ?? [];
  const terpilih = list.find((s) => s.id === value);
  const cari = q.trim();
  const hasil = list.filter((s) => s.nama.toLowerCase().includes(cari.toLowerCase()));
  // Sudah ada persis? Kalau ya, jangan tawarkan "Buat" (mencegah duplikat).
  const sudahAda = list.some((s) => s.nama.toLowerCase() === cari.toLowerCase());

  const buat = useMutation({
    mutationFn: () => subjectsApi.create(cari),
    onSuccess: (sub) => {
      qc.invalidateQueries({ queryKey: ["subjects"] });
      onChange(sub.id);
      tutup();
    },
  });

  function tutup() {
    setBuka(false);
    setQ("");
    buat.reset();
  }

  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: tema.muted, fontSize: 13 }}>{label}</Text>

      <Pressable onPress={() => setBuka(true)} style={s.trigger}>
        <Text style={{ color: terpilih ? tema.teks : tema.muted, flex: 1 }} numberOfLines={1}>
          {terpilih?.nama ?? "Pilih mata pelajaran..."}
        </Text>
        <Ionicons name="chevron-down" size={18} color={tema.muted} />
      </Pressable>

      <Modal visible={buka} transparent animationType="slide" onRequestClose={tutup}>
        <Pressable style={s.bg} onPress={tutup} />
        <View style={s.card}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ color: tema.teks, fontSize: 18, fontWeight: "800", flex: 1 }}>
              Pilih Mata Pelajaran
            </Text>
            <Pressable onPress={tutup} hitSlop={10}>
              <Ionicons name="close" size={22} color={tema.muted} />
            </Pressable>
          </View>

          {/* cari / ketik untuk membuat */}
          <View style={s.cari}>
            <Ionicons name="search" size={16} color={tema.muted} />
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Cari atau ketik untuk membuat..."
              placeholderTextColor={tema.muted}
              autoCapitalize="words"
              style={{ flex: 1, color: tema.teks, fontSize: 14, paddingVertical: 10 }}
              onSubmitEditing={() => {
                if (cari && !sudahAda && !buat.isPending) buat.mutate();
              }}
            />
          </View>

          <ScrollView style={{ maxHeight: 280 }} keyboardShouldPersistTaps="handled">
            {value ? (
              <Pressable
                onPress={() => {
                  onChange("");
                  tutup();
                }}
                style={s.baris}
              >
                <Ionicons name="remove-circle-outline" size={18} color={tema.muted} />
                <Text style={{ color: tema.muted }}>Tanpa kategori</Text>
              </Pressable>
            ) : null}

            {hasil.map((sub) => (
              <Pressable
                key={sub.id}
                onPress={() => {
                  onChange(sub.id);
                  tutup();
                }}
                style={s.baris}
              >
                <Ionicons name="folder-outline" size={18} color={tema.muted} />
                <Text style={{ color: tema.teks, flex: 1 }}>{sub.nama}</Text>
                {value === sub.id ? <Ionicons name="checkmark" size={18} color={tema.brand} /> : null}
              </Pressable>
            ))}

            {hasil.length === 0 ? (
              <Text style={{ color: tema.muted, textAlign: "center", paddingVertical: 18, fontSize: 13 }}>
                {cari
                  ? "Tidak ada yang cocok. Ketuk tombol di bawah untuk membuat."
                  : "Belum ada mata pelajaran. Ketik untuk membuat."}
              </Text>
            ) : null}
          </ScrollView>

          {/* buat baru dari yang diketik */}
          {cari && !sudahAda ? (
            <Pressable
              onPress={() => buat.mutate()}
              disabled={buat.isPending}
              style={[s.buat, buat.isPending && { opacity: 0.6 }]}
            >
              {buat.isPending ? (
                <ActivityIndicator color={tema.brand} size="small" />
              ) : (
                <Ionicons name="add-circle" size={18} color={tema.brand} />
              )}
              <Text style={{ color: tema.brand, fontWeight: "700" }} numberOfLines={1}>
                Buat &quot;{cari}&quot;
              </Text>
            </Pressable>
          ) : null}

          {buat.isError ? (
            <Text style={{ color: tema.merah, fontSize: 13, marginTop: 8 }}>
              {buat.error instanceof Error ? buat.error.message : "Gagal membuat mata pelajaran."}
            </Text>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  bg: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  card: {
    backgroundColor: tema.card,
    borderTopWidth: 1,
    borderColor: tema.border,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    paddingBottom: 32,
  },
  cari: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: tema.card2,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  baris: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: tema.border,
  },
  buat: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.5)",
    backgroundColor: "rgba(249,115,22,0.1)",
    borderRadius: 14,
    paddingVertical: 13,
  },
});
