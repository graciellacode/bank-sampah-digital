import { apiClient, toFormData } from "./client";
import { ApiSuccessResponse } from "@/types/api";
import { KategoriSampah } from "@/types/kategori";
import { CreateKategoriPayload, UpdateKategoriPayload } from "@/types/kategoriAdmin";

export async function getKategoriSampah(): Promise<KategoriSampah[]> {
    const res = await apiClient.get<ApiSuccessResponse<KategoriSampah[]>>(
        "/kategori-sampah"
    );
    return res.data.data;
}

export async function createKategoriSampah(
    payload: CreateKategoriPayload
): Promise<KategoriSampah> {
    const hasFile = payload.foto instanceof File;
    const body = hasFile ? toFormData(payload) : payload;
    const res = await apiClient.post<ApiSuccessResponse<KategoriSampah>>(
        "/kategori-sampah",
        body
    );
    return res.data.data;
}

export async function updateKategoriSampah(
    id: string,
    payload: UpdateKategoriPayload
): Promise<KategoriSampah> {
    const hasFile = payload.foto instanceof File;
    const body = hasFile ? toFormData(payload) : payload;
    const res = await apiClient.put<ApiSuccessResponse<KategoriSampah>>(
        `/kategori-sampah/${id}`,
        body
    );
    return res.data.data;
}

export async function deleteKategoriSampah(id: string): Promise<void> {
    await apiClient.delete(`/kategori-sampah/${id}`);
}