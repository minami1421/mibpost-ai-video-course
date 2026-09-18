const SPREADSHEET_ID = '1h-duibMO-Jemn-NmQE7c2giJ7t5wymj1Qmo4G9PY77w';
const SHEET_NAME = 'Animation Registrations';
const SLIP_FOLDER_NAME = 'AI Animation Workshop Slips';

function doGet(e) {
  const page = (e && e.parameter && e.parameter.page) || 'public';
  const file = page === 'admin' ? 'Admin' : 'Public';
  return HtmlService.createHtmlOutputFromFile(file)
    .setTitle(page === 'admin' ? 'AI Animation Workshop — Admin' : 'AI Animation Workshop')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function sheet_(){
  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (!sh) throw new Error('ไม่พบชีต ' + SHEET_NAME);
  return sh;
}

function createRegistration(data) {
  if (!data || !data.name || !data.phone || !data.courseCode) throw new Error('ข้อมูลสมัครไม่ครบ');
  const prices = {group:1990, private1:8990, private2:11980, private3:14970};
  const labels = {
    group:'Group AI Animation Workshop — 1,990 บาท',
    private1:'Private 1 คน — 8,990 บาท',
    private2:'Private 2 คน — 5,990 บาท/คน',
    private3:'Private 3 คน — 4,990 บาท/คน'
  };
  if (!prices[data.courseCode]) throw new Error('แพ็กเกจไม่ถูกต้อง');
  const id = 'AIA-' + Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyyMMddHHmmss') + '-' + Math.floor(100+Math.random()*900);
  const now = new Date();
  const row = [
    now,id,String(data.name||''),String(data.phone||''),String(data.line||''),String(data.email||''),
    data.courseCode,labels[data.courseCode],prices[data.courseCode],'รอชำระเงิน','',
    String(data.experience||''),arr_(data.tools),String(data.otherAI||''),String(data.goalType||''),String(data.style||''),
    String(data.idea||''),String(data.device||''),String(data.ram||''),arr_(data.subs),arr_(data.days),arr_(data.times),
    String(data.firstProject||''),'','','รอนัดหมาย','',now,'',''
  ];
  sheet_().appendRow(row);
  return {ok:true, registrationId:id, amount:prices[data.courseCode], course:labels[data.courseCode]};
}

function confirmPayment(payload) {
  if (!payload || !payload.registrationId || !payload.fileBase64) throw new Error('ข้อมูลการชำระเงินไม่ครบ');
  const sh = sheet_();
  const row = findRow_(sh, payload.registrationId);
  const bytes = Utilities.base64Decode(payload.fileBase64);
  const blob = Utilities.newBlob(bytes, payload.mimeType || 'application/octet-stream', sanitize_(payload.fileName || 'slip'));
  const folders = DriveApp.getFoldersByName(SLIP_FOLDER_NAME);
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(SLIP_FOLDER_NAME);
  const file = folder.createFile(blob);
  file.setDescription('Registration ID: ' + payload.registrationId);
  sh.getRange(row, 10, 1, 2).setValues([['รอตรวจสอบ', file.getUrl()]]);
  sh.getRange(row, 28).setValue(new Date());
  SpreadsheetApp.flush();
  return {ok:true, registrationId:payload.registrationId};
}

function getAdminData() {
  const sh = sheet_();
  const values = sh.getDataRange().getDisplayValues();
  const headers = values[0] || [];
  const rows = values.slice(1).filter(r=>r[1]).map(r=>{
    const o={}; headers.forEach((h,i)=>o[h]=r[i]||''); return o;
  });
  return {headers,rows,updatedAt:new Date().toISOString()};
}

function saveAppointment(p) {
  if (!p || !p.registrationId) throw new Error('ไม่มี Registration ID');
  const allowed=['รอนัดหมาย','ยืนยันแล้ว','เรียนแล้ว','เลื่อนนัด','ยกเลิก'];
  if (!allowed.includes(p.status || 'รอนัดหมาย')) throw new Error('สถานะนัดไม่ถูกต้อง');
  const sh=sheet_();
  const row=findRow_(sh,p.registrationId);
  sh.getRange(row,24,1,5).setValues([[
    String(p.date||''),String(p.time||''),String(p.status||'รอนัดหมาย'),String(p.note||''),new Date()
  ]]);
  sh.getRange(row,29).setValue(Session.getActiveUser().getEmail() || 'admin');
  SpreadsheetApp.flush();
  return {ok:true};
}

function findRow_(sh,id){
  const last=sh.getLastRow(); if(last<2) throw new Error('ไม่พบข้อมูล');
  const ids=sh.getRange(2,2,last-1,1).getDisplayValues().flat();
  const i=ids.indexOf(String(id)); if(i<0) throw new Error('ไม่พบ Registration ID');
  return i+2;
}
function arr_(v){ return Array.isArray(v) ? v.join(', ') : String(v||''); }
function sanitize_(s){ return String(s).replace(/[^a-zA-Z0-9ก-๙._-]/g,'_').slice(0,100); }
