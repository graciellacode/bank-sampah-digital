import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(1, "Username wajib diisi"),
    password: z.string().min(1, "Password wajib diisi"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerNasabahSchema = z.object({
    username: z.string().min(3, "Username minimal 3 karakter"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    namaNasabah: z.string().min(1, "Nama lengkap wajib diisi"),
    alamat: z.string().min(1, "Alamat wajib diisi"),
    telp: z.string().min(8, "Nomor telepon tidak valid"),
});
export type RegisterNasabahFormValues = z.infer<typeof registerNasabahSchema>;

export const registerAdminSchema = z.object({
    username: z.string().min(3, "Username minimal 3 karakter"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    namaUnit: z.string().min(1, "Nama unit wajib diisi"),
    namaPengelola: z.string().min(1, "Nama pengelola wajib diisi"),
    telp: z.string().min(8, "Nomor telepon tidak valid"),

});
export type RegisterAdminFormValues = z.infer<typeof registerAdminSchema>;

export const setorSampahSchema = z.object({
    tanggal: z.string().min(1, "Tanggal wajib diisi"),
    catatan: z.string().optional(),
    items: z
        .array(
            z.object({
                kategoriSampahId: z.string().min(1, "Pilih jenis sampah"),
                beratKg: z.coerce.number().positive("Berat harus lebih dari 0"),
            })
        )
        .min(1, "Tambahkan minimal 1 jenis sampah"),
});
export type SetorSampahFormValues = z.infer<typeof setorSampahSchema>;

export const createNasabahAdminSchema = z.object({
    username: z.string().min(3, "Username minimal 3 karakter"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    namaNasabah: z.string().min(1, "Nama lengkap wajib diisi"),
    alamat: z.string().min(1, "Alamat wajib diisi"),
    telp: z.string().min(8, "Nomor telepon tidak valid"),
});
export type CreateNasabahAdminFormValues = z.infer<typeof createNasabahAdminSchema>;

export const updateNasabahAdminSchema = z.object({
    namaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
    noTelepon: z.string().min(8, "Nomor telepon tidak valid"),
    alamat: z.string().min(1, "Alamat wajib diisi"),
});
export type UpdateNasabahAdminFormValues = z.infer<typeof updateNasabahAdminSchema>;

export const kategoriSampahAdminSchema = z.object({
    namaKategori: z.string().min(1, "Nama kategori wajib diisi"),
    hargaPerKg: z.coerce.number().positive("Harga harus lebih dari 0"),
    poinPerKg: z.coerce.number().positive("Poin harus lebih dari 0"),
    jenis: z.enum(["plastik", "kertas", "logam", "kaca"], {
        message: "Pilih jenis sampah",
    }),
});
export type KategoriSampahAdminFormValues = z.infer<typeof kategoriSampahAdminSchema>;

export const hadiahAdminSchema = z.object({
    namaHadiah: z.string().min(1, "Nama hadiah wajib diisi"),
    poinDibutuhkan: z.coerce.number().positive("Poin harus lebih dari 0"),
    stok: z.coerce.number().min(0, "Stok tidak boleh negatif"),
});
export type HadiahAdminFormValues = z.infer<typeof hadiahAdminSchema>;
