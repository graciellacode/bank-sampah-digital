import { StatusSetor } from "./dashboard";

export interface SetorAdminListItem {
    id: string;
    kodeSetor: string;
    tanggal: string;
    nasabah: {
        namaNasabah: string;
        telp: string;
    };
    status: StatusSetor;
    totalBeratKg: number;
    totalPoin: number;
}

export interface VerifyItemSetorPayload {
    kategoriSampahId: string;
    beratKgReal: number;
}

export interface VerifySetorPayload {
    status: "diverifikasi" | "selesai" | "ditolak";
    catatanAdmin: string;
    itemsReal?: VerifyItemSetorPayload[];
}