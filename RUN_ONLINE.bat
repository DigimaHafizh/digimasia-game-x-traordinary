@echo off
TITLE X-CELERATE ONLINE RUNNER (RAILWAY MODE)
COLOR 0A

echo ===========================================
echo    X-CELERATE THE TREE: RAILWAY MODE
echo    Backend: Railway (Online, Permanent!)
echo    Frontend: Vercel (Online, Permanent!)
echo ===========================================
echo.

:: Get the current directory with quotes
set "BASE_DIR=%~dp0"

echo [1/2] Memulai Frontend (Port 3000)...
start "Frontend Server" cmd /k "cd /d "%BASE_DIR%apps\frontend" && npm run dev"

echo [2/2] Memulai Tunnel Frontend (PERMANENT DOMAIN)...
echo LINK ANDA ADALAH: https://parkway-guts-humped.ngrok-free.app
start "Tunnel Frontend" cmd /k "ngrok http --domain=parkway-guts-humped.ngrok-free.app 3000"

echo.
echo ===========================================
echo   SISTEM SUDAH ONLINE!
echo ===========================================
echo.
echo CARA MENGGUNAKAN:
echo 1. Backend sudah ONLINE PERMANEN di Railway!
echo    URL: https://backend-production-51da.up.railway.app
echo 2. BAGIKAN LINK PERMANEN BERIKUT KE PESERTA:
echo    https://digimasia-game-x-traordinary-fronte.vercel.app
echo.
echo ===========================================
echo CATATAN: Jika ingin development lokal,
echo jalankan: npm run dev (di root folder)
echo ===========================================
pause
