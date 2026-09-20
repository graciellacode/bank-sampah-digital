"use client";

import { Menu, User } from "lucide-react";
import { useSidebar } from "@/lib/layout/SidebarContext";
import { useCurrentUser } from "@/lib/auth/AuthContext";
import { resolvePhotoUrl } from "@/lib/utils/photo";

interface DashboardTopbarProps {
    greeting: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export function DashboardTopbar({ greeting, subtitle, action }: DashboardTopbarProps) {
    const { toggle } = useSidebar();
    const user = useCurrentUser();

    const displayName = user?.adminBank?.namaUnit ?? user?.nasabah?.namaNasabah ?? user?.username ?? "User";
    const roleLabel = user?.role === "ADMIN" ? "Admin Unit" : "Nasabah";
    const photoUrl = resolvePhotoUrl(user?.nasabah?.foto);

    return (
        <header className="mb-6 sm:mb-8 space-y-4 sm:space-y-6">
            {/* Top Bar Controls (Mobile Menu & User Profile) */}
            <div className="flex items-center justify-between gap-3">
                <button
                    onClick={toggle}
                    className="lg:hidden flex-shrink-0 w-10 h-10 rounded-xl border border-slate-200/80 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-600 shadow-xs print:hidden"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Profile Badge */}
                <div className="ml-auto flex items-center gap-2 bg-white border border-slate-200/80 rounded-full pl-1.5 pr-3.5 py-1 shadow-xs print:hidden">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center overflow-hidden flex-shrink-0">
                        {photoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={photoUrl} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-4 h-4 text-[#16A34A]" />
                        )}
                    </div>
                    <div className="hidden sm:block text-left pr-1">
                        <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[150px]">
                            {displayName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">{roleLabel}</p>
                    </div>
                </div>
            </div>

            {/* Title & Subtitle */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight truncate">
                        {greeting}
                    </h1>
                    {subtitle && (
                        <p className="text-xs sm:text-sm text-slate-400 mt-1 truncate">{subtitle}</p>
                    )}
                </div>
                {action && <div className="flex-shrink-0">{action}</div>}
            </div>
        </header>
    );
}