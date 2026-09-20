import { apiClient, toFormData } from "./client";
import { ApiSuccessResponse } from "@/types/api";
import {
    NasabahAdmin,
    CreateNasabahPayload,
    UpdateNasabahPayload,
} from "@/types/nasabahAdmin";

export async function getNasabahList(): Promise<NasabahAdmin[]> {
    const res = await apiClient.get<ApiSuccessResponse<NasabahAdmin[]>>("/admin/nasabah");
    return res.data.data;
}

export async function createNasabahAdmin(
    payload: CreateNasabahPayload
): Promise<NasabahAdmin> {
    const hasFile = payload.foto instanceof File;
    const body = hasFile ? toFormData(payload) : payload;
    const res = await apiClient.post<ApiSuccessResponse<NasabahAdmin>>("/admin/nasabah", body);
    return res.data.data;
}

export async function updateNasabahAdmin(
    id: string,
    payload: UpdateNasabahPayload
): Promise<NasabahAdmin> {
    const hasFile = payload.foto instanceof File;
    const body = hasFile ? toFormData(payload) : payload;
    const res = await apiClient.put<ApiSuccessResponse<NasabahAdmin>>(
        `/admin/nasabah/${id}`,
        body
    );
    return res.data.data;
}

export async function deleteNasabahAdmin(id: string): Promise<void> {
    await apiClient.delete(`/admin/nasabah/${id}`);
}