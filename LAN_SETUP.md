# LAN Server Setup Guide - X-Celerate the Tree

Agar aplikasi dapat diakses oleh peserta melalui HP/Tablet menggunakan jaringan WiFi yang sama, ikuti langkah-langkah berikut:

## 1. Dapatkan IP Address Komputer Host (Server)
Buka PowerShell dan jalankan perintah berikut:
```powershell
ipconfig
```
Cari bagian `IPv4 Address` di bawah `Wireless LAN adapter Wi-Fi` (contoh: `192.168.1.15`).

## 2. Buka Firewall Port (PowerShell Admin)
Jalankan perintah ini di PowerShell dengan hak akses **Administrator** agar port 3000 (Frontend) dan 3001 (Backend) dapat diakses dari luar:
```powershell
New-NetFirewallRule -DisplayName "XCelerate Frontend" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
New-NetFirewallRule -DisplayName "XCelerate Backend" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow
```

## 3. Konfigurasi Client (HP Peserta)
Peserta cukup membuka browser di HP dan mengetikkan alamat IP server:
`http://[IP_HOST]:3000`
Contoh: `http://192.168.1.15:3000`

## 4. Jalankan Aplikasi
Di komputer host (server), jalankan perintah:
```bash
npm run dev
```
Pastikan backend (`localhost:3001`) dan frontend (`localhost:3000`) berjalan lancar.

> [!IMPORTANT]
> Pastikan HP peserta dan Komputer Server terhubung ke **jaringan WiFi yang sama**. Jika menggunakan Hotspot HP, pastikan setting "Client Isolation" atau "AP Isolation" dalam keadaan mati.
