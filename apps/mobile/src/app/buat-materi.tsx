import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { materialsApi } from "@/lib/api/resources";
import { PilihMapel } from "@/components/pilih-mapel";
import { Field, Screen, Tombol } from "@/components/ui";
import { tema } from "@/lib/tema";

type Sumber = "file" | "youtube" | "note";
type Berkas = { uri: string; name: string; mimeType: string };

const SUMBER: { key: Sumber; label: string; ikon: React.ComponentProps<typeof Ionicons>["name"] }[] = [
  { key: "file", label: "File", ikon: "document-outline" },
  { key: "youtube", label: "YouTube", ikon: "logo-youtube" },
  { key: "note", label: "Tulis", ikon: "create-outline" },
];

export default function BuatMateriScreen() {
  const qc = useQueryClient();

  const [sumber, setSumber] = useState<Sumber>("file");
  const [judul, setJudul] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [file, setFile] = useState<Berkas | null>(null);
  const [url, setUrl] = useState("");
  const [teks, setTeks] = useState("");

  const buat = useMutation({
    mutationFn: async () => {
      if (sumber === "file") {
        const form = new FormData();
        if (file) form.append("file", { uri: file.uri, name: file.name, type: file.mimeType } as unknown as Blob);
        form.append("judul", judul.trim() || file?.name || "Materi");
        form.append("tipe", "file");
        if (subjectId) form.append("subjectId", subjectId);
        return materialsApi.upload(form);
      }
      return materialsApi.create({
        judul: judul.trim() || (sumber === "note" ? "Catatan" : "Materi"),
        tipe: sumber,
        subjectId: subjectId || undefined,
        sourceUrl: sumber === "youtube" ? url.trim() : undefined,
        rawText: sumber === "note" ? teks.trim() : undefined,
      });
    },
    onSuccess: (m) => {
      qc.invalidateQueries({ queryKey: ["materials"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
      router.replace({ pathname: "/catatan/[id]", params: { id: m.id } });
    },
  });

  async function pilihFile() {
    const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (res.canceled) return;
    const a = res.assets[0];
    setFile({ uri: a.uri, name: a.name, mimeType: a.mimeType ?? "application/octet-stream" });
    if (!judul.trim()) setJudul(a.name.replace(/\.[^.]+$/, ""));
  }

  const bisaProses =
    !!judul.trim() &&
    ((sumber === "file" && !!file) ||
      (sumber === "youtube" && !!url.trim()) ||
      (sumber === "note" && !!teks.trim()));

  return (
    <Screen edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={s.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="close" size={24} color={tema.teks} />
        </Pressable>
        <Text style={{ color: tema.teks, fontSize: 18, fontWeight: "800" }}>Buat Materi</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* pilih sumber */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          {SUMBER.map((x) => {
            const aktif = sumber === x.key;
            return (
              <Pressable
                key={x.key}
                onPress={() => setSumber(x.key)}
                style={[s.sumberCard, aktif && { borderColor: tema.brand, backgroundColor: "rgba(249,115,22,0.1)" }]}
              >
                <Ionicons name={x.ikon} size={22} color={aktif ? tema.brand : tema.muted} />
                <Text style={{ color: aktif ? tema.brand : tema.teks, fontWeight: "700", marginTop: 6 }}>
                  {x.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Field label="Judul" value={judul} onChangeText={setJudul} placeholder="Judul materi" />

        <PilihMapel value={subjectId} onChange={setSubjectId} />

        {sumber === "file" ? (
          <Pressable onPress={pilihFile} style={s.dropzone}>
            <Ionicons name={file ? "document" : "attach"} size={26} color={tema.brand} />
            <Text style={{ color: tema.teks, fontWeight: "700", marginTop: 8 }} numberOfLines={1}>
              {file ? file.name : "Tap untuk memilih file"}
            </Text>
            <Text style={{ color: tema.muted, fontSize: 12 }}>PDF, DOCX, TXT, PNG, JPG</Text>
          </Pressable>
        ) : sumber === "youtube" ? (
          <Field label="Link YouTube" value={url} onChangeText={setUrl} placeholder="https://youtube.com/watch?v=..." keyboardType="url" />
        ) : (
          <View style={{ gap: 6 }}>
            <Text style={{ color: tema.muted, fontSize: 13 }}>Isi catatan</Text>
            <TextInput
              value={teks}
              onChangeText={setTeks}
              multiline
              placeholder="Tempel atau tulis materi di sini..."
              placeholderTextColor={tema.muted}
              style={s.textarea}
            />
          </View>
        )}

        {buat.isError ? (
          <Text style={{ color: tema.merah, fontSize: 13 }}>
            {buat.error instanceof Error ? buat.error.message : "Gagal memproses."}
          </Text>
        ) : null}

        <Tombol
          judul={sumber === "note" ? "Simpan" : "Proses dengan AI"}
          ikonKiri={<Ionicons name="sparkles" size={16} color="#fff" />}
          loading={buat.isPending}
          disabled={!bisaProses}
          onPress={() => buat.mutate()}
        />
        {buat.isPending && sumber !== "note" ? (
          <Text style={{ color: tema.muted, textAlign: "center", fontSize: 12 }}>
            Menganalisis dengan AI, mohon tunggu…
          </Text>
        ) : null}
      </ScrollView>

    </Screen>
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
  sumberCard: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 16,
    paddingVertical: 16,
  },
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
  dropzone: {
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: tema.border,
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 16,
  },
  textarea: {
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 14,
    padding: 14,
    color: tema.teks,
    minHeight: 160,
    textAlignVertical: "top",
  },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  modalCard: {
    backgroundColor: tema.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
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
