"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ImagePlus, CheckCircle2 } from "lucide-react";

import { registerNasabah } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/client";
import {
    registerNasabahSchema,
    RegisterNasabahFormValues,
} from "@/lib/auth/schema";
import { FormField, inputClass } from "@/components/ui/FormField";

export default function RegisterNasabahPage() {
    const router = useRouter();
    const [apiError, setApiError] = useState<string | null>(null);
    const [foto, setFoto] = useState<File | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterNasabahFormValues>({
        resolver: zodResolver(registerNasabahSchema),
    });

    async function onSubmit(values: RegisterNasabahFormValues) {
        setApiError(null);
        try {
            await registerNasabah({ ...values, foto: foto ?? undefined });
            setIsSuccess(true);
            setTimeout(() => router.push("/login"), 1500);
        } catch (err) {
            setApiError(getApiErrorMessage(err));
        }
    }

    if (isSuccess) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-8 text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-brand-600 mx-auto" />
                    <h1 className="text-lg font-semibold text-foreground">Registrasi berhasil!</h1>
                    <p className="text-sm text-gray-500">Mengarahkan ke halaman login...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-8">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-brand-600 mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg">
                        BS
                    </div>
                    <h1 className="text-xl font-semibold text-foreground">Daftar Akun Nasabah</h1>
                    <p className="text-sm text-gray-500 mt-1">Isi data diri Anda untuk mendaftar</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormField label="Username" error={errors.username?.message}>
                        <input
                            type="text"
                            autoComplete="username"
                            {...register("username")}
                            className={inputClass}
                            placeholder="Contoh: budi_santoso"
                        />
                    </FormField>

                    <FormField label="Password" error={errors.password?.message}>
                        <input
                            type="password"
                            autoComplete="new-password"
                            {...register("password")}
                            className={inputClass}
                            placeholder="Minimal 6 karakter"
                        />
                    </FormField>

                    <FormField label="Nama Lengkap" error={errors.namaNasabah?.message}>
                        <input
                            type="text"
                            {...register("namaNasabah")}
                            className={inputClass}
                            placeholder="Nama lengkap Anda"
                        />
                    </FormField>

                    <FormField label="Alamat" error={errors.alamat?.message}>
                        <textarea
                            {...register("alamat")}
                            className={`${inputClass} resize-none`}
                            rows={2}
                            placeholder="Alamat domisili"
                        />
                    </FormField>

                    <FormField label="No. Telepon" error={errors.telp?.message}>
                        <input
                            type="tel"
                            {...register("telp")}
                            className={inputClass}
                            placeholder="08xxxxxxxxxx"
                        />
                    </FormField>

                    <FormField label="Foto Profil" optional>
                        <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-500 cursor-pointer hover:border-brand-400 transition-colors">
                            <ImagePlus className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{foto ? foto.name : "Pilih foto (JPG/PNG)"}</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
                            />
                        </label>
                    </FormField>

                    {apiError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
                            {apiError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-colors flex items-center justify-center gap-2"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? "Mendaftar..." : "Daftar"}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="text-brand-600 font-medium hover:underline">
                            Masuk di sini
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}