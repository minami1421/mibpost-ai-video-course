AI ANIMATION WORKSHOP — LIVE DATABASE PACKAGE

ฐานข้อมูล:
Google Sheet: AI Video Course Registration
Tab ใหม่: Animation Registrations
(แยกจาก Registrations งานเก่าแล้ว)

ไฟล์:
1) Code.gs   — Backend / Google Sheet / Slip upload / Admin API
2) Public.html — เว็บ AI Animation Workshop ไฟล์ล่าสุดของคุณ + เชื่อมฐานข้อมูล
3) Admin.html  — หลังบ้านดูยอด/ลูกค้า/สลิป และแก้เฉพาะนัดหมาย

ติดตั้ง Google Apps Script:
1. เปิด script.google.com แล้วสร้าง Project
2. วาง Code.gs
3. สร้าง HTML file ชื่อ Public แล้ววาง Public.html
4. สร้าง HTML file ชื่อ Admin แล้ววาง Admin.html
5. Deploy > New deployment > Web app
6. Execute as: Me
7. Who has access: เลือกตามการใช้งานของคุณ (เว็บสมัครต้องเข้าถึงได้โดยผู้สมัคร)
8. URL ปกติ = หน้าเว็บสมัคร
9. URL เดิมเติม ?page=admin = หลังบ้าน

Flow:
กรอกฟอร์ม -> createRegistration() -> บันทึกสถานะ “รอชำระเงิน”
แนบสลิป -> confirmPayment() -> อัปโหลด Drive + เปลี่ยนเป็น “รอตรวจสอบ”
Admin -> อ่านข้อมูลสดจาก Sheet
Admin แก้ได้เฉพาะ วันนัด / เวลา / สถานะนัด / หมายเหตุนัด

หมายเหตุ assets:
Public.html ยังอ้าง assets/... ตามเว็บต้นฉบับ (รูป/วิดีโอ/QR)
ถ้าเอา Public.html ไปโฮสต์ใน Apps Script โดยตรง ต้องเปลี่ยน assets เป็น URL ที่เข้าถึงได้จริง หรือโฮสต์ไฟล์หน้าเว็บเดิมแล้วใช้ API backend แยกต่างหาก
