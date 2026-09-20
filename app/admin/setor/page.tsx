"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, PackageCheck, Eye, Search, ChevronLeft, ChevronRight, Coins, Scale, Calendar } from "lucide-react";

import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MonthFilter } from "@/components/ui/MonthFilter";
import { StatusFilter } from "@/components/ui/StatusFilter";
import { getSetorAdminList } from "@/lib/api/setor";
import { getApiErrorMessage } from "@/lib/api/client";
import { SetorAdminListItem } from "@/types/setorAdmin";
import { formatKg, formatPoin, formatTanggal } from "@/lib/utils/format";

function TableSkeleton() {
    return (
        <div className="bg-white rounded-[22px] sm:rounded-[26px] p-5 sm:p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 bg-slate-100/80 rounded-xl" />
            ))}
        </div>
    );
}

export default function AdminSetorListPage() {
    const [status, setStatus] = useState("");
    const [bulan, setBulan] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [data, setData] = useState<SetorAdminListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        getSetorAdminList({ status: status || undefined, bulan: bulan || undefined })
            .then(setData)
            .catch((err) => setError(getApiErrorMessage(err)))
            .finally(() => setIsLoading(false));
    }, [status, bulan]);

    // Reset pagination when filter or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [status, bulan, searchQuery]);

    const filteredData = data.filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
            item.kodeSetor.toLowerCase().includes(query) ||
            item.nasabah.namaNasabah.toLowerCase().includes(query)
        );
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="space-y-6">
            <DashboardTopbar
                greeting="Verifikasi Setor Sampah"
                subtitle="Kelola dan verifikasi pengajuan penyetoran sampah dari nasabah"
            />

            {/* Filter Bar & Search Controls */}
            <div className="bg-white rounded-[22px] sm:rounded-[26px] border border-slate-100/90 p-4 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <StatusFilter value={status} onChange={setStatus} />
                        <MonthFilter value={bulan} onChange={setBulan} />
                    </div>

                    <div className="relative w-full lg:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari kode / nama nasabah..."
                            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700 placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {isLoading && <TableSkeleton />}

                {!isLoading && error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4 flex items-center gap-3 shadow-xs">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {!isLoading && !error && filteredData.length === 0 && (
                    <EmptyState message="Tidak ada pengajuan setor yang sesuai" icon={PackageCheck} />
                )}

                {!isLoading && !error && filteredData.length > 0 && (
                    <>
                        {/* Mobile Card Layout */}
                        <div className="sm:hidden space-y-3">
                            {paginatedData.map((setor, idx) => (
                                <Link
                                    key={setor.id}
                                    href={`/admin/setor/${setor.id}`}
                                    className="block p-4 bg-slate-50/70 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all space-y-3"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-xs font-bold text-slate-400 font-mono">
                                                #{String(startIndex + idx + 1).padStart(2, "0")}
                                            </span>
                                            <span className="font-bold text-slate-800 text-sm truncate">
                                                {setor.kodeSetor}
                                            </span>
                                        </div>
                                        <StatusBadge status={setor.status} />
                                    </div>

                                    <div className="text-xs text-slate-600 space-y-1">
                                        <p className="font-semibold text-slate-800">{setor.nasabah.namaNasabah}</p>
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{formatTanggal(setor.tanggal)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                                        <div className="flex items-center gap-1 text-slate-600 font-medium">
                                            <Scale className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{formatKg(setor.totalBeratKg)}</span>
                                        </div>
                                        <div className="flex items-center gap-1 font-extrabold text-[#16A34A]">
                                            <Coins className="w-3.5 h-3.5" />
                                            <span>{formatPoin(setor.totalPoin)}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Styled Table Layout (Nexus / Gateway style matching photo) */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead>
                                    <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider font-semibold bg-slate-50/50">
                                        <th className="py-3.5 px-4 rounded-l-xl">#</th>
                                        <th className="py-3.5 px-4">Kode & Nasabah</th>
                                        <th className="py-3.5 px-4">Tanggal</th>
                                        <th className="py-3.5 px-4">Total Berat</th>
                                        <th className="py-3.5 px-4">Total Poin</th>
                                        <th className="py-3.5 px-4 text-center">Status</th>
                                        <th className="py-3.5 px-4 text-center rounded-r-xl">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium">
                                    {paginatedData.map((setor, idx) => (
                                        <tr
                                            key={setor.id}
                                            className="even:bg-slate-50/40 hover:bg-slate-50 transition-colors group"
                                        >
                                            <td className="py-4 px-4 text-xs font-semibold text-slate-400 font-mono">
                                                {String(startIndex + idx + 1).padStart(2, "0")}
                                            </td>

                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">
                                                        {setor.kodeSetor}
                                                    </p>
                                                    <p className="text-xs text-slate-400 font-medium">
                                                        {setor.nasabah.namaNasabah}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4 text-xs sm:text-sm text-slate-500">
                                                {formatTanggal(setor.tanggal)}
                                            </td>

                                            <td className="py-4 px-4 font-semibold text-slate-700">
                                                {formatKg(setor.totalBeratKg)}
                                            </td>

                                            <td className="py-4 px-4">
                                                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#16A34A] bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                                                    {formatPoin(setor.totalPoin)}
                                                </span>
                                            </td>

                                            <td className="py-4 px-4 text-center">
                                                <StatusBadge status={setor.status} />
                                            </td>

                                            <td className="py-4 px-4 text-center">
                                                <Link
                                                    href={`/admin/setor/${setor.id}`}
                                                    className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                    title="Verifikasi / Detail"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Bottom Pagination Controls (Matching Photo) */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                            <div className="text-xs text-slate-400 font-medium">
                                Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} data pengajuan
                            </div>

                            <div className="flex items-center justify-center gap-1">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="w-8 h-8 rounded-full border border-slate-200/80 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentPage === page
                                                ? "bg-[#35C71D] text-white shadow-xs"
                                                : "text-slate-600 hover:bg-slate-100"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="w-8 h-8 rounded-full border border-slate-200/80 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}