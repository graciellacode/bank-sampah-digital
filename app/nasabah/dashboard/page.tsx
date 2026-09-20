"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Recycle,
    Gift,
    PackageCheck,
    AlertCircle,
    TrendingUp,
    ArrowUpRight,
} from "lucide-react";

import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { useCurrentUser } from "@/lib/auth/AuthContext";
import { getDashboardSummary } from "@/lib/api/dashboard";
import { getApiErrorMessage } from "@/lib/api/client";
import { DashboardSummary } from "@/types/dashboard";
import { formatPoin, formatTanggal } from "@/lib/utils/format";

function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="h-32 bg-slate-200 rounded-[24px]" />
                    <div className="h-32 bg-slate-200 rounded-[24px]" />
                    <div className="h-32 bg-slate-200 rounded-[24px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="h-64 bg-slate-200 rounded-[26px]" />
                    <div className="h-64 bg-slate-200 rounded-[26px]" />
                </div>
            </div>
        </div>
    );
}

export default function NasabahDashboardPage() {
    const user = useCurrentUser();
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getDashboardSummary()
            .then(setSummary)
            .catch((err) => setError(getApiErrorMessage(err)))
            .finally(() => setIsLoading(false));
    }, []);

    const setorTerakhir = summary?.setorTerakhir?.[0] ?? null;
    const penukaranTerakhir = summary?.penukaranTerakhir?.[0] ?? null;

    return (
        <div className="pb-8">
            <DashboardTopbar
                greeting={`Halo, ${user.nasabah?.namaNasabah ?? user.username}`}
                subtitle="Berikut ringkasan aktivitas dan poin daur ulang Anda"
            />

            {isLoading && <DashboardSkeleton />}

            {!isLoading && error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {!isLoading && !error && summary && (
                <div className="space-y-6">
                    {/* Baris 3 Kartu Statistik Hijau */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Card 1: Saldo Poin */}
                        <div className="relative overflow-hidden bg-gradient-to-r from-[#3BC12F] via-[#35C71D] to-[#1DA724] rounded-[22px] sm:rounded-[26px] p-4 sm:p-5 text-white shadow-md shadow-emerald-600/10 flex flex-col justify-between min-h-[120px] sm:min-h-[140px]">
                            <svg
                                className="absolute bottom-0 left-0 right-0 w-full h-14 text-white/15 pointer-events-none"
                                viewBox="0 0 300 60"
                                fill="none"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M0 35 C60 15, 120 45, 180 20 C230 -5, 270 35, 300 15 L300 60 L0 60 Z"
                                    fill="currentColor"
                                />
                            </svg>

                            <div className="flex items-center justify-between relative z-10">
                                <span className="text-xs font-medium text-white/90">Saldo Poin</span>
                                <div className="bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>Aktif</span>
                                </div>
                            </div>
                            <div className="relative z-10 mt-3">
                                <p className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-white tracking-tight">
                                    {formatPoin(summary.saldoPoin)}
                                </p>
                            </div>
                        </div>

                        {/* Card 2: Poin Diperoleh */}
                        <div className="relative overflow-hidden bg-gradient-to-r from-[#3BC12F] via-[#35C71D] to-[#1DA724] rounded-[22px] sm:rounded-[26px] p-4 sm:p-5 text-white shadow-md shadow-emerald-600/10 flex flex-col justify-between min-h-[120px] sm:min-h-[140px]">
                            <svg
                                className="absolute bottom-0 left-0 right-0 w-full h-14 text-white/15 pointer-events-none"
                                viewBox="0 0 300 60"
                                fill="none"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M0 25 C50 45, 110 15, 170 35 C230 55, 260 15, 300 30 L300 60 L0 60 Z"
                                    fill="currentColor"
                                />
                            </svg>

                            <div className="flex items-center justify-between relative z-10">
                                <span className="text-xs font-medium text-white/90">Poin Diperoleh</span>
                                <div className="bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                                    <PackageCheck className="w-3 h-3" />
                                    <span>Total</span>
                                </div>
                            </div>
                            <div className="relative z-10 mt-3">
                                <p className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-white tracking-tight">
                                    {formatPoin(summary.totalPoinDiperoleh)}
                                </p>
                            </div>
                        </div>

                        {/* Card 3: Penukaran Hadiah */}
                        <div className="relative overflow-hidden bg-gradient-to-r from-[#3BC12F] via-[#35C71D] to-[#1DA724] rounded-[22px] sm:rounded-[26px] p-4 sm:p-5 text-white shadow-md shadow-emerald-600/10 flex flex-col justify-between min-h-[120px] sm:min-h-[140px]">
                            <svg
                                className="absolute bottom-0 left-0 right-0 w-full h-14 text-white/15 pointer-events-none"
                                viewBox="0 0 300 60"
                                fill="none"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M0 40 C70 10, 130 50, 200 20 C250 0, 280 30, 300 20 L300 60 L0 60 Z"
                                    fill="currentColor"
                                />
                            </svg>

                            <div className="flex items-center justify-between relative z-10">
                                <span className="text-xs font-medium text-white/90">Penukaran Hadiah</span>
                                <div className="bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                                    <Gift className="w-3 h-3" />
                                    <span>Item</span>
                                </div>
                            </div>
                            <div className="relative z-10 mt-3">
                                <p className="text-xl sm:text-2xl xl:text-3xl font-extrabold text-white tracking-tight">
                                    {summary.totalPenukaranHadiah.toLocaleString("id-ID")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Detail Panel Setoran & Penukaran Terakhir */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Card Setoran Terakhir */}
                        <div className="bg-white border border-slate-100 rounded-[22px] sm:rounded-[26px] p-5 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4 sm:mb-5 pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <Recycle className="w-4 h-4" />
                                    </div>
                                    <h2 className="font-bold text-slate-800 text-sm">Setoran Terakhir</h2>
                                </div>
                                {setorTerakhir && <StatusBadge status={setorTerakhir.status} />}
                            </div>
                            {setorTerakhir ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400 font-medium">Kode</span>
                                        <span className="text-slate-800 font-semibold text-right truncate ml-2 max-w-[60%]">{setorTerakhir.kodeSetor}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400 font-medium">Tanggal</span>
                                        <span className="text-slate-700">{formatTanggal(setorTerakhir.tanggal)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400 font-medium">Berat</span>
                                        <span className="text-slate-700 font-medium">
                                            {setorTerakhir.totalBeratKg.toLocaleString("id-ID")} kg
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm pt-3 border-t border-slate-100">
                                        <span className="text-slate-700 font-semibold">Poin Diperoleh</span>
                                        <span className="text-[#35C71D] font-extrabold text-base">
                                            +{formatPoin(setorTerakhir.totalPoin)}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <EmptyState message="Belum ada pengajuan setoran" icon={Recycle} />
                            )}
                        </div>

                        {/* Card Penukaran Terakhir */}
                        <div className="bg-white border border-slate-100 rounded-[22px] sm:rounded-[26px] p-5 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4 sm:mb-5 pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                        <Gift className="w-4 h-4" />
                                    </div>
                                    <h2 className="font-bold text-slate-800 text-sm">Penukaran Terakhir</h2>
                                </div>
                                {penukaranTerakhir && <StatusBadge status={penukaranTerakhir.status} />}
                            </div>
                            {penukaranTerakhir ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400 font-medium">Kode</span>
                                        <span className="text-slate-800 font-semibold text-right truncate ml-2 max-w-[60%]">{penukaranTerakhir.kodePenukaran}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400 font-medium">Tanggal</span>
                                        <span className="text-slate-700">{formatTanggal(penukaranTerakhir.tanggal)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400 font-medium">Hadiah</span>
                                        <span className="text-slate-800 font-medium text-right max-w-[55%] truncate">
                                            {penukaranTerakhir.hadiah.namaHadiah}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm pt-3 border-t border-slate-100">
                                        <span className="text-slate-700 font-semibold">Poin Terpakai</span>
                                        <span className="text-amber-600 font-extrabold text-base">
                                            -{formatPoin(penukaranTerakhir.poinTerpakai)}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <EmptyState message="Belum ada penukaran poin" icon={Gift} />
                            )}
                        </div>
                    </div>

                    {/* Recent Activity Table Container */}
                    <div className="bg-white border border-slate-100 rounded-[22px] sm:rounded-[26px] p-4 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="font-bold text-slate-800 text-sm sm:text-base">Aktivitas Terkini</h2>
                                <p className="text-xs text-slate-400 hidden sm:block">Ringkasan transaksi setoran dan penukaran</p>
                            </div>
                            <Link
                                href="/nasabah/setor/riwayat"
                                className="text-xs font-semibold text-[#35C71D] hover:underline flex items-center gap-1"
                            >
                                <span>Lihat Semua</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* Mobile Card View */}
                        <div className="sm:hidden space-y-3">
                            {setorTerakhir && (
                                <div className="flex items-center justify-between p-3 bg-slate-50/70 rounded-xl">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs flex-shrink-0">
                                            ↑
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 truncate">Setor Sampah</p>
                                            <p className="text-xs text-slate-400">{formatTanggal(setorTerakhir.tanggal)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <p className="text-sm font-bold text-[#35C71D]">+{formatPoin(setorTerakhir.totalPoin)}</p>
                                        <StatusBadge status={setorTerakhir.status} />
                                    </div>
                                </div>
                            )}
                            {penukaranTerakhir && (
                                <div className="flex items-center justify-between p-3 bg-slate-50/70 rounded-xl">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs flex-shrink-0">
                                            ↓
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 truncate">Tukar Hadiah</p>
                                            <p className="text-xs text-slate-400">{formatTanggal(penukaranTerakhir.tanggal)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <p className="text-sm font-bold text-amber-600">-{formatPoin(penukaranTerakhir.poinTerpakai)}</p>
                                        <StatusBadge status={penukaranTerakhir.status} />
                                    </div>
                                </div>
                            )}
                            {!setorTerakhir && !penukaranTerakhir && (
                                <p className="py-6 text-center text-slate-400 text-xs">
                                    Belum ada transaksi aktivitas
                                </p>
                            )}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead>
                                    <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                                        <th className="py-3 px-2 font-semibold">Jenis</th>
                                        <th className="py-3 px-2 font-semibold">Kode</th>
                                        <th className="py-3 px-2 font-semibold">Tanggal</th>
                                        <th className="py-3 px-2 font-semibold">Poin</th>
                                        <th className="py-3 px-2 font-semibold text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 font-medium">
                                    {setorTerakhir && (
                                        <tr className="hover:bg-slate-50/60 transition-colors">
                                            <td className="py-3.5 px-2 flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">
                                                    ↑
                                                </div>
                                                <span className="text-slate-800">Setor Sampah</span>
                                            </td>
                                            <td className="py-3.5 px-2 text-slate-800 font-semibold">{setorTerakhir.kodeSetor}</td>
                                            <td className="py-3.5 px-2 text-slate-500 text-xs">{formatTanggal(setorTerakhir.tanggal)}</td>
                                            <td className="py-3.5 px-2 text-[#35C71D] font-bold">+{formatPoin(setorTerakhir.totalPoin)}</td>
                                            <td className="py-3.5 px-2 text-right">
                                                <StatusBadge status={setorTerakhir.status} />
                                            </td>
                                        </tr>
                                    )}
                                    {penukaranTerakhir && (
                                        <tr className="hover:bg-slate-50/60 transition-colors">
                                            <td className="py-3.5 px-2 flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs">
                                                    ↓
                                                </div>
                                                <span className="text-slate-800">Tukar Hadiah</span>
                                            </td>
                                            <td className="py-3.5 px-2 text-slate-800 font-semibold">{penukaranTerakhir.kodePenukaran}</td>
                                            <td className="py-3.5 px-2 text-slate-500 text-xs">{formatTanggal(penukaranTerakhir.tanggal)}</td>
                                            <td className="py-3.5 px-2 text-amber-600 font-bold">-{formatPoin(penukaranTerakhir.poinTerpakai)}</td>
                                            <td className="py-3.5 px-2 text-right">
                                                <StatusBadge status={penukaranTerakhir.status} />
                                            </td>
                                        </tr>
                                    )}
                                    {!setorTerakhir && !penukaranTerakhir && (
                                        <tr>
                                            <td colSpan={5} className="py-6 text-center text-slate-400 text-xs">
                                                Belum ada transaksi aktivitas
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}