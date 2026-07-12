import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useQueryClient } from "@tanstack/react-query";
import { meApi } from "@/lib/api/resources";
import { activeQuestions } from "@/lib/onboarding/questions";
import { computeRadar, RADAR_AXES } from "@/lib/onboarding/scoring";
import type { Answers, Question } from "@/lib/onboarding/types";
import { Screen, Tombol } from "@/components/ui";
import { tema } from "@/lib/tema";

/** Nilai awal tiap pertanyaan (agar slider punya posisi). */
function seed(qs: Question[]): Answers {
  const a: Answers = {};
  for (const q of qs) {
    if (q.kind === "scale" || q.kind === "semantic" || q.kind === "capsule") a[q.id] = q.default;
    else if (q.kind === "curve") a[q.id] = q.hours.map(() => q.default);
    else if (q.kind === "dual") {
      a[q.left.key] = q.left.default;
      a[q.right.key] = q.right.default;
    }
  }
  return a;
}

function terjawab(q: Question, a: Answers): boolean {
  if (q.kind === "single") return typeof a[q.id] === "string";
  return true; // slider selalu punya nilai
}

export default function OnboardingScreen() {
  const qc = useQueryClient();
  const [answers, setAnswers] = useState<Answers>(() => seed(activeQuestions({})));
  const [i, setI] = useState(0);
  const [selesai, setSelesai] = useState(false);

  const aktif = useMemo(() => activeQuestions(answers), [answers]);
  const total = aktif.length;
  const q = aktif[Math.min(i, total - 1)];

  const set = (key: string, v: Answers[string]) => setAnswers((p) => ({ ...p, [key]: v }));

  async function tuntas() {
    try {
      const p = await meApi.update({ onboardingCompleted: true });
      qc.setQueryData(["me"], p);
    } catch {
      /* jangan menahan user bila API bermasalah */
    }
    router.replace("/beranda");
  }

  if (selesai) {
    const skor = computeRadar(answers);
    return (
      <Screen edges={["top", "bottom"]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ScrollView contentContainerStyle={{ padding: 24, gap: 18, flexGrow: 1, justifyContent: "center" }}>
          <View style={{ alignItems: "center", gap: 8 }}>
            <View style={s.hasilIkon}>
              <Ionicons name="sparkles" size={30} color={tema.brand} />
            </View>
            <Text style={{ color: tema.teks, fontSize: 24, fontWeight: "800" }}>Profil belajarmu siap</Text>
            <Text style={{ color: tema.muted, textAlign: "center" }}>
              AI akan menyesuaikan gaya bantuan berdasarkan {total} jawabanmu.
            </Text>
          </View>

          <View style={{ gap: 10, marginTop: 8 }}>
            {RADAR_AXES.map((ax) => {
              const v = skor[ax.key];
              return (
                <View key={ax.key} style={{ gap: 4 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ color: tema.muted, fontSize: 13 }}>{ax.label}</Text>
                    <Text style={{ color: tema.teks, fontSize: 13, fontWeight: "700" }}>{v}</Text>
                  </View>
                  <View style={s.barBg}>
                    <View style={[s.barFg, { width: `${v}%` }]} />
                  </View>
                </View>
              );
            })}
          </View>

          <Tombol judul="Mulai Belajar" onPress={tuntas} />
        </ScrollView>
      </Screen>
    );
  }

  const bisaLanjut = terjawab(q, answers);
  const terakhir = i >= total - 1;

  return (
    <Screen edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* header: back · N/total · Lewati */}
      <View style={s.header}>
        {i > 0 ? (
          <Pressable onPress={() => setI(i - 1)} hitSlop={10}>
            <Ionicons name="chevron-back" size={24} color={tema.teks} />
          </Pressable>
        ) : (
          <View style={{ width: 24 }} />
        )}
        <Text style={{ color: tema.muted, fontWeight: "600" }}>
          {i + 1} / {total}
        </Text>
        <Pressable onPress={tuntas} hitSlop={10}>
          <Text style={{ color: tema.muted, fontWeight: "700" }}>Lewati</Text>
        </Pressable>
      </View>

      <View style={s.progresBg}>
        <View style={[s.progresFg, { width: `${((i + 1) / total) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, gap: 24 }}>
        <View style={{ gap: 6 }}>
          <Text style={{ color: tema.teks, fontSize: 21, fontWeight: "800", textAlign: "center" }}>{q.title}</Text>
          {q.subtitle ? (
            <Text style={{ color: tema.muted, textAlign: "center" }}>{q.subtitle}</Text>
          ) : null}
        </View>

        <Input q={q} answers={answers} set={set} />
      </ScrollView>

      <View style={{ padding: 20 }}>
        <Tombol
          judul={terakhir ? "Selesai" : "Lanjut"}
          disabled={!bisaLanjut}
          onPress={() => (terakhir ? setSelesai(true) : setI(i + 1))}
        />
      </View>
    </Screen>
  );
}

// ── Input per jenis pertanyaan ──────────────────────────────
function Input({
  q,
  answers,
  set,
}: {
  q: Question;
  answers: Answers;
  set: (key: string, v: Answers[string]) => void;
}) {
  if (q.kind === "single") {
    const dipilih = answers[q.id];
    return (
      <View style={{ gap: 12 }}>
        {q.options.map((o) => {
          const aktif = dipilih === o.value;
          return (
            <Pressable
              key={o.value}
              onPress={() => set(q.id, o.value)}
              style={[s.opsi, aktif && { borderColor: tema.brand, backgroundColor: "rgba(249,115,22,0.1)" }]}
            >
              {o.icon ? (
                <Ionicons name={o.icon} size={22} color={aktif ? tema.brand : tema.muted} />
              ) : null}
              <View style={{ flex: 1 }}>
                <Text style={{ color: aktif ? tema.brand : tema.teks, fontWeight: "600", fontSize: 15 }}>
                  {o.label}
                </Text>
                {o.sublabel ? (
                  <Text style={{ color: tema.muted, fontSize: 12, marginTop: 2 }}>{o.sublabel}</Text>
                ) : null}
              </View>
              {aktif ? <Ionicons name="checkmark-circle" size={20} color={tema.brand} /> : null}
            </Pressable>
          );
        })}
      </View>
    );
  }

  if (q.kind === "scale") {
    const v = (answers[q.id] as number) ?? q.default;
    const label = q.valueLabel(v);
    return (
      <View style={{ alignItems: "center", gap: 8 }}>
        <Text style={{ color: "#FACC15", fontSize: 44, fontWeight: "800" }}>{v}</Text>
        <Text style={{ fontSize: 22 }}>{label.emoji}</Text>
        <Text style={{ color: tema.muted }}>{label.text}</Text>
        <Garis
          min={q.min}
          max={q.max}
          step={q.step}
          value={v}
          onChange={(x) => set(q.id, x)}
        />
      </View>
    );
  }

  if (q.kind === "capsule") {
    const v = (answers[q.id] as number) ?? q.default;
    const label = q.valueLabel(v);
    return (
      <View style={{ alignItems: "center", gap: 8 }}>
        <Text style={{ fontSize: 30 }}>{label.emoji}</Text>
        <Text style={{ color: tema.teks, fontSize: 34, fontWeight: "800" }}>{v}%</Text>
        <Text style={{ color: label.color, fontWeight: "700" }}>{label.text}</Text>
        <Garis min={0} max={100} step={1} value={v} onChange={(x) => set(q.id, x)} />
      </View>
    );
  }

  if (q.kind === "semantic") {
    const v = (answers[q.id] as number) ?? q.default;
    return (
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: tema.teks, flex: 1, fontSize: 13 }}>{q.leftLabel}</Text>
          <Text style={{ color: tema.teks, flex: 1, fontSize: 13, textAlign: "right" }}>{q.rightLabel}</Text>
        </View>
        <Garis min={0} max={100} step={1} value={v} onChange={(x) => set(q.id, x)} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: tema.muted, fontSize: 12 }}>{100 - v}%</Text>
          <Text style={{ color: tema.brand, fontSize: 12, fontWeight: "700" }}>{q.centerLabel(v)}</Text>
          <Text style={{ color: tema.muted, fontSize: 12 }}>{v}%</Text>
        </View>
      </View>
    );
  }

  if (q.kind === "dual") {
    return (
      <View style={{ gap: 20 }}>
        {[q.left, q.right].map((sisi) => {
          const v = (answers[sisi.key] as number) ?? sisi.default;
          return (
            <View key={sisi.key} style={{ gap: 4 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: tema.teks, fontWeight: "600" }}>{sisi.label}</Text>
                <Text style={{ color: tema.brand, fontWeight: "800" }}>{v.toFixed(1)}</Text>
              </View>
              <Garis
                min={sisi.min}
                max={sisi.max}
                step={sisi.step}
                value={v}
                onChange={(x) => set(sisi.key, Math.round(x * 10) / 10)}
              />
            </View>
          );
        })}
      </View>
    );
  }

  // curve — Golden Hours
  const nilai = (answers[q.id] as number[]) ?? q.hours.map(() => q.default);
  const NAMA = ["Pagi", "Siang", "Sore", "Malam"];
  return (
    <View style={{ gap: 18 }}>
      {q.hours.map((_, idx) => {
        const v = nilai[idx] ?? q.default;
        return (
          <View key={idx} style={{ gap: 4 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: tema.teks, fontWeight: "600" }}>{NAMA[idx] ?? `Jam ${q.hours[idx]}`}</Text>
              <Text style={{ color: tema.brand, fontWeight: "800" }}>{v}</Text>
            </View>
            <Garis
              min={0}
              max={100}
              step={1}
              value={v}
              onChange={(x) => {
                const baru = [...nilai];
                baru[idx] = x;
                set(q.id, baru);
              }}
            />
          </View>
        );
      })}
    </View>
  );
}

function Garis({
  min,
  max,
  step,
  value,
  onChange,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <Slider
      style={{ width: "100%", height: 40 }}
      minimumValue={min}
      maximumValue={max}
      step={step}
      value={value}
      onValueChange={onChange}
      minimumTrackTintColor={tema.brand}
      maximumTrackTintColor={tema.border}
      thumbTintColor={tema.brand}
    />
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  progresBg: { height: 4, backgroundColor: tema.border, marginHorizontal: 20, borderRadius: 2 },
  progresFg: { height: 4, backgroundColor: tema.brand, borderRadius: 2 },
  opsi: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: tema.border,
    backgroundColor: tema.card,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  hasilIkon: {
    height: 72,
    width: 72,
    borderRadius: 36,
    backgroundColor: "rgba(249,115,22,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  barBg: { height: 8, backgroundColor: tema.card2, borderRadius: 4, overflow: "hidden" },
  barFg: { height: 8, backgroundColor: tema.brand, borderRadius: 4 },
});
