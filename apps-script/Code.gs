// Paste this into the Apps Script editor bound to your Google Sheet
// (Extensions > Apps Script). See README.md for full setup steps.

const SHEET_NAME = "Signups";

// Must match the CLASSES array in schedule.js.
const CLASSES = [
  "Beginner Build",
  "Beginner Code",
  "Beginner Notebook",
  "Strategy",
  "Advanced Build",
  "Advanced Code",
  "Advanced Notebook",
  "Engage (IQ)"
];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    const headers = ["Timestamp", "Name", "Team", "Years of Robotics Experience"].concat(CLASSES);
    sheet.appendRow(headers);
  }
  return sheet;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet_();

    const row = [new Date(), data.name || "", data.team || "", data.experience || ""].concat(
      CLASSES.map((className) => data[className] || "")
    );

    sheet.appendRow(row);

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
