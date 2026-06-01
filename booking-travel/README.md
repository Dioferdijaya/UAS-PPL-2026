# Booking Travel HIACE — Ringkasan Proyek

## Ringkasan Singkat
Aplikasi ini adalah sistem pemesanan travel (HIACE) berbasis AdonisJS dengan rendering server-side (Edge). Pengguna dapat mencari jadwal, memilih kursi, melakukan booking, serta mengirim testimoni. Admin dapat mengelola jadwal melalui dashboard admin.

## Alur Utama (User Journey)

- Pengguna membuka halaman pencarian jadwal (home) dan memilih jadwal yang tersedia.
- Pada halaman detail jadwal, pengguna memilih nomor kursi yang belum dipesan.
- Pengguna mengisi data penumpang dan mengirimkan form booking.
- Sistem menyimpan booking dengan status `pending`. Pengguna diarahkan ke dashboard.
- Admin dapat menandai booking sebagai `paid` atau `cancelled` dari dashboard admin.

## Alur Testimoni

- Pengguna yang masuk dapat membuka halaman `Berikan Testimoni`.
- Form testimoni divalidasi di server; jika gagal, pesan error disimpan di session flash dan input lama dipertahankan.
- Testimoni disimpan di tabel `testimonials` dan dapat ditampilkan di halaman publik setelah disetujui (`approved`).

## Fitur Utama

- Pencarian dan pemilihan jadwal
- Booking kursi (status: pending / paid / cancelled)
- Autentikasi (signup/login) dan proteksi route via middleware
- Dashboard user & admin (manajemen jadwal, statistik, daftar booking)
- Form testimoni dengan validasi dan flash messages
- Frontend tooling: Vite + Tailwind (HMR saat development)

## Struktur Folder (ringkas)

- `app/` — Controller, Model, Middleware, Validators
- `resources/views/` — Template Edge (pages, partials, layouts)
- `config/`, `start/` — konfigurasi dan routing bootstrap
- `database/` — migrations & seeders
- `public/` — aset hasil build
- `build/` — output build produksi
- `tmp/db.sqlite3` — database SQLite (development)

Contoh file penting:
- `app/controllers/public_booking_controller.ts` — alur booking
- `app/controllers/testimonials_controller.ts` — alur testimoni
- `resources/views/pages/testimonial_form.edge` — template form testimoni
- `database/migrations/*` — struktur tabel (users, bookings, schedules, testimonials)

## Teknologi & Arsitektur

- Backend framework: AdonisJS (MVC)
- Bahasa: TypeScript
- ORM: Lucid (@adonisjs/lucid)
- Templating: Edge (edge.js)
- Frontend build: Vite, Tailwind CSS
- Database (development): SQLite (`better-sqlite3`)
- Keamanan: @adonisjs/shield, session middleware

Arsitektur: klasik MVC — Controllers menangani request, Models (Lucid) mengakses DB, Views (Edge) merender HTML. Middleware dipakai untuk autentikasi dan proteksi route.

## Setup & Menjalankan (Development)

1. Masuk ke folder proyek:

```powershell
cd booking-travel
```

2. Install dependencies:

```powershell
npm install
```

3. (Opsional) Jalankan TypeScript typecheck:

```powershell
node_modules\.bin\tsc --noEmit
# atau: npm run typecheck
```

4. Jalankan migrasi database:

```powershell
node ace migration:run
```

5. Jalankan server development dengan HMR:

```powershell
npm run dev
# atau: node ace serve --hmr
```

6. Buka browser: `http://localhost:54725` (alamat dapat berbeda — lihat output server saat dijalankan)

## Catatan Pengembangan

- Validasi form menggunakan validator di `app/validators/` dan flash errors melalui `session.flash('errors', ...)`.
- Untuk mengubah skema tabel, edit migration di `database/migrations/` dan jalankan `node ace migration:run` lagi.
- Jika VS Code menampilkan peringatan tsconfig dari `node_modules`, lebih baik tambahkan override di `tsconfig.json` proyek daripada mengedit `node_modules` secara permanen.

## File yang Perlu Diperhatikan saat Membuat Laporan

- `start/routes.ts` — daftar route dan rujukan ke controller
- `app/controllers/*` — logika fitur (booking, testimonials, auth)
- `app/models/*` — definisi skema model (Booking, User, Schedule, Testimonial)
- `resources/views/*` — tampilan end-user dan admin

