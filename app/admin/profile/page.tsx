"use client";

import { Building2, User, Phone, AtSign, ShieldCheck, Leaf } from "lucide-react";

import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { useCurrentUser } from "@/lib/auth/AuthContext";

export default function AdminProfilePage() {
    const user = useCurrentUser();
    const adminBank = user.adminBank;

    return (
        <div>
            <DashboardTopbar greeting="Profile" subtitle="Informasi data unit Bank Sampah Anda" />

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
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-full border-4 border-white shadow-xl overflow-hidden bg-emerald-50 flex items-center justify-center flex-shrink-0 relative z-10 text-[#16A34A]">
                                <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#16A34A]" />
                            </div>
                        </div>

                        {/* Name & Subtitle */}
                        <div className="space-y-0.5">
                            <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
                                {adminBank?.namaUnit ?? user.username}
                            </h1>
                            <p className="text-xs text-slate-400 font-medium">
                                @{user.username} · Admin Pengelola Unit
                            </p>
                        </div>

                        {/* Tags / Pills Row */}
                        <div className="flex flex-wrap items-center gap-2 my-3">
                            <span className="px-3 py-0.5 rounded-full bg-emerald-50 text-[#16A34A] border border-emerald-100 text-xs font-semibold flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#35C71D]" />
                                Admin Unit Verified
                            </span>
                            <span className="px-3 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5">
                                <Leaf className="w-3.5 h-3.5 text-[#35C71D]" />
                                Bank Sampah
                            </span>
                        </div>

                        {/* 2-Column Key Metrics Bar */}
                        <div className="grid grid-cols-2 border-y border-slate-100 py-2.5 my-3 text-center">
                            <div>
                                <p className="text-xs sm:text-sm font-extrabold text-[#35C71D] truncate px-1">
                                    {adminBank?.namaPengelola || user.username}
                                </p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                                    Nama Pengelola
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

                        {/* Detail Data Diri Container */}
                        <div className="bg-slate-50/80 border border-slate-100/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-3">
                            <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Rincian Pengelola & Kontak Unit
                            </h3>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400 shadow-sm">
                                    <Building2 className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-slate-400 font-medium">Nama Unit</p>
                                    <p className="text-xs font-semibold text-slate-800">{adminBank?.namaUnit || "-"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400 shadow-sm">
                                    <User className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-slate-400 font-medium">Nama Pengelola</p>
                                    <p className="text-xs font-semibold text-slate-800">{adminBank?.namaPengelola || "-"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400 shadow-sm">
                                    <Phone className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-slate-400 font-medium">No. Telepon</p>
                                    <p className="text-xs font-semibold text-slate-800">{adminBank?.telp || "-"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400 shadow-sm">
                                    <AtSign className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-slate-400 font-medium">Username</p>
                                    <p className="text-xs font-semibold text-slate-800">@{user.username}</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-[11px] text-slate-400 text-center mt-3 font-medium">
                            Fitur ubah profil unit belum tersedia di API saat ini.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}