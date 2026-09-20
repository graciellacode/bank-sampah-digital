export interface CreateHadiahPayload {
    namaHadiah: string;
    poinDibutuhkan: number;
    stok: number;
    foto?: File;
}

export type UpdateHadiahPayload = CreateHadiahPayload;