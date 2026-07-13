import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tema } from "@/lib/tema";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

/** Tinggi bar; radius = TINGGI/2 supaya jadi pil penuh. */
const TINGGI = 58;

function icon(name: IoniconName) {
  const C = ({ color }: { color: string }) => <Ionicons name={name} color={color} size={20} />;
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
        // Navbar MELAYANG berbentuk PIL: radius = setengah tinggi, jadi ujungnya
        // benar-benar bulat penuh (bukan sekadar sudut tumpul).
        tabBarStyle: {
          position: "absolute",
          left: 12,
          right: 12,
          bottom: bawah,
          height: TINGGI,
          paddingTop: 6,
          paddingBottom: 6,
          backgroundColor: tema.card,
          borderRadius: TINGGI / 2,
          borderWidth: 1,
          borderColor: tema.border,
          borderTopWidth: 1,
          borderTopColor: tema.border,
          elevation: 12,
          shadowColor: "#000",
          shadowOpacity: 0.4,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          ...Platform.select({ android: { overflow: "hidden" as const } }),
        },
        tabBarItemStyle: { paddingVertical: 0 },
        tabBarLabelStyle: { fontSize: 9.5, fontWeight: "600", marginTop: -2 },
        tabBarIconStyle: { marginTop: 2 },
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
