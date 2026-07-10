import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tema.brand,
        tabBarInactiveTintColor: tema.muted,
        tabBarStyle: {
          backgroundColor: tema.card,
          borderTopColor: tema.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11 },
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
