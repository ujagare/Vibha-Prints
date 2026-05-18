@echo off
echo ╔══════════════════════════════════════════════════════════════╗
echo ║        CodeSunny - Master Automation Runner                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

cd /d %~dp0
chcp 65001 >nul
set PYTHONIOENCODING=utf-8

:menu
echo.
echo Select automation to run:
echo.
echo [1] Social Media Automation
echo [2] Lead Intelligence
echo [3] WhatsApp Automation
echo [4] Payment & Invoice
echo [5] Email Follow-ups
echo [6] Inbound Email AI
echo [7] Automation Hub (Background)
echo [8] Run ALL Daily Tasks
echo [9] Test All Systems
echo [0] Exit
echo.
set /p choice="Enter choice (0-9): "

if "%choice%"=="1" goto social
if "%choice%"=="2" goto lead
if "%choice%"=="3" goto whatsapp
if "%choice%"=="4" goto payment
if "%choice%"=="5" goto email
if "%choice%"=="6" goto inbound
if "%choice%"=="7" goto hub
if "%choice%"=="8" goto all
if "%choice%"=="9" goto test
if "%choice%"=="0" goto end
goto menu

:social
echo.
echo ═══════════════════════════════════════════════════════════════
echo Social Media Automation
echo ═══════════════════════════════════════════════════════════════
echo.
echo [1] Post to all platforms
echo [2] View best posting times
echo [3] Back to menu
echo.
set /p schoice="Enter choice: "
if "%schoice%"=="1" (
    set /p msg="Enter message: "
    python social_media_automation.py post "%msg%"
)
if "%schoice%"=="2" python social_media_automation.py times
if "%schoice%"=="3" goto menu
pause
goto menu

:lead
echo.
echo ═══════════════════════════════════════════════════════════════
echo Lead Intelligence
echo ═══════════════════════════════════════════════════════════════
echo.
echo [1] Score all leads
echo [2] Enrich lead data
echo [3] Qualify leads (threshold 50)
echo [4] Qualify leads (threshold 70)
echo [5] Back to menu
echo.
set /p lchoice="Enter choice: "
if "%lchoice%"=="1" python lead_intelligence.py score
if "%lchoice%"=="2" python lead_intelligence.py enrich
if "%lchoice%"=="3" python lead_intelligence.py qualify 50
if "%lchoice%"=="4" python lead_intelligence.py qualify 70
if "%lchoice%"=="5" goto menu
pause
goto menu

:whatsapp
echo.
echo ═══════════════════════════════════════════════════════════════
echo WhatsApp Automation
echo ═══════════════════════════════════════════════════════════════
echo.
echo [1] Enable auto-reply
echo [2] Disable auto-reply
echo [3] Send quote
echo [4] Back to menu
echo.
set /p wchoice="Enter choice: "
if "%wchoice%"=="1" python whatsapp_automation.py auto-reply enable
if "%wchoice%"=="2" python whatsapp_automation.py auto-reply disable
if "%wchoice%"=="3" (
    set /p phone="Enter phone: "
    set /p services="Enter services (web,seo,etc): "
    python whatsapp_automation.py quote %phone% %services%
)
if "%wchoice%"=="4" goto menu
pause
goto menu

:payment
echo.
echo ═══════════════════════════════════════════════════════════════
echo Payment & Invoice Automation
echo ═══════════════════════════════════════════════════════════════
echo.
echo [1] Create invoice
echo [2] Check overdue & send reminders
echo [3] View revenue stats
echo [4] Mark invoice as paid
echo [5] Back to menu
echo.
set /p pchoice="Enter choice: "
if "%pchoice%"=="1" (
    set /p leadid="Enter lead ID: "
    set /p amount="Enter amount: "
    set /p services="Enter services: "
    python payment_automation.py invoice %leadid% %amount% "%services%"
)
if "%pchoice%"=="2" python payment_automation.py remind
if "%pchoice%"=="3" python payment_automation.py stats
if "%pchoice%"=="4" (
    set /p invnum="Enter invoice number: "
    python payment_automation.py paid %invnum%
)
if "%pchoice%"=="5" goto menu
pause
goto menu

:email
echo.
echo ═══════════════════════════════════════════════════════════════
echo Email Follow-up Automation
echo ═══════════════════════════════════════════════════════════════
echo.
python email_automation.py
pause
goto menu

:inbound
echo.
echo ═══════════════════════════════════════════════════════════════
echo Inbound Email AI Agent
echo ═══════════════════════════════════════════════════════════════
echo.
python inbound_email_ai_agent.py
pause
goto menu

:hub
echo.
echo ═══════════════════════════════════════════════════════════════
echo Automation Hub (Background Mode)
echo ═══════════════════════════════════════════════════════════════
echo.
echo Starting automation hub in background...
start "Automation Hub" cmd /k "python automation_hub.py"
echo.
echo ✅ Automation hub started in new window
pause
goto menu

:all
echo.
echo ═══════════════════════════════════════════════════════════════
echo Running ALL Daily Automation Tasks
echo ═══════════════════════════════════════════════════════════════
echo.
echo [1/6] Scoring leads...
python lead_intelligence.py score
echo.
echo [2/6] Checking email follow-ups...
python email_automation.py
echo.
echo [3/6] Processing inbound emails...
python inbound_email_ai_agent.py
echo.
echo [4/6] Checking payment reminders...
python payment_automation.py remind
echo.
echo [5/6] Running automation hub cycle...
python automation_hub.py
echo.
echo [6/6] Generating revenue stats...
python payment_automation.py stats
echo.
echo ═══════════════════════════════════════════════════════════════
echo ✅ All daily tasks completed!
echo ═══════════════════════════════════════════════════════════════
pause
goto menu

:test
echo.
echo ═══════════════════════════════════════════════════════════════
echo Testing All Automation Systems
echo ═══════════════════════════════════════════════════════════════
echo.
echo [1/4] Testing Social Media...
python social_media_automation.py times
echo.
echo [2/4] Testing Lead Intelligence...
python lead_intelligence.py score
echo.
echo [3/4] Testing WhatsApp...
python whatsapp_automation.py auto-reply enable
echo.
echo [4/4] Testing Payment System...
python payment_automation.py stats
echo.
echo ═══════════════════════════════════════════════════════════════
echo ✅ All systems tested successfully!
echo ═══════════════════════════════════════════════════════════════
pause
goto menu

:end
echo.
echo Goodbye!
echo.
exit
