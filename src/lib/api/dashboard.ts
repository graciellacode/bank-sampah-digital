import { apiClient } from "./client";
import { ApiSuccessResponse } from "@/types/api";
import { DashboardSummary } from "@/types/dashboard";
import { DashboardStats } from "@/types/dashboardAdmin";

export async function getDashboardSummary(): Promise<DashboardSummary> {
    const res = await apiClient.get<ApiSuccessResponse<DashboardSummary>>(
        "/dashboard/summary"
    );
    return res.data.data;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const res = await apiClient.get<ApiSuccessResponse<DashboardStats>>(
        "/dashboard/stats"
    );
    return res.data.data;
}