import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { materialsApi } from "@/lib/api/resources";
import { PilihMapel } from "@/components/pilih-mapel";
import { Field, Screen, Tombol } from "@/components/ui";
import { tema } from "@/lib/tema";

/** Wizard 2 langkah "Upload Materi" (ss homepage). Sumber datang dari bottom sheet Beranda. */
type Sumber = "file" | "youtube" | "audio" | "video";
type Berkas = { uri: string; name: string; mimeType: string };

const KONFIG: Record<
  Sumber,
  {
    judul: string;
    sub: string;
    tapText: string;
    format: string;
    ikon: React.ComponentProps<typeof Ionicons>["name"];
    fg: string;
    bg: string;
    /** MIME untuk DocumentPicker. */
    accept: string[];
  }
> = {
  file: {
    judul: "Pilih File",
    sub: "Upload PDF, DOCX, PPT, atau dokumen lainnya untuk dibuatkan catatan belajar",
    tapText: "Tap untuk memilih file",
    format: "PDF, DOCX, DOC, PPT, PPTX, TXT",
    ikon: "document-text",
    fg: "#60A5FA",
    bg: "rgba(59,130,246,0.15)",
    accept: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.*", "text/plain"],
  },
  youtube: {
    judul: "Masukkan URL YouTube",
    sub: "Masukkan link video YouTube untuk dibuatkan catatan belajar",
    tapText: "",
    format: "",
    ikon: "logo-youtube",
    fg: "#F87171",
    bg: "rgba(239,68,68,0.15)",
    accept: [],
  },
  audio: {
    judul: "Pilih Audio",
    sub: "Upload satu atau beberapa file audio untuk dibuatkan catatan belajar",
    tapText: "Tap untuk memilih audio",
    format: "MP3, WAV, M4A, OGG",
    ikon: "musical-notes",
    fg: "#34D399",
    bg: "rgba(16,185,129,0.15)",
    accept: ["audio/*"],
  },
  video: {
    judul: "Pilih Video",
    sub: "Upload satu atau beberapa file video untuk dibuatkan catatan belajar",
    tapText: "Tap untuk memilih video",
    format: "MP4, MOV, AVI, MKV",
    ikon: "videocam",
    fg: "#C084FC",
    bg: "rgba(168,85,247,0.15)",
    accept: ["video/*"],
  },
};

const MODE = [
  { key: "kilat", label: "Kilat", sub: "Inti materi", ikon: "sparkles" as const, fg: "#FACC15" },
  { key: "standar", label: "Standar", sub: "Seimbang", ikon: "reader" as const, fg: tema.brand },
  { key: "lengkap", label: "Lengkap", sub: "Mendalam", ikon: "disc" as const, fg: "#F87171" },
];

const GAYA = [
  { key: "santai", label: "😊 Ramah & Santai" },
  { key: "formal", label: "🎩 Serius & Formal" },
  { key: "kreatif", label: "🎨 Menyenangkan & Kreatif" },
  { key: "akademis", label: "🎓 Akademis & Ilmiah" },
];

const BAHASA = [
  { key: "id", label: "🇮🇩 Bahasa Indonesia" },
  { key: "en", label: "🇬🇧 English" },
  { key: "ar", label: "🇸🇦 العربية" },
  { key: "zh", label: "🇨🇳 中文" },
];

