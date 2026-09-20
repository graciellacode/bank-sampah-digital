export interface BreakdownJenis {
    tonaseKg: number;
    rupiah: number;
    poin: number;
}

export interface RekapitulasiBulanan {
    periode: string;
    rekapitulasiTonase: {
        totalKg: number;
        totalTon: number;
        totalEstimasiPembayaranRupiah: number;
        totalPoinDiterbitkan: number;
    };
    breakdownJenisSampah: {
        plastik: BreakdownJenis;
        kertas: BreakdownJenis;
        logam: BreakdownJenis;
        kaca: BreakdownJenis;
    };
    rekapitulasiPenukaranPoin: {
        totalTransaksiPenukaran: number;
        totalPoinTerpakai: number;
    };
}