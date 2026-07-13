import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tema } from "@/lib/tema";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

function icon(name: IoniconName) {
  const C = ({ color, size }: { color: string; size: number }) => (
    <Ionicons name={name} color={color} size={size} />
  );
  C.displayName = `TabIcon(${name})`;
  return C;
}

export default function TabsLayout() {
  // Jarak dari tepi bawah: gesture bar Android/iOS + sedikit ruang, supaya
  // navbar yang melayang tidak menabrak indikator sistem.
  const insets = useSafeAreaInsets();
  const bawah = Math.max(insets.bottom, 10) + 6;

  // Tidak ada gerbang onboarding di sini: `splash.tsx` yang memutuskan tujuan
  // setelah login. Menaruh redirect di sini pernah menyebabkan loop.
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tema.brand,
        tabBarInactiveTintColor: tema.muted,
        // Navbar MELAYANG: lepas dari tepi layar, sudut membulat penuh.
        tabBarStyle: {
          position: "absolute",
          left: 14,
          right: 14,
          bottom: bawah,
          height: 66,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: tema.card,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: tema.border,
          // hilangkan garis atas bawaan — kita pakai border penuh
          borderTopWidth: 1,
          borderTopColor: tema.border,
          elevation: 12,
          shadowColor: "#000",
          shadowOpacity: 0.35,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 6 },
          ...Platform.select({ android: { overflow: "hidden" as const } }),
        },
        tabBarItemStyle: { paddingVertical: 2 },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      }}
    >
      <Tabs.Screen name="beranda" options={{ title: "Beranda", tabBarIcon: icon("home-outline") }} />
      <Tabs.Screen
        name="mata-pelajaran"
        options={{ title: "Mata Pelajaran", tabBarIcon: icon("folder-outline") }}
      />
      <Tabs.Screen name="ujian" options={{ title: "Ujian", tabBarIcon: icon("document-text-outline") }} />
      <Tabs.Screen name="peringkat" options={{ title: "Peringkat", tabBarIcon: icon("trophy-outline") }} />
      <Tabs.Screen name="profil" options={{ title: "Profil", tabBarIcon: icon("settings-outline") }} />
    </Tabs>
  );
}
