// Google Apps Script web app that stores submissions (see scripts/register-sheet.gs).
const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbzyXXXUHhxrtd4taW0MAAlureojYgZBhYI8hBH0SFvDRbZhMZ6A7t-fHU7mulBYenQCeA/exec";

export async function submitToSheet(data) {
  const response = await fetch(SHEET_URL, {
    method: "POST",
    headers: {
      // Apps Script can't answer a CORS preflight, which application/json would trigger.
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return { success: response.ok && result.success === true, message: result.message };
}
