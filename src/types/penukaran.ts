import { StatusPenukaran } from "./dashboard";

export interface PenukaranPoin {
    id: string;
    kodePenukaran: string;
    tanggal: string;
    poinTerpakai: number;
    status: StatusPenukaran;
    hadiah: {
        namaHadiah: string;
        poinDibutuhkan?: number;
        foto?: string | null;
    };
    nasabah?: {
        namaNasabah: string;
        telp: string;
    };
}