import { JenisSampah } from "@/types/kategori";

const jenisConfig: Record<JenisSampah, { label: string; className: string }> = {
    plastik: { label: "Plastik", className: "bg-blue-50 text-blue-700" },
    kertas: { label: "Kertas", className: "bg-amber-50 text-amber-700" },
    logam: { label: "Logam", className: "bg-gray-100 text-gray-700" },
    kaca: { label: "Kaca", className: "bg-cyan-50 text-cyan-700" },
};

export function JenisBadge({ jenis }: { jenis: JenisSampah }) {
    const config = jenisConfig[jenis];
    return (
        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
            {config.label}
        </span>
    );
}