"use client";

import { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { getKategoriSampah } from "@/lib/api/kategoriSampah";
import { createSetorSampah } from "@/lib/api/setor";
import { getApiErrorMessage } from "@/lib/api/client";
import { setorSampahSchema, SetorSampahFormValues } from "@/lib/auth/schema";
import { KategoriSampah } from "@/types/kategori";
import { formatPoin } from "@/lib/utils/format";
import { inputClass, FormField } from "@/components/ui/FormField";

export default function AjukanSetorPage() {
    const router = useRouter();
    const [kategoriList, setKategoriList] = useState<KategoriSampah[]>([]);
    const [isLoadingKategori, setIsLoadingKategori] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        getKategoriSampah()
            .then(setKategoriList)
            .finally(() => setIsLoadingKategori(false));
    }, []);

    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<z.input<typeof setorSampahSchema>, unknown, SetorSampahFormValues>({
        resolver: zodResolver(setorSampahSchema),
        defaultValues: {
            tanggal: new Date().toISOString().slice(0, 10),
            catatan: "",
            items: [{ kategoriSampahId: "", beratKg: 0 }],
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "items" });
    const watchedItems = watch("items");

    // Hitung estimasi poin real-time berdasarkan pilihan kategori & berat yang diisi
    const estimasiPoin = watchedItems.reduce((total, item) => {
        const kategori = kategoriList.find((k) => k.id === item.kategoriSampahId);
        if (!kategori || !item.beratKg) return total;
        return total + kategori.poinPerKg * Number(item.beratKg);
    }, 0);

    async function onSubmit(values: SetorSampahFormValues) {
        setApiError(null);
        try {
            await createSetorSampah({
                tanggal: new Date(values.tanggal).toISOString(),
                catatan: values.catatan ?? "",
                items: values.items.map((item) => ({
                    kategoriSampahId: item.kategoriSampahId,
                    beratKg: Number(item.beratKg),
                })),
            });
            setIsSuccess(true);
            setTimeout(() => router.push("/nasabah/setor/riwayat"), 1500);
        } catch (err) {
            setApiError(getApiErrorMessage(err));
        }
    }

    if (isSuccess) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-white border border-slate-100 rounded-[22px] sm:rounded-[26px] shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-6 sm:p-8 text-center space-y-3 max-w-sm mx-4">
                    <CheckCircle2 className="w-12 h-12 text-[#35C71D] mx-auto" />
                    <h1 className="text-lg font-bold text-slate-800">Pengajuan berhasil dikirim!</h1>
                    <p className="text-sm text-slate-400">Mengarahkan ke riwayat setor...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <DashboardTopbar
                greeting="Ajukan Setor Sampah"
                subtitle="Pilih jenis sampah, estimasi berat, dan tanggal penyetoran"
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-3xl">
                <div className="bg-white border border-slate-100 rounded-[20px] sm:rounded-[26px] shadow-[0_4px_25px_rgba(0,0,0,0.03)] p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="Tanggal Penyetoran" error={errors.tanggal?.message}>
                            <input type="date" {...register("tanggal")} className={inputClass} />
                        </FormField>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Pilih Jenis Sampah
                        </label>

                        {isLoadingKategori && (
                            <p className="text-sm text-slate-400">Memuat daftar kategori...</p>
                        )}

                        {!isLoadingKategori && kategoriList.length === 0 && (
                            <p className="text-sm text-slate-400">
                                Belum ada kategori sampah tersedia. Hubungi admin.
                            </p>
                        )}

                        {!isLoadingKategori && kategoriList.length > 0 && (
                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex flex-col sm:flex-row gap-2 sm:items-start min-w-0">
                                        <div className="flex-1 min-w-0 w-full">
                                            <select
                                                {...register(`items.${index}.kategoriSampahId` as const)}
                                                className={`${inputClass} truncate w-full max-w-full`}
                                            >
                                                <option value="">-- Pilih jenis sampah --</option>
                                                {kategoriList.map((kategori) => (
                                                    <option key={kategori.id} value={kategori.id}>
                                                        {kategori.namaKategori} ({formatPoin(kategori.poinPerKg)}/kg)
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.items?.[index]?.kategoriSampahId && (
                                                <p className="text-xs text-red-600 mt-1">
                                                    {errors.items[index]?.kategoriSampahId?.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="w-full sm:w-32">
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                placeholder="Berat (kg)"
                                                {...register(`items.${index}.beratKg` as const)}
                                                className={inputClass}
                                            />
                                            {errors.items?.[index]?.beratKg && (
                                                <p className="text-xs text-red-600 mt-1">
                                                    {errors.items[index]?.beratKg?.message}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            disabled={fields.length === 1}
                                            className="p-2.5 text-slate-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0 self-start sm:self-auto"
                                            title="Hapus item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => append({ kategoriSampahId: "", beratKg: 0 })}
                                    className="flex items-center gap-1.5 text-sm text-[#35C71D] hover:underline font-semibold pt-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Tambah jenis sampah
                                </button>
                            </div>
                        )}
                    </div>

                    <FormField label="Catatan" optional error={errors.catatan?.message}>
                        <textarea
                            {...register("catatan")}
                            className={`${inputClass} resize-none`}
                            rows={2}
                            placeholder="Contoh: Sampah sudah dipilah rapi"
                        />
                    </FormField>

                    {estimasiPoin > 0 && (
                        <div className="bg-emerald-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between border border-emerald-100">
                            <span className="text-xs sm:text-sm font-semibold text-emerald-800">Estimasi Total Poin</span>
                            <span className="text-base sm:text-lg font-extrabold text-[#35C71D]">
                                {formatPoin(estimasiPoin)}
                            </span>
                        </div>
                    )}

                    {apiError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {apiError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || isLoadingKategori}
                        className="w-full bg-[#35C71D] hover:bg-[#2EB319] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl px-4 py-3 text-sm transition-all shadow-md flex items-center justify-center gap-2"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? "Mengirim..." : "Ajukan Setor"}
                    </button>
                </div>
            </form>
        </div>
    );
}