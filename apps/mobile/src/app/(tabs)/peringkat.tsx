import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui";
import { tema } from "@/lib/tema";

/**
 * Leaderboard (ss 28) butuh sistem XP/aktivitas nyata yang belum dibangun
 * (masih mock di backend). Ditampilkan sebagai placeholder jujur, bukan data palsu.
 */
export default function PeringkatScreen() {
  return (
    <Screen>
      <View style={{ padding: 16 }}>
        <Text style={{ color: tema.muted, fontSize: 12, letterSpacing: 1 }}>KOMUNITAS</Text>
        <Text style={{ color: tema.teks, fontSize: 26, fontWeight: "800" }}>Leaderboard</Text>
        <Text style={{ color: tema.muted, marginTop: 2 }}>Top pelajar paling konsisten minggu ini</Text>
      </View>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
        <View style={s.ikon}>
          <Ionicons name="trophy-outline" size={30} color={tema.brand} />
        </View>
        <Text style={{ color: tema.teks, fontWeight: "700", fontSize: 16, marginTop: 16 }}>Segera hadir</Text>
        <Text style={{ color: tema.muted, textAlign: "center", marginTop: 6 }}>
          Peringkat berdasarkan XP & streak akan aktif setelah sistem gamifikasi dinyalakan.
        </Text>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  ikon: {
    height: 64,
    width: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
});
