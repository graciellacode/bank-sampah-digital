"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Gift, Loader2, AlertCircle, ImagePlus, Search, Coins, Package } from "lucide-react";

import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FormField, inputClass } from "@/components/ui/FormField";
import {
    getHadiahList,
    createHadiah,
    updateHadiah,
    deleteHadiah,
} from "@/lib/api/hadiah";
import { getApiErrorMessage } from "@/lib/api/client";
import { hadiahAdminSchema, HadiahAdminFormValues } from "@/lib/auth/schema";
import { Hadiah } from "@/types/hadiah";
import { formatPoin } from "@/lib/utils/format";
import { resolvePhotoUrl } from "@/lib/utils/photo";

function TableSkeleton() {
    return (
        <div className="bg-white rounded-[22px] sm:rounded-[26px] p-5 sm:p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 bg-slate-100/80 rounded-xl" />
            ))}
        </div>
    );
}

function HadiahForm({
    initialData,
    onSuccess,
    onError,
}: {
    initialData?: Hadiah;
    onSuccess: () => void;
    onError: (msg: string) => void;
}) {
    const [foto, setFoto] = useState<File | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.input<typeof hadiahAdminSchema>, unknown, HadiahAdminFormValues>({
        resolver: zodResolver(hadiahAdminSchema),
        defaultValues: initialData
            ? {
                namaHadiah: initialData.namaHadiah,
                poinDibutuhkan: initialData.poinDibutuhkan,
                stok: initialData.stok,
            }
            : undefined,
    });

    async function onSubmit(values: HadiahAdminFormValues) {
        try {
            const payload = { ...values, foto: foto ?? undefined };
            if (initialData) {
                await updateHadiah(initialData.id, payload);
            } else {
                await createHadiah(payload);
            }
            onSuccess();
        } catch (err) {
            onError(getApiErrorMessage(err));
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
            <FormField label="Nama Hadiah" error={errors.namaHadiah?.message}>
                <input type="text" {...register("namaHadiah")} className={`${inputClass} rounded-xl`} placeholder="Contoh: Voucher Pulsa / Beras 5kg" />
            </FormField>
            <FormField label="Poin Dibutuhkan" error={errors.poinDibutuhkan?.message}>
                <input type="number" step="1" {...register("poinDibutuhkan")} className={`${inputClass} rounded-xl`} placeholder="0" />
            </FormField>
            <FormField label="Stok Tersedia" error={errors.stok?.message}>
                <input type="number" step="1" {...register("stok")} className={`${inputClass} rounded-xl`} placeholder="0" />
            </FormField>
            <FormField label="Foto Hadiah" optional>
                <label className="flex items-center gap-2 border border-dashed border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-500 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all">
                    <ImagePlus className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                    <span className="truncate">{foto ? foto.name : "Pilih foto (opsional)"}</span>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
                    />
                </label>
            </FormField>
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#35C71D] hover:bg-[#2EB319] disabled:opacity-60 text-white font-bold rounded-xl px-4 py-3 text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-2"
            >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Tambah Hadiah"}
            </button>
        </form>
    );
}

export default function AdminHadiahPage() {
    const [data, setData] = useState<Hadiah[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState<Hadiah | null>(null);
    const [deleting, setDeleting] = useState<Hadiah | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    function loadData() {
        setIsLoading(true);
        setError(null);
        getHadiahList()
            .then(setData)
            .catch((err) => setError(getApiErrorMessage(err)))
            .finally(() => setIsLoading(false));
    }

    useEffect(loadData, []);

    function handleFormSuccess() {
        setShowCreate(false);
        setEditing(null);
        setFormError(null);
        loadData();
    }

    async function handleDelete() {
        if (!deleting) return;
        setIsDeleting(true);
        try {
            await deleteHadiah(deleting.id);
            setDeleting(null);
            loadData();
        } catch (err) {
            setError(getApiErrorMessage(err));
            setDeleting(null);
        } finally {
            setIsDeleting(false);
        }
    }

    const filteredData = data.filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return item.namaHadiah.toLowerCase().includes(query);
    });

    return (
        <div className="space-y-6">
            <DashboardTopbar greeting="Katalog Hadiah" subtitle="Kelola barang dan voucher penukaran poin nasabah" />

            {isLoading && <TableSkeleton />}

            {!isLoading && error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4 flex items-center gap-3 shadow-xs">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {!isLoading && !error && (
                <div className="bg-white rounded-[22px] sm:rounded-[26px] border border-slate-100/90 p-4 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-5">
                    {/* Header Bar Inside Card: Search & Action Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                        <div className="relative w-full sm:w-72">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama hadiah..."
                                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-700 placeholder:text-slate-400"
                            />
                        </div>

                        <button
                            onClick={() => {
                                setFormError(null);
                                setShowCreate(true);
                            }}
                            className="flex items-center justify-center gap-2 bg-[#35C71D] hover:bg-[#2EB319] text-white text-xs sm:text-sm font-bold rounded-xl px-4 py-2.5 shadow-md shadow-emerald-600/10 transition-all flex-shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Tambah Hadiah</span>
                        </button>
                    </div>

                    {filteredData.length === 0 ? (
                        <EmptyState message="Belum ada hadiah yang sesuai" icon={Gift} />
                    ) : (
                        <>
                            {/* Mobile Card Layout */}
                            <div className="sm:hidden space-y-3">
                                {filteredData.map((hadiah) => (
                                    <div
                                        key={hadiah.id}
                                        className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-3"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center overflow-hidden flex-shrink-0 border border-amber-200/60 shadow-xs">
                                                    {hadiah.foto ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={resolvePhotoUrl(hadiah.foto) ?? undefined}
                                                            alt={hadiah.namaHadiah}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Gift className="w-5 h-5 text-amber-600" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-slate-800 truncate">
                                                        {hadiah.namaHadiah}
                                                    </p>
                                                    <div className="mt-1">
                                                        {hadiah.stok <= 0 ? (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                                                                Stok Habis
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded-full">
                                                                Stok: {hadiah.stok}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <button
                                                    onClick={() => {
                                                        setFormError(null);
                                                        setEditing(hadiah);
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleting(hadiah)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                                            <span className="text-slate-500 font-medium">Poin Dibutuhkan</span>
                                            <div className="flex items-center gap-1 font-extrabold text-[#16A34A]">
                                                <Coins className="w-3.5 h-3.5" />
                                                <span>{formatPoin(hadiah.poinDibutuhkan)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Styled Table Layout (Nexus CRM style) */}
                            <div className="hidden sm:block overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-600">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider font-semibold">
                                            <th className="py-3 px-3">Nama Hadiah</th>
                                            <th className="py-3 px-3">Poin Dibutuhkan</th>
                                            <th className="py-3 px-3">Stok</th>
                                            <th className="py-3 px-3 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-medium">
                                        {filteredData.map((hadiah) => (
                                            <tr
                                                key={hadiah.id}
                                                className="hover:bg-slate-50/60 transition-colors group"
                                            >
                                                <td className="py-3.5 px-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center overflow-hidden flex-shrink-0 border border-amber-200/60 shadow-xs">
                                                            {hadiah.foto ? (
                                                                // eslint-disable-next-line @next/next/no-img-element
                                                                <img
                                                                    src={resolvePhotoUrl(hadiah.foto) ?? undefined}
                                                                    alt={hadiah.namaHadiah}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <Gift className="w-4 h-4 text-amber-600" />
                                                            )}
                                                        </div>
                                                        <span className="font-bold text-slate-800 text-sm">
                                                            {hadiah.namaHadiah}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-3">
                                                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#16A34A] bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                                                        {formatPoin(hadiah.poinDibutuhkan)}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-3">
                                                    {hadiah.stok <= 0 ? (
                                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
                                                            Stok Habis
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                                            <Package className="w-3.5 h-3.5 text-slate-400" />
                                                            {hadiah.stok} unit
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="py-3.5 px-3 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            onClick={() => {
                                                                setFormError(null);
                                                                setEditing(hadiah);
                                                            }}
                                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleting(hadiah)}
                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            )}

            <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Tambah Hadiah Baru">
                {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{formError}</span>
                    </div>
                )}
                <HadiahForm onSuccess={handleFormSuccess} onError={setFormError} />
            </Modal>

            <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Data Hadiah">
                {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{formError}</span>
                    </div>
                )}
                {editing && (
                    <HadiahForm
                        initialData={editing}
                        onSuccess={handleFormSuccess}
                        onError={setFormError}
                    />
                )}
            </Modal>

            <ConfirmDialog
                isOpen={!!deleting}
                title="Hapus Hadiah"
                description={`Apakah Anda yakin ingin menghapus hadiah "${deleting?.namaHadiah}"? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleting(null)}
                isLoading={isDeleting}
            />
        </div>
    );
}