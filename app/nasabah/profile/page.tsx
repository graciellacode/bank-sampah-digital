"use client";

import { User, MapPin, Phone, Coins, AtSign, CheckCircle2, Leaf, Sparkles, ShieldCheck } from "lucide-react";

import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { useCurrentUser } from "@/lib/auth/AuthContext";
import { formatPoin } from "@/lib/utils/format";
import { resolvePhotoUrl } from "@/lib/utils/photo";

export default function NasabahProfilePage() {
    const user = useCurrentUser();
    const nasabah = user.nasabah;
    const photoUrl = resolvePhotoUrl(nasabah?.foto);

    return (
        <div>
            <DashboardTopbar greeting="Profile" subtitle="Informasi data diri akun Anda" />

            <div className="max-w-xl mx-auto px-0">
                <div className="bg-white border border-slate-100 rounded-[22px] sm:rounded-[28px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
                    {/* Top Cover / Banner Image */}
                    <div className="relative h-20 sm:h-24 md:h-28 w-full bg-gradient-to-r from-[#1E2822] via-[#243329] to-[#1B241E] p-4 overflow-hidden">
                        {/* Background Ornaments */}
                        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#35C71D]/15 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute right-0 top-0 w-full h-full bg-[radial-gradient(#35C71D_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
                    </div>

                    {/* Avatar Photo Overlap & Header Info */}
                    <div className="px-4 sm:px-6 md:px-8 pb-5">
                        <div className="-mt-8 sm:-mt-10 md:-mt-12 mb-3 flex items-end justify-between">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex items-center justify-center flex-shrink-0 relative z-10">
                                {photoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={photoUrl}
                                        alt={nasabah?.namaNasabah ?? user.username}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
                                )}
                            </div>
                        </div>

                        {/* Name & Subtitle */}
                        <div className="space-y-0.5">
                            <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
                                {nasabah?.namaNasabah ?? user.username}
                            </h1>
                            <p className="text-xs text-slate-400 font-medium">
                                @{user.username} · Nasabah Bank Sampah
                            </p>
                        </div>

                        {/* Tags / Pills Row */}
                        <div className="flex flex-wrap items-center gap-2 my-3">
                            <span className="px-3 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5">
                                <Leaf className="w-3.5 h-3.5 text-[#35C71D]" />
                                Bank Sampah
                            </span>
                        </div>

                        {/* 2-Column Key Metrics Bar */}
                        <div className="grid grid-cols-2 border-y border-slate-100 py-2.5 my-3 text-center">
                            <div>
                                <p className="text-sm sm:text-base font-extrabold text-[#35C71D]">
                                    {formatPoin(nasabah?.saldoPoin ?? 0)}
                                </p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                                    Saldo Poin
                                </p>
                            </div>
                            <div className="border-l border-slate-100 px-1">
                                <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                                    @{user.username}
                                </p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                                    Username
                                </p>
                            </div>
                        </div>

                        {/* Detail Data Diri Nasabah Container */}
                        <div className="bg-slate-50/80 border border-slate-100/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-3">
                            <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Rincian Kontak & Alamat
                            </h3>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400 shadow-sm">
                                    <Phone className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-slate-400 font-medium">No. Telepon</p>
                                    <p className="text-xs font-semibold text-slate-800">{nasabah?.telp || "-"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400 shadow-sm">
                                    <MapPin className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-slate-400 font-medium">Alamat</p>
                                    <p className="text-xs font-semibold text-slate-800 break-words">{nasabah?.alamat || "-"}</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-[11px] text-slate-400 text-center mt-3 font-medium">
                            Untuk mengubah data profil, silakan hubungi admin bank sampah Anda.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}