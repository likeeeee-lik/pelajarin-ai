import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { tema } from "@/lib/tema";

export function Field({
  label,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        placeholderTextColor={tema.muted}
        style={s.input}
        autoCapitalize="none"
        {...props}
      />
    </View>
  );
}

export function Tombol({
  judul,
  onPress,
  loading,
  disabled,
}: {
  judul: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  const mati = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={mati}
      style={({ pressed }) => [s.tombol, mati && { opacity: 0.5 }, pressed && !mati && { opacity: 0.85 }]}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.tombolTeks}>{judul}</Text>}
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

const s = StyleSheet.create({
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
  tombol: {
    backgroundColor: tema.brand,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tombolTeks: { color: "#fff", fontWeight: "700", fontSize: 15 },
  galat: {
    backgroundColor: "rgba(244,63,94,0.1)",
    borderWidth: 1,
    borderColor: "rgba(244,63,94,0.4)",
    borderRadius: 12,
    padding: 12,
  },
});
