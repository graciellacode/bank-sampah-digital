"use client";

import { useEffect, useState } from "react";
import { Repeat, AlertCircle, Loader2, Search, Gift, ChevronLeft, ChevronRight, Coins, Calendar, CheckCircle2 } from "lucide-react";

import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MonthFilter } from "@/components/ui/MonthFilter";
import { getPenukaranAdminList, updatePenukaranStatus } from "@/lib/api/penukaran";
import { getApiErrorMessage } from "@/lib/api/client";
import { PenukaranAdminListItem } from "@/types/penukaranAdmin";
import { formatPoin, formatTanggal } from "@/lib/utils/format";

function TableSkeleton() {
    return (
        <div className="bg-white rounded-[22px] sm:rounded-[26px] p-5 sm:p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 bg-slate-100/80 rounded-xl" />
            ))}
        </div>
    );
}

export default function AdminPenukaranPage() {
    const [bulan, setBulan] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [data, setData] = useState<PenukaranAdminListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [rowError, setRowError] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    function loadData() {
        setIsLoading(true);
        setError(null);
        getPenukaranAdminList(bulan || undefined)
            .then(setData)
            .catch((err) => setError(getApiErrorMessage(err)))
            .finally(() => setIsLoading(false));
    }

    useEffect(loadData, [bulan]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [bulan, statusFilter, searchQuery]);

    async function handleSelesaikan(id: string) {
        setUpdatingId(id);
        setRowError(null);
        try {
            await updatePenukaranStatus(id, "selesai");
            loadData();
        } catch (err) {
            setRowError(getApiErrorMessage(err));
        } finally {
            setUpdatingId(null);
        }
    }

    const filteredData = data.filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesStatus = !statusFilter || item.status === statusFilter;
        const matchesQuery =
            !query ||
            item.kodePenukaran.toLowerCase().includes(query) ||
            item.nasabah.namaNasabah.toLowerCase().includes(query) ||
            item.hadiah.namaHadiah.toLowerCase().includes(query);

        return matchesStatus && matchesQuery;
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="space-y-6">
            <DashboardTopbar
                greeting="Transaksi Penukaran Poin"
                subtitle="Kelola dan konfirmasi transaksi penukaran poin hadiah nasabah"
            />

            {rowError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl px-5 py-4 flex items-center gap-3 shadow-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{rowError}</span>
                </div>
            )}

            {/* Filter Bar & Table Container (Nexus Gateway style) */}
            <div className="bg-white rounded-[22px] sm:rounded-[26px] border border-slate-100/90 p-4 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                        >
                            <option value="">Semua Status</option>
                            <option value="diproses">Diproses</option>
                            <option value="selesai">Selesai</option>
                            <option value="ditolak">Ditolak</option>
                        </select>
                        <MonthFilter value={bulan} onChange={setBulan} />
                    </div>

                    <div className="relative w-full lg:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari kode, nasabah, hadiah..."
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
                    <EmptyState message="Belum ada transaksi penukaran yang sesuai" icon={Repeat} />
                )}

                {!isLoading && !error && filteredData.length > 0 && (
                    <>
                        {/* Mobile Card Layout */}
                        <div className="sm:hidden space-y-3">
                            {paginatedData.map((penukaran, idx) => (
                                <div
                                    key={penukaran.id}
                                    className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-3"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-xs font-bold text-slate-400 font-mono">
                                                #{String(startIndex + idx + 1).padStart(2, "0")}
                                            </span>
                                            <span className="font-bold text-slate-800 text-sm truncate">
                                                {penukaran.kodePenukaran}
                                            </span>
                                        </div>
                                        <StatusBadge status={penukaran.status} />
                                    </div>

                                    <div className="text-xs text-slate-600 space-y-1">
                                        <p className="font-semibold text-slate-800">{penukaran.nasabah.namaNasabah}</p>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Gift className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                            <span className="font-medium truncate">{penukaran.hadiah.namaHadiah}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{formatTanggal(penukaran.tanggal)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                                        <div className="flex items-center gap-1 font-extrabold text-amber-600">
                                            <Coins className="w-3.5 h-3.5" />
                                            <span>-{formatPoin(penukaran.poinTerpakai)}</span>
                                        </div>

                                        {penukaran.status === "diproses" && (
                                            <button
                                                onClick={() => handleSelesaikan(penukaran.id)}
                                                disabled={updatingId === penukaran.id}
                                                className="flex items-center gap-1 bg-[#35C71D] hover:bg-[#2EB319] disabled:opacity-60 text-white font-bold rounded-xl px-3 py-1.5 text-[11px] shadow-xs transition-all"
                                            >
                                                {updatingId === penukaran.id ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                )}
                                                <span>Tandai Selesai</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Styled Table Layout (Nexus / Gateway style matching photo) */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead>
                                    <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider font-semibold bg-slate-50/50">
                                        <th className="py-3.5 px-4 rounded-l-xl">#</th>
                                        <th className="py-3.5 px-4">Kode & Nasabah</th>
                                        <th className="py-3.5 px-4">Hadiah Ditukar</th>
                                        <th className="py-3.5 px-4">Poin Terpakai</th>
                                        <th className="py-3.5 px-4">Tanggal</th>
                                        <th className="py-3.5 px-4 text-center">Status</th>
                                        <th className="py-3.5 px-4 text-center rounded-r-xl">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium">
                                    {paginatedData.map((penukaran, idx) => (
                                        <tr
                                            key={penukaran.id}
                                            className="even:bg-slate-50/40 hover:bg-slate-50 transition-colors group"
                                        >
                                            <td className="py-4 px-4 text-xs font-semibold text-slate-400 font-mono">
                                                {String(startIndex + idx + 1).padStart(2, "0")}
                                            </td>

                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">
                                                        {penukaran.kodePenukaran}
                                                    </p>
                                                    <p className="text-xs text-slate-400 font-medium">
                                                        {penukaran.nasabah.namaNasabah}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-lg bg-amber-100/80 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-200/60 shadow-xs">
                                                        <Gift className="w-4 h-4 text-amber-600" />
                                                    </div>
                                                    <span className="font-bold text-slate-800 text-xs sm:text-sm truncate max-w-[180px]">
                                                        {penukaran.hadiah.namaHadiah}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-4">
                                                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                                                    -{formatPoin(penukaran.poinTerpakai)}
                                                </span>
                                            </td>

                                            <td className="py-4 px-4 text-xs sm:text-sm text-slate-500">
                                                {formatTanggal(penukaran.tanggal)}
                                            </td>

                                            <td className="py-4 px-4 text-center">
                                                <StatusBadge status={penukaran.status} />
                                            </td>

                                            <td className="py-4 px-4 text-center">
                                                {penukaran.status === "diproses" ? (
                                                    <button
                                                        onClick={() => handleSelesaikan(penukaran.id)}
                                                        disabled={updatingId === penukaran.id}
                                                        className="inline-flex items-center gap-1.5 bg-[#35C71D] hover:bg-[#2EB319] disabled:opacity-60 text-white font-bold rounded-xl px-3.5 py-1.5 text-xs transition-all shadow-xs"
                                                    >
                                                        {updatingId === penukaran.id ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                        )}
                                                        <span>Tandai Selesai</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-slate-300">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Bottom Pagination Controls (Matching Photo) */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                            <div className="text-xs text-slate-400 font-medium">
                                Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} data penukaran
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