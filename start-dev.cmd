@echo off
setlocal
cd /d "%~dp0"
set "FJORD_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if exist "%FJORD_NODE%" goto bundled
where node >nul 2>nul
if errorlevel 1 goto missing
node scripts\astro.mjs dev --host 127.0.0.1
exit /b %ERRORLEVEL%
:bundled
set "PATH=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%"
"%FJORD_NODE%" scripts\astro.mjs dev --host 127.0.0.1
exit /b %ERRORLEVEL%
:missing
echo Node.js could not be found. Install Node.js 22.12 or newer and try again.
pause
exit /b 1
