@echo off
:: ================================================================
:: TURSO MIGRATION HELPER
:: Jalankan script ini SEKALI untuk setup database Turso
:: Pastikan kamu sudah daftar di turso.tech dan punya credentials!
:: ================================================================

TITLE Turso Migration - X-Celerate the Tree
COLOR 0E

echo ===========================================
echo    TURSO DATABASE MIGRATION HELPER
echo ===========================================
echo.

:: ========================
:: SET TURSO CREDENTIALS DI SINI
:: ========================
set /p TURSO_URL="Masukkan TURSO_DATABASE_URL (libsql://...): "
set /p TURSO_TOKEN="Masukkan TURSO_AUTH_TOKEN (eyJ...): "

echo.
echo [INFO] Menjalankan migrasi dan seed ke Turso...
echo.

set "BASE_DIR=%~dp0"

cd /d "%BASE_DIR%apps\backend"

:: Jalankan migration script dengan env vars
set TURSO_DATABASE_URL=%TURSO_URL%
set TURSO_AUTH_TOKEN=%TURSO_TOKEN%

npx ts-node prisma/turso-migrate.ts

echo.
echo ===========================================
if %ERRORLEVEL% == 0 (
    echo   MIGRASI BERHASIL!
    echo.
    echo   Selanjutnya:
    echo   1. Set env vars ini di Railway:
    echo      TURSO_DATABASE_URL = %TURSO_URL%
    echo      TURSO_AUTH_TOKEN   = (token kamu, jangan share!)
    echo.
    echo   2. Deploy backend ke Railway
    echo   3. Update Vercel dengan URL Railway
) else (
    echo   MIGRASI GAGAL! Cek credentials Turso kamu.
)
echo ===========================================
pause
