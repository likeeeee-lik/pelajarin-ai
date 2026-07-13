import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { tema } from "@/lib/tema";

export type Sumber = "file" | "youtube" | "audio" | "video";

const SUMBER: {
  key: Sumber;
  judul: string;
  sub: string;
  ikon: React.ComponentProps<typeof Ionicons>["name"];
  fg: string;
  bg: string;
}[] = [
  { key: "file", judul: "Upload File", sub: "PDF, Word, PPT", ikon: "document-text", fg: "#60A5FA", bg: "rgba(59,130,246,0.15)" },
  { key: "youtube", judul: "YouTube", sub: "Tempel link video", ikon: "logo-youtube", fg: "#F87171", bg: "rgba(239,68,68,0.15)" },
  { key: "audio", judul: "Audio", sub: "MP3, WAV, rekaman", ikon: "mic", fg: "#34D399", bg: "rgba(16,185,129,0.15)" },
  { key: "video", judul: "Video", sub: "MP4, MOV", ikon: "videocam", fg: "#C084FC", bg: "rgba(168,85,247,0.15)" },
];

/** Bottom sheet "Buat catatan baru" — 4 pilihan sumber (ss homepage/kategori upload). */
export function SheetSumber({
  buka,
  onTutup,
  onPilih,
}: {
  buka: boolean;
  onTutup: () => void;
  onPilih: (s: Sumber) => void;
}) {
  return (
    <Modal visible={buka} transparent animationType="slide" onRequestClose={onTutup}>
      <Pressable style={s.bg} onPress={onTutup} />
      <View style={s.sheet}>
        <View style={s.handle} />

        <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: tema.teks, fontSize: 21, fontWeight: "800" }}>Buat catatan baru</Text>
            <Text style={{ color: tema.muted, marginTop: 2 }}>
              Pilih bahan yang mau kamu ubah jadi catatan
            </Text>
          </View>
          <Pressable onPress={onTutup} hitSlop={10}>
            <Ionicons name="close" size={24} color={tema.muted} />
          </Pressable>
        </View>

        <View style={{ gap: 10 }}>
          {SUMBER.map((x) => (
            <Pressable key={x.key} onPress={() => onPilih(x.key)} style={s.baris}>
              <View style={[s.ikon, { backgroundColor: x.bg }]}>
                <Ionicons name={x.ikon} size={22} color={x.fg} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: tema.teks, fontWeight: "700", fontSize: 16 }}>{x.judul}</Text>
                <Text style={{ color: tema.muted, fontSize: 13 }}>{x.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={tema.muted} />
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  sheet: {
    backgroundColor: tema.bg,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    borderColor: tema.border,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 34,
  },
  handle: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: tema.border,
    marginBottom: 16,
  },
  baris: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 16,
    padding: 14,
  },
  ikon: { height: 48, width: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
});
