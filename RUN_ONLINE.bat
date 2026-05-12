@echo off
TITLE X-CELERATE ONLINE RUNNER (PERMANENT NGROK MODE)
COLOR 09

echo ===========================================
echo    X-CELERATE THE TREE: PERMANENT & SAFE
echo ===========================================
echo.

:: Get the current directory with quotes
set "BASE_DIR=%~dp0"

echo [1/4] Memulai Backend (Port 3001)...
start "Backend Server" cmd /k "cd /d "%BASE_DIR%apps\backend" && npm run start"

echo [2/4] Memulai Tunnel Backend (Zrok - Stable)...
echo TUNGGU SAMPAI MUNCUL URL...
start "Tunnel Backend" cmd /k "cd /d "%BASE_DIR%" && zrok share public localhost:3001 --backend-mode proxy --headless"

echo [3/4] Memulai Frontend (Port 3000)...
start "Frontend Server" cmd /k "cd /d "%BASE_DIR%apps\frontend" && npm run dev"

echo [4/4] Memulai Tunnel Frontend (PERMANENT DOMAIN)...
echo LINK ANDA ADALAH: https://parkway-guts-humped.ngrok-free.dev
start "Tunnel Frontend" cmd /k "ngrok http --domain=parkway-guts-humped.ngrok-free.dev 3000"

echo.
echo ===========================================
echo   SISTEM SUDAH ONLINE!
echo ===========================================
echo.
echo CARA MENGGUNAKAN:
echo 1. Lihat jendela "Tunnel Backend" (Zrok), copy link-nya.
echo 2. Masukkan ke file apps/frontend/.env.local (lalu Refresh).
echo 3. BAGIKAN LINK PERMANEN BERIKUT KE PESERTA (PAKAI QR CODE):
echo    https://parkway-guts-humped.ngrok-free.dev
echo.
echo ===========================================
pause
