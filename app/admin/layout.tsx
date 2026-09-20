"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { PageLoader } from "@/components/shared/PageLoader";
import { useAuth } from "@/hooks/useAuth";
import { AuthContext } from "@/lib/auth/AuthContext";
import { SidebarProvider } from "@/lib/layout/SidebarContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8]">
                <PageLoader />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={user}>
            <SidebarProvider>
                <div className="min-h-screen bg-[#F4F6F8] text-slate-800 flex print:bg-white print:p-0">
                    <AdminSidebar />
                    <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 max-w-full overflow-x-hidden transition-all duration-200 print:p-0">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        </AuthContext.Provider>
    );
}