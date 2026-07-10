import type { MailMessage } from "./mail-provider";

const BRAND = "#F97316";
const INK = "#0F172A";
const MUTED = "#64748B";

/** Escape agar nama pengguna tak bisa menyuntik HTML ke dalam email. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Kerangka email. Sengaja memakai tabel + gaya sebaris: banyak klien email
 * (Outlook, Gmail lawas) mengabaikan <style> dan flexbox.
 */
function layout(opts: { judul: string; halo: string; isi: string; kode: string; catatan: string }): string {
  return `<!doctype html>
<html lang="id">
<body style="margin:0;padding:0;background:#F1F5F9;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08);">
        <tr><td style="background:${BRAND};padding:20px 28px;">
          <span style="color:#FFFFFF;font-size:18px;font-weight:800;letter-spacing:-.02em;">pelajarin.ai</span>
        </td></tr>
        <tr><td style="padding:32px 28px 8px;">
          <h1 style="margin:0 0 8px;font-size:20px;color:${INK};">${opts.judul}</h1>
          <p style="margin:0 0 4px;font-size:15px;color:${INK};">${opts.halo}</p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:${MUTED};">${opts.isi}</p>
        </td></tr>
        <tr><td align="center" style="padding:0 28px 8px;">
          <div style="display:inline-block;background:#FFF7ED;border:1px solid #FED7AA;border-radius:12px;padding:16px 28px;">
            <span style="font-family:'SFMono-Regular',Consolas,monospace;font-size:32px;font-weight:700;letter-spacing:.35em;color:${BRAND};">${opts.kode}</span>
          </div>
        </td></tr>
        <tr><td style="padding:16px 28px 32px;">
          <p style="margin:0;font-size:13px;line-height:1.6;color:${MUTED};">${opts.catatan}</p>
        </td></tr>
        <tr><td style="background:#F8FAFC;padding:16px 28px;border-top:1px solid #E2E8F0;">
          <p style="margin:0;font-size:12px;color:${MUTED};">Email ini dikirim otomatis. Mohon jangan dibalas.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function verifyEmailTemplate(to: string, nama: string, kode: string, menit: number): MailMessage {
  const halo = `Halo, ${esc(nama)}!`;
  return {
    to,
    subject: `${kode} adalah kode verifikasi Pelajarin.ai`,
    html: layout({
      judul: "Verifikasi email kamu",
      halo,
      isi: "Masukkan kode di bawah ini untuk mengaktifkan akunmu.",
      kode,
      catatan: `Kode berlaku ${menit} menit. Jika kamu tidak membuat akun di Pelajarin.ai, abaikan email ini.`,
    }),
    text: `Halo, ${nama}!\n\nKode verifikasi Pelajarin.ai kamu: ${kode}\nBerlaku ${menit} menit.\n\nJika kamu tidak membuat akun, abaikan email ini.`,
  };
}

export function resetPasswordTemplate(to: string, nama: string, kode: string, menit: number): MailMessage {
  const halo = `Halo, ${esc(nama)}!`;
  return {
    to,
    subject: `${kode} adalah kode reset password Pelajarin.ai`,
    html: layout({
      judul: "Atur ulang password",
      halo,
      isi: "Kami menerima permintaan untuk mengatur ulang passwordmu. Masukkan kode di bawah ini untuk melanjutkan.",
      kode,
      catatan: `Kode berlaku ${menit} menit. Jika kamu tidak meminta ini, abaikan email ini — passwordmu tidak berubah.`,
    }),
    text: `Halo, ${nama}!\n\nKode reset password Pelajarin.ai kamu: ${kode}\nBerlaku ${menit} menit.\n\nJika kamu tidak meminta ini, abaikan email ini.`,
  };
}
