"use client";

import { useEffect, useState } from "react";
import {
    Scale,
    Coins,
    Repeat,
    AlertCircle,
    FileBarChart,
    PieChart,
    Printer,
    Sparkles,
    Calendar,
    Layers,
    Award,
    ArrowUpRight,
    TrendingUp,
} from "lucide-react";

import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { MonthFilter } from "@/components/ui/MonthFilter";
import { getRekapitulasiBulanan } from "@/lib/api/rekapitulasi";
import { getApiErrorMessage } from "@/lib/api/client";
import { RekapitulasiBulanan } from "@/types/rekapitulasi";
import { JenisSampah } from "@/types/kategori";
import { formatKg, formatPoin, formatRupiah } from "@/lib/utils/format";

function currentMonth(): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${now.getFullYear()}-${month}`;
}

function formatBulanIndo(yyyyMm: string): string {
    if (!yyyyMm) return "";
    const [year, month] = yyyyMm.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

function RekapSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                <div className="h-32 bg-slate-100 rounded-[24px]" />
                <div className="h-32 bg-slate-100 rounded-[24px]" />
                <div className="h-32 bg-slate-100 rounded-[24px]" />
            </div>
            <div className="h-44 bg-slate-100 rounded-[24px]" />
            <div className="h-80 bg-slate-100 rounded-[24px]" />
        </div>
    );
}

const jenisMeta: Record<
    JenisSampah,
    { label: string; bg: string; text: string; border: string; barBg: string; dotColor: string }
> = {
    plastik: {
        label: "Plastik",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200/70",
        barBg: "bg-emerald-500",
        dotColor: "#10B981",
    },
    kertas: {
        label: "Kertas",
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200/70",
        barBg: "bg-amber-500",
        dotColor: "#F59E0B",
    },
    logam: {
        label: "Logam",
        bg: "bg-slate-100",
        text: "text-slate-700",
        border: "border-slate-200/70",
        barBg: "bg-slate-600",
        dotColor: "#475569",
    },
    kaca: {
        label: "Kaca",
        bg: "bg-cyan-50",
        text: "text-cyan-700",
        border: "border-cyan-200/70",
        barBg: "bg-cyan-500",
        dotColor: "#06B6D4",
    },
};

const jenisList: JenisSampah[] = ["plastik", "kertas", "logam", "kaca"];

export default function AdminRekapitulasiPage() {
    const [bulan, setBulan] = useState(currentMonth());
    const [data, setData] = useState<RekapitulasiBulanan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!bulan) return;
        setIsLoading(true);
        setError(null);
        getRekapitulasiBulanan(bulan)
            .then(setData)
            .catch((err) => setError(getApiErrorMessage(err)))
            .finally(() => setIsLoading(false));
    }, [bulan]);

    const totalKg = data?.rekapitulasiTonase.totalKg || 0;
    const poinDiterbitkan = data?.rekapitulasiTonase.totalPoinDiterbitkan || 0;
    const poinTerpakai = data?.rekapitulasiPenukaranPoin.totalPoinTerpakai || 0;
    const poinRatio = poinDiterbitkan > 0 ? Math.min(Math.round((poinTerpakai / poinDiterbitkan) * 100), 100) : 0;

    return (
        <div className="space-y-6">
            <DashboardTopbar
                greeting="Rekapitulasi Bulanan"
                subtitle="Analisis tonase sampah, estimasi pembayaran, & perputaran poin nasabah"
            />

            {/* Print Only Official Report Header */}
            {bulan && data && (
                <div className="hidden print:block mb-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Laporan Rekapitulasi Bulanan Bank Sampah</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Periode Laporan: <strong>{formatBulanIndo(bulan)}</strong></p>
                        </div>
                        <div className="text-right text-xs text-slate-400 font-mono">
                            Cetak: {new Date().toLocaleDateString("id-ID")}
                        </div>
                    </div>
                </div>
            )}

            {/* Filter & Period Header Card (Hidden when printing) */}
            <div className="bg-white rounded-[22px] sm:rounded-[26px] border border-slate-100/90 p-4 sm:p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Pilih Periode:
                        </span>
                    </div>
                    <MonthFilter value={bulan} onChange={setBulan} />
                </div>

                {bulan && data && (
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="inline-flex items-center gap-2 bg-emerald-50/80 border border-emerald-100 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Periode: {formatBulanIndo(bulan)}</span>
                        </div>
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl px-3 py-1.5 text-xs transition-all"
                            title="Cetak Laporan"
                        >
                            <Printer className="w-3.5 h-3.5 text-slate-500" />
                            <span className="hidden sm:inline">Cetak</span>
                        </button>
                    </div>
                )}
            </div>

            {!bulan && (
                <div className="bg-white rounded-[22px] border border-slate-100/90 shadow-xs p-8">
                    <EmptyState message="Pilih bulan untuk melihat rekapitulasi data" icon={FileBarChart} />
                </div>
            )}

            {bulan && isLoading && <RekapSkeleton />}

            {bulan && !isLoading && error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4 flex items-center gap-3 shadow-xs">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {bulan && !isLoading && !error && data && (
                <div className="space-y-6">
                    {/* Top Metric Cards (3 Cards) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                        {/* 1. Total Tonase */}
                        <div className="bg-white rounded-[22px] sm:rounded-[26px] border border-slate-100/90 p-5 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs sm:text-sm font-semibold text-slate-500">Total Tonase</span>
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/80 text-[#16A34A] flex items-center justify-center flex-shrink-0 border border-emerald-200/60 shadow-xs group-hover:scale-105 transition-transform">
                                    <Scale className="w-5 h-5 text-[#16A34A]" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                                    {formatKg(data.rekapitulasiTonase.totalKg)}
                                </p>
                                <div className="flex items-center gap-2 mt-2.5">
                                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#16A34A] bg-emerald-50 border border-emerald-100/80 px-2.5 py-0.5 rounded-full">
                                        <TrendingUp className="w-3 h-3" />
                                        {data.rekapitulasiTonase.totalTon.toFixed(2)} Ton
                                    </span>
                                    <span className="text-[11px] font-medium text-slate-400">terkumpul</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Estimasi Pembayaran */}
                        <div className="bg-white rounded-[22px] sm:rounded-[26px] border border-slate-100/90 p-5 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs sm:text-sm font-semibold text-slate-500">Estimasi Pembayaran</span>
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-100/80 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-200/60 shadow-xs group-hover:scale-105 transition-transform">
                                    <Coins className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                                    {formatRupiah(data.rekapitulasiTonase.totalEstimasiPembayaranRupiah)}
                                </p>
                                <div className="flex items-center gap-2 mt-2.5">
                                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-blue-700 bg-blue-50 border border-blue-100/80 px-2.5 py-0.5 rounded-full">
                                        Nilai Penyetoran
                                    </span>
                                    <span className="text-[11px] font-medium text-slate-400">rupiah nasabah</span>
                                </div>
                            </div>
                        </div>

                        {/* 3. Total Poin Diterbitkan */}
                        <div className="bg-white rounded-[22px] sm:rounded-[26px] border border-slate-100/90 p-5 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs sm:text-sm font-semibold text-slate-500">Poin Diterbitkan</span>
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100/80 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-200/60 shadow-xs group-hover:scale-105 transition-transform">
                                    <Award className="w-5 h-5 text-amber-600" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                                    {formatPoin(data.rekapitulasiTonase.totalPoinDiterbitkan)}
                                </p>
                                <div className="flex items-center gap-2 mt-2.5">
                                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-700 bg-amber-50 border border-amber-100/80 px-2.5 py-0.5 rounded-full">
                                        Distribusi Poin
                                    </span>
                                    <span className="text-[11px] font-medium text-slate-400">periode ini</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Proportion Analytics Progress Bar Section */}
                    <div className="bg-white rounded-[22px] sm:rounded-[26px] border border-slate-100/90 p-5 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-[#16A34A] flex items-center justify-center flex-shrink-0">
                                    <PieChart className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                                        Proporsi Sampah Berdasarkan Jenis
                                    </h3>
                                    <p className="text-xs text-slate-400 font-medium">
                                        Persentase kontribusi tonase dari setiap jenis sampah
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Multi-segment progress bar */}
                        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex p-0.5 gap-0.5">
                            {jenisList.map((jenis) => {
                                const item = data.breakdownJenisSampah[jenis];
                                const percent = totalKg > 0 ? (item.tonaseKg / totalKg) * 100 : 0;
                                if (percent <= 0) return null;
                                return (
                                    <div
                                        key={jenis}
                                        style={{ width: `${percent}%` }}
                                        className={`h-full rounded-xs transition-all duration-500 ${jenisMeta[jenis].barBg}`}
                                        title={`${jenisMeta[jenis].label}: ${percent.toFixed(1)}%`}
                                    />
                                );
                            })}
                        </div>

                        {/* Legend cards grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                            {jenisList.map((jenis) => {
                                const item = data.breakdownJenisSampah[jenis];
                                const meta = jenisMeta[jenis];
                                const percent = totalKg > 0 ? (item.tonaseKg / totalKg) * 100 : 0;
                                return (
                                    <div
                                        key={jenis}
                                        className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 flex flex-col justify-between"
                                    >
                                        <div className="flex items-center justify-between gap-1 mb-1.5">
                                            <div className="flex items-center gap-1.5">
                                                <span
                                                    className="w-2.5 h-2.5 rounded-full inline-block"
                                                    style={{ backgroundColor: meta.dotColor }}
                                                />
                                                <span className="text-xs font-bold text-slate-700">{meta.label}</span>
                                            </div>
                                            <span className="text-xs font-extrabold text-slate-600 font-mono">
                                                {percent.toFixed(1)}%
                                            </span>
                                        </div>
                                        <p className="text-sm font-extrabold text-slate-800">
                                            {formatKg(item.tonaseKg)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Detailed Breakdown Table */}
                    <div className="bg-white rounded-[22px] sm:rounded-[26px] border border-slate-100/90 p-4 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
                                    <Layers className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                                        Rincian Per Jenis Sampah
                                    </h3>
                                    <p className="text-xs text-slate-400 font-medium">
                                        Data lengkap tonase, estimasi rupiah, dan poin diterbitkan
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead>
                                    <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider font-semibold bg-slate-50/50">
                                        <th className="py-3.5 px-4 rounded-l-xl">Jenis Sampah</th>
                                        <th className="py-3.5 px-4">Tonase (kg)</th>
                                        <th className="py-3.5 px-4 text-center">Kontribusi (%)</th>
                                        <th className="py-3.5 px-4">Estimasi Rupiah</th>
                                        <th className="py-3.5 px-4 text-center rounded-r-xl">Poin Diterbitkan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium">
                                    {jenisList.map((jenis) => {
                                        const item = data.breakdownJenisSampah[jenis];
                                        const meta = jenisMeta[jenis];
                                        const percent = totalKg > 0 ? (item.tonaseKg / totalKg) * 100 : 0;
                                        return (
                                            <tr
                                                key={jenis}
                                                className="even:bg-slate-50/40 hover:bg-slate-50 transition-colors group"
                                            >
                                                <td className="py-4 px-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${meta.bg} ${meta.text} border ${meta.border}`}
                                                    >
                                                        <span
                                                            className="w-2 h-2 rounded-full"
                                                            style={{ backgroundColor: meta.dotColor }}
                                                        />
                                                        {meta.label}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="space-y-1">
                                                        <span className="font-extrabold text-slate-800 text-sm">
                                                            {formatKg(item.tonaseKg)}
                                                        </span>
                                                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${meta.barBg}`}
                                                                style={{ width: `${Math.min(percent, 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className="inline-flex items-center text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md font-mono">
                                                        {percent.toFixed(1)}%
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-800 bg-slate-100/80 border border-slate-200/60 px-3 py-1 rounded-full">
                                                        {formatRupiah(item.rupiah)}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
                                                        {formatPoin(item.poin)}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-slate-50/80 font-bold border-t-2 border-slate-200/70">
                                        <td className="py-3.5 px-4 text-slate-800 rounded-l-xl">Total Akumulasi</td>
                                        <td className="py-3.5 px-4 text-slate-900 text-sm">{formatKg(totalKg)}</td>
                                        <td className="py-3.5 px-4 text-center text-slate-600 font-mono">100%</td>
                                        <td className="py-3.5 px-4 text-[#16A34A] text-sm">
                                            {formatRupiah(data.rekapitulasiTonase.totalEstimasiPembayaranRupiah)}
                                        </td>
                                        <td className="py-3.5 px-4 text-center text-amber-700 text-sm rounded-r-xl">
                                            {formatPoin(poinDiterbitkan)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Bottom Summary Cards (Penukaran Poin & Point Ratio) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        {/* Ringkasan Penukaran Poin */}
                        <div className="bg-white rounded-[22px] sm:rounded-[26px] border border-slate-100/90 p-5 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
                            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                                <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-100">
                                    <Repeat className="w-4 h-4 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                                        Ringkasan Penukaran Poin
                                    </h3>
                                    <p className="text-xs text-slate-400 font-medium">
                                        Aktivitas penukaran poin hadiah oleh nasabah
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
                                    <p className="text-xs text-slate-400 font-medium mb-1">Total Transaksi</p>
                                    <p className="text-xl font-extrabold text-slate-800">
                                        {data.rekapitulasiPenukaranPoin.totalTransaksiPenukaran.toLocaleString("id-ID")}
                                    </p>
                                    <span className="text-[10px] text-slate-400 font-medium">penukaran sukses</span>
                                </div>
                                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100/70">
                                    <p className="text-xs text-amber-700 font-medium mb-1">Total Poin Terpakai</p>
                                    <p className="text-xl font-extrabold text-amber-800">
                                        {formatPoin(poinTerpakai)}
                                    </p>
                                    <span className="text-[10px] text-amber-600 font-medium">telah ditukarkan</span>
                                </div>
                            </div>
                        </div>

                        {/* Analisis Sirkulasi Poin */}
                        <div className="bg-white rounded-[22px] sm:rounded-[26px] border border-slate-100/90 p-5 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
                            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                                <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                                    <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                                        Analisis Sirkulasi Poin
                                    </h3>
                                    <p className="text-xs text-slate-400 font-medium">
                                        Perbandingan poin terpakai vs poin diterbitkan
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-600">Rasio Penukaran Poin</span>
                                    <span className="font-extrabold text-emerald-700 font-mono text-sm">{poinRatio}%</span>
                                </div>
                                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                                        style={{ width: `${poinRatio}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[11px] text-slate-400 font-medium pt-1">
                                    <span>Poin Diterbitkan: <strong className="text-slate-700">{formatPoin(poinDiterbitkan)}</strong></span>
                                    <span>Poin Terpakai: <strong className="text-amber-700">{formatPoin(poinTerpakai)}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}