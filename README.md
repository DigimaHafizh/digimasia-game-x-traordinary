# X-Celerate the Tree 🌳

Sistem Voting & Trivia interaktif secara real-time untuk perayaan **Digima ASIA 10th Anniversary**. Dibangun dengan arsitektur monorepo yang dioptimalkan untuk deployment dalam jaringan lokal (LAN).

## 🚀 Fitur Utama
- **Real-time Synchronization**: Perpindahan fase permainan (Login, Voting, Trivia, Watering) tersinkronisasi antar semua peserta via WebSocket.
- **Interactive Voting**: Pemilihan *Best Team* dan *Digimer of the Year* dengan validasi satu suara per kategori.
- **Trivia Engine**: 10 soal interaktif dengan timer 30 detik otomatis.
- **Collaborative Watering**: Mekanisme tapping bersama untuk menumbuhkan pohon event melalui 10 tahap pertumbuhan.
- **Leaderboard & Winners**: Pengumuman pemenang dan kontributor air terbanyak secara real-time dengan efek visual premium.
- **Admin Dashboard**: Pusat kendali fase permainan dan reset sistem.

## 🛠️ Tech Stack
- **Frontend**: Next.js 14 (App Router), Zustand, Socket.IO Client.
- **Backend**: NestJS, Socket.IO, Prisma ORM.
- **Database**: SQLite (Local file `dev.db`).
- **Styling**: Vanilla CSS (Premium Glassmorphism Design).
- **Runtime**: Node.js v18+.

## ⚙️ Persiapan & Instalasi
1. Clone repositori ini.
2. Install dependencies di root folder:
   ```bash
   npm install
   ```
3. Lakukan inisialisasi database (SQLite):
   ```bash
   cd apps/backend
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

## 🏃 Menjalankan Aplikasi
Jalankan perintah berikut di root folder untuk menyalakan frontend (port 3000) dan backend (port 3001) secara bersamaan:
```bash
npm run dev
```

## 📂 Struktur Monorepo
- `apps/frontend/`: Aplikasi Next.js untuk Peserta & Admin.
- `apps/backend/`: Server NestJS & WebSocket Gateway.
- `packages/shared-types/`: TypeScript interfaces yang digunakan bergantian oleh frontend & backend.
- `LAN_SETUP.md`: Panduan konfigurasi jaringan agar bisa diakses via HP/Tablet peserta.

## 📱 Akses LAN (WiFi)
Untuk mengakses aplikasi melalui perangkat lain dalam jaringan WiFi yang sama, gunakan alamat IP host komputer Anda. Silakan baca panduan lengkap di:
👉 [**LAN_SETUP.md**](./LAN_SETUP.md)

---
Developed by **Digima ASIA Tech Team** for the 10th Anniversary Celebration.
