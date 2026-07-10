import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { tema } from "@/lib/tema";

export function Screen({
  children,
  edges = ["top"],
}: {
  children: React.ReactNode;
  edges?: Edge[];
}) {
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: tema.bg }}>
      {children}
    </SafeAreaView>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function Field({ label, ...props }: TextInputProps & { label?: string }) {
  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <TextInput placeholderTextColor={tema.muted} style={s.input} autoCapitalize="none" {...props} />
    </View>
  );
}

export function Tombol({
  judul,
  onPress,
  loading,
  disabled,
  warna = tema.brand,
  ikonKiri,
}: {
  judul: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  warna?: string;
  ikonKiri?: React.ReactNode;
}) {
  const mati = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={mati}
      style={({ pressed }) => [
        s.tombol,
        { backgroundColor: warna },
        mati && { opacity: 0.5 },
        pressed && !mati && { opacity: 0.85 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {ikonKiri}
          <Text style={s.tombolTeks}>{judul}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function Galat({ pesan }: { pesan?: string | null }) {
  if (!pesan) return null;
  return (
    <View style={s.galat}>
      <Text style={{ color: tema.merah, fontSize: 13 }}>{pesan}</Text>
    </View>
  );
}

export function Pusat({ children }: { children: React.ReactNode }) {
  return <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>{children}</View>;
}

export function Memuat() {
  return (
    <Pusat>
      <ActivityIndicator color={tema.brand} size="large" />
    </Pusat>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 18,
    padding: 16,
  },
  label: { color: tema.muted, fontSize: 13, fontWeight: "500" },
  input: {
    backgroundColor: tema.card,
    borderWidth: 1,
    borderColor: tema.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: tema.teks,
    fontSize: 15,
  },
  tombol: { borderRadius: 16, paddingVertical: 15, alignItems: "center", justifyContent: "center" },
  tombolTeks: { color: "#fff", fontWeight: "700", fontSize: 15 },
  galat: {
    backgroundColor: "rgba(244,63,94,0.1)",
    borderWidth: 1,
    borderColor: "rgba(244,63,94,0.4)",
    borderRadius: 12,
    padding: 12,
  },
});
