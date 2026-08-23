AI VIDEO EDITING COURSE WEBSITE

ไฟล์หลัก
- index.html
- style.css
- app.js
- assets/mib-mascot-front.png
- google-apps-script.gs

HOST ฟรีได้กับ
- GitHub Pages
- Cloudflare Pages
- Firebase Hosting

เชื่อม Google Sheets
1) สร้าง Google Sheet ใหม่
2) Extensions > Apps Script
3) วางโค้ดจาก google-apps-script.gs
4) Deploy > New deployment > Web app
5) Execute as: Me
6) Who has access: Anyone
7) Copy Web App URL
8) เปิด app.js แล้วใส่ URL ใน GOOGLE_SCRIPT_URL

ราคาในหน้าเว็บปัจจุบัน
- Video Course 990 บาท
- Founding Batch Group Workshop: ราคาปกติ 3,990 > Early Bird 2,590 บาท/คน
- รีวิวประสบการณ์หลังเรียน รับคืน 1,000 บาท (สุทธิ 1,590 ตามเงื่อนไข)
- Private 1 คน 8,990 บาท
- Private 2 คน 5,990 บาท/คน
- Private 3 คน 4,990 บาท/คน
- ทุกแพ็กเกจ MibPost ฟรี 1 เดือน มูลค่า 690 บาท


V7 PAYMENT FLOW
- Form -> payment page -> SCB account details -> upload slip -> Google Apps Script -> Google Drive + Google Sheet
- QR image encodes the account number only; it is not PromptPay / Thai QR Payment and does not lock an amount.
- Update deployed Apps Script using google-apps-script.gs and create a new deployment version.
