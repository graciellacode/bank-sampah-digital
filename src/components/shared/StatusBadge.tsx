type BadgeStatus =
    | "menunggu_konfirmasi"
    | "diverifikasi"
    | "selesai"
    | "ditolak"
    | "diproses";

const statusConfig: Record<BadgeStatus, { label: string; className: string }> = {
    menunggu_konfirmasi: {
        label: "Menunggu",
        className: "bg-amber-500 text-white font-extrabold shadow-xs",
    },
    diverifikasi: {
        label: "Diverifikasi",
        className: "bg-blue-600 text-white font-extrabold shadow-xs",
    },
    selesai: {
        label: "Selesai",
        className: "bg-[#35C71D] text-white font-extrabold shadow-xs",
    },
    ditolak: {
        label: "Ditolak",
        className: "bg-red-500 text-white font-extrabold shadow-xs",
    },
    diproses: {
        label: "Diproses",
        className: "bg-amber-500 text-white font-extrabold shadow-xs",
    },
};

export function StatusBadge({ status }: { status: BadgeStatus }) {
    const config = statusConfig[status] ?? {
        label: status,
        className: "bg-slate-500 text-white font-bold",
    };

    return (
        <span
            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] sm:text-[11px] tracking-wider uppercase ${config.className}`}
        >
            {config.label}
        </span>
    );
}