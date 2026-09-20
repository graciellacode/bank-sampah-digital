export function formatRupiah(value: number | null | undefined): string {
    const safeValue = typeof value === "number" && !isNaN(value) ? value : 0;
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(safeValue);
}

export function formatTanggal(isoDate: string | null | undefined): string {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

export function formatKg(value: number | null | undefined): string {
    const safeValue = typeof value === "number" && !isNaN(value) ? value : 0;
    return `${safeValue.toLocaleString("id-ID")} kg`;
}

export function formatPoin(value: number | null | undefined): string {
    const safeValue = typeof value === "number" && !isNaN(value) ? value : 0;
    return `${safeValue.toLocaleString("id-ID")} Poin`;
}