"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Recycle, ChevronRight } from "lucide-react";

import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MonthFilter } from "@/components/ui/MonthFilter";
import { getMySetor } from "@/lib/api/setor";
import { getApiErrorMessage } from "@/lib/api/client";
import { SetorSampah } from "@/types/setor";
import { formatKg, formatPoin, formatTanggal } from "@/lib/utils/format";

function RiwayatSkeleton() {
    return (
        <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-2xl" />
            ))}
        </div>
    );
}

export default function RiwayatSetorPage() {
    const [bulan, setBulan] = useState("");
    const [data, setData] = useState<SetorSampah[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        getMySetor(bulan || undefined)
            .then(setData)
            .catch((err) => setError(getApiErrorMessage(err)))
            .finally(() => setIsLoading(false));
    }, [bulan]);

    return (
        <>
            <DashboardTopbar
                greeting="Riwayat Setor Sampah"
                subtitle="Pantau status dan riwayat pengajuan penyetoran Anda"
            />

            <div className="flex items-center justify-between mb-4">
                <MonthFilter value={bulan} onChange={setBulan} />
            </div>

            {isLoading && <RiwayatSkeleton />}

            {!isLoading && error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-4 py-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {!isLoading && !error && data.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm">
                    <EmptyState
                        message={
                            bulan
                                ? "Tidak ada pengajuan setor di bulan ini"
                                : "Belum ada pengajuan setor"
                        }
                        icon={Recycle}
                    />
                </div>
            )}

            {!isLoading && !error && data.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-[20px] sm:rounded-[26px] shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {data.map((setor) => (
                            <Link
                                key={setor.id}
                                href={`/nasabah/setor/${setor.id}`}
                                className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4.5 hover:bg-slate-50/70 transition-colors group"
                            >
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                                        <Recycle className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                                            {setor.kodeSetor}
                                        </p>
                                        <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">
                                            {formatTanggal(setor.tanggal)} · {formatKg(setor.totalBeratKg)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-extrabold text-[#35C71D]">
                                            +{formatPoin(setor.totalPoin ?? setor.estimasiTotalPoin ?? 0)}
                                        </p>
                                    </div>
                                    <StatusBadge status={setor.status} />
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors hidden sm:block" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}