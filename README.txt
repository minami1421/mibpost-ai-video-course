AI ANIMATION WORKSHOP — PAYMENT REVIEW V2

ไฟล์ที่ต้องใช้:
1) index.html — หน้าเว็บลูกค้า (มีสถานะแนบไฟล์/สมัครสำเร็จ/ส่งไม่สำเร็จ)
2) Code.gs — Backend Google Apps Script
3) Admin.html — หลังบ้านตรวจสลิป + ยืนยัน/ปฏิเสธ + นัดเรียน

สำคัญ:
- Deploy Code.gs + Admin.html ใน Google Apps Script เป็น Web App
- Execute as: Me
- ตั้งสิทธิ์ตามการใช้งานของคุณ
- เอา URL ที่ลงท้าย /exec ไปแทน PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE ใน index.html
- หน้า Admin ให้เปิดจาก URL Apps Script: /exec?page=admin
- อย่าใช้ Admin.html ผ่าน GitHub Pages เพราะ google.script.run ทำงานเฉพาะหน้า Apps Script

สถานะการชำระ:
รอชำระเงิน -> รอตรวจสอบ -> ชำระถูกต้อง
                         -> สลิปไม่ถูกต้อง

Dashboard นับรายรับเฉพาะ 'ชำระถูกต้อง'
