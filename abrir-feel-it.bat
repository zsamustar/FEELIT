@echo off
setlocal
cd /d "%~dp0"

REM Inicia el servidor local en segundo plano y abre Feel It en el navegador.
REM Requiere Node.js, que ya está disponible en este equipo.
start "Feel It local server" /min cmd /c "node server.js"
timeout /t 1 /nobreak >nul
start "" "http://127.0.0.1:4174"

endlocal
