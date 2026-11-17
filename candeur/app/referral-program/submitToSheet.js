

// Google Apps Script web app that stores referral submissions (see scripts/referral-sheet.gs).
// Paste the /exec URL of the NEW referral deployment here (not the register script's URL).
const SHEET_URL = "https://script.google.com/macros/s/AKfycbwmDVjbC7nnXoJvkhwgEo0xowoqwHi7wvgFZVRlq1XeAag2Rv2bwPmd009dY_WeVLjENA/exec";

export async function submitToSheet(data) {
  // URLSearchParams sends application/x-www-form-urlencoded, which Apps Script
  // reads as e.parameter. It is a "simple" request, so no CORS preflight is triggered.
  const response = await fetch(SHEET_URL, {
    method: "POST",
    body: new URLSearchParams(data),
  });

  let result;
  try {
    result = await response.json();
  } catch {
    return { success: false, message: "Unexpected response from the server. Please try again." };
  }

  if (result.result === "success") return { success: true };
  if (result.result === "duplicate") return { success: false, duplicate: true, message: result.message };
  return {
    success: false,
    message: result.message === "Invalid fields" ? "Please check the highlighted fields." : result.message,
  };
}