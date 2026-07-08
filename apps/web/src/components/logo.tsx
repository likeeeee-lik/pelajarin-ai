/** Logo Pelajarin.ai — buku terbuka dengan wajah senyum + bookmark. */
export function LogoMark({
  className = "h-9 w-9",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* halaman buku terbuka */}
      <path d="M24 13c-4-3-9-3.5-14-2.5v25c5-1 10-0.5 14 2.5 4-3 9-3.5 14-2.5v-25c-5-1-10-0.5-14 2.5Z" />
      {/* mata */}
      <circle cx="17.5" cy="21" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="24.5" cy="21" r="1.1" fill="currentColor" stroke="none" />
      {/* senyum */}
      <path d="M17 25c1.6 2 4.4 2 6 0" />
      {/* bookmark seperti pin */}
      <path d="M29 24.5c1.6 0 2.8 1.2 2.8 2.8S29 31 29 31" />
    </svg>
  );
}

export function LogoWordmark({
  className = "",
  markClass = "h-7 w-7",
}: {
  className?: string;
  markClass?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoMark className={`${markClass} text-white`} />
      <span className="text-xl font-extrabold tracking-tight">pelajarin.ai</span>
    </div>
  );
}
