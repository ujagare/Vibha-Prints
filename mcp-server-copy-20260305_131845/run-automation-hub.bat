@echo off
cd /d %~dp0
chcp 65001 >nul
set PYTHONIOENCODING=utf-8
if "%AUTOMATION_HUB_MODE%"=="" set AUTOMATION_HUB_MODE=loop
if "%AUTOMATION_POLL_SECONDS%"=="" set AUTOMATION_POLL_SECONDS=300
echo [automation-hub] mode=%AUTOMATION_HUB_MODE% poll=%AUTOMATION_POLL_SECONDS%s
python automation_hub.py
