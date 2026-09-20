"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    AlertCircle,
    Gift,
    Coins,
    PackageX,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    TrendingUp,
} from "lucide-react";

import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { useCurrentUser } from "@/lib/auth/AuthContext";
import { getHadiahList } from "@/lib/api/hadiah";
import { getApiErrorMessage } from "@/lib/api/client";
import { Hadiah } from "@/types/hadiah";
import { formatPoin } from "@/lib/utils/format";
import { resolvePhotoUrl } from "@/lib/utils/photo";

function HadiahSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-28 sm:h-32 bg-slate-200 rounded-[22px] sm:rounded-[26px]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-64 sm:h-72 bg-slate-200 rounded-[22px] sm:rounded-[26px]" />
                ))}
            </div>
        </div>
    );
}

export default function KatalogHadiahPage() {
    const user = useCurrentUser();
    const router = useRouter();
    const [data, setData] = useState<Hadiah[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const saldoPoin = user.nasabah?.saldoPoin ?? 0;

    useEffect(() => {
        getHadiahList()
            .then(setData)
            .catch((err) => setError(getApiErrorMessage(err)))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="pb-8 space-y-5 sm:space-y-6">
            <DashboardTopbar
                greeting="Katalog Hadiah"
                subtitle="Tukarkan saldo poin daur ulang Anda dengan berbagai hadiah menarik"
            />

            {/* Banner Top Summary Card Saldo Poin */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#3BC12F] via-[#35C71D] to-[#1DA724] rounded-[20px] sm:rounded-[26px] p-5 sm:p-6 md:p-7 text-white shadow-lg shadow-emerald-600/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <svg
                    className="absolute bottom-0 left-0 right-0 w-full h-16 sm:h-20 text-white/10 pointer-events-none"
                    viewBox="0 0 300 60"
                    fill="none"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0 35 C60 15, 120 45, 180 20 C230 -5, 270 35, 300 15 L300 60 L0 60 Z"
                        fill="currentColor"
                    />
                </svg>

                <div className="relative z-10 space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] sm:text-xs font-semibold text-white border border-white/20">
                        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-300" />
                        <span>Saldo Poin Anda</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white pt-1">
                        {formatPoin(saldoPoin)}
                    </h2>
                    <p className="text-[11px] sm:text-xs text-white/90 font-medium">
                        Kumpulkan lebih banyak poin dengan terus menyetor sampah daur ulang!
                    </p>
                </div>

                <div className="relative z-10 flex-shrink-0 w-full sm:w-auto">
                    <button
                        onClick={() => router.push("/nasabah/penukaran")}
                        className="w-full sm:w-auto px-5 py-2.5 sm:py-3 bg-white hover:bg-slate-50 text-[#1DA724] font-bold text-xs rounded-xl sm:rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <span>Riwayat Penukaran</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {isLoading && <HadiahSkeleton />}

            {!isLoading && error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {!isLoading && !error && data.length === 0 && (
                <div className="bg-white border border-slate-100 rounded-[22px] sm:rounded-[26px] shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-8">
                    <EmptyState message="Belum ada hadiah tersedia" icon={Gift} />
                </div>
            )}

            {!isLoading && !error && data.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {data.map((hadiah) => {
                        const habis = hadiah.stok <= 0;
                        const cukupPoin = saldoPoin >= hadiah.poinDibutuhkan;
                        const bisaDitukar = !habis && cukupPoin;

                        return (
                            <div
                                key={hadiah.id}
                                className="group bg-white border border-slate-100 rounded-[20px] sm:rounded-[26px] shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1"
                            >
                                {/* Photo Container & Floating Badges */}
                                <div className="relative h-36 sm:h-44 bg-slate-50 overflow-hidden flex items-center justify-center">
                                    {hadiah.foto ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={resolvePhotoUrl(hadiah.foto) ?? undefined}
                                            alt={hadiah.namaHadiah}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center">
                                            <Gift className="w-6 h-6 sm:w-7 sm:h-7" />
                                        </div>
                                    )}

                                    {/* Badge Status Top-Left */}
                                    <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3">
                                        {habis ? (
                                            <span className="bg-red-500/90 text-white backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold shadow-sm flex items-center gap-1">
                                                <PackageX className="w-3 h-3" />
                                                Stok Habis
                                            </span>
                                        ) : cukupPoin ? (
                                            <span className="bg-emerald-500/90 text-white backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold shadow-sm flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Siap Ditukar
                                            </span>
                                        ) : (
                                            <span className="bg-amber-500/90 text-white backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold shadow-sm">
                                                Poin Kurang
                                            </span>
                                        )}
                                    </div>

                                    {/* Badge Poin Floating Top-Right */}
                                    <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 bg-white/95 backdrop-blur-md text-[#35C71D] border border-slate-100 shadow-md font-extrabold px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs flex items-center gap-1">
                                        <Coins className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#35C71D]" />
                                        <span>{formatPoin(hadiah.poinDibutuhkan)}</span>
                                    </div>
                                </div>

                                {/* Body Info & Action */}
                                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-2 group-hover:text-[#35C71D] transition-colors">
                                            {hadiah.namaHadiah}
                                        </h3>
                                        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 font-medium mt-2 pt-2 border-t border-slate-100">
                                            <span>Sisa Stok</span>
                                            <span className={habis ? "text-red-500 font-bold" : "text-slate-700 font-semibold"}>
                                                {habis ? "0 Unit" : `${hadiah.stok} Unit`}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => router.push(`/nasabah/penukaran?hadiahId=${hadiah.id}`)}
                                        disabled={!bisaDitukar}
                                        className={`w-full py-2.5 sm:py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${bisaDitukar
                                                ? "bg-gradient-to-r from-[#3BC12F] to-[#1DA724] text-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                            }`}
                                    >
                                        {habis ? (
                                            "Stok Tidak Tersedia"
                                        ) : !cukupPoin ? (
                                            "Poin Belum Cukup"
                                        ) : (
                                            <>
                                                <span>Tukar Sekarang</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}