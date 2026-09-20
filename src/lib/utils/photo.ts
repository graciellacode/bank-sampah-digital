const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

// Hilangkan akhiran "/api/v1" dari base URL, supaya dapat root domain backend
// (untuk menggabungkan dengan path foto yang relatif, seperti "/uploads/xxx.jpg")
const STATIC_BASE_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

/**
 * Mengubah path foto dari API menjadi URL lengkap yang bisa dipakai <img>.
 * - Kalau sudah berupa URL lengkap (http/https), kembalikan apa adanya.
 * - Kalau path relatif (contoh: "/uploads/xxx.jpg"), gabungkan dengan domain backend.
 * - Kalau kosong/null, kembalikan null.
 */
export function resolvePhotoUrl(path?: string | null): string | null {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${STATIC_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}