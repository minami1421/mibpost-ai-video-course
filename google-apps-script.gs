function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const data = JSON.parse(e.postData.contents);

    let slipUrl = "";
    if (data.slipDataUrl) {
      const match = String(data.slipDataUrl).match(/^data:([^;]+);base64,(.+)$/);
      if (!match) throw new Error("รูปแบบไฟล์สลิปไม่ถูกต้อง");

      const mimeType = match[1];
      const bytes = Utilities.base64Decode(match[2]);
      const folderName = "AI Video Course Slips";
      const folders = DriveApp.getFoldersByName(folderName);
      const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

      const safeName = (data.registrationId || "registration") + "-" + (data.slipName || "slip");
      const blob = Utilities.newBlob(bytes, mimeType, safeName);
      const file = folder.createFile(blob);
      slipUrl = file.getUrl();
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "วันที่สมัคร","Registration ID","ชื่อ-นามสกุล","เบอร์โทร","LINE","Email",
        "คอร์สที่เลือก","จำนวนผู้เรียน Private","ยอดชำระ","สถานะการชำระ",
        "Slip URL","ทราบจากช่องทาง","ผู้แนะนำ",
        "Facebook","Instagram","TikTok","YouTube",
        "ประสบการณ์ตัดต่อ","โปรแกรมตัดต่อที่ใช้","โปรแกรมอื่น ๆ",
        "ระดับการใช้ AI","AI ที่เคยใช้","AI อื่น ๆ",
        "เป้าหมายที่มาเรียน","เป้าหมายอื่น ๆ","อยากให้ AI ช่วยอะไรเป็นพิเศษ","หมายเหตุรวม"
      ]);
    }

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
        message: String(error)
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}