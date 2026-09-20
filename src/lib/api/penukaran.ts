import { apiClient } from "./client";
import { ApiSuccessResponse } from "@/types/api";
import { PenukaranPoin } from "@/types/penukaran";
import { PenukaranAdminListItem } from "@/types/penukaranAdmin";

export async function tukarPoin(hadiahId: string): Promise<PenukaranPoin> {
    const res = await apiClient.post<ApiSuccessResponse<PenukaranPoin>>(
        "/penukaran-poin/tukar",
        { hadiahId }
    );
    return res.data.data;
}

export async function getMyPenukaran(): Promise<PenukaranPoin[]> {
    const res = await apiClient.get<ApiSuccessResponse<PenukaranPoin[]>>(
        "/penukaran-poin/my-penukaran"
    );
    return res.data.data;
}

export async function getPenukaranNota(id: string): Promise<PenukaranPoin> {
    const res = await apiClient.get<ApiSuccessResponse<PenukaranPoin>>(
        `/penukaran-poin/nota/${id}`
    );
    return res.data.data;
}

export async function getPenukaranAdminList(
    bulan?: string
): Promise<PenukaranAdminListItem[]> {
    const res = await apiClient.get<ApiSuccessResponse<PenukaranAdminListItem[]>>(
        "/penukaran-poin/admin/list",
        { params: bulan ? { bulan } : undefined }
    );
    return res.data.data;
}

export async function updatePenukaranStatus(
    id: string,
    status: "diproses" | "selesai"
): Promise<PenukaranPoin> {
    const res = await apiClient.put<ApiSuccessResponse<PenukaranPoin>>(
        `/penukaran-poin/admin/status/${id}`,
        { status }
    );
    return res.data.data;
}