import Link from "next/link";
import {
  Leaf,
  Recycle,
  Coins,
  Gift,
  ClipboardCheck,
  UserPlus,
  ArrowRight,
  Building2,
  Users,
  FileBarChart,
  ShieldCheck,
} from "lucide-react";

const tickerItems = [
  "Setor Sampah Jadi Poin",
  "Pantau Status Real-time",
  "Tukar Poin Jadi Hadiah",
  "Kelola via Admin Digital",
  "Cetak Nota Transaksi",
  "Rekap Tonase Bulanan",
];

const langkahKerja = [
  {
    icon: UserPlus,
    title: "Daftar & Masuk",
    desc: "Buat akun sebagai Nasabah, lalu masuk ke aplikasi untuk mulai menyetor sampah.",
  },
  {
    icon: Recycle,
    title: "Pilih & Ajukan Setor",
    desc: "Pilih jenis sampah, isi estimasi berat, dan tentukan tanggal penyetoran.",
  },
  {
    icon: ClipboardCheck,
    title: "Diverifikasi Admin",
    desc: "Petugas bank sampah menimbang dan mengonfirmasi penyetoran Anda.",
  },
  {
    icon: Gift,
    title: "Poin Cair, Tukar Hadiah",
    desc: "Poin otomatis masuk ke saldo Anda dan siap ditukar dengan hadiah menarik.",
  },
];

const fiturNasabah = [
  "Lihat daftar jenis sampah, harga, dan poin per kilogram",
  "Ajukan penyetoran sampah untuk beberapa jenis sekaligus",
  "Pantau status pengajuan: menunggu, diverifikasi, hingga selesai",
  "Lihat histori setor & penukaran berdasarkan bulan",
  "Tukar poin dengan katalog hadiah yang tersedia",
  "Cetak nota transaksi setor maupun penukaran",
];

const fiturAdmin = [
  "Kelola data nasabah, kategori sampah, dan katalog hadiah",
  "Verifikasi & timbang ulang setiap pengajuan setor",
  "Pantau seluruh transaksi penukaran poin nasabah",
  "Lihat rekapitulasi tonase sampah & estimasi pembayaran per bulan",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">Bank Sampah Digital</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#cara-kerja" className="hover:text-brand-700 transition-colors">
              Cara Kerja
            </a>
            <a href="#fitur" className="hover:text-brand-700 transition-colors">
              Fitur
            </a>
            <a href="#tentang" className="hover:text-brand-700 transition-colors">
              Tentang
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-brand-700 px-3 py-2 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register-nasabah"
              className="text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-full px-4 py-2 transition-colors"
            >
              Daftar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <Leaf className="w-3.5 h-3.5" />
            Kelola Sampah, Panen Manfaat
          </span>
          <h1 className="text-4xl sm:text-5xl font-semibold text-foreground leading-tight mb-5">
            Setor sampah,{" "}
            <span className="text-brand-600">kumpulkan poin</span>, tukar
            jadi hadiah
          </h1>
          <p className="text-gray-500 text-base sm:text-lg mb-8 max-w-md">
            Platform digital untuk mencatat penyetoran sampah daur ulang,
            mengelola poin nasabah, dan menukarnya dengan hadiah — dikelola
            langsung oleh unit bank sampah Anda.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/register-nasabah"
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-full px-6 py-3 text-sm transition-colors"
            >
              Daftar Sebagai Nasabah
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-foreground font-medium rounded-full px-6 py-3 text-sm transition-colors"
            >
              Masuk ke Akun
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-brand-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80"
              alt="Pengelolaan sampah daur ulang"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-lg px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
              <Coins className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Poin terkumpul</p>
              <p className="text-sm font-semibold text-foreground">
                Otomatis tercatat
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="bg-brand-800 py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span
              key={i}
              className="mx-4 text-sm font-medium text-brand-100 flex items-center gap-4"
            >
              {item}
              <span className="text-brand-400">✳</span>
            </span>
          ))}
        </div>
      </div>

      {/* Cara Kerja */}
      <section id="cara-kerja" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-medium text-brand-600 uppercase tracking-wide">
            Cara Kerja
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mt-2">
            Empat langkah dari sampah menjadi hadiah
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {langkahKerja.map((langkah, i) => {
            const Icon = langkah.icon;
            return (
              <div
                key={langkah.title}
                className="bg-white rounded-2xl shadow-sm p-6 relative"
              >
                <span className="absolute top-5 right-5 text-3xl font-semibold text-gray-100">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
                <h3 className="font-medium text-foreground mb-1.5">
                  {langkah.title}
                </h3>
                <p className="text-sm text-gray-500">{langkah.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fitur */}
      <section id="fitur" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-medium text-brand-600 uppercase tracking-wide">
              Fitur
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mt-2">
              Dibuat untuk Nasabah dan Pengelola Bank Sampah
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">Untuk Nasabah</h3>
              </div>
              <ul className="space-y-3">
                {fiturNasabah.map((fitur) => (
                  <li key={fitur} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <ShieldCheck className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                    {fitur}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-brand-800 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">Untuk Admin Unit</h3>
              </div>
              <ul className="space-y-3">
                {fiturAdmin.map((fitur) => (
                  <li key={fitur} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <FileBarChart className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                    {fitur}
                  </li>
                ))}
              </ul>
              <Link
                href="/register-admin"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline mt-5"
              >
                Daftarkan unit bank sampah Anda
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang */}
      <section id="tentang" className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <span className="text-xs font-medium text-brand-600 uppercase tracking-wide">
          Tentang
        </span>
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mt-2 mb-4">
          Mendorong kebiasaan memilah dan menyetor sampah daur ulang
        </h2>
        <p className="text-gray-500 leading-relaxed">
          Bank Sampah Digital menghubungkan masyarakat dengan unit bank sampah
          terdekat melalui satu aplikasi — mulai dari pengajuan setor,
          verifikasi oleh petugas, hingga penukaran poin dengan hadiah,
          semuanya tercatat rapi dan bisa dipantau kapan saja.
        </p>
      </section>

      {/* CTA Footer */}
      <section className="bg-brand-800 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-3">
            Mulai setor sampah Anda hari ini
          </h2>
          <p className="text-brand-100 mb-7">
            Daftar sebagai nasabah dan mulai kumpulkan poin dari sampah daur
            ulang Anda.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register-nasabah"
              className="bg-white text-brand-800 font-medium rounded-full px-6 py-3 text-sm hover:bg-brand-50 transition-colors"
            >
              Daftar Sebagai Nasabah
            </Link>
            <Link
              href="/login"
              className="border border-white/30 text-white font-medium rounded-full px-6 py-3 text-sm hover:bg-white/10 transition-colors"
            >
              Masuk ke Akun
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-xs text-gray-400">
        Bank Sampah Digital • UKK RPL 2026/2027
      </footer>
    </main>
  );
}