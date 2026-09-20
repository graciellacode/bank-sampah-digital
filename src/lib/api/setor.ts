import { apiClient } from "./client";
import { ApiSuccessResponse } from "@/types/api";
import { CreateSetorSampahPayload, SetorSampah } from "@/types/setor";
import { SetorAdminListItem, VerifySetorPayload } from "@/types/setorAdmin";

export async function createSetorSampah(
    payload: CreateSetorSampahPayload
): Promise<SetorSampah> {
    const res = await apiClient.post<ApiSuccessResponse<SetorSampah>>(
        "/setor-sampah/pengajuan",
        payload
    );
    return res.data.data;
}

export async function getMySetor(bulan?: string): Promise<SetorSampah[]> {
    const res = await apiClient.get<ApiSuccessResponse<SetorSampah[]>>(
        "/setor-sampah/my-setor",
        { params: bulan ? { bulan } : undefined }
    );
    return res.data.data;
}

export async function getSetorDetail(id: string): Promise<SetorSampah> {
    const res = await apiClient.get<ApiSuccessResponse<SetorSampah>>(
        `/setor-sampah/${id}`
    );
    return res.data.data;
}

export async function getSetorAdminList(params?: {
    status?: string;
    bulan?: string;
}): Promise<SetorAdminListItem[]> {
    const res = await apiClient.get<ApiSuccessResponse<SetorAdminListItem[]>>(
        "/setor-sampah/admin/list",
        { params }
    );
    return res.data.data;
}

export async function verifySetorSampah(
    id: string,
    payload: VerifySetorPayload
): Promise<SetorSampah> {
    const res = await apiClient.put<ApiSuccessResponse<SetorSampah>>(
        `/setor-sampah/admin/verify/${id}`,
        payload
    );
    return res.data.data;
}