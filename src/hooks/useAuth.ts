"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/api/auth";
import { clearSession } from "@/lib/auth/session";
import { AuthUser } from "@/types/auth";

/**
 * Ambil data user yang sedang login dari /auth/me.
 * Kalau token tidak valid/expired, otomatis bersihkan sesi & lempar ke /login.
 */
export function useAuth() {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        getMe()
            .then((data) => {
                if (isMounted) {
                    setUser(data);
                    setIsLoading(false);
                }
            })
            .catch(() => {
                clearSession();
                router.replace("/login");
            });

        return () => {
            isMounted = false;
        };
    }, [router]);

    return { user, isLoading };
}