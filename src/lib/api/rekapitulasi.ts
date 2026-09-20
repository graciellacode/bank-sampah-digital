import { apiClient } from "./client";
import { ApiSuccessResponse } from "@/types/api";
import { RekapitulasiBulanan } from "@/types/rekapitulasi";

export async function getRekapitulasiBulanan(
    bulan: string
): Promise<RekapitulasiBulanan> {
    const res = await apiClient.get<ApiSuccessResponse<RekapitulasiBulanan>>(
        "/rekapitulasi/bulanan",
        { params: { bulan } }
    );
    return res.data.data;
}