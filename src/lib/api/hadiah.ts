import { apiClient, toFormData } from "./client";
import { ApiSuccessResponse } from "@/types/api";
import { Hadiah } from "@/types/hadiah";
import { CreateHadiahPayload, UpdateHadiahPayload } from "@/types/hadiahAdmin";

export async function getHadiahList(): Promise<Hadiah[]> {
    const res = await apiClient.get<ApiSuccessResponse<Hadiah[]>>("/hadiah");
    return res.data.data;
}

export async function getHadiahDetail(id: string): Promise<Hadiah> {
    const res = await apiClient.get<ApiSuccessResponse<Hadiah>>(`/hadiah/${id}`);
    return res.data.data;
}

export async function createHadiah(payload: CreateHadiahPayload): Promise<Hadiah> {
    const hasFile = payload.foto instanceof File;
    const body = hasFile ? toFormData(payload) : payload;
    const res = await apiClient.post<ApiSuccessResponse<Hadiah>>("/hadiah", body);
    return res.data.data;
}

export async function updateHadiah(
    id: string,
    payload: UpdateHadiahPayload
): Promise<Hadiah> {
    const hasFile = payload.foto instanceof File;
    const body = hasFile ? toFormData(payload) : payload;
    const res = await apiClient.put<ApiSuccessResponse<Hadiah>>(`/hadiah/${id}`, body);
    return res.data.data;
}

export async function deleteHadiah(id: string): Promise<void> {
    await apiClient.delete(`/hadiah/${id}`);
}