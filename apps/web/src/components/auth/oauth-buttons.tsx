"use client";

import { signInWith } from "@/lib/auth";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5Z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.6 5.1C9.6 39.6 16.2 44 24 44Z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.3C41.6 35.8 44 30.4 44 24c0-1.3-.1-2.3-.4-3.5Z"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.2.5c1.7.4 3.2 1.1 4.6 2A16.7 16.7 0 0 0 5 5.5 17 17 0 0 1 9.6 3.5L9.4 3A19.8 19.8 0 0 0 3.7 4.4C1.2 8.1.5 11.8.8 15.4a19.9 19.9 0 0 0 6 3l.8-1.1c-.7-.3-1.4-.6-2-1l.5-.4a14.2 14.2 0 0 0 12 0l.5.4c-.6.4-1.3.7-2 1l.8 1.1a19.9 19.9 0 0 0 6-3c.4-4.2-.6-7.9-3.1-11ZM9 13.6c-1 0-1.7-.9-1.7-1.9S8 9.8 9 9.8s1.7.9 1.7 1.9-.7 1.9-1.7 1.9Zm6 0c-1 0-1.7-.9-1.7-1.9S14 9.8 15 9.8s1.7.9 1.7 1.9-.7 1.9-1.7 1.9Z" />
    </svg>
  );
}

export function OAuthButtons({ verb = "Masuk" }: { verb?: string }) {
  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => signInWith("google")}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-ink-500 bg-ink-700/60 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-ink-500/60"
      >
        <GoogleIcon />
        {verb} dengan Google
      </button>
      <button
        type="button"
        onClick={() => signInWith("discord")}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-ink-500 bg-ink-700/60 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-ink-500/60"
      >
        <span className="text-[#5865F2]">
          <DiscordIcon />
        </span>
        {verb} dengan Discord
      </button>
    </div>
  );
}

export function OrDivider({ label = "ATAU" }: { label?: string }) {
  return (
    <div className="my-6 flex items-center gap-4">
      <span className="h-px flex-1 bg-ink-500" />
      <span className="text-xs font-semibold tracking-[0.2em] text-muted">
        {label}
      </span>
      <span className="h-px flex-1 bg-ink-500" />
    </div>
  );
}
