"use client";

import { createContext, useContext, useState } from "react";

interface SidebarContextValue {
    isOpen: boolean;
    toggle: () => void;
    close: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

/** Bungkus area Nasabah/Admin dengan ini, supaya Sidebar & Topbar bisa saling terhubung. */
export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const value: SidebarContextValue = {
        isOpen,
        toggle: () => setIsOpen((prev) => !prev),
        close: () => setIsOpen(false),
    };

    return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar(): SidebarContextValue {
    const ctx = useContext(SidebarContext);
    if (!ctx) {
        throw new Error("useSidebar dipanggil di luar SidebarProvider.");
    }
    return ctx;
}