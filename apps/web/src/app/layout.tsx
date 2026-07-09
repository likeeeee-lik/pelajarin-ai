import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/query-provider";

export const metadata: Metadata = {
  title: "Pelajarin.ai — Ubah 6 Jam Belajar Jadi 1 Jam",
  description:
    "Transformasi cara belajarmu dengan AI. Upload materi apapun, dapatkan ringkasan, flashcard, dan kuis dalam sekejap.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
