"use client";

import { useEffect, useState } from "react";
import { Users, Recycle, PackageCheck, Gift, Scale, Coins, AlertCircle } from "lucide-react";

import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { StatCard } from "@/components/shared/StatCard";
import { useCurrentUser } from "@/lib/auth/AuthContext";
import { getDashboardStats } from "@/lib/api/dashboard";
import { getApiErrorMessage } from "@/lib/api/client";
import { DashboardStats } from "@/types/dashboardAdmin";
import { formatKg, formatPoin } from "@/lib/utils/format";

function StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-36 bg-slate-200/70 rounded-[24px]" />
            ))}
        </div>
    );
}

export default function AdminDashboardPage() {
    const user = useCurrentUser();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getDashboardStats()
            .then(setStats)
            .catch((err) => setError(getApiErrorMessage(err)))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <DashboardTopbar
                greeting={`Selamat datang, ${user.adminBank?.namaUnit ?? user.username} 👋`}
                subtitle="Ringkasan statistik unit Bank Sampah Anda"
            />

            {isLoading && <StatsSkeleton />}

            {!isLoading && error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4 flex items-center gap-3 shadow-xs">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {!isLoading && !error && stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    <StatCard
                        label="Total Nasabah"
                        value={stats.totalNasabah.toLocaleString("id-ID")}
                        icon={Users}
                        trend="Aktif"
                        subtitle="nasabah terdaftar"
                    />
                    <StatCard
                        label="Total Kategori Sampah"
                        value={stats.totalKategoriSampah.toLocaleString("id-ID")}
                        icon={Recycle}
                        trend="Aktif"
                        subtitle="kategori tersedia"
                    />
                    <StatCard
                        label="Total Transaksi Setor"
                        value={stats.totalTransaksiSetor.toLocaleString("id-ID")}
                        icon={PackageCheck}
                        trend="Terproses"
                        subtitle="penyetoran"
                    />
                    <StatCard
                        label="Total Hadiah"
                        value={stats.totalHadiah.toLocaleString("id-ID")}
                        icon={Gift}
                        trend="Tersedia"
                        subtitle="katalog hadiah"
                    />
                    <StatCard
                        label="Total Berat Sampah"
                        value={formatKg(stats.totalBeratSampahKg)}
                        icon={Scale}
                        trend="Terkumpul"
                        subtitle="total akumulasi"
                    />
                    <StatCard
                        label="Total Poin Tersalurkan"
                        value={formatPoin(stats.totalPoinTersalurkan)}
                        icon={Coins}
                        trend="Tersalurkan"
                        subtitle="poin nasabah"
                    />
                </div>
            )}
        </div>
    );
}