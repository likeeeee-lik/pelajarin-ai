import Svg, { Circle, Path } from "react-native-svg";

/**
 * Logo Pelajarin.ai — buku terbuka dengan wajah senyum + bookmark.
 * Path-nya sama persis dengan apps/web/src/components/logo.tsx.
 */
export function LogoMark({ size = 48, color = "#FFFFFF" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* halaman buku terbuka */}
      <Path
        d="M24 13c-4-3-9-3.5-14-2.5v25c5-1 10-0.5 14 2.5 4-3 9-3.5 14-2.5v-25c-5-1-10-0.5-14 2.5Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* mata */}
      <Circle cx="17.5" cy="21" r="1.1" fill={color} />
      <Circle cx="24.5" cy="21" r="1.1" fill={color} />
      {/* senyum */}
      <Path d="M17 25c1.6 2 4.4 2 6 0" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {/* bookmark */}
      <Path
        d="M29 24.5c1.6 0 2.8 1.2 2.8 2.8S29 31 29 31"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
