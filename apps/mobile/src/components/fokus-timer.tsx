import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { tema } from "@/lib/tema";

const DEFAULT_MENIT = 25;

/**
 * Timer fokus (Pomodoro) — padanan "Fokus 25:00" di sidebar workspace web.
 * Ringkas: satu baris di header workspace, bisa play/pause/reset.
 */
export function FokusTimer() {
  const [sisa, setSisa] = useState(DEFAULT_MENIT * 60);
  const [jalan, setJalan] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!jalan) return;
    ref.current = setInterval(() => {
      setSisa((s) => {
        if (s <= 1) {
          setJalan(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [jalan]);

  const menit = String(Math.floor(sisa / 60)).padStart(2, "0");
  const detik = String(sisa % 60).padStart(2, "0");
  const selesai = sisa === 0;

  function reset() {
    setJalan(false);
    setSisa(DEFAULT_MENIT * 60);
  }

  return (
    <View style={[s.wrap, jalan && { borderColor: tema.brand }, selesai && { borderColor: tema.hijau }]}>
      <Ionicons
        name={selesai ? "checkmark-circle" : "timer-outline"}
        size={16}
        color={selesai ? tema.hijau : tema.brand}
      />
      <Text style={{ color: selesai ? tema.hijau : tema.teks, fontWeight: "800", fontVariant: ["tabular-nums"] }}>
        {selesai ? "Selesai!" : `${menit}:${detik}`}
      </Text>

      <Pressable onPress={() => (selesai ? reset() : setJalan((v) => !v))} hitSlop={8}>
        <Ionicons
          name={selesai ? "refresh" : jalan ? "pause" : "play"}
          size={16}
          color={tema.muted}
        />
      </Pressable>

      {!selesai && sisa !== DEFAULT_MENIT * 60 ? (
        <Pressable onPress={reset} hitSlop={8}>
          <Ionicons name="refresh" size={16} color={tema.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: tema.border,
    backgroundColor: tema.card,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
});
