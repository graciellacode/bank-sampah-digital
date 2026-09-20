export interface NasabahAdmin {
    id: string;
    namaNasabah: string;
    alamat: string;
    telp: string;
    saldoPoin: number;
    foto: string | null;
    user: {
        username: string;
        role: string;
    };
}

export interface CreateNasabahPayload {
    username: string;
    password: string;
    namaNasabah: string;
    alamat: string;
    telp: string;
    foto?: File;
}

/** Perhatikan: nama field BERBEDA dari CreateNasabahPayload, sesuai kontrak API di PDF. */
export interface UpdateNasabahPayload {
    namaLengkap: string;
    noTelepon: string;
    alamat: string;
    tanggalLahir: string;
    foto?: File;
}