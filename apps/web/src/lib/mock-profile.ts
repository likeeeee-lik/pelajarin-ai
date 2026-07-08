/** Statistik & langganan tiruan untuk halaman Profil. TODO(API): GET /me + /usage. */
export const MOCK_PROFILE_STATS = {
  totalCatatan: 0,
  flashcardDibuat: 0,
  kuisDibuat: 0,
  prediksiUjian: 0,
  totalFile: 0,
};

export const MOCK_SUBSCRIPTION = {
  plan: "Gratis" as const,
  siklusTagihan: "Bulanan",
  quotas: [
    { label: "Catatan Mingguan", used: 0, limit: 1, resetDate: "8 Juli 2026", color: "bg-brand" },
    { label: "Chat AI Mingguan", used: 0, limit: 0, resetDate: "8 Juli 2026", color: "bg-purple-500" },
    { label: "Prediksi Ujian (Demo)", used: 0, limit: 1, resetDate: null, color: "bg-brand" },
  ],
};

export const BAHASA_TAMPILAN = [
  { value: "id", label: "Indonesia" },
  { value: "en", label: "English" },
];

export const BAHASA_GENERASI = [
  { value: "id", label: "Bahasa Indonesia" },
  { value: "en", label: "Bahasa Inggris" },
];
