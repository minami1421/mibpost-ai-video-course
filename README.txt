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



V8 SLIP FIX
============
แก้ปัญหาสลิปหายแล้ว:
1) Apps Script จะสร้างชีตใหม่ชื่อ "Registrations" อัตโนมัติ
2) สลิปจะถูกเก็บใน Google Drive โฟลเดอร์ "AI Video Course Slips"
3) ในชีต Registrations จะมีคอลัมน์ "Slip URL" กดเปิดไฟล์ได้
4) เว็บจะถือว่าส่งสำเร็จต่อเมื่อ Apps Script ตอบ success:true เท่านั้น

วิธีอัปเดต Apps Script:
- Extensions > Apps Script
- วาง google-apps-script.gs นี้แทนโค้ดเดิม
- Save
- รัน setupRegistrationSystem() 1 ครั้งเพื่ออนุญาต Google Drive + Google Sheets
- Deploy > Manage deployments > Edit
- Version: New version
- Deploy
- ใช้ Web App URL เดิมได้



V9 SYNCED VERSION
=================
หน้าเว็บและ Apps Script ใช้ field name ชุดเดียวกันแล้ว

Frontend -> Backend:
fullName
phone
line
email
course
privatePeople
amount
paymentStatus
source
referrer
facebook
instagram
tiktok
youtube
editingExperience
editingSoftware
editingSoftwareOther
aiExperience
aiTools
aiToolsOther
learningGoal
learningGoalOther
goal
note
registrationId
slipName
slipType
slipDataUrl

หลังอัปเว็บ V9 ขึ้น GitHub:
1. ไป Google Sheet > Extensions > Apps Script
2. วาง google-apps-script.gs ตัวนี้แทนของเดิม
3. Save
4. เลือก setupRegistrationSystem แล้ว Run 1 ครั้ง
5. อนุญาต Google Sheets + Google Drive
6. Deploy > Manage deployments > Edit
7. เลือก New version
8. Deploy
9. URL /exec เดิมใช้ต่อได้ ไม่ต้องแก้เว็บ


V10 — SCHEDULE + LINE FOLLOW-UP
- เพิ่มให้ผู้สมัครเลือกวันที่สะดวก: จันทร์–ศุกร์ / เสาร์–อาทิตย์
- เพิ่มช่วงเวลาสะดวก: เช้า / บ่าย / ค่ำ
- เลือกได้มากกว่า 1 ตัวเลือก และบังคับอย่างน้อย 1 วัน + 1 เวลา
- หลังอัปโหลดสลิปสำเร็จ แสดง QR LINE และข้อความให้แอดไลน์เพื่อแจ้งการโอนและรับวันนัดหมาย
- Apps Script เพิ่มคอลัมน์ วันที่สะดวกเรียน และ ช่วงเวลาที่สะดวกเรียน
