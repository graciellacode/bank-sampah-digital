import { apiClient, toFormData } from "./client";
import { ApiSuccessResponse } from "@/types/api";
import {
    AuthUser,
    LoginPayload,
    LoginResponseData,
    RegisterAdminPayload,
    RegisterNasabahPayload,
} from "@/types/auth";

/** Login bersama untuk Nasabah maupun Admin — endpoint sama, backend yang membedakan role dari database. */
export async function login(payload: LoginPayload): Promise<LoginResponseData> {
    const res = await apiClient.post<ApiSuccessResponse<LoginResponseData>>(
        "/auth/login",
        payload
    );
    return res.data.data;
}

/** Ambil profil user yang sedang login, sekaligus dipakai untuk cek "apakah token masih valid". */
export async function getMe(): Promise<AuthUser> {
    const res = await apiClient.get<ApiSuccessResponse<AuthUser>>("/auth/me");
    return res.data.data;
}

/** Registrasi akun Nasabah baru. Kalau ada foto, otomatis dikirim sebagai multipart/form-data. */
export async function registerNasabah(payload: RegisterNasabahPayload) {
    const hasFile = payload.foto instanceof File;
    const body = hasFile ? toFormData(payload) : payload;

    const res = await apiClient.post("/auth/nasabah/register", body);
    return res.data.data;
}

/** Registrasi unit Admin Bank Sampah baru (tidak ada upload foto, sesuai DTO di PDF). */
export async function registerAdmin(payload: RegisterAdminPayload) {
    const res = await apiClient.post("/auth/admin/register", payload);
    return res.data.data;
}