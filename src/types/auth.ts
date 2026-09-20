export type UserRole = "NASABAH" | "ADMIN";

// Bentuk data nasabah, sesuai object "nasabah" pada response /auth/login dan /auth/me
export interface Nasabah {
    id: string;
    namaNasabah: string;
    alamat: string;
    telp: string;
    saldoPoin: number;
    foto: string | null;
}

// Bentuk data admin bank, sesuai object "adminBank" pada response /auth/login dan /auth/me
export interface AdminBank {
    id: string;
    namaUnit: string;
    namaPengelola: string;
    telp: string;
}

// Bentuk data user gabungan (dipakai baik untuk Nasabah maupun Admin).
// Kalau role === "NASABAH", field "nasabah" berisi data, dan "adminBank" bernilai null. Begitu juga sebaliknya.
export interface AuthUser {
    id: string;
    username: string;
    role: UserRole;
    nasabah: Nasabah | null;
    adminBank: AdminBank | null;
}

// Data tambahan "token" hanya muncul di response LOGIN, tidak muncul di /auth/me
export interface LoginResponseData extends AuthUser {
    token: string;
}

export interface LoginPayload {
    username: string;
    password: string;
}

export interface RegisterNasabahPayload {
    username: string;
    password: string;
    namaNasabah: string;
    alamat: string;
    telp: string;
    foto?: File;
}

export interface RegisterAdminPayload {
    username: string;
    password: string;
    namaUnit: string;
    namaPengelola: string;
    telp: string;
}