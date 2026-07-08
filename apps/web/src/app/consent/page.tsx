import { AuthShell } from "@/components/auth/auth-shell";
import { ConsentActions } from "@/components/auth/consent-actions";

const SCOPES = [
  { name: "OpenID", desc: "Verify your identity" },
  { name: "Profile", desc: "Access your name and profile picture" },
  { name: "Email", desc: "Access your email address" },
];

export default function ConsentPage() {
  return (
    <AuthShell title="Authorize access" wide>
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full border border-ink-500 text-muted">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
          </svg>
        </span>
        <p className="text-sm">
          <span className="font-bold">pelajarin.ai web</span>{" "}
          <span className="text-muted">wants to access:</span>
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {SCOPES.map((s) => (
          <li key={s.name} className="card px-5 py-4">
            <div className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted" />
              <div>
                <p className="font-bold">{s.name}</p>
                <p className="text-sm text-muted">{s.desc}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <ConsentActions />
      </div>
    </AuthShell>
  );
}
