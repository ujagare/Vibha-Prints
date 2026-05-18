@echo off
echo ========================================
echo Testing All Automation Systems
echo ========================================
echo.

cd /d %~dp0
chcp 65001 >nul
set PYTHONIOENCODING=utf-8

echo [1/4] Testing Social Media Automation...
echo.
python social_media_automation.py post "Testing automation system"
echo.

echo [2/4] Testing Lead Intelligence...
echo.
python lead_intelligence.py score
echo.

echo [3/4] Testing WhatsApp Automation...
echo.
python whatsapp_automation.py auto-reply enable
echo.

echo [4/4] Testing Payment Automation...
echo.
python payment_automation.py stats
echo.

echo ========================================
echo All Tests Complete!
echo ========================================
echo.
echo Check logs above for any errors.
echo.
pause
