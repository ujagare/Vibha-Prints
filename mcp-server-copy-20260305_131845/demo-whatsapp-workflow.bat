@echo off
echo ╔══════════════════════════════════════════════════════════════╗
echo ║     WhatsApp Automation - Manual Mode Demo                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

cd /d %~dp0
chcp 65001 >nul
set PYTHONIOENCODING=utf-8

echo SCENARIO: New lead "Rahul Kumar" inquires about website + SEO
echo.
pause

echo.
echo ═══════════════════════════════════════════════════════════════
echo STEP 1: Add contact to database
echo ═══════════════════════════════════════════════════════════════
echo.
python whatsapp_automation.py add-contact +919876543210 "Rahul Kumar" hot-lead
echo.
pause

echo.
echo ═══════════════════════════════════════════════════════════════
echo STEP 2: Generate personalized quote
echo ═══════════════════════════════════════════════════════════════
echo.
python whatsapp_automation.py quote +919876543210 "web,seo"
echo.
pause

echo.
echo ═══════════════════════════════════════════════════════════════
echo STEP 3: View generated message
echo ═══════════════════════════════════════════════════════════════
echo.
echo Opening: data/whatsapp_messages.json
echo.
type data\whatsapp_messages.json
echo.
pause

echo.
echo ═══════════════════════════════════════════════════════════════
echo STEP 4: Manual Action Required
echo ═══════════════════════════════════════════════════════════════
echo.
echo 1. Copy the message from data/whatsapp_messages.json
echo 2. Open WhatsApp Web (web.whatsapp.com)
echo 3. Search for +919876543210
echo 4. Paste and send the message
echo.
echo ✅ Message sent manually!
echo.
pause

echo.
echo ═══════════════════════════════════════════════════════════════
echo COMPARISON: With Twilio (Future)
echo ═══════════════════════════════════════════════════════════════
echo.
echo Current (Manual):
echo   - Time: 2-3 minutes per lead
echo   - Steps: 4 manual steps
echo   - Availability: Only when you're online
echo.
echo With Twilio (Automated):
echo   - Time: 0 seconds (instant)
echo   - Steps: 0 manual steps (fully automatic)
echo   - Availability: 24/7 (even at 2 AM!)
echo.
echo Cost: ₹0.40 per message (₹240/month for 20 leads/day)
echo Value: 20 hours saved/month = ₹10,000 value
echo.
pause

echo.
echo ═══════════════════════════════════════════════════════════════
echo Demo Complete!
echo ═══════════════════════════════════════════════════════════════
echo.
echo Your current setup:
echo ✅ AI message generation working
echo ✅ Contact management working
echo ✅ Quote generation working
echo ⚪ Manual sending (for now)
echo.
echo When ready to automate:
echo 1. Get Twilio account (free trial)
echo 2. Add credentials to .env
echo 3. Messages send automatically!
echo.
pause
