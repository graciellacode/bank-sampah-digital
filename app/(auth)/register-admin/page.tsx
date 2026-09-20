"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";

import { registerAdmin } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/client";
import { registerAdminSchema, RegisterAdminFormValues } from "@/lib/auth/schema";
import { FormField, inputClass } from "@/components/ui/FormField";

export default function RegisterAdminPage() {
    const router = useRouter();
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterAdminFormValues>({
        resolver: zodResolver(registerAdminSchema),
    });

    async function onSubmit(values: RegisterAdminFormValues) {
        setApiError(null);
        try {
            await registerAdmin(values);
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
                    <h1 className="text-lg font-semibold text-foreground">Pendaftaran unit berhasil!</h1>
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
                    <h1 className="text-xl font-semibold text-foreground">Daftar Unit Bank Sampah</h1>
                    <p className="text-sm text-gray-500 mt-1">Daftarkan unit pengelola Anda</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormField label="Username" error={errors.username?.message}>
                        <input
                            type="text"
                            autoComplete="username"
                            {...register("username")}
                            className={inputClass}
                            placeholder="Contoh: admin_asrijaya"
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

                    <FormField label="Nama Unit Bank Sampah" error={errors.namaUnit?.message}>
                        <input
                            type="text"
                            {...register("namaUnit")}
                            className={inputClass}
                            placeholder="Contoh: Bank Sampah Asri Jaya"
                        />
                    </FormField>

                    <FormField label="Nama Pengelola" error={errors.namaPengelola?.message}>
                        <input
                            type="text"
                            {...register("namaPengelola")}
                            className={inputClass}
                            placeholder="Nama penanggung jawab"
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
                        {isSubmitting ? "Mendaftar..." : "Daftar Unit"}
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