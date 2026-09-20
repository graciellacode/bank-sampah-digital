"use client";

interface MonthFilterProps {
    value: string;
    onChange: (value: string) => void;
}

/**
 * Filter bulan sederhana pakai <input type="month">.
 * Dipakai berulang di riwayat setor, riwayat penukaran, dan rekap admin.
 */
export function MonthFilter({ value, onChange }: MonthFilterProps) {
    return (
        <div className="flex items-center gap-2">
            <input
                type="month"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    className="text-xs text-gray-400 hover:text-gray-600"
                >
                    Reset
                </button>
            )}
        </div>
    );
}