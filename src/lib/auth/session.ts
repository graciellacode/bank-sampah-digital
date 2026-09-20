import Cookies from "js-cookie";
import { TOKEN_COOKIE_NAME } from "@/lib/api/client";
import { UserRole } from "@/types/auth";

const ROLE_COOKIE_NAME = "bank_sampah_role";
// Sesuaikan angka ini kalau ternyata masa berlaku JWT dari backend berbeda.
// 1 = cookie akan otomatis terhapus browser setelah 1 hari.
const COOKIE_EXPIRES_DAYS = 1;

/** Dipanggil sesaat setelah login berhasil, untuk menyimpan token & role ke cookie. */
export function saveSession(token: string, role: UserRole) {
    Cookies.set(TOKEN_COOKIE_NAME, token, { expires: COOKIE_EXPIRES_DAYS });
    Cookies.set(ROLE_COOKIE_NAME, role, { expires: COOKIE_EXPIRES_DAYS });
}

export function getToken(): string | undefined {
    return Cookies.get(TOKEN_COOKIE_NAME);
}

export function getRole(): UserRole | undefined {
    return Cookies.get(ROLE_COOKIE_NAME) as UserRole | undefined;
}

/** Dipanggil saat logout, menghapus semua data sesi. */
export function clearSession() {
    Cookies.remove(TOKEN_COOKIE_NAME);
    Cookies.remove(ROLE_COOKIE_NAME);
}

export function isLoggedIn(): boolean {
    return Boolean(getToken());
}