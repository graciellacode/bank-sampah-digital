"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
    AlertCircle,
    Gift,
    Coins,
    Loader2,
    CheckCircle2,
    ChevronRight,
    X,
} from "lucide-react";

import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useCurrentUser } from "@/lib/auth/AuthContext";
import { getHadiahDetail } from "@/lib/api/hadiah";
import { tukarPoin, getMyPenukaran } from "@/lib/api/penukaran";
import { getApiErrorMessage } from "@/lib/api/client";
import { Hadiah } from "@/types/hadiah";
import { PenukaranPoin } from "@/types/penukaran";
import { formatPoin, formatTanggal } from "@/lib/utils/format";

function KonfirmasiTukar({ hadiahId }: { hadiahId: string }) {
    const router = useRouter();
    const user = useCurrentUser();
    const [hadiah, setHadiah] = useState<Hadiah | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const saldoPoin = user.nasabah?.saldoPoin ?? 0;

    useEffect(() => {
        getHadiahDetail(hadiahId)
            .then(setHadiah)
            .catch((err) => setError(getApiErrorMessage(err)))
            .finally(() => setIsLoading(false));
    }, [hadiahId]);

    async function handleTukar() {
        setIsSubmitting(true);
        setError(null);
        try {
            await tukarPoin(hadiahId);
            setIsSuccess(true);
            setTimeout(() => router.push("/nasabah/penukaran"), 1500);
        } catch (err) {
            setError(getApiErrorMessage(err));
            setIsSubmitting(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="bg-white border border-slate-100 rounded-[22px] sm:rounded-[26px] shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-6 sm:p-8 text-center space-y-3 max-w-sm mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-[#35C71D] mx-auto" />
                <h2 className="text-lg font-bold text-slate-800">Penukaran berhasil diajukan!</h2>
                <p className="text-sm text-slate-400">Memuat riwayat penukaran...</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="bg-white border border-slate-100 rounded-[22px] sm:rounded-[26px] shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-6 mb-6 animate-pulse h-40" />
        );
    }

    if (error && !hadiah) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4 flex items-center gap-3 mb-6 shadow-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
            </div>
        );
    }

    if (!hadiah) return null;

    const cukupPoin = saldoPoin >= hadiah.poinDibutuhkan;
    const habis = hadiah.stok <= 0;

    return (
        <div className="bg-white border border-slate-100 rounded-[20px] sm:rounded-[26px] shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-5 sm:p-6 md:p-7 mb-6 relative max-w-xl">
            <Link
                href="/nasabah/penukaran"
                className="absolute top-4 sm:top-5 right-4 sm:right-5 text-slate-400 hover:text-slate-600 transition-colors"
            >
                <X className="w-5 h-5" />
            </Link>

            <h2 className="text-sm sm:text-base font-bold text-slate-800 mb-4 sm:mb-5 pb-3 border-b border-slate-100 pr-8">
                Konfirmasi Penukaran Poin
            </h2>

            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Gift className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm sm:text-base truncate">{hadiah.namaHadiah}</p>
                    <p className="text-xs sm:text-sm text-[#35C71D] font-extrabold flex items-center gap-1 mt-0.5">
                        <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        {formatPoin(hadiah.poinDibutuhkan)}
                    </p>
                </div>
            </div>

            <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-2 mb-4 sm:mb-5 border border-slate-100">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-400 font-medium">Saldo poin Anda</span>
                    <span className="text-slate-700 font-semibold">{formatPoin(saldoPoin)}</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-400 font-medium">Poin dibutuhkan</span>
                    <span className="text-amber-600 font-semibold">{formatPoin(hadiah.poinDibutuhkan)}</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-800">Sisa setelah tukar</span>
                    <span className="font-extrabold text-[#35C71D]">
                        {formatPoin(Math.max(saldoPoin - hadiah.poinDibutuhkan, 0))}
                    </span>
                </div>
            </div>

            {habis && (
                <p className="text-xs sm:text-sm text-red-600 font-medium mb-4">Maaf, stok hadiah ini sudah habis.</p>
            )}
            {!habis && !cukupPoin && (
                <p className="text-xs sm:text-sm text-red-600 font-medium mb-4">Poin Anda tidak mencukupi untuk menukar hadiah ini.</p>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            <button
                onClick={handleTukar}
                disabled={isSubmitting || habis || !cukupPoin}
                className="w-full bg-[#35C71D] hover:bg-[#2EB319] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl px-4 py-3 text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Memproses..." : "Konfirmasi Tukar Poin"}
            </button>
        </div>
    );
}

function RiwayatSkeleton() {
    return (
        <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-slate-200 rounded-[24px]" />
            ))}
        </div>
    );
}

export default function PenukaranPoinPage() {
    const searchParams = useSearchParams();
    const hadiahId = searchParams.get("hadiahId");

    const [data, setData] = useState<PenukaranPoin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getMyPenukaran()
            .then(setData)
            .catch((err) => setError(getApiErrorMessage(err)))
            .finally(() => setIsLoading(false));
    }, [hadiahId]);

    return (
        <div className="pb-8 space-y-4">
            <DashboardTopbar
                greeting="Penukaran Poin"
                subtitle="Ajukan penukaran dan lihat riwayat penukaran Anda"
            />

            {hadiahId && <KonfirmasiTukar hadiahId={hadiahId} />}

            <h2 className="text-sm sm:text-base font-bold text-slate-800">Riwayat Penukaran Poin</h2>

            {isLoading && <RiwayatSkeleton />}

            {!isLoading && error && !hadiahId && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {!isLoading && data.length === 0 && (
                <div className="bg-white border border-slate-100 rounded-[22px] sm:rounded-[26px] shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-8">
                    <EmptyState message="Belum ada penukaran poin" icon={Gift} />
                </div>
            )}

            {!isLoading && data.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-[20px] sm:rounded-[26px] shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {data.map((penukaran) => (
                            <Link
                                key={penukaran.id}
                                href={`/nasabah/penukaran/${penukaran.id}`}
                                className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4.5 hover:bg-slate-50/70 transition-colors group"
                            >
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                                        <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                                            {penukaran.hadiah.namaHadiah}
                                        </p>
                                        <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">
                                            {formatTanggal(penukaran.tanggal)} · {penukaran.kodePenukaran}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                                    <p className="text-xs sm:text-sm font-extrabold text-amber-600 hidden sm:block">
                                        -{formatPoin(penukaran.poinTerpakai)}
                                    </p>
                                    <StatusBadge status={penukaran.status} />
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors hidden sm:block" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}