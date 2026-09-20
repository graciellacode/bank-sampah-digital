"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Printer, AlertCircle, Recycle } from "lucide-react";

import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getSetorDetail } from "@/lib/api/setor";
import { getApiErrorMessage } from "@/lib/api/client";
import { SetorSampah } from "@/types/setor";
import { formatKg, formatPoin, formatTanggal } from "@/lib/utils/format";

function DetailSkeleton() {
    return (
        <div className="max-w-lg mx-auto space-y-4 animate-pulse">
            <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
    );
}

export default function DetailSetorPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [data, setData] = useState<SetorSampah | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getSetorDetail(params.id)
            .then(setData)
            .catch((err) => setError(getApiErrorMessage(err)))
            .finally(() => setIsLoading(false));
    }, [params.id]);

    return (
        <div>
            <div className="print:hidden">
                <DashboardTopbar
                    greeting="Detail Setor Sampah"
                    subtitle="Rincian transaksi penyetoran sampah"
                />

                <button
                    onClick={() => router.push("/nasabah/setor/riwayat")}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-foreground mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Riwayat
                </button>
            </div>

            {isLoading && <DetailSkeleton />}

            {!isLoading && error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-4 py-3 flex items-center gap-2 print:hidden">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {!isLoading && !error && data && (
                <div className="max-w-lg mx-auto print:max-w-xl print:mx-auto print:my-0">
                    <div className="bg-white rounded-2xl shadow-sm p-6 print:shadow-none print:rounded-none print:border print:border-slate-200 print:p-8">
                        {/* Header nota */}
                        <div className="text-center pb-4 border-b border-dashed border-gray-200">
                            <div className="w-10 h-10 rounded-xl bg-brand-600 mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm">
                                BS
                            </div>
                            <h1 className="font-semibold text-foreground">Bank Sampah Digital</h1>
                            <p className="text-xs text-gray-400">Nota Penyetoran Sampah</p>
                        </div>

                        {/* Info transaksi */}
                        <div className="py-4 space-y-1.5 border-b border-dashed border-gray-200">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">No. Transaksi</span>
                                <span className="font-medium text-foreground">{data.kodeSetor}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Tanggal</span>
                                <span className="text-foreground">{formatTanggal(data.tanggal)}</span>
                            </div>
                            {data.nasabah && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Nasabah</span>
                                    <span className="text-foreground">{data.nasabah.namaNasabah}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Status</span>
                                <StatusBadge status={data.status} />
                            </div>
                        </div>

                        {/* Detail item sampah */}
                        <div className="py-4 border-b border-dashed border-gray-200">
                            <p className="text-xs font-medium text-gray-400 uppercase mb-2">
                                Detail Sampah
                            </p>
                            {data.detailSetors.length === 0 ? (
                                <div className="text-center py-4">
                                    <Recycle className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                                    <p className="text-sm text-gray-400">Belum ada rincian item</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {data.detailSetors.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between text-sm">
                                            <div>
                                                <p className="text-foreground">
                                                    {item.kategoriSampah?.namaKategori ?? item.kategoriSampahId}
                                                </p>
                                                <p className="text-xs text-gray-400">{formatKg(item.beratKg)}</p>
                                            </div>
                                            <span className="font-medium text-foreground">
                                                {formatPoin(item.subtotalPoin)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Total */}
                        <div className="py-4 space-y-1.5 border-b border-dashed border-gray-200">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Total Berat</span>
                                <span className="text-foreground">{formatKg(data.totalBeratKg)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-foreground">Total Poin</span>
                                <span className="text-lg font-semibold text-brand-600">
                                    {formatPoin(data.totalPoin ?? data.estimasiTotalPoin ?? 0)}
                                </span>
                            </div>
                        </div>

                        {/* Catatan */}
                        {(data.catatan || data.catatanAdmin) && (
                            <div className="pt-4 space-y-2">
                                {data.catatan && (
                                    <div>
                                        <p className="text-xs font-medium text-gray-400 uppercase mb-1">
                                            Catatan Nasabah
                                        </p>
                                        <p className="text-sm text-gray-600">{data.catatan}</p>
                                    </div>
                                )}
                                {data.catatanAdmin && (
                                    <div>
                                        <p className="text-xs font-medium text-gray-400 uppercase mb-1">
                                            Catatan Admin
                                        </p>
                                        <p className="text-sm text-gray-600">{data.catatanAdmin}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <p className="text-center text-xs text-gray-300 pt-4 mt-4 border-t border-dashed border-gray-200">
                            Terima kasih telah menjaga lingkungan 🌱
                        </p>
                    </div>

                    <button
                        onClick={() => window.print()}
                        className="w-full mt-4 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-colors flex items-center justify-center gap-2 print:hidden"
                    >
                        <Printer className="w-4 h-4" />
                        Cetak Nota
                    </button>
                </div>
            )}
        </div>
    );
}