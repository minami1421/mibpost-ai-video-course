const SHEET_NAME = "Registrations";
const SLIP_FOLDER_NAME = "AI Video Course Slips";

const HEADERS = [
  "วันที่สมัคร",
  "Registration ID",
  "ชื่อ-นามสกุล",
  "เบอร์โทร",
  "LINE",
  "Email",
  "คอร์สที่เลือก",
  "จำนวนผู้เรียน Private",
  "ยอดชำระ",
  "สถานะการชำระ",
  "Slip URL",
  "ทราบจากช่องทาง",
  "ผู้แนะนำ",
  "Facebook",
  "Instagram",
  "TikTok",
  "YouTube",
  "ประสบการณ์ตัดต่อ",
  "โปรแกรมตัดต่อที่ใช้",
  "โปรแกรมอื่น ๆ",
  "ระดับการใช้ AI",
  "AI ที่เคยใช้",
  "AI อื่น ๆ",
  "เป้าหมายที่มาเรียน",
  "เป้าหมายอื่น ๆ",
  "วันที่สะดวกเรียน",
  "ช่วงเวลาที่สะดวกเรียน",
  "อยากให้ AI ช่วยอะไรเป็นพิเศษ",
  "หมายเหตุรวม"
];

function getRegistrationSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setFontWeight("bold")
    .setBackground("#d9ead3");
  sheet.setFrozenRows(1);

  return sheet;
}

function getSlipFolder_() {
  const folders = DriveApp.getFoldersByName(SLIP_FOLDER_NAME);
  return folders.hasNext()
    ? folders.next()
    : DriveApp.createFolder(SLIP_FOLDER_NAME);
}

function saveSlip_(data) {
  if (!data.slipDataUrl) {
    throw new Error("ไม่พบไฟล์สลิป");
  }

  const match = String(data.slipDataUrl)
    .match(/^data:([^;]+);base64,(.+)$/);

  if (!match) {
    throw new Error("รูปแบบไฟล์สลิปไม่ถูกต้อง");
  }

  const mimeType = match[1];
  const bytes = Utilities.base64Decode(match[2]);

  if (bytes.length > 8 * 1024 * 1024) {
    throw new Error("ไฟล์สลิปเกิน 8 MB");
  }

  const folder = getSlipFolder_();
  const registrationId = data.registrationId || Utilities.getUuid();

  const originalName = String(data.slipName || "slip")
    .replace(/[^\w.\-ก-๙ ]/g, "_");

  const file = folder.createFile(
    Utilities.newBlob(
      bytes,
      mimeType,
      registrationId + "-" + originalName
    )
  );

  return file.getUrl();
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("ไม่พบข้อมูลที่ส่งมา");
    }

    const data = JSON.parse(e.postData.contents);
    const sheet = getRegistrationSheet_();
    const slipUrl = saveSlip_(data);

    sheet.appendRow([
      new Date(),
      data.registrationId || "",
      data.fullName || "",
      data.phone || "",
      data.line || "",
      data.email || "",
      data.course || "",
      data.privatePeople || "",
      data.amount || "",
      data.paymentStatus || "รอตรวจสอบ",
      slipUrl,
      data.source || "",
      data.referrer || "",
      data.facebook || "",
      data.instagram || "",
      data.tiktok || "",
      data.youtube || "",
      data.editingExperience || "",
      data.editingSoftware || "",
      data.editingSoftwareOther || "",
      data.aiExperience || "",
      data.aiTools || "",
      data.aiToolsOther || "",
      data.learningGoal || "",
      data.learningGoalOther || "",
      data.preferredDays || "",
      data.preferredTimes || "",
      data.goal || "",
      data.note || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        registrationId: data.registrationId || "",
        slipUrl: slipUrl
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: String(error && error.message ? error.message : error)
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function setupRegistrationSystem() {
  const sheet = getRegistrationSheet_();
  const folder = getSlipFolder_();

  Logger.log("Sheet: " + sheet.getName());
  Logger.log("Slip Folder: " + folder.getUrl());
}
