import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Markdown from "react-native-markdown-display";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  chaptersApi,
  chatApi,
  flashcardsApi,
  materialsApi,
  mindmapApi,
  quizzesApi,
} from "@/lib/api/resources";
import type { Material, MindmapNode, Quiz, QuizQuestion } from "@/lib/api/types";
import { FokusTimer } from "@/components/fokus-timer";
import { Memuat, Screen, Tombol } from "@/components/ui";
import { tema } from "@/lib/tema";

type Tab = "bab" | "mindmap" | "flashcard" | "kuis" | "dokumen" | "chat";
const TABS: { key: Tab; label: string; ikon: React.ComponentProps<typeof Ionicons>["name"] }[] = [
  { key: "bab", label: "Bab", ikon: "list" },
  { key: "mindmap", label: "Mind Map", ikon: "git-network" },
  { key: "flashcard", label: "Flashcard", ikon: "layers" },
  { key: "kuis", label: "Kuis", ikon: "help-circle" },
  { key: "dokumen", label: "Dokumen", ikon: "folder-open" },
  { key: "chat", label: "Chat", ikon: "chatbubbles" },
];

/** Alamat web, untuk membentuk tautan publik hasil "Bagikan". */
const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL ?? "http://localhost:3000";

export default function CatatanScreen() {
  const qc = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const material = useQuery({ queryKey: ["material", id], queryFn: () => materialsApi.get(id), enabled: !!id });
  const [tab, setTab] = useState<Tab>("bab");

  const bagikan = useMutation({
    mutationFn: () => materialsApi.share(id, true),
    onSuccess: async (r) => {
      qc.invalidateQueries({ queryKey: ["material", id] });
      if (r.shareSlug) {
        await Share.share({ message: `${WEB_URL}/publik/${r.shareSlug}` }).catch(() => undefined);
      }
    },
  });

  const hapus = useMutation({
    mutationFn: () => materialsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["materials"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
      router.replace("/beranda");
    },
  });

  function konfirmasiHapus() {
    Alert.alert("Hapus catatan?", "Semua bab, flashcard, kuis, dan file di dalamnya ikut terhapus.", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => hapus.mutate() },
    ]);
  }

  if (material.isLoading) return <Screen><Memuat /></Screen>;
  const m = material.data;
  if (!m) {
    return (
      <Screen>
        <Stack.Screen options={{ title: "Catatan" }} />
        <View style={{ padding: 24 }}>
          <Text style={{ color: tema.teks, fontWeight: "700", fontSize: 18 }}>Materi tidak ditemukan</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: m.judul }} />

      {/* aksi: fokus timer · bagikan · hapus */}
      <View style={s.aksi}>
        <FokusTimer />
        <View style={{ flex: 1 }} />
        <Pressable onPress={() => bagikan.mutate()} disabled={bagikan.isPending} style={s.aksiBtn}>
          {bagikan.isPending ? (
            <ActivityIndicator size="small" color={tema.muted} />
          ) : (
            <Ionicons name="share-social-outline" size={17} color={tema.muted} />
          )}
        </Pressable>
        <Pressable onPress={konfirmasiHapus} style={s.aksiBtn}>
          <Ionicons name="trash-outline" size={17} color={tema.merah} />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={s.tabbar}>
        {TABS.map((t) => {
          const aktif = tab === t.key;
          return (
            <Pressable key={t.key} onPress={() => setTab(t.key)} style={[s.tabBtn, aktif && { backgroundColor: tema.brand }]}>
              <Ionicons name={t.ikon} size={15} color={aktif ? "#fff" : tema.muted} />
              <Text style={{ color: aktif ? "#fff" : tema.muted, fontWeight: "700", fontSize: 13 }}>{t.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ flex: 1 }}>
        {tab === "bab" && <BabTab material={m} />}
        {tab === "mindmap" && <MindmapTab materialId={m.id} />}
        {tab === "flashcard" && <FlashcardTab materialId={m.id} />}
        {tab === "kuis" && <KuisTab materialId={m.id} />}
        {tab === "dokumen" && <DokumenTab material={m} />}
        {tab === "chat" && <ChatTab materialId={m.id} />}
      </View>
    </Screen>
  );
}

/** Tab Dokumen: file asli yang diunggah — buka/unduh lewat signed URL. */
function DokumenTab({ material }: { material: Material }) {
  const [membuka, setMembuka] = useState<string | null>(null);

  async function buka(fileId: string) {
    setMembuka(fileId);
    try {
      const { url } = await materialsApi.fileUrl(material.id, fileId);
      if (url) await Linking.openURL(url);
      else Alert.alert("File tidak tersedia", "Penyimpanan file belum aktif untuk materi ini.");
    } catch (e) {
      Alert.alert("Gagal membuka file", e instanceof Error ? e.message : "Coba lagi.");
    } finally {
      setMembuka(null);
    }
  }

  const kb = (n: number) => (n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1048576).toFixed(1)} MB`);

  if (material.files.length === 0) {
    return (
      <View style={{ padding: 24, alignItems: "center" }}>
        <Ionicons name="folder-open-outline" size={30} color={tema.muted} />
        <Text style={{ color: tema.teks, fontWeight: "700", marginTop: 10 }}>Tidak ada file</Text>
        <Text style={{ color: tema.muted, textAlign: "center", marginTop: 4, fontSize: 13 }}>
          Materi ini dibuat dari teks atau YouTube, bukan unggahan file.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
      {material.files.map((f) => (
        <Pressable key={f.id} onPress={() => buka(f.id)} style={s.fileBaris}>
          <View style={s.fileIkon}>
            {membuka === f.id ? (
              <ActivityIndicator size="small" color={tema.brand} />
            ) : (
              <Ionicons name="document-text" size={19} color={tema.brand} />
            )}
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ color: tema.teks, fontWeight: "600" }} numberOfLines={1}>
              {f.name}
            </Text>
            <Text style={{ color: tema.muted, fontSize: 12 }}>{kb(f.size)}</Text>
          </View>
          <Ionicons name="open-outline" size={17} color={tema.muted} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

// ── BAB ─────────────────────────────────────────────────────
function BabTab({ material }: { material: Material }) {
  const qc = useQueryClient();
  const [buka, setBuka] = useState<string | null>(null);
  const gen = useMutation({
    mutationFn: (chId: string) => chaptersApi.generate(chId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["material", material.id] }),
  });

  const babBuka = material.chapters.find((c) => c.id === buka);
  if (babBuka) {
    return (
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Pressable onPress={() => setBuka(null)} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <Ionicons name="chevron-back" size={18} color={tema.muted} />
          <Text style={{ color: tema.muted }}>Kembali ke daftar bab</Text>
        </Pressable>
        <Text style={{ color: tema.teks, fontSize: 20, fontWeight: "800", marginBottom: 12 }}>{babBuka.judul}</Text>
        {babBuka.kontenMd ? (
          <Markdown style={md}>{babBuka.kontenMd}</Markdown>
        ) : (
          <Text style={{ color: tema.muted }}>Bab ini masih kosong.</Text>
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      {material.chapters.length === 0 ? (
        <Text style={{ color: tema.muted, textAlign: "center", paddingVertical: 20 }}>
          Belum ada bab. Materi tipe catatan diisi dari web.
        </Text>
      ) : null}
      {material.chapters.map((c) => {
        const adaKonten = (c.kontenMd?.trim().length ?? 0) > 0;
        const sedang = gen.isPending && gen.variables === c.id;
        return (
          <View key={c.id} style={s.baris}>
            <View style={s.nomor}>
              <Text style={{ color: tema.brand, fontWeight: "800" }}>{c.urutan}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: tema.teks, fontWeight: "600" }} numberOfLines={1}>{c.judul}</Text>
              <Text style={{ color: adaKonten ? "#34D399" : tema.muted, fontSize: 12 }}>
                {adaKonten ? "Selesai" : "Menunggu"}
                {c.isPro ? " · Pro" : ""}
              </Text>
            </View>
            {adaKonten ? (
              <Pressable onPress={() => setBuka(c.id)} style={s.kecilBtn}>
                <Text style={{ color: tema.teks, fontWeight: "700", fontSize: 13 }}>Buka</Text>
              </Pressable>
            ) : (
              <Pressable onPress={() => gen.mutate(c.id)} disabled={sedang} style={[s.kecilBtn, { backgroundColor: tema.brand }]}>
                {sedang ? <ActivityIndicator size="small" color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>Buat</Text>}
              </Pressable>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

// ── MIND MAP ────────────────────────────────────────────────
function MindmapTab({ materialId }: { materialId: string }) {
  const qc = useQueryClient();
  const mm = useQuery({ queryKey: ["mindmap", materialId], queryFn: () => mindmapApi.get(materialId) });
  const gen = useMutation({
    mutationFn: () => mindmapApi.generate(materialId),
    onSuccess: (data) => qc.setQueryData(["mindmap", materialId], data),
  });

  if (mm.isLoading) return <Memuat />;
  if (!mm.data) {
    return (
      <View style={{ padding: 24, gap: 14, alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Ionicons name="git-network-outline" size={30} color={tema.brand} />
        <Text style={{ color: tema.muted, textAlign: "center" }}>Belum ada mind map untuk materi ini.</Text>
        <View style={{ alignSelf: "stretch" }}>
          <Tombol judul="Buat Mind Map" loading={gen.isPending} onPress={() => gen.mutate()} />
        </View>
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Node node={mm.data.dataJson} level={0} />
    </ScrollView>
  );
}

function Node({ node, level }: { node: MindmapNode; level: number }) {
  return (
    <View style={{ marginLeft: level * 16, marginVertical: 3 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <View style={[s.dot, { backgroundColor: level === 0 ? tema.brand : tema.muted }]} />
        <Text style={{ color: level === 0 ? tema.teks : tema.muted, fontWeight: level === 0 ? "800" : "500" }}>
          {node.label}
        </Text>
      </View>
      {node.children?.map((c, i) => <Node key={i} node={c} level={level + 1} />)}
    </View>
  );
}

// ── FLASHCARD ───────────────────────────────────────────────
function FlashcardTab({ materialId }: { materialId: string }) {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["flashcards", materialId], queryFn: () => flashcardsApi.list(materialId) });
  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState(false);
  const gen = useMutation({
    mutationFn: () => flashcardsApi.generate(materialId, { count: 15 }),
    onSuccess: (data) => {
      qc.setQueryData(["flashcards", materialId], data);
      setIdx(0);
      setFlip(false);
    },
  });

  if (list.isLoading) return <Memuat />;
  const cards = list.data ?? [];
  if (cards.length === 0) {
    return (
      <View style={{ padding: 24, gap: 14, alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Ionicons name="layers-outline" size={30} color={tema.brand} />
        <Text style={{ color: tema.muted, textAlign: "center" }}>Belum ada flashcard.</Text>
        <View style={{ alignSelf: "stretch" }}>
          <Tombol judul="Buat 15 Flashcard" loading={gen.isPending} onPress={() => gen.mutate()} />
        </View>
      </View>
    );
  }
  const card = cards[idx];
  return (
    <View style={{ flex: 1, padding: 16, gap: 14 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: tema.muted }}>{idx + 1} / {cards.length}</Text>
        <Pressable onPress={() => { setIdx(0); setFlip(false); }} style={s.kecilBtn}>
          <Text style={{ color: tema.teks, fontWeight: "700", fontSize: 13 }}>Main Ulang</Text>
        </Pressable>
      </View>
      <Pressable onPress={() => setFlip((f) => !f)} style={s.flashcard}>
        <Text style={{ color: tema.muted, fontSize: 11, fontWeight: "700", letterSpacing: 1 }}>
          {flip ? "JAWABAN" : "PERTANYAAN"}
        </Text>
        <Text style={{ color: tema.teks, fontSize: 18, fontWeight: "600", textAlign: "center", marginTop: 14 }}>
          {flip ? card.back : card.front}
        </Text>
        <Text style={{ color: tema.muted, fontSize: 12, marginTop: 16 }}>tap untuk membalik</Text>
      </Pressable>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Pressable disabled={idx === 0} onPress={() => { setIdx((i) => i - 1); setFlip(false); }} style={[s.navBtn, idx === 0 && { opacity: 0.3 }]}>
          <Ionicons name="chevron-back" size={22} color={tema.teks} />
        </Pressable>
        <Pressable disabled={idx >= cards.length - 1} onPress={() => { setIdx((i) => i + 1); setFlip(false); }} style={[s.navBtn, idx >= cards.length - 1 && { opacity: 0.3 }]}>
          <Ionicons name="chevron-forward" size={22} color={tema.teks} />
        </Pressable>
      </View>
    </View>
  );
}

// ── KUIS ────────────────────────────────────────────────────
const norm = (x: string) => x.trim().toLowerCase();
function KuisTab({ materialId }: { materialId: string }) {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["quizzes", materialId], queryFn: () => quizzesApi.list(materialId) });
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [jawaban, setJawaban] = useState<Record<number, string>>({});
  const [selesai, setSelesai] = useState(false);

  const gen = useMutation({
    mutationFn: () => quizzesApi.generate(materialId, { count: 5, types: ["pilihan_ganda"] }),
    onSuccess: (q) => {
      qc.invalidateQueries({ queryKey: ["quizzes", materialId] });
      mulai(q);
    },
  });
  const simpanSkor = useMutation({ mutationFn: (skor: number) => quizzesApi.saveScore(quiz!.id, skor) });

  function mulai(q: Quiz) {
    setQuiz(q);
    setJawaban({});
    setSelesai(false);
  }

  if (list.isLoading) return <Memuat />;
  const quizzes = list.data ?? [];

  if (!quiz) {
    return (
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Tombol judul="Buat Kuis Baru" ikonKiri={<Ionicons name="add" size={16} color="#fff" />} loading={gen.isPending} onPress={() => gen.mutate()} />
        {quizzes.length > 0 ? <Text style={{ color: tema.muted, fontSize: 13 }}>Kerjakan ulang tanpa biaya AI:</Text> : null}
        {quizzes.map((q) => (
          <Pressable key={q.id} onPress={() => mulai(q)} style={s.baris}>
            <View style={s.nomor}><Ionicons name="clipboard-outline" size={18} color={tema.brand} /></View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: tema.teks, fontWeight: "600" }}>{q.soalJson.questions.length} soal</Text>
              <Text style={{ color: tema.muted, fontSize: 12 }}>
                {q.skor !== null ? `Skor terakhir ${q.skor}/${q.soalJson.questions.length}` : "Belum dikerjakan"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={tema.muted} />
          </Pressable>
        ))}
      </ScrollView>
    );
  }

  const questions: QuizQuestion[] = quiz.soalJson.questions;
  const skor = questions.reduce((s2, q, i) => (norm(jawaban[i] ?? "") === norm(q.jawaban) ? s2 + 1 : s2), 0);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        {selesai ? (
          <View style={s.skorBadge}><Text style={{ color: tema.brand, fontWeight: "800" }}>Skor {skor}/{questions.length}</Text></View>
        ) : <View />}
        <Pressable onPress={() => setQuiz(null)} style={s.kecilBtn}>
          <Text style={{ color: tema.teks, fontWeight: "700", fontSize: 13 }}>Daftar Kuis</Text>
        </Pressable>
      </View>

      {questions.map((q, i) => {
        const opsi = q.tipe === "benar_salah" ? ["Benar", "Salah"] : q.opsi ?? [];
        const betul = norm(jawaban[i] ?? "") === norm(q.jawaban);
        return (
          <View key={i} style={s.kartu}>
            <Text style={{ color: tema.teks, fontWeight: "600" }}>{i + 1}. {q.pertanyaan}</Text>
            <View style={{ gap: 8, marginTop: 10 }}>
              {opsi.map((o) => {
                const pilih = jawaban[i] === o;
                const kunci = norm(o) === norm(q.jawaban);
                let border: string = tema.border,
                  bg: string = tema.card2;
                if (selesai) {
                  if (kunci) { border = "#22C55E"; bg = "rgba(34,197,94,0.1)"; }
                  else if (pilih) { border = tema.merah; bg = "rgba(244,63,94,0.1)"; }
                } else if (pilih) { border = tema.brand; bg = "rgba(249,115,22,0.1)"; }
                return (
                  <Pressable key={o} disabled={selesai} onPress={() => setJawaban((a) => ({ ...a, [i]: o }))} style={[s.opsi, { borderColor: border, backgroundColor: bg }]}>
                    <Text style={{ color: tema.teks }}>{o}</Text>
                  </Pressable>
                );
              })}
            </View>
            {selesai ? (
              <View style={{ backgroundColor: tema.card2, borderRadius: 10, padding: 10, marginTop: 10 }}>
                <Text style={{ color: betul ? "#34D399" : tema.merah, fontWeight: "700" }}>
                  {betul ? "Benar" : `Jawaban: ${q.jawaban}`}
                </Text>
                {q.pembahasan ? <Text style={{ color: tema.muted, marginTop: 4 }}>{q.pembahasan}</Text> : null}
              </View>
            ) : null}
          </View>
        );
      })}

      {!selesai ? (
        <Tombol judul="Selesai & Lihat Skor" onPress={() => { setSelesai(true); simpanSkor.mutate(skor); }} />
      ) : (
        <Tombol judul="Kerjakan Ulang" warna={tema.card2} onPress={() => { setJawaban({}); setSelesai(false); }} />
      )}
    </ScrollView>
  );
}

// ── CHAT ────────────────────────────────────────────────────
function ChatTab({ materialId }: { materialId: string }) {
  const qc = useQueryClient();
  const sessions = useQuery({ queryKey: ["chat-sessions", materialId], queryFn: () => chatApi.listSessions(materialId) });
  const sessionId = sessions.data?.[0]?.id;

  const buatSesi = useMutation({
    mutationFn: () => chatApi.createSession(materialId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chat-sessions", materialId] }),
  });

  const messages = useQuery({
    queryKey: ["chat-messages", sessionId],
    queryFn: () => chatApi.getMessages(sessionId!),
    enabled: !!sessionId,
  });

  const [teks, setTeks] = useState("");
  const kirim = useMutation({
    mutationFn: (q: string) => chatApi.sendMessage(sessionId!, { question: q }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["chat-messages", sessionId] }),
  });

  if (sessions.isLoading) return <Memuat />;
  if (!sessionId) {
    return (
      <View style={{ padding: 24, gap: 14, alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Ionicons name="chatbubbles-outline" size={30} color={tema.brand} />
        <Text style={{ color: tema.muted, textAlign: "center" }}>Mulai sesi tanya-jawab tentang materi ini.</Text>
        <View style={{ alignSelf: "stretch" }}>
          <Tombol judul="Mulai Chat" loading={buatSesi.isPending} onPress={() => buatSesi.mutate()} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        {(messages.data ?? []).map((msg) => (
          <View key={msg.id} style={[s.bubble, msg.role === "user" ? s.bubbleUser : s.bubbleAI]}>
            <Text style={{ color: msg.role === "user" ? "#fff" : tema.teks, lineHeight: 20 }}>{msg.konten}</Text>
          </View>
        ))}
        {kirim.isPending ? <ActivityIndicator color={tema.brand} style={{ marginTop: 8 }} /> : null}
      </ScrollView>
      <View style={s.chatInput}>
        <TextInput
          value={teks}
          onChangeText={setTeks}
          placeholder="Tanya sesuatu…"
          placeholderTextColor={tema.muted}
          style={{ flex: 1, color: tema.teks }}
        />
        <Pressable
          disabled={!teks.trim() || kirim.isPending}
          onPress={() => { kirim.mutate(teks.trim()); setTeks(""); }}
          style={[s.kirimBtn, (!teks.trim() || kirim.isPending) && { opacity: 0.4 }]}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

/** Gaya markdown untuk isi bab (tema gelap). */
const md = StyleSheet.create({
  body: { color: tema.teks, fontSize: 15, lineHeight: 24 },
  heading1: { color: tema.teks, fontSize: 22, fontWeight: "800", marginTop: 12, marginBottom: 6 },
  heading2: { color: tema.teks, fontSize: 19, fontWeight: "800", marginTop: 12, marginBottom: 6 },
  heading3: { color: tema.teks, fontSize: 17, fontWeight: "700", marginTop: 10, marginBottom: 4 },
  strong: { color: tema.teks, fontWeight: "800" },
  em: { fontStyle: "italic" },
  bullet_list_icon: { color: tema.brand },
  ordered_list_icon: { color: tema.brand },
  code_inline: {
    backgroundColor: tema.card2,
    color: tema.brand,
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  fence: {
    backgroundColor: tema.card2,
    borderColor: tema.border,
    borderWidth: 1,
    borderRadius: 10,
    color: tema.teks,
    padding: 12,
  },
  code_block: {
    backgroundColor: tema.card2,
    borderColor: tema.border,
    borderWidth: 1,
    borderRadius: 10,
    color: tema.teks,
    padding: 12,
  },
  blockquote: {
    backgroundColor: tema.card2,
    borderLeftColor: tema.brand,
    borderLeftWidth: 3,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  hr: { backgroundColor: tema.border, height: 1 },
  link: { color: tema.brand },
  table: { borderColor: tema.border },
  th: { color: tema.teks },
  td: { color: tema.teks },
});

const s = StyleSheet.create({
  aksi: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  aksiBtn: {
    height: 36,
    width: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tema.border,
    backgroundColor: tema.card,
    alignItems: "center",
    justifyContent: "center",
  },
  fileBaris: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 14,
    padding: 14,
  },
  fileIkon: {
    height: 40,
    width: 40,
    borderRadius: 12,
    backgroundColor: "rgba(249,115,22,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  tabbar: { gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  tabBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: tema.border,
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
    borderRadius: 14,
    padding: 12,
  },
  nomor: {
    height: 34,
    width: 34,
    borderRadius: 10,
    backgroundColor: "rgba(249,115,22,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  kecilBtn: { borderWidth: 1, borderColor: tema.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  dot: { height: 8, width: 8, borderRadius: 4 },
  flashcard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 18,
    padding: 24,
  },
  navBtn: {
    height: 46,
    width: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: tema.border,
    alignItems: "center",
    justifyContent: "center",
  },
  kartu: { backgroundColor: tema.card, borderWidth: 1, borderColor: tema.border, borderRadius: 14, padding: 14 },
  opsi: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  skorBadge: { backgroundColor: "rgba(249,115,22,0.15)", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  bubble: { maxWidth: "85%", borderRadius: 16, padding: 12 },
  bubbleUser: { alignSelf: "flex-end", backgroundColor: tema.brand },
  bubbleAI: { alignSelf: "flex-start", backgroundColor: tema.card, borderWidth: 1, borderColor: tema.border },
  chatInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: tema.border,
  },
  kirimBtn: { height: 42, width: 42, borderRadius: 21, backgroundColor: tema.brand, alignItems: "center", justifyContent: "center" },
});
