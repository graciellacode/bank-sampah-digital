export type JenisSampah = "plastik" | "kertas" | "logam" | "kaca";

export interface KategoriSampah {
    id: string;
    namaKategori: string;
    hargaPerKg: number;
    poinPerKg: number;
    jenis: JenisSampah;
    foto: string | null;
}