export default function BuatMateriScreen() {
  const qc = useQueryClient();
  const params = useLocalSearchParams<{ sumber?: string }>();
  const sumber = (["file", "youtube", "audio", "video"].includes(params.sumber ?? "")
    ? params.sumber
    : "file") as Sumber;
  const k = KONFIG[sumber];

  const [langkah, setLangkah] = useState<1 | 2>(1);
  const [file, setFile] = useState<Berkas | null>(null);
  const [url, setUrl] = useState("");

  const [subjectId, setSubjectId] = useState("");
  const [mode, setMode] = useState("standar");
  const [gaya, setGaya] = useState("santai");
  const [bahasa, setBahasa] = useState("id");

  async function pilihBerkas() {
    const r = await DocumentPicker.getDocumentAsync({
      type: k.accept.length ? k.accept : "*/*",
      copyToCacheDirectory: true,
    });
    if (r.canceled || !r.assets?.[0]) return;
    const a = r.assets[0];
    setFile({ uri: a.uri, name: a.name, mimeType: a.mimeType ?? "application/octet-stream" });
  }

  const buat = useMutation({
    mutationFn: async () => {
      const judul = sumber === "youtube" ? "Video YouTube" : (file?.name ?? "Materi");

      if (sumber === "youtube") {
        return materialsApi.create({
          judul,
          tipe: "youtube",
          sourceUrl: url.trim(),
          subjectId: subjectId || undefined,
          modeBelajar: mode,
          gayaPenulisan: gaya,
          bahasa,
        });
      }

      const form = new FormData();
      form.append("file", { uri: file!.uri, name: file!.name, type: file!.mimeType } as unknown as Blob);
      form.append("judul", judul);
      form.append("tipe", sumber); // file | audio | video
      if (subjectId) form.append("subjectId", subjectId);
      form.append("modeBelajar", mode);
      form.append("gayaPenulisan", gaya);
      form.append("bahasa", bahasa);
      return materialsApi.upload(form);
    },
    onSuccess: (m) => {
      qc.invalidateQueries({ queryKey: ["materials"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
      router.replace({ pathname: "/catatan/[id]", params: { id: m.id } });
    },
  });

  const bisaLanjut = sumber === "youtube" ? url.trim().length > 8 : !!file;
  // Mapel WAJIB di langkah 2 (tanda * di referensi).
  const bisaProses = !!subjectId && !buat.isPending;

  return (
    <Screen edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* header + progres 2 segmen */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="close" size={24} color={tema.teks} />
        </Pressable>
        <Text style={{ color: tema.teks, fontSize: 19, fontWeight: "800", flex: 1, marginLeft: 14 }}>
          Upload Materi
        </Text>
        <Text style={{ color: tema.muted }}>Langkah {langkah} / 2</Text>
      </View>
      <View style={s.progres}>
        <View style={[s.seg, { backgroundColor: tema.brand }]} />
        <View style={[s.seg, { backgroundColor: langkah === 2 ? tema.brand : tema.border }]} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 22 }} keyboardShouldPersistTaps="handled">
        {langkah === 1 ? (
          <>
            <View style={{ gap: 4 }}>
              <Text style={{ color: tema.teks, fontSize: 17, fontWeight: "800" }}>{k.judul}</Text>
              <Text style={{ color: tema.muted, lineHeight: 21 }}>{k.sub}</Text>
            </View>

            {sumber === "youtube" ? (
              <View style={s.urlWrap}>
                <Ionicons name="link" size={18} color={tema.muted} />
                <TextInput
                  value={url}
                  onChangeText={setUrl}
                  placeholder="https://youtube.com/watch?v=..."
                  placeholderTextColor={tema.muted}
                  autoCapitalize="none"
                  keyboardType="url"
                  style={{ flex: 1, color: tema.teks, fontSize: 15, paddingVertical: 15 }}
                />
              </View>
            ) : (
              <Pressable onPress={pilihBerkas} style={{ gap: 12 }}>
                <View style={[s.ikonBesar, { backgroundColor: k.bg }]}>
                  <Ionicons name={k.ikon} size={30} color={k.fg} />
                </View>
                <View>
                  <Text style={{ color: tema.teks, fontWeight: "700", fontSize: 16 }} numberOfLines={1}>
                    {file?.name ?? k.tapText}
                  </Text>
                  <Text style={{ color: tema.muted, fontSize: 13, marginTop: 2 }}>{k.format}</Text>
                </View>
              </Pressable>
            )}

            <Tombol judul="Lanjutkan" disabled={!bisaLanjut} onPress={() => setLangkah(2)} />
          </>
        ) : (
          <>
            <View style={{ gap: 4 }}>
              <Text style={{ color: tema.teks, fontSize: 17, fontWeight: "800" }}>Pengaturan Catatan</Text>
              <Text style={{ color: tema.muted }}>Atur gaya catatan dan bahasa yang kamu mau</Text>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ color: tema.teks, fontWeight: "700" }}>
                Mata Pelajaran/Kuliah <Text style={{ color: tema.merah }}>*</Text>
              </Text>
              <PilihMapel value={subjectId} onChange={setSubjectId} label="" />
            </View>

            {/* Mode Belajar */}
            <View style={{ gap: 10 }}>
              <Text style={{ color: tema.teks, fontWeight: "700" }}>Mode Belajar</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                {MODE.map((m) => {
                  const aktif = mode === m.key;
                  return (
                    <Pressable
                      key={m.key}
                      onPress={() => setMode(m.key)}
                      style={[s.modeKartu, aktif && { borderColor: tema.brand, backgroundColor: "rgba(249,115,22,0.1)" }]}
                    >
                      <Ionicons name={m.ikon} size={20} color={aktif ? tema.brand : m.fg} />
                      <Text style={{ color: aktif ? tema.brand : tema.teks, fontWeight: "700", marginTop: 6 }}>
                        {m.label}
                      </Text>
                      <Text style={{ color: tema.muted, fontSize: 11 }}>{m.sub}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Pilihan
              judul="Gaya Penulisan"
              opsi={GAYA}
              nilai={gaya}
              onPilih={setGaya}
            />
            <Pilihan
              judul="Bahasa Catatan"
              opsi={BAHASA}
              nilai={bahasa}
              onPilih={setBahasa}
              catatan="Catatan akan dibuat dalam bahasa ini"
            />

            {/* kartu sumber terpilih */}
            <View style={s.sumberKartu}>
              <View style={[s.sumberIkon, { backgroundColor: k.bg }]}>
                <Ionicons name={k.ikon} size={18} color={k.fg} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ color: tema.teks, fontWeight: "600" }} numberOfLines={1}>
                  {sumber === "youtube" ? url : file?.name}
                </Text>
                <Text style={{ color: tema.muted, fontSize: 12 }}>
                  {sumber === "youtube" ? "Video YouTube" : sumber === "audio" ? "Audio" : sumber === "video" ? "Video" : "Dokumen"}
                </Text>
              </View>
              <Pressable onPress={() => setLangkah(1)} hitSlop={10}>
                <Ionicons name="close" size={20} color={tema.muted} />
              </Pressable>
            </View>

            {buat.isError ? (
              <Text style={{ color: tema.merah, fontSize: 13 }}>
                {buat.error instanceof Error ? buat.error.message : "Gagal memproses."}
              </Text>
            ) : null}

            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Tombol judul="Kembali" warna={tema.card2} onPress={() => setLangkah(1)} disabled={buat.isPending} />
              </View>
              <View style={{ flex: 1.4 }}>
                <Tombol
                  judul="Proses"
                  ikonKiri={<Ionicons name="sparkles" size={16} color="#fff" />}
                  loading={buat.isPending}
                  disabled={!bisaProses}
                  onPress={() => buat.mutate()}
                />
              </View>
            </View>

            {buat.isPending ? (
              <Text style={{ color: tema.muted, textAlign: "center", fontSize: 12 }}>
                Menganalisis dengan AI, mohon tunggu…
              </Text>
            ) : null}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

/** Dropdown sederhana berbentuk baris pilihan (emoji + label). */
function Pilihan({
  judul,
  opsi,
  nilai,
  onPilih,
  catatan,
}: {
  judul: string;
  opsi: { key: string; label: string }[];
  nilai: string;
  onPilih: (k: string) => void;
  catatan?: string;
}) {
  const [buka, setBuka] = useState(false);
  const terpilih = opsi.find((o) => o.key === nilai);

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: tema.teks, fontWeight: "700" }}>{judul}</Text>
      <Pressable onPress={() => setBuka((v) => !v)} style={s.dropdown}>
        <Text style={{ color: tema.teks, flex: 1, fontSize: 15 }}>{terpilih?.label}</Text>
        <Ionicons name={buka ? "chevron-up" : "chevron-down"} size={18} color={tema.muted} />
      </Pressable>

      {buka
        ? opsi
            .filter((o) => o.key !== nilai)
            .map((o) => (
              <Pressable
                key={o.key}
                onPress={() => {
                  onPilih(o.key);
                  setBuka(false);
                }}
                style={s.dropdownItem}
              >
                <Text style={{ color: tema.muted, fontSize: 15 }}>{o.label}</Text>
              </Pressable>
            ))
        : null}

      {catatan ? <Text style={{ color: tema.muted, fontSize: 12 }}>{catatan}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14 },
  progres: { flexDirection: "row", gap: 8, paddingHorizontal: 20, marginBottom: 6 },
  seg: { flex: 1, height: 4, borderRadius: 2 },
  ikonBesar: { height: 62, width: 62, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  urlWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  modeKartu: {
    flex: 1,
    alignItems: "center",
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 6,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownItem: {
    backgroundColor: tema.card2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sumberKartu: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 16,
    padding: 12,
  },
  sumberIkon: { height: 40, width: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
});
