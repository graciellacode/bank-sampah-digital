import { StatusPenukaran } from "./dashboard";

export interface PenukaranAdminListItem {
    id: string;
    kodePenukaran: string;
    tanggal: string;
    nasabah: {
        namaNasabah: string;
        telp: string;
    };
    hadiah: {
        namaHadiah: string;
    };
    poinTerpakai: number;
    status: StatusPenukaran;
}