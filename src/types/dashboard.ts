export type StatusSetor = "menunggu_konfirmasi" | "diverifikasi" | "selesai" | "ditolak";
export type StatusPenukaran = "diproses" | "selesai";

export interface DetailSetorRingkas {
    kategoriSampahId: string;
    beratKg: number;
    subtotalPoin: number;
    kategoriSampah?: {
        namaKategori: string;
        jenis: string;
    };
}

export interface SetorRingkas {
    id: string;
    kodeSetor: string;
    tanggal: string;
    status: StatusSetor;
    totalBeratKg: number;
    totalPoin: number;
    catatan?: string;
    detailSetors: DetailSetorRingkas[];
}

export interface PenukaranRingkas {
    id: string;
    kodePenukaran: string;
    tanggal: string;
    poinTerpakai: number;
    status: StatusPenukaran;
    hadiah: {
        namaHadiah: string;
    };
}

/** Struktur ini mengikuti response ASLI backend (berbeda dari contoh di PDF — lihat laporan bug). */
export interface DashboardSummary {
    saldoPoin: number;
    totalPengajuanSetor: number;
    totalPenukaranHadiah: number;
    totalPoinDiperoleh: number;
    setorTerakhir: SetorRingkas[];
    penukaranTerakhir: PenukaranRingkas[];
}