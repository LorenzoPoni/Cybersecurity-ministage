@echo off
chcp 65001 >nul
setlocal

:: ============================================================================
:: CONFIGURAZIONE - Sostituisci "" con il tuo username GitHub
:: ============================================================================
set "UTENTE_GITHUB=LorenzoPoni"
set "NOME_REPO=Cybersecurity-ministage"
set "BRANCH=main"

set "REPO_URL=https://github.com/%UTENTE_GITHUB%/%NOME_REPO%.git"
set "ZIP_URL=https://github.com/%UTENTE_GITHUB%/%NOME_REPO%/archive/refs/heads/%BRANCH%.zip"

:: Si posiziona nella stessa cartella in cui si trova questo file .bat
cd /d "%~dp0"

echo ========================================================
echo   SCARICAMENTO PROGETTO: %NOME_REPO%
echo ========================================================
echo.

:: 1. Controlla se Git e' installato sul PC del laboratorio
where git >nul 2>&1
if %errorlevel%==0 (
    if exist "%NOME_REPO%\.git" (
        echo [INFO] Cartella gia presente. Aggiornamento con git pull...
        cd /d "%NOME_REPO%"
        git pull
        cd /d "%~dp0"
    ) else (
        echo [INFO] Git trovato! Clonazione della repository in corso...
        git clone "%REPO_URL%" "%NOME_REPO%"
    )
) else (
    :: 2. Se Git non e' installato sul PC, scarica ed estrae lo ZIP tramite PowerShell
    echo [INFO] Git non trovato su questo PC. Scarico l'archivio ZIP da GitHub...
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
      "Invoke-WebRequest -Uri '%ZIP_URL%' -OutFile 'repo_temp.zip'; ^
       Expand-Archive -Path 'repo_temp.zip' -DestinationPath '.' -Force; ^
       Remove-Item 'repo_temp.zip' -Force"

    :: GitHub estrae lo ZIP come "NomeRepo-main", lo rinominiamo in "NomeRepo"
    if exist "%NOME_REPO%-%BRANCH%" (
        if exist "%NOME_REPO%" rmdir /s /q "%NOME_REPO%"
        ren "%NOME_REPO%-%BRANCH%" "%NOME_REPO%"
    )
)

echo.
if exist "%NOME_REPO%" (
    echo [OK] Progetto scaricato correttamente in: "%~dp0%NOME_REPO%"

    :: 3. Installa automaticamente i pacchetti Node.js in backend\service se npm e' presente
    where npm >nul 2>&1
    if %errorlevel%==0 (
        if exist "%NOME_REPO%\backend\service\package.json" (
            echo [INFO] Installazione dipendenze Node.js (npm install)...
            cd /d "%NOME_REPO%\backend\service"
            call npm install
        )
    )
) else (
    echo [ERRORE] Scaricamento non riuscito. Verifica il nome utente, il branch o la rete.
)

echo.
pause