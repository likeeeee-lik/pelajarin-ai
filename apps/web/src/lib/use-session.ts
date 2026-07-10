"use client";

import { useQuery } from "@tanstack/react-query";
import { meApi } from "@/lib/api/resources";
import type { Profile } from "@/lib/api/types";
import { useSignedIn } from "@/lib/session";

const MODE = process.env.NEXT_PUBLIC_AUTH_MODE ?? "stub";

/**
 * Sumber tunggal identitas & status login di UI.
 * - Profil (nama/email/avatar/plan) SELALU dari API `GET /me`.
 * - Status login:
 *   - local/logto : `/me` berhasil = sudah masuk (token dari cookie sesi).
 *   - stub        : penanda localStorage (API menerima token apa pun).
 */
export function useSession(): {
  signedIn: boolean;
  profile: Profile | null;
  isLoading: boolean;
} {
  const stubSignedIn = useSignedIn();
  const me = useQuery({
    queryKey: ["me"],
    queryFn: meApi.get,
    retry: false,
    staleTime: 5 * 60_000,
  });

  const signedIn = MODE === "stub" ? stubSignedIn : !!me.data;
  return { signedIn, profile: me.data ?? null, isLoading: me.isLoading };
}
