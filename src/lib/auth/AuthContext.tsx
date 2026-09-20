"use client";

import { createContext, useContext } from "react";
import { AuthUser } from "@/types/auth";

export const AuthContext = createContext<AuthUser | null>(null);

export function useCurrentUser(): AuthUser {
    const user = useContext(AuthContext);
    if (!user) {
        throw new Error(
            "useCurrentUser dipanggil di luar AuthContext.Provider, atau dipanggil sebelum data user selesai dimuat. " +
            "Ini wajar terjadi sesaat setelah hot-reload saat development — coba hard refresh (Ctrl+Shift+R). " +
            "Kalau tetap muncul setelah navigasi normal (login -> dashboard), ada bug struktural yang perlu diperbaiki."
        );
    }
    return user;
}   