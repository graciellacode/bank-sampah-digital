import { JenisSampah } from "./kategori";

export interface CreateKategoriPayload {
    namaKategori: string;
    hargaPerKg: number;
    poinPerKg: number;
    jenis: JenisSampah;
    foto?: File;
}

export type UpdateKategoriPayload = CreateKategoriPayload;