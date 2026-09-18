const SPREADSHEET_ID='1h-duibMO-Jemn-NmQE7c2giJ7t5wymj1Qmo4G9PY77w';
const SHEET_NAME='Animation Registrations';
const SLIP_FOLDER_NAME='AI Animation Workshop Slips';

function doGet(e){
  const page=(e&&e.parameter&&e.parameter.page)||'public';
  if(page==='admin') return HtmlService.createHtmlOutputFromFile('Admin').setTitle('AI Animation Workshop — Admin');
  return ContentService.createTextOutput(JSON.stringify({ok:true,service:'AI Animation Workshop API'})).setMimeType(ContentService.MimeType.JSON);
}
function doPost(e){
  try{
    const p=e.parameter||{}, action=p.action||'';
    let out;
    if(action==='register') out=createRegistration_(p);
    else if(action==='payment') out=confirmPayment_(p);
    else if(action==='appointment') out=saveAppointment_(p);
    else throw new Error('action ไม่ถูกต้อง');
    return json_(out);
  }catch(err){return json_({ok:false,error:String(err.message||err)})}
}
function sheet_(){const sh=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);if(!sh)throw new Error('ไม่พบชีต '+SHEET_NAME);return sh}
function parseArr_(v){try{const a=JSON.parse(v||'[]');return Array.isArray(a)?a.join(', '):String(v||'')}catch(_){return String(v||'')}}
function createRegistration_(p){
  if(!p.registrationId||!p.name||!p.phone||!p.courseCode)throw new Error('ข้อมูลสมัครไม่ครบ');
  const prices={group:1990,private1:8990,private2:11980,private3:14970};
  const labels={group:'Group AI Animation Workshop — 1,990 บาท',private1:'Private 1 คน — 8,990 บาท',private2:'Private 2 คน — 5,990 บาท/คน',private3:'Private 3 คน — 4,990 บาท/คน'};
  if(!prices[p.courseCode])throw new Error('แพ็กเกจไม่ถูกต้อง');
  const sh=sheet_();
  // idempotent: don't duplicate if user clicks submit twice
  if(findRowMaybe_(sh,p.registrationId)) return {ok:true,registrationId:p.registrationId,amount:prices[p.courseCode]};
  const now=new Date();
  sh.appendRow([now,p.registrationId,p.name,p.phone,p.line||'',p.email||'',p.courseCode,labels[p.courseCode],prices[p.courseCode],'รอชำระเงิน','',p.experience||'',parseArr_(p.tools),p.otherAI||'',p.goalType||'',p.style||'',p.idea||'',p.device||'',p.ram||'',parseArr_(p.subs),parseArr_(p.days),parseArr_(p.times),p.firstProject||'','','','รอนัดหมาย','',now,'','']);
  SpreadsheetApp.flush(); return {ok:true,registrationId:p.registrationId,amount:prices[p.courseCode]};
}
function confirmPayment_(p){
  if(!p.registrationId||!p.fileBase64)throw new Error('ข้อมูลการชำระเงินไม่ครบ');
  const sh=sheet_(),row=findRow_(sh,p.registrationId),bytes=Utilities.base64Decode(p.fileBase64);
  const blob=Utilities.newBlob(bytes,p.mimeType||'application/octet-stream',sanitize_(p.fileName||'slip'));
  const fs=DriveApp.getFoldersByName(SLIP_FOLDER_NAME),folder=fs.hasNext()?fs.next():DriveApp.createFolder(SLIP_FOLDER_NAME),file=folder.createFile(blob);
  file.setDescription('Registration ID: '+p.registrationId); sh.getRange(row,10,1,2).setValues([['รอตรวจสอบ',file.getUrl()]]); sh.getRange(row,28).setValue(new Date()); SpreadsheetApp.flush(); return {ok:true,registrationId:p.registrationId};
}
function getAdminData(){const sh=sheet_(),v=sh.getDataRange().getDisplayValues(),h=v[0]||[];return {headers:h,rows:v.slice(1).filter(r=>r[1]).map(r=>Object.fromEntries(h.map((x,i)=>[x,r[i]||'']))),updatedAt:new Date().toISOString()}}
function saveAppointment(p){return saveAppointment_(p)}
function saveAppointment_(p){if(!p.registrationId)throw new Error('ไม่มี Registration ID');const allowed=['รอนัดหมาย','ยืนยันแล้ว','เรียนแล้ว','เลื่อนนัด','ยกเลิก'];if(!allowed.includes(p.status||'รอนัดหมาย'))throw new Error('สถานะนัดไม่ถูกต้อง');const sh=sheet_(),row=findRow_(sh,p.registrationId);sh.getRange(row,24,1,5).setValues([[p.date||'',p.time||'',p.status||'รอนัดหมาย',p.note||'',new Date()]]);sh.getRange(row,29).setValue(Session.getActiveUser().getEmail()||'admin');SpreadsheetApp.flush();return {ok:true}}
function findRowMaybe_(sh,id){const n=sh.getLastRow();if(n<2)return 0;const a=sh.getRange(2,2,n-1,1).getDisplayValues().flat(),i=a.indexOf(String(id));return i<0?0:i+2}
function findRow_(sh,id){const r=findRowMaybe_(sh,id);if(!r)throw new Error('ไม่พบ Registration ID');return r}
function sanitize_(s){return String(s).replace(/[^a-zA-Z0-9ก-๙._-]/g,'_').slice(0,100)}
function json_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)}
