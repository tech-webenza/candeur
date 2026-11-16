// Google Apps Script that stores /register form submissions in a Google Sheet.
// It runs inside Google, not in this project. Setup:
//
//   1. Create a sheet at https://sheets.new, then open Extensions > Apps Script.
//   2. Replace the editor contents with this file and save.
//   3. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
//   4. Copy the web app URL into SHEET_URL in app/register/submitToSheet.js.
//   5. Run npm run build and deploy the site.
//
// After changing this script: Deploy > Manage deployments > Edit > New version.
// The URL stays the same.

const SHEET_NAME = "Registrations";
const HEADERS = ["Submitted At", "Name", "Email", "Mobile", "Company"];

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (error) {
    return respond(false, "Invalid request.");
  }

  // The endpoint is public, so the form's rules are enforced again here.
  const name = text(data.name, 100);
  const email = text(data.email, 254);
  const phone = text(data.mobile, 10);
  const company = text(data.company, 120);

  if (
    name.length < 2 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ||
    !/^[6-9]\d{9}$/.test(phone) ||
    company.length < 2
  ) {
    return respond(false, "Please check your details and try again.");
  }

  // Keeps simultaneous submissions from overwriting the same row.
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    getSheet().appendRow([new Date(), safe(name), safe(email), phone, safe(company)]);
    return respond(true, "Saved.");
  } catch (error) {
    console.error(error);
    return respond(false, "Unable to submit your details. Please try again.");
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function text(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

// Stops submitted text like =IMPORTXML(...) from running as a formula in the sheet.
function safe(value) {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

function respond(success, message) {
  return ContentService.createTextOutput(JSON.stringify({ success, message })).setMimeType(
    ContentService.MimeType.JSON
  );
}
