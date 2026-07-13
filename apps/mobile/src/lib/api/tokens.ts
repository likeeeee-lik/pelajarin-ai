import * as SecureStore from "expo-secure-store";

/**
 * Token disimpan di penyimpanan aman perangkat (Keychain iOS / Keystore Android),
 * BUKAN AsyncStorage yang isinya bisa dibaca aplikasi lain pada perangkat rooted.
 */
const ACCESS = "pelajarin_token";
const REFRESH = "pelajarin_refresh";

export async function simpanToken(token: string, refreshToken: string) {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS, token),
    SecureStore.setItemAsync(REFRESH, refreshToken),
  ]);
}

export function ambilAccessToken() {
  return SecureStore.getItemAsync(ACCESS);
}

export function ambilRefreshToken() {
  return SecureStore.getItemAsync(REFRESH);
}

export async function hapusToken() {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS),
    SecureStore.deleteItemAsync(REFRESH),
  ]);
}

