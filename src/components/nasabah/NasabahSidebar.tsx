"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Recycle,
    PackagePlus,
    History,
    Gift,
    Repeat,
    User,
    LogOut,
    Leaf,
    X,
} from "lucide-react";
import { clearSession } from "@/lib/auth/session";
import { useSidebar } from "@/lib/layout/SidebarContext";

const menuGroups = [
    {
        label: "Overview",
        items: [{ href: "/nasabah/dashboard", label: "Dashboard", icon: LayoutDashboard }],
    },
    {
        label: "Aktivitas",
        items: [
            { href: "/nasabah/kategori-sampah", label: "Kategori Sampah", icon: Recycle },
            { href: "/nasabah/setor", label: "Ajukan Setor", icon: PackagePlus },
            { href: "/nasabah/setor/riwayat", label: "Riwayat Setor", icon: History },
            { href: "/nasabah/hadiah", label: "Katalog Hadiah", icon: Gift },
            { href: "/nasabah/penukaran", label: "Penukaran Poin", icon: Repeat },
        ],
    },
    {
        label: "Akun",
        items: [{ href: "/nasabah/profile", label: "Profile", icon: User }],
    },
];

export function NasabahSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isOpen, close } = useSidebar();

    function handleLogout() {
        clearSession();
        router.push("/login");
    }

    return (
        <>
            {/* Overlay gelap di belakang sidebar, hanya muncul di mobile saat sidebar terbuka */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden print:hidden"
                    onClick={close}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white border-r border-slate-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.03)] px-4 py-6 transform transition-transform duration-200 ease-in-out print:hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
            >
                <div className="flex items-center gap-3 px-3 mb-8">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-sm shadow-emerald-500/20">
                        <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-slate-800 font-bold text-lg tracking-tight">Bank Sampah</span>
                    <button onClick={close} className="ml-auto lg:hidden text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <nav className="flex-1 space-y-6 overflow-y-auto pr-1">
                    {menuGroups.map((group) => (
                        <div key={group.label}>
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
                                {group.label}
                            </p>
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={close}
                                            className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${isActive
                                                    ? "bg-[#EDFBEA] text-[#2EC71E] font-semibold"
                                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium"
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? "text-[#2EC71E]" : "text-slate-400"}`} />
                                            <span>{item.label}</span>
                                            {isActive && (
                                                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#2EC71E] rounded-l-full" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
                    >
                        <LogOut className="w-4 h-4 text-slate-400 hover:text-red-600" />
                        Log Out
                    </button>
                    <p className="text-[11px] text-center text-slate-300 font-medium">
                        @BankSampah.com 2026
                    </p>
                </div>
            </aside>
        </>
    );
}