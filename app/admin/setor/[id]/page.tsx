"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, Recycle, Loader2, CheckCircle2 } from "lucide-react";

import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { FormField, inputClass } from "@/components/ui/FormField";
import { getSetorDetail, verifySetorSampah } from "@/lib/api/setor";
import { getApiErrorMessage } from "@/lib/api/client";
import { SetorSampah } from "@/types/setor";
import { formatKg, formatPoin, formatTanggal } from "@/lib/utils/format";

function DetailSkeleton() {
    return (
        <div className="max-w-xl mx-auto space-y-4 animate-pulse">
            <div className="h-72 bg-gray-200 rounded-2xl" />
        </div>
    );
}

export default function AdminSetorDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();

    const [data, setData] = useState<SetorSampah | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [status, setStatus] = useState<"diverifikasi" | "selesai" | "ditolak">("diverifikasi");
    const [catatanAdmin, setCatatanAdmin] = useState("");
    const [beratReal, setBeratReal] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    function loadData() {
        setIsLoading(true);
        getSetorDetail(params.id)
            .then((detail) => {
                setData(detail);
                setStatus(
                    detail.status === "menunggu_konfirmasi" ? "diverifikasi" : (detail.status as any)
                );
            })
            .catch((err) => setError(getApiErrorMessage(err)))
            .finally(() => setIsLoading(false));
    }

    useEffect(loadData, [params.id]);

    async function handleVerify() {
        if (!data) return;
        setIsSubmitting(true);
        setSubmitError(null);

        // Hanya sertakan itemsReal untuk item yang memang diisi ulang beratnya (opsional).
        const itemsReal = data.detailSetors
            .filter((item) => beratReal[item.kategoriSampahId]?.trim())
            .map((item) => ({
                kategoriSampahId: item.kategoriSampahId,
                beratKgReal: Number(beratReal[item.kategoriSampahId]),
            }));

        try {
            await verifySetorSampah(params.id, {
                status,
                catatanAdmin,
                ...(itemsReal.length > 0 ? { itemsReal } : {}),
            });
            setIsSuccess(true);
            setTimeout(() => router.push("/admin/setor"), 1500);
        } catch (err) {
            setSubmitError(getApiErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center space-y-3 max-w-sm">
                    <CheckCircle2 className="w-12 h-12 text-brand-600 mx-auto" />
                    <h1 className="text-lg font-semibold text-foreground">Verifikasi berhasil disimpan!</h1>
                    <p className="text-sm text-gray-500">Mengarahkan ke daftar setor...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <DashboardTopbar
                greeting="Verifikasi Penyetoran"
                subtitle="Periksa dan konfirmasi pengajuan penyetoran sampah"
            />

            <button
                onClick={() => router.push("/admin/setor")}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-foreground mb-4 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Daftar
            </button>

            {isLoading && <DetailSkeleton />}

            {!isLoading && error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-4 py-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {!isLoading && !error && data && (
                <div className="max-w-xl mx-auto space-y-5">
                    {/* Info pengajuan */}
                    <div className="bg-white rounded-[22px] border border-slate-100/90 p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h2 className="text-sm font-bold text-slate-800">{data.kodeSetor}</h2>
                            <StatusBadge status={data.status} />
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-medium">Nasabah</span>
                                <span className="text-slate-800 font-bold">{data.nasabah?.namaNasabah ?? "-"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-medium">Tanggal</span>
                                <span className="text-slate-700">{formatTanggal(data.tanggal)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-medium">Catatan Nasabah</span>
                                <span className="text-slate-700 text-right max-w-[60%] font-medium">
                                    {data.catatan || "-"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Item sampah - input berat real */}
                    <div className="bg-white rounded-[22px] border border-slate-100/90 p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            Timbang Ulang (Opsional)
                        </p>
                        <div className="space-y-3">
                            {data.detailSetors.map((item, i) => (
                                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#16A34A] flex items-center justify-center flex-shrink-0">
                                            <Recycle className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-800 truncate">
                                                {item.kategoriSampah?.namaKategori ?? item.kategoriSampahId}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                Estimasi: {formatKg(item.beratKg)}
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        placeholder="Berat real (kg)"
                                        value={beratReal[item.kategoriSampahId] ?? ""}
                                        onChange={(e) =>
                                            setBeratReal((prev) => ({
                                                ...prev,
                                                [item.kategoriSampahId]: e.target.value,
                                            }))
                                        }
                                        className={`${inputClass} rounded-xl w-full sm:w-36 flex-shrink-0`}
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 mt-3">
                            Kosongkan jika berat sesuai estimasi nasabah — tidak perlu diisi ulang.
                        </p>
                    </div>

                    {/* Form verifikasi */}
                    <div className="bg-white rounded-[22px] border border-slate-100/90 p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Keputusan Verifikasi
                        </p>

                        <FormField label="Ubah Status">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as typeof status)}
                                className={`${inputClass} rounded-xl`}
                            >
                                <option value="diverifikasi">Diverifikasi</option>
                                <option value="selesai">Selesai</option>
                                <option value="ditolak">Ditolak</option>
                            </select>
                        </FormField>

                        <div>
                            <FormField label="Catatan Admin" optional>
                                <textarea
                                    value={catatanAdmin}
                                    onChange={(e) => setCatatanAdmin(e.target.value)}
                                    className={`${inputClass} rounded-xl resize-none`}
                                    rows={2}
                                    placeholder="Contoh: Berat sesuai timbangan"
                                />
                            </FormField>
                        </div>

                        {submitError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-3 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{submitError}</span>
                            </div>
                        )}

                        <button
                            onClick={handleVerify}
                            disabled={isSubmitting}
                            className="w-full mt-2 bg-[#35C71D] hover:bg-[#2EB319] disabled:opacity-60 text-white font-bold rounded-xl px-4 py-3 text-sm transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isSubmitting ? "Menyimpan..." : "Simpan Verifikasi"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}