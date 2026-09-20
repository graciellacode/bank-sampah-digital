import { NextRequest, NextResponse } from "next/server";

const TOKEN_COOKIE_NAME = "bank_sampah_token";
const ROLE_COOKIE_NAME = "bank_sampah_role";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;
    const role = request.cookies.get(ROLE_COOKIE_NAME)?.value;
    const isLoggedIn = Boolean(token);

    const isNasabahRoute = pathname.startsWith("/nasabah");
    const isAdminRoute = pathname.startsWith("/admin");
    const isLoginRoute = pathname === "/login";

    // 1. Belum login tapi coba buka halaman terproteksi -> lempar ke /login
    if ((isNasabahRoute || isAdminRoute) && !isLoggedIn) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    // 2. Sudah login tapi rolenya tidak cocok dengan area yang diakses
    if (isNasabahRoute && role !== "NASABAH") {
        const redirectUrl = new URL(role === "ADMIN" ? "/admin/dashboard" : "/login", request.url);
        return NextResponse.redirect(redirectUrl);
    }

    if (isAdminRoute && role !== "ADMIN") {
        const redirectUrl = new URL(role === "NASABAH" ? "/nasabah/dashboard" : "/login", request.url);
        return NextResponse.redirect(redirectUrl);
    }

    // 3. Sudah login tapi masih coba buka /login -> langsung ke dashboard-nya
    if (isLoginRoute && isLoggedIn) {
        const redirectUrl = new URL(
            role === "ADMIN" ? "/admin/dashboard" : "/nasabah/dashboard",
            request.url
        );
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/nasabah/:path*", "/admin/:path*", "/login"],
};