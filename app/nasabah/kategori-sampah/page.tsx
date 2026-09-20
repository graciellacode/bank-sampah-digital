"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Recycle } from "lucide-react";

import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { JenisBadge } from "@/components/shared/JenisBadge";
import { getKategoriSampah } from "@/lib/api/kategoriSampah";
import { getApiErrorMessage } from "@/lib/api/client";
import { KategoriSampah } from "@/types/kategori";
import { formatRupiah, formatPoin } from "@/lib/utils/format";

function KategoriSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
            ))}
        </div>
    );
}

export default function KategoriSampahPage() {
    const [data, setData] = useState<KategoriSampah[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getKategoriSampah()
            .then(setData)
            .catch((err) => setError(getApiErrorMessage(err)))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div>
            <DashboardTopbar
                greeting="Kategori Sampah"
                subtitle="Daftar jenis sampah daur ulang beserta harga dan poin per kilogram"
            />

            {isLoading && <KategoriSkeleton />}

            {!isLoading && error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-4 py-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {!isLoading && !error && data.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm">
                    <EmptyState message="Belum ada kategori sampah tersedia" icon={Recycle} />
                </div>
            )}

            {!isLoading && !error && data.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {data.map((kategori) => (
                        <div
                            key={kategori.id}
                            className="bg-white border border-slate-100 rounded-[20px] sm:rounded-[26px] p-4 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <Recycle className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <JenisBadge jenis={kategori.jenis} />
                            </div>
                            <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-3 sm:mb-4">
                                {kategori.namaKategori}
                            </h3>
                            <div className="space-y-2 pt-3 border-t border-slate-100">
                                <div className="flex items-center justify-between text-xs sm:text-sm">
                                    <span className="text-slate-400 font-medium">Harga/kg</span>
                                    <span className="font-semibold text-slate-700">
                                        {formatRupiah(kategori.hargaPerKg)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs sm:text-sm">
                                    <span className="text-slate-400 font-medium">Poin/kg</span>
                                    <span className="font-extrabold text-[#35C71D]">
                                        {formatPoin(kategori.poinPerKg)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}