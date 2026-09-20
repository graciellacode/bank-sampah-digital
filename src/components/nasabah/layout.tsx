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
            <div className="min-h-screen flex items-center justify-center bg-background">
                <PageLoader />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={user}>
            <SidebarProvider>
                <div className="min-h-screen bg-background flex">
                    <NasabahSidebar />
                    <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 max-w-full overflow-x-hidden">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        </AuthContext.Provider>
    );
}