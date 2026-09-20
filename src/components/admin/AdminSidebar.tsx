"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Recycle,
    Gift,
    PackageCheck,
    Repeat,
    FileBarChart,
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
        items: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
    },
    {
        label: "Data Master",
        items: [
            { href: "/admin/nasabah", label: "Nasabah", icon: Users },
            { href: "/admin/kategori-sampah", label: "Kategori Sampah", icon: Recycle },
            { href: "/admin/hadiah", label: "Hadiah", icon: Gift },
        ],
    },
    {
        label: "Transaksi",
        items: [
            { href: "/admin/setor", label: "Verifikasi Setor", icon: PackageCheck },
            { href: "/admin/penukaran", label: "Penukaran Poin", icon: Repeat },
            { href: "/admin/rekapitulasi", label: "Rekapitulasi", icon: FileBarChart },
        ],
    },
    {
        label: "Akun",
        items: [{ href: "/admin/profile", label: "Profile", icon: User }],
    },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isOpen, close } = useSidebar();

    function handleLogout() {
        clearSession();
        router.push("/login");
    }

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden print:hidden" onClick={close} />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white border-r border-slate-100 px-4 py-5 transform transition-transform duration-200 ease-in-out shadow-[2px_0_20px_rgba(0,0,0,0.02)] print:hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto lg:h-screen lg:sticky lg:top-0`}
            >
                {/* Logo & Brand Header */}
                <div className="flex items-center gap-3 px-2 mb-6 pb-4 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#35C71D] via-[#2EB319] to-[#1DA724] flex items-center justify-center shadow-md shadow-emerald-500/20 text-white flex-shrink-0">
                        <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-slate-800 font-extrabold text-base tracking-tight truncate">
                            Bank Sampah
                        </span>
                        <span className="text-[10px] font-bold bg-emerald-50 text-[#16A34A] border border-emerald-200/80 px-2 py-0.5 rounded-full flex-shrink-0">
                            Admin
                        </span>
                    </div>
                    <button onClick={close} className="ml-auto lg:hidden text-slate-400 hover:text-slate-600 p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
                    {menuGroups.map((group) => (
                        <div key={group.label}>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
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
                                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${isActive
                                                    ? "bg-[#E6F7ED] text-[#16A34A] shadow-xs"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#16A34A]" : "text-slate-400"}`} />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Logout Action */}
                <div className="pt-4 mt-auto border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-4 h-4 flex-shrink-0 text-slate-400 hover:text-red-600" />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>
        </>
    );
}