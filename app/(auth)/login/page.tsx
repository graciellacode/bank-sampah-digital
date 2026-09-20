"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { login } from "@/lib/api/auth";
import { saveSession } from "@/lib/auth/session";
import { getApiErrorMessage } from "@/lib/api/client";
import { loginSchema, LoginFormValues } from "@/lib/auth/schema";

export default function LoginPage() {
    const router = useRouter();
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(values: LoginFormValues) {
        setApiError(null);
        try {
            const data = await login(values);
            saveSession(data.token, data.role);

            if (data.role === "ADMIN") {
                router.push("/admin/dashboard");
            } else {
                router.push("/nasabah/dashboard");
            }
        } catch (err) {
            setApiError(getApiErrorMessage(err));
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-8">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-brand-600 mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg">
                        BS
                    </div>
                    <h1 className="text-xl font-semibold text-foreground">Bank Sampah Digital</h1>
                    <p className="text-sm text-gray-500 mt-1">Masuk ke akun Anda</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            autoComplete="username"
                            {...register("username")}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            placeholder="Masukkan username"
                        />
                        {errors.username && (
                            <p className="text-xs text-red-600 mt-1">{errors.username.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            {...register("password")}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            placeholder="Masukkan password"
                        />
                        {errors.password && (
                            <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
                        )}
                    </div>

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
                        {isSubmitting ? "Memproses..." : "Masuk"}
                    </button>

                    <div className="text-center text-sm text-gray-500 space-y-1 pt-1">
                        <p>
                            Belum punya akun?{" "}
                            <Link href="/register-nasabah" className="text-brand-600 font-medium hover:underline">
                                Daftar sebagai Nasabah
                            </Link>
                        </p>
                        <p>
                            Punya unit bank sampah?{" "}
                            <Link href="/register-admin" className="text-brand-600 font-medium hover:underline">
                                Daftar Unit Admin
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </main>
    );
}