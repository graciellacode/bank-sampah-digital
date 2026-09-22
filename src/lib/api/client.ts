import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

// Nama key cookie tempat kita menyimpan token JWT hasil login.
// Dipakai bersama oleh client.ts (untuk baca token) dan session.ts di Step 8 (untuk simpan/hapus token).
export const TOKEN_COOKIE_NAME = "bank_sampah_token";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const APP_KEY = process.env.NEXT_PUBLIC_APP_KEY;

if (!API_BASE_URL || !APP_KEY) {
    // Ini hanya warning di console, membantu kita cepat sadar kalau .env.local belum diisi/lupa restart server.
    console.error(
        "NEXT_PUBLIC_API_BASE_URL atau NEXT_PUBLIC_APP_KEY belum diatur. Cek file .env.local dan restart dev server."
    );
}

// Instance axios utama yang akan dipakai di SELURUH project.
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "x-app-key": APP_KEY,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
    },
});

// Interceptor: kode ini berjalan otomatis SEBELUM setiap request dikirim.
// Tugasnya: cek apakah ada token login tersimpan di cookie, kalau ada, tempel ke header Authorization.
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = Cookies.get(TOKEN_COOKIE_NAME);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Bentuk response error standar sesuai kontrak API di PDF.
export interface ApiErrorResponse {
    statusCode: number;
    success: false;
    message: string;
    errors: unknown;
    timestamp: string;
}

/**
 * Ambil pesan error yang enak dibaca dari error axios.
 * Selalu utamakan message dari API (mis. "Username atau password salah"),
 * baru fallback ke pesan generik kalau API tidak mengembalikan message.
 */
export function getApiErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const err = error as AxiosError<ApiErrorResponse>;

        if (err.response?.data?.message) {
            const rawMessage = err.response.data.message;

            // Pengecekan khusus error Foreign Key Constraint (relasi data di database)
            if (rawMessage.includes("Foreign key constraint violated")) {
                if (rawMessage.includes("hadiahId") || rawMessage.includes("hadiah")) {
                    return "Hadiah tidak dapat dihapus karena sudah memiliki riwayat penukaran oleh nasabah.";
                }
                if (rawMessage.includes("kategori") || rawMessage.includes("kategoriSampahId")) {
                    return "Kategori sampah tidak dapat dihapus karena sudah memiliki riwayat transaksi penyetoran.";
                }
                if (rawMessage.includes("nasabah") || rawMessage.includes("nasabahId")) {
                    return "Data nasabah tidak dapat dihapus karena memiliki riwayat transaksi aktif.";
                }
                return "Data tidak dapat dihapus karena masih terhubung dengan data transaksi lain.";
            }

            return rawMessage;
        }
        if (err.code === "ERR_NETWORK") {
            return "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
        }
        if (err.code === "ECONNABORTED") {
            return "Permintaan ke server terlalu lama (timeout). Coba lagi.";
        }
        return err.message || "Terjadi kesalahan saat menghubungi server.";
    }
    return "Terjadi kesalahan yang tidak diketahui.";
}

/**
 * Ubah object biasa menjadi FormData.
 * Dipakai untuk endpoint yang butuh multipart/form-data (upload foto nasabah/kategori/hadiah).
 * - File akan dilampirkan langsung.
 * - Array (misalnya "items" pada pengajuan setor) di-stringify jadi JSON dulu.
 */
export function toFormData<T extends object>(payload: T): FormData {
    const formData = new FormData();
    const entries = Object.entries(payload) as [string, unknown][];

    entries.forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (value instanceof File) {
            formData.append(key, value);
        } else if (Array.isArray(value) || typeof value === "object") {
            formData.append(key, JSON.stringify(value));
        } else {
            formData.append(key, String(value));
        }
    });

    return formData;
}