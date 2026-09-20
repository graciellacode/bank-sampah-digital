"use client";

interface StatusFilterProps {
    value: string;
    onChange: (value: string) => void;
}

const statusOptions = [
    { value: "", label: "Semua Status" },
    { value: "menunggu_konfirmasi", label: "Menunggu Konfirmasi" },
    { value: "diverifikasi", label: "Diverifikasi" },
    { value: "selesai", label: "Selesai" },
    { value: "ditolak", label: "Ditolak" },
];

export function StatusFilter({ value, onChange }: StatusFilterProps) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        >
            {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}