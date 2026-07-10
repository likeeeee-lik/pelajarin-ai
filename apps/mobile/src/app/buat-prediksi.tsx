import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { predictionsApi, subjectsApi } from "@/lib/api/resources";
import type { ExamType } from "@/lib/api/types";
import { Field, Screen, Tombol } from "@/components/ui";
import { tema } from "@/lib/tema";

const TIPE: { value: ExamType; label: string; sub: string; ikon: React.ComponentProps<typeof Ionicons>["name"] }[] = [
  { value: "uts", label: "UTS", sub: "Ujian Tengah Semester", ikon: "reader-outline" },
  { value: "uas", label: "UAS", sub: "Ujian Akhir Semester", ikon: "school-outline" },
  { value: "kuis", label: "Kuis", sub: "Kuis atau Ulangan", ikon: "help-circle-outline" },
  { value: "latihan", label: "Latihan", sub: "Soal Latihan", ikon: "barbell-outline" },
];

type Berkas = { uri: string; name: string; mimeType: string };

export default function BuatPrediksiScreen() {
  const qc = useQueryClient();
  const subjects = useQuery({ queryKey: ["subjects"], queryFn: subjectsApi.list });

  const [langkah, setLangkah] = useState<1 | 2>(1);
  const [judul, setJudul] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [tipe, setTipe] = useState<ExamType>("uts");
  const [files, setFiles] = useState<Berkas[]>([]);
  const [pickerBuka, setPickerBuka] = useState(false);

  const mapel = subjects.data?.find((x) => x.id === subjectId)?.nama ?? "";

  const buat = useMutation({
    mutationFn: async () => {
      const form = new FormData();
      files.forEach((f) =>
        // RN FormData: objek {uri,name,type} untuk multipart file.
        form.append("files", { uri: f.uri, name: f.name, type: f.mimeType } as unknown as Blob),
      );
      form.append("judul", judul.trim() || "Prediksi Soal");
      form.append("tipe", tipe);
      if (subjectId) form.append("subjectId", subjectId);
      return predictionsApi.upload(form);
    },
    onSuccess: (pred) => {
      qc.invalidateQueries({ queryKey: ["predictions"] });
      router.replace({ pathname: "/prediksi/[id]", params: { id: pred.id } });
    },
  });

  async function pilihFile() {
    const res = await DocumentPicker.getDocumentAsync({
      multiple: true,
      type: ["application/pdf", "image/*", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      copyToCacheDirectory: true,
    });
    if (res.canceled) return;
    const baru = res.assets.map((a) => ({
      uri: a.uri,
      name: a.name,
      mimeType: a.mimeType ?? "application/octet-stream",
    }));
    setFiles((prev) => [...prev, ...baru]);
  }

  return (
    <Screen edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={s.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="close" size={24} color={tema.teks} />
        </Pressable>
        <Text style={{ color: tema.teks, fontSize: 18, fontWeight: "800" }}>Upload Soal Ujian</Text>
        <Text style={{ color: tema.muted, fontSize: 13 }}>Langkah {langkah} / 2</Text>
      </View>
      <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 16, marginBottom: 8 }}>
        <View style={[s.progres, { backgroundColor: tema.brand }]} />
        <View style={[s.progres, { backgroundColor: langkah === 2 ? tema.brand : tema.border }]} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 18 }}>
        {langkah === 1 ? (
          <>
            <Field label="Judul Koleksi" value={judul} onChangeText={setJudul} placeholder="Contoh: UTS Kalkulus 2024" />

            <View style={{ gap: 6 }}>
              <Text style={{ color: tema.muted, fontSize: 13 }}>Mata Pelajaran</Text>
              <Pressable onPress={() => setPickerBuka(true)} style={s.pickerBtn}>
                <Text style={{ color: mapel ? tema.teks : tema.muted }}>{mapel || "Pilih mata pelajaran..."}</Text>
                <Ionicons name="swap-vertical" size={18} color={tema.muted} />
              </Pressable>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ color: tema.muted, fontSize: 13 }}>Tipe Ujian</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {TIPE.map((t) => {
                  const aktif = tipe === t.value;
                  return (
                    <Pressable
                      key={t.value}
                      onPress={() => setTipe(t.value)}
                      style={[s.tipeCard, aktif && { borderColor: tema.brand, backgroundColor: "rgba(249,115,22,0.1)" }]}
                    >
                      <Ionicons name={t.ikon} size={22} color={aktif ? tema.brand : tema.muted} />
                      <Text style={{ color: aktif ? tema.brand : tema.teks, fontWeight: "800", marginTop: 6 }}>
                        {t.label}
                      </Text>
                      <Text style={{ color: tema.muted, fontSize: 11, textAlign: "center" }}>{t.sub}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Text style={{ color: tema.muted, fontSize: 12 }}>
              ℹ Pengguna gratis: 1 prediksi ujian seumur hidup
            </Text>
            <Tombol judul="Lanjutkan" disabled={!judul.trim()} onPress={() => setLangkah(2)} />
          </>
        ) : (
          <>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="cloud-upload-outline" size={20} color={tema.brand} />
              <Text style={{ color: tema.teks, fontWeight: "700", fontSize: 16 }}>Upload File Soal</Text>
            </View>
            <Text style={{ color: tema.muted }}>
              Upload satu atau beberapa file soal ujian sebelumnya. AI akan menganalisis pola dan membuat prediksi soal.
            </Text>

            <Pressable onPress={pilihFile} style={s.dropzone}>
              <Ionicons name="attach" size={26} color={tema.brand} />
              <Text style={{ color: tema.teks, fontWeight: "700", marginTop: 8 }}>Tap untuk memilih file</Text>
              <Text style={{ color: tema.muted, fontSize: 12 }}>PDF, DOCX, TXT, PNG, JPG</Text>
            </Pressable>

            {files.map((f, i) => (
              <View key={i} style={s.fileBaris}>
                <Ionicons name="document" size={16} color={tema.muted} />
                <Text style={{ color: tema.teks, flex: 1, fontSize: 13 }} numberOfLines={1}>
                  {f.name}
                </Text>
                <Pressable onPress={() => setFiles((p) => p.filter((_, j) => j !== i))} hitSlop={8}>
                  <Ionicons name="close" size={16} color={tema.muted} />
                </Pressable>
              </View>
            ))}

            <View style={s.ringkasan}>
              <Text style={{ color: tema.muted }}>Judul: <Text style={{ color: tema.teks }}>{judul || "-"}</Text></Text>
              <Text style={{ color: tema.muted }}>Tipe: <Text style={{ color: tema.teks }}>{tipe.toUpperCase()}</Text></Text>
              <Text style={{ color: tema.muted }}>File: <Text style={{ color: tema.teks }}>{files.length} file</Text></Text>
            </View>

            {buat.isError ? (
              <Text style={{ color: tema.merah, fontSize: 13 }}>
                {buat.error instanceof Error ? buat.error.message : "Gagal memproses."}
              </Text>
            ) : null}

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Tombol judul="Kembali" warna={tema.card2} disabled={buat.isPending} onPress={() => setLangkah(1)} />
              </View>
              <View style={{ flex: 1 }}>
                <Tombol
                  judul="Proses"
                  ikonKiri={<Ionicons name="sparkles" size={16} color="#fff" />}
                  loading={buat.isPending}
                  disabled={files.length === 0}
                  onPress={() => buat.mutate()}
                />
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <PickerMapel
        buka={pickerBuka}
        onTutup={() => setPickerBuka(false)}
        onPilih={(id) => {
          setSubjectId(id);
          setPickerBuka(false);
        }}
      />
    </Screen>
  );
}

function PickerMapel({ buka, onTutup, onPilih }: { buka: boolean; onTutup: () => void; onPilih: (id: string) => void }) {
  const qc = useQueryClient();
  const subjects = useQuery({ queryKey: ["subjects"], queryFn: subjectsApi.list });
  const [nama, setNama] = useState("");
  const buat = useMutation({
    mutationFn: () => subjectsApi.create(nama.trim()),
    onSuccess: (s) => {
      qc.invalidateQueries({ queryKey: ["subjects"] });
      setNama("");
      onPilih(s.id);
    },
  });

  return (
    <Modal visible={buka} transparent animationType="slide" onRequestClose={onTutup}>
      <Pressable style={s.modalBg} onPress={onTutup} />
      <View style={s.modalCard}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Text style={{ color: tema.teks, fontSize: 18, fontWeight: "800" }}>Pilih Mata Pelajaran</Text>
          <Pressable onPress={onTutup} hitSlop={10}>
            <Ionicons name="close" size={22} color={tema.muted} />
          </Pressable>
        </View>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <Field value={nama} onChangeText={setNama} placeholder="Buat baru..." autoCapitalize="words" />
          </View>
          <Pressable
            onPress={() => nama.trim() && buat.mutate()}
            style={[s.plusBtn, !nama.trim() && { opacity: 0.4 }]}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </Pressable>
        </View>
        <ScrollView style={{ maxHeight: 260 }}>
          {(subjects.data ?? []).map((sub) => (
            <Pressable key={sub.id} onPress={() => onPilih(sub.id)} style={s.mapelBaris}>
              <Ionicons name="folder-outline" size={18} color={tema.muted} />
              <Text style={{ color: tema.teks }}>{sub.nama}</Text>
            </Pressable>
          ))}
          {(subjects.data ?? []).length === 0 ? (
            <Text style={{ color: tema.muted, textAlign: "center", paddingVertical: 20 }}>
              Belum ada mata pelajaran. Buat baru di atas.
            </Text>
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progres: { flex: 1, height: 4, borderRadius: 2 },
  pickerBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  tipeCard: {
    flexGrow: 1,
    flexBasis: "45%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 16,
    padding: 14,
  },
  dropzone: {
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: tema.border,
    borderRadius: 16,
    paddingVertical: 28,
  },
  fileBaris: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  ringkasan: {
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  modalCard: {
    backgroundColor: tema.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
  },
  plusBtn: {
    height: 50,
    width: 50,
    borderRadius: 14,
    backgroundColor: tema.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  mapelBaris: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: tema.border,
  },
});
