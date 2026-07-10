import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
) => Promise<Buffer>;

const KEYLEN = 64;
const SALT_BYTES = 16;

/**
 * Hash password memakai scrypt (bawaan Node — tak perlu kompilasi native).
 * Format tersimpan: `scrypt$<saltHex>$<hashHex>`.
 */
export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const hash = await scrypt(plain.normalize("NFKC"), salt, KEYLEN);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

/**
 * Verifikasi password. Selalu memakai perbandingan timing-safe agar durasinya
 * tidak membocorkan seberapa mirip tebakan penyerang.
 */
export async function verifyPassword(plain: string, stored: string | null): Promise<boolean> {
  if (!stored) return false;
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, "hex");
  let actual: Buffer;
  try {
    actual = await scrypt(plain.normalize("NFKC"), Buffer.from(saltHex, "hex"), expected.length);
  } catch {
    return false;
  }
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

/** Aturan minimal password. Pesan dikembalikan bila tidak lolos. */
export function checkPasswordStrength(plain: string): string | null {
  if (plain.length < 8) return "Password minimal 8 karakter";
  if (plain.length > 200) return "Password terlalu panjang";
  if (!/[a-zA-Z]/.test(plain) || !/[0-9]/.test(plain)) {
    return "Password harus memuat huruf dan angka";
  }
  return null;
}
