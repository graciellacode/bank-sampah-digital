"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Plus,
    Pencil,
    Trash2,
    User,
    Loader2,
    AlertCircle,
    ImagePlus,
    Search,
    Phone,
    MapPin,
    Coins,
} from "lucide-react";

import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FormField, inputClass } from "@/components/ui/FormField";
import {
    getNasabahList,
    createNasabahAdmin,
    updateNasabahAdmin,
    deleteNasabahAdmin,
} from "@/lib/api/nasabahAdmin";
import { getApiErrorMessage } from "@/lib/api/client";
import {
    createNasabahAdminSchema,
    CreateNasabahAdminFormValues,
    updateNasabahAdminSchema,
    UpdateNasabahAdminFormValues,
} from "@/lib/auth/schema";
import { NasabahAdmin } from "@/types/nasabahAdmin";
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

function CreateNasabahForm({
    onSuccess,
    onError,
}: {
    onSuccess: () => void;
    onError: (msg: string) => void;
}) {
    const [foto, setFoto] = useState<File | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateNasabahAdminFormValues>({
        resolver: zodResolver(createNasabahAdminSchema),
    });

    async function onSubmit(values: CreateNasabahAdminFormValues) {
        try {
            await createNasabahAdmin({ ...values, foto: foto ?? undefined });
            onSuccess();
        } catch (err) {
            onError(getApiErrorMessage(err));
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
            <FormField label="Username" error={errors.username?.message}>
                <input type="text" {...register("username")} className={`${inputClass} rounded-xl`} placeholder="Username nasabah" />
            </FormField>
            <FormField label="Password" error={errors.password?.message}>
                <input type="password" {...register("password")} className={`${inputClass} rounded-xl`} placeholder="Password nasabah" />
            </FormField>
            <FormField label="Nama Lengkap" error={errors.namaNasabah?.message}>
                <input type="text" {...register("namaNasabah")} className={`${inputClass} rounded-xl`} placeholder="Nama lengkap nasabah" />
            </FormField>
            <FormField label="Alamat" error={errors.alamat?.message}>
                <textarea {...register("alamat")} className={`${inputClass} rounded-xl resize-none`} rows={2} placeholder="Alamat lengkap nasabah" />
            </FormField>
            <FormField label="No. Telepon" error={errors.telp?.message}>
                <input type="tel" {...register("telp")} className={`${inputClass} rounded-xl`} placeholder="Nomor telepon WhatsApp" />
            </FormField>
            <FormField label="Foto Profile" optional>
                <label className="flex items-center gap-2 border border-dashed border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-500 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all">
                    <ImagePlus className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                    <span className="truncate">{foto ? foto.name : "Pilih foto profil (opsional)"}</span>
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
                {isSubmitting ? "Menyimpan..." : "Tambah Nasabah"}
            </button>
        </form>
    );
}

function EditNasabahForm({
    nasabah,
    onSuccess,
    onError,
}: {
    nasabah: NasabahAdmin;
    onSuccess: () => void;
    onError: (msg: string) => void;
}) {
    const [foto, setFoto] = useState<File | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UpdateNasabahAdminFormValues>({
        resolver: zodResolver(updateNasabahAdminSchema),
        defaultValues: {
            namaLengkap: nasabah.namaNasabah,
            noTelepon: nasabah.telp,
            alamat: nasabah.alamat,
            tanggalLahir: "",
        },
    });

    async function onSubmit(values: UpdateNasabahAdminFormValues) {
        try {
            await updateNasabahAdmin(nasabah.id, { ...values, foto: foto ?? undefined });
            onSuccess();
        } catch (err) {
            onError(getApiErrorMessage(err));
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
            <FormField label="Nama Lengkap" error={errors.namaLengkap?.message}>
                <input type="text" {...register("namaLengkap")} className={`${inputClass} rounded-xl`} />
            </FormField>
            <FormField label="Alamat" error={errors.alamat?.message}>
                <textarea {...register("alamat")} className={`${inputClass} rounded-xl resize-none`} rows={2} />
            </FormField>
            <FormField label="No. Telepon" error={errors.noTelepon?.message}>
                <input type="tel" {...register("noTelepon")} className={`${inputClass} rounded-xl`} />
            </FormField>
            <FormField label="Foto Profile" optional>
                <label className="flex items-center gap-2 border border-dashed border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-500 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all">
                    <ImagePlus className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                    <span className="truncate">{foto ? foto.name : "Ganti foto profil (opsional)"}</span>
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
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
        </form>
    );
}

export default function AdminNasabahPage() {
    const [data, setData] = useState<NasabahAdmin[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState<NasabahAdmin | null>(null);
    const [deleting, setDeleting] = useState<NasabahAdmin | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    function loadData() {
        setIsLoading(true);
        setError(null);
        getNasabahList()
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
            await deleteNasabahAdmin(deleting.id);
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
        return (
            item.namaNasabah.toLowerCase().includes(query) ||
            item.user.username.toLowerCase().includes(query) ||
            item.telp.toLowerCase().includes(query) ||
            item.alamat.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-6">
            <DashboardTopbar
                greeting="Data Nasabah"
                subtitle="Kelola akun nasabah, informasi kontak, dan saldo poin"
            />

            {isLoading && <TableSkeleton />}

            {!isLoading && error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-4 flex items-center gap-3 shadow-xs">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {!isLoading && !error && (
                <div className="bg-white rounded-[22px] sm:rounded-[26px] border border-slate-100/90 p-4 sm:p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-5">
                    {/* Header Bar Inside Card: Search & Action Button (Nexus UI style) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                        <div className="relative w-full sm:w-72">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama, username, telp..."
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
                            <span>Tambah Nasabah</span>
                        </button>
                    </div>

                    {filteredData.length === 0 ? (
                        <EmptyState message="Belum ada data nasabah yang sesuai" icon={User} />
                    ) : (
                        <>
                            {/* Mobile Card Layout */}
                            <div className="sm:hidden space-y-3">
                                {filteredData.map((nasabah) => (
                                    <div
                                        key={nasabah.id}
                                        className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-3"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center overflow-hidden flex-shrink-0 border border-white shadow-xs">
                                                    {nasabah.foto ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={resolvePhotoUrl(nasabah.foto) ?? undefined}
                                                            alt={nasabah.namaNasabah}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <User className="w-5 h-5 text-[#16A34A]" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-slate-800 truncate">
                                                        {nasabah.namaNasabah}
                                                    </p>
                                                    <p className="text-xs text-slate-400 font-medium truncate">
                                                        @{nasabah.user.username}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <button
                                                    onClick={() => {
                                                        setFormError(null);
                                                        setEditing(nasabah);
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                    title="Edit Data"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleting(nasabah)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus Data"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60">
                                            <div className="flex items-center gap-1.5 text-slate-600 truncate">
                                                <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                                <span className="truncate">{nasabah.telp}</span>
                                            </div>
                                            <div className="flex items-center justify-end gap-1 font-bold text-[#16A34A]">
                                                <Coins className="w-3.5 h-3.5" />
                                                <span>{formatPoin(nasabah.saldoPoin)}</span>
                                            </div>
                                        </div>

                                        {nasabah.alamat && (
                                            <div className="flex items-start gap-1.5 text-xs text-slate-500 pt-1">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                                                <span className="line-clamp-1">{nasabah.alamat}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Styled Table Layout (Nexus CRM style) */}
                            <div className="hidden sm:block overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-600">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider font-semibold">
                                            <th className="py-3 px-3">Nasabah</th>
                                            <th className="py-3 px-3">Username</th>
                                            <th className="py-3 px-3">Kontak & Alamat</th>
                                            <th className="py-3 px-3">Saldo Poin</th>
                                            <th className="py-3 px-3 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-medium">
                                        {filteredData.map((nasabah) => (
                                            <tr
                                                key={nasabah.id}
                                                className="hover:bg-slate-50/60 transition-colors group"
                                            >
                                                <td className="py-3.5 px-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-emerald-100/70 text-emerald-700 font-bold flex items-center justify-center overflow-hidden flex-shrink-0 border border-white shadow-xs">
                                                            {nasabah.foto ? (
                                                                // eslint-disable-next-line @next/next/no-img-element
                                                                <img
                                                                    src={resolvePhotoUrl(nasabah.foto) ?? undefined}
                                                                    alt={nasabah.namaNasabah}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <User className="w-4 h-4 text-[#16A34A]" />
                                                            )}
                                                        </div>
                                                        <span className="font-bold text-slate-800 text-sm">
                                                            {nasabah.namaNasabah}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-3">
                                                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                                                        @{nasabah.user.username}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-3">
                                                    <div>
                                                        <p className="text-slate-800 text-xs font-medium">{nasabah.telp}</p>
                                                        <p className="text-slate-400 text-[11px] truncate max-w-[200px]" title={nasabah.alamat}>
                                                            {nasabah.alamat || "-"}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-3">
                                                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#16A34A] bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                                                        {formatPoin(nasabah.saldoPoin)}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-3 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            onClick={() => {
                                                                setFormError(null);
                                                                setEditing(nasabah);
                                                            }}
                                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleting(nasabah)}
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

            <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Tambah Nasabah Baru">
                {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{formError}</span>
                    </div>
                )}
                <CreateNasabahForm onSuccess={handleFormSuccess} onError={setFormError} />
            </Modal>

            <Modal isOpen={!!editing} onClose={() => setEditing(null)} title="Edit Data Nasabah">
                {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{formError}</span>
                    </div>
                )}
                {editing && (
                    <EditNasabahForm
                        nasabah={editing}
                        onSuccess={handleFormSuccess}
                        onError={setFormError}
                    />
                )}
            </Modal>

            <ConfirmDialog
                isOpen={!!deleting}
                title="Hapus Nasabah"
                description={`Apakah Anda yakin ingin menghapus akun nasabah "${deleting?.namaNasabah}"? Seluruh data akun nasabah ini akan dihapus.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleting(null)}
                isLoading={isDeleting}
            />
        </div>
    );
}