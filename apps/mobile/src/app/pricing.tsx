import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Tombol } from "@/components/ui";
import { tema } from "@/lib/tema";

const PAKET = [
  { nama: "Tahunan", harga: "Rp 30.000", per: "/bln", catatan: "Total Rp 360.000 / tahun", tag: "PALING HEMAT", hemat: "Hemat 50%" },
  { nama: "6 Bulan", harga: "Rp 48.000", per: "/bln", catatan: "Total Rp 288.000 / 6 bln", tag: null, hemat: "Hemat 20%" },
  { nama: "Bulanan", harga: "Rp 60.000", per: "/bln", catatan: "", tag: null, hemat: null },
];

/**
 * Pricing (ss 35). Pembayaran belum dibangun — tombol menampilkan info jujur,
 * belum memproses transaksi. TODO: integrasi Midtrans/Xendit + gating Pro.
 */
export default function PricingScreen() {
  return (
    <Screen edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={s.header}>
        <View style={s.premium}>
          <Ionicons name="trophy" size={14} color={tema.brand} />
          <Text style={{ color: tema.brand, fontWeight: "800", fontSize: 12 }}>PREMIUM</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View style={{ alignItems: "center", gap: 8, marginBottom: 8 }}>
          <View style={s.ikonBesar}>
            <Ionicons name="sparkles" size={30} color={tema.brand} />
          </View>
          <Text style={{ color: tema.teks, fontSize: 22, fontWeight: "800" }}>Tanya AI Sepuasnya</Text>
          <Text style={{ color: tema.muted, textAlign: "center" }}>
            Dapatkan penjelasan konsep sulit langsung dari AI Mentor 24/7.
          </Text>
        </View>

        <Text style={{ color: tema.muted, fontSize: 12, letterSpacing: 1 }}>PILIH PAKET BELAJARMU</Text>

        {PAKET.map((p, i) => (
          <View key={p.nama} style={[s.paket, i === 0 && { borderColor: tema.brand }]}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ color: i === 0 ? tema.brand : tema.teks, fontWeight: "800", fontSize: 16 }}>
                  {p.nama}
                </Text>
                {p.tag ? (
                  <View style={s.tag}>
                    <Text style={{ color: tema.ungu, fontSize: 10, fontWeight: "800" }}>{p.tag}</Text>
                  </View>
                ) : null}
              </View>
              {p.catatan ? <Text style={{ color: tema.muted, fontSize: 12 }}>{p.catatan}</Text> : null}
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: tema.teks, fontWeight: "800", fontSize: 16 }}>
                {p.harga}
                <Text style={{ color: tema.muted, fontSize: 12 }}>{p.per}</Text>
              </Text>
              {p.hemat ? <Text style={{ color: tema.brand, fontSize: 11, fontWeight: "700" }}>{p.hemat}</Text> : null}
            </View>
          </View>
        ))}

        <Tombol
          judul="Upgrade ke Pro"
          onPress={() =>
            Alert.alert("Segera hadir", "Pembayaran belum tersedia. Fitur ini sedang dalam pengembangan.")
          }
        />
        <Text style={{ color: tema.muted, textAlign: "center", fontSize: 12 }}>
          Pembayaran belum aktif — sedang dalam pengembangan.
        </Text>
      </ScrollView>

      <View style={{ position: "absolute", top: 16, left: 16 }}>
        <Ionicons name="close" size={26} color={tema.teks} onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  header: { alignItems: "center", paddingTop: 12 },
  premium: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.5)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  ikonBesar: {
    height: 72,
    width: 72,
    borderRadius: 24,
    backgroundColor: "rgba(249,115,22,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  paket: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 16,
    padding: 16,
  },
  tag: { backgroundColor: "rgba(168,85,247,0.15)", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
});
