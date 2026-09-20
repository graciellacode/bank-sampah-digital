import { StatusSetor } from "./dashboard";

export interface ItemSetorPayload {
    kategoriSampahId: string;
    beratKg: number;
}

export interface CreateSetorSampahPayload {
    tanggal: string;
    catatan: string;
    items: ItemSetorPayload[];
}

export interface DetailSetorItem {
    kategoriSampahId: string;
    beratKg: number;
    subtotalPoin: number;
    kategoriSampah?: {
        namaKategori: string;
        jenis: string;
    };
}

export interface SetorSampah {
    id: string;
    kodeSetor: string;
    tanggal: string;
    status: StatusSetor;
    totalBeratKg: number;
    totalPoin?: number;
    estimasiTotalPoin?: number;
    catatan: string;
    catatanAdmin?: string;
    detailSetors: DetailSetorItem[];
    nasabah?: {
        namaNasabah: string;
        telp: string;
        alamat?: string;
    };
}