# Bank Sampah Digital - Frontend (Web)

Aplikasi web portal untuk sistem Bank Sampah Digital yang menghubungkan fitur **Nasabah** dan **Admin Unit**, dibangun sebagai solusi pengelolaan sampah daur ulang dan sistem penukaran poin.

Aplikasi ini dikembangkan untuk mengonsumsi API Backend ("Sumber Data: API disediakan panitia") sesuai dengan dokumen kontrak spesifikasi ujian.

## Framework & Tools yang Digunakan

Sesuai dengan ketentuan "Tools Utama: NextJS/ReactJS/VueJS atau framework pilihan Anda", project ini menggunakan arsitektur modern berikut:

- **Framework**: Next.js 15 (App Router) + React 19
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS (Native styling, tanpa template eksternal)
- **Icons**: Lucide React
- **API Fetching**: Axios (Terkonfigurasi dengan Interceptors untuk otomatisasi JWT Token)
- **State Management**: React Context API (Untuk autentikasi global/sesi user)

## Persyaratan Sistem (Environment)
Pastikan environment lokal Anda telah terinstal:
- Node.js (Versi 18.x atau terbaru disarankan)
- npm (Node Package Manager)

## Cara Menjalankan Aplikasi

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi di *environment* lokal Anda:

### 1. Ekstrak / Buka Folder Project
Pastikan Anda berada di root direktori project ini (folder yang memuat file `package.json`).

### 2. Konfigurasi Endpoint API (Base URL)
Buat file `.env` di root direktori project (jika belum ada) dan masukkan Base URL API yang telah diberikan panitia saat ujian dimulai. 
Buka file `.env` dan konfigurasikan seperti contoh berikut:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```
*(Ganti `http://localhost:5000/api/v1` dengan URL API sebenarnya dari panitia)*

### 3. Install Dependensi
Buka terminal/command prompt di direktori project, lalu jalankan perintah:
```bash
npm install
```

### 4. Jalankan Development Server
Setelah proses instalasi selesai, jalankan server pengembangan (*development server*):
```bash
npm run dev
```

### 5. Akses Aplikasi
Buka browser Anda dan kunjungi URL berikut:
```text
http://localhost:3000
```
- Aplikasi web sudah siap diakses.
- Tampilan aplikasi sudah disesuaikan agar responsif (*mobile-friendly*) hingga skala layar laptop/tablet sesuai instruksi panduan (Gambar Kerja Bagian II).
- Seluruh form dan interaksi data telah diintegrasikan langsung (*100% consuming endpoint*) tanpa menggunakan *dummy data*.

---
*Dibuat untuk memenuhi kualifikasi pengumpulan Berkas Ujian: Dokumen singkat (framework dan cara menjalankan).*
