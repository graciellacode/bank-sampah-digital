"use client";

import { NasabahSidebar } from "@/components/nasabah/NasabahSidebar";
import { PageLoader } from "@/components/shared/PageLoader";
import { useAuth } from "@/hooks/useAuth";
import { AuthContext } from "@/lib/auth/AuthContext";
import { SidebarProvider } from "@/lib/layout/SidebarContext";

export default function NasabahLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F3F5F7]">
                <PageLoader />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={user}>
            <SidebarProvider>
                <div className="min-h-screen bg-[#F3F5F7] text-slate-800 print:bg-white print:p-0">
                    <NasabahSidebar />
                    <main className="min-h-screen lg:pl-64 transition-all duration-200 print:pl-0 print:p-0 print:m-0">
                        <div className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 max-w-full overflow-x-hidden print:p-0 print:max-w-none print:overflow-visible">
                            {children}
                        </div>
                    </main>
                </div>
            </SidebarProvider>
        </AuthContext.Provider>
    );
}