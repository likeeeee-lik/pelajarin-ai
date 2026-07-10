import { ActivityIndicator, View } from "react-native";
import { tema } from "@/lib/tema";

/** Layar antara: _layout.tsx segera mengalihkan ke /masuk atau /beranda. */
export default function Index() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: tema.bg }}>
      <ActivityIndicator color={tema.brand} size="large" />
    </View>
  );
}
