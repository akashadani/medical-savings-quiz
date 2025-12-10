/**
 * Google Apps Script for Medical Savings Quiz Lead Capture
 *
 * SETUP INSTRUCTIONS:
 *
 * 1. Create a new Google Sheet or use existing:
 *    https://docs.google.com/spreadsheets/d/19g0Bf1QgAnZeFkfxXV0ELrUJjvs3zg4EvIGAmdZOTtY
 *
 * 2. Go to Extensions > Apps Script
 *
 * 3. Copy and paste this entire script (or update existing doPost function)
 *
 * 4. Update the SPREADSHEET_ID if using a different sheet
 *
 * 5. Save (Ctrl+S or Cmd+S)
 *
 * 6. Deploy as web app:
 *    - Click "Deploy" > "New deployment" (or "Manage deployments" to update)
 *    - Click gear icon > Select "Web app"
 *    - Description: "Medical Savings Quiz Capture"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 *    - Click "Deploy"
 *    - Copy the Web App URL
 *
 * 7. Update the GOOGLE_SCRIPT_URL in app/results/page.tsx with your Web App URL
 *
 * 8. The "MedicalSavingsQuiz" sheet will be auto-created on first submission
 *
 * Sheet columns will include:
 * - Timestamp
 * - Email, Name, Phone
 * - Estimated Savings (Min-Max)
 * - Quiz Answers (all fields)
 */

// Your spreadsheet ID - update this if using a different sheet
const SPREADSHEET_ID = "19g0Bf1QgAnZeFkfxXV0ELrUJjvs3zg4EvIGAmdZOTtY";
const SHEET_NAME = "MedicalSavingsQuiz";

function doPost(e) {
  try {
    // Get the spreadsheet by ID
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

    // Get or create the MedicalSavingsQuiz sheet
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      // Create header row with all fields
      sheet.appendRow([
        "Timestamp",
        "Email",
        "Name",
        "Phone",
        "Referral Source",
        "Savings Min",
        "Savings Max",
        "Urgency Level",
        "Situation",
        "Delivery Type",
        "Multiples",
        "Complications",
        "Hospital Services",
        "In Network",
        "Total Billed",
        "Your Responsibility",
        "Past Bills",
        "Insurance Type",
        "Financial Hardship",
        "Actions Taken",
        "Red Flags",
        "Full Quiz Answers (JSON)",
        "Savings Breakdown (JSON)"
      ]);
    }

    // Parse the POST data
    let data;
    if (e.postData && e.postData.type === "application/json") {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    // Extract main fields
    const email = data.email;
    const name = data.name || "";
    const phone = data.phone || "";
    const referralSource = data.referral_source || "";
    const savingsMin = data.savings_min || data.savingsMin || 0;
    const savingsMax = data.savings_max || data.savingsMax || 0;
    const urgencyLevel = data.urgency_level || data.urgencyLevel || "normal";

    // Validate email
    if (!email || !email.trim()) {
      return createResponse(false, "Email is required");
    }

    // Check if email already exists in column B
    const allData = sheet.getDataRange().getValues();
    let existingRowIndex = -1;

    for (let i = 1; i < allData.length; i++) {
      if (allData[i][1] === email) {
        existingRowIndex = i + 1; // +1 because sheets are 1-indexed
        break;
      }
    }

    if (existingRowIndex > 0) {
      // Email exists - return message
      return createResponse(false, "Email already registered. We have your information!");
    }

    // Parse answers from JSON string if needed
    let answers = {};
    if (typeof data.answers === 'string') {
      try {
        answers = JSON.parse(data.answers);
      } catch (err) {
        answers = {};
      }
    } else {
      answers = data.answers || {};
    }

    // Parse breakdown from JSON string if needed
    let breakdown = [];
    if (typeof data.breakdown === 'string') {
      try {
        breakdown = JSON.parse(data.breakdown);
      } catch (err) {
        breakdown = [];
      }
    } else {
      breakdown = data.breakdown || [];
    }

    // Extract key quiz answers for easy filtering in sheets
    const situation = answers.situation || "";
    const deliveryType = answers.delivery_type || "";
    const multiples = answers.multiples || "";
    const complications = Array.isArray(answers.complications)
      ? answers.complications.join(", ")
      : answers.complications || "";
    const hospitalServices = Array.isArray(answers.hospital_services)
      ? answers.hospital_services.join(", ")
      : answers.hospital_services || "";
    const inNetwork = answers.in_network || "";
    const totalBilled = answers.total_billed || "";
    const yourResponsibility = answers.your_responsibility || "";
    const pastBills = answers.past_bills || "";
    const insuranceType = answers.insurance_type || "";
    const financialHardship = Array.isArray(answers.financial_hardship)
      ? answers.financial_hardship.join(", ")
      : answers.financial_hardship || "";
    const actionsTaken = Array.isArray(answers.actions_taken)
      ? answers.actions_taken.join(", ")
      : answers.actions_taken || "";
    const redFlags = Array.isArray(answers.red_flags)
      ? answers.red_flags.join(", ")
      : answers.red_flags || "";

    // Add new row with all data
    sheet.appendRow([
      new Date(),
      email,
      name,
      phone,
      referralSource,
      savingsMin,
      savingsMax,
      urgencyLevel,
      situation,
      deliveryType,
      multiples,
      complications,
      hospitalServices,
      inNetwork,
      totalBilled,
      yourResponsibility,
      pastBills,
      insuranceType,
      financialHardship,
      actionsTaken,
      redFlags,
      JSON.stringify(answers),
      JSON.stringify(breakdown)
    ]);

    return createResponse(true, "Successfully submitted! We'll be in touch soon.");

  } catch (error) {
    return createResponse(false, "Error: " + error.toString());
  }
}

// Handle preflight requests
function doOptions(e) {
  return ContentService.createTextOutput("");
}

// Helper function to create JSON response
function createResponse(success, message) {
  return ContentService.createTextOutput(
    JSON.stringify({
      success: success,
      message: message,
    })
  ).setMimeType(ContentService.MimeType.JSON);
}
