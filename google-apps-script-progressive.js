/**
 * Google Apps Script for Medical Savings Quiz - Progressive Tracking
 *
 * This version tracks users through each question with ONE ROW PER USER.
 * Updates the same row after each question is answered.
 *
 * SETUP INSTRUCTIONS:
 *
 * 1. Open your Google Sheet:
 *    https://docs.google.com/spreadsheets/d/19g0Bf1QgAnZeFkfxXV0ELrUJjvs3zg4EvIGAmdZOTtY
 *
 * 2. Go to Extensions > Apps Script
 *
 * 3. Replace the entire code with this script
 *
 * 4. Save (Ctrl+S or Cmd+S)
 *
 * 5. Deploy:
 *    - Click "Deploy" > "Manage deployments" (or "New deployment" if first time)
 *    - Click pencil icon to edit OR gear icon to create new
 *    - Select "New version"
 *    - Click "Deploy"
 *
 * 6. Copy the Web App URL and add to your .env.local:
 *    NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/[ID]/exec
 *
 * SHEET STRUCTURE:
 * The sheet will have columns for:
 * - Session tracking (session_id, started_at, last_updated, current_question, completed, drop_off_point)
 * - Contact info (email, name, phone)
 * - All quiz questions (situation, delivery_type, multiples, etc.)
 * - Results (savings_min, savings_max, urgency_level)
 */

const SPREADSHEET_ID = "19g0Bf1QgAnZeFkfxXV0ELrUJjvs3zg4EvIGAmdZOTtY";
const SHEET_NAME = "MedicalSavingsQuiz";

// Define all possible question IDs (columns) in the order they should appear
const QUIZ_COLUMNS = [
  // Tracking columns
  "session_id",
  "started_at",
  "last_updated",
  "current_question",
  "completed",
  "drop_off_point",

  // Contact info (filled at end)
  "email",
  "name",
  "phone",
  "referral_source",

  // All quiz questions
  "situation",
  "expected_delivery",
  "delivery_type",
  "multiples",
  "complications",
  "hospital_services",
  "hospital_days",
  "procedures",
  "in_network",
  "surprise_bills",
  "air_ambulance",
  "total_billed",
  "your_responsibility",
  "past_bills",
  "insurance_type",
  "insurance_coverage",
  "financial_hardship",
  "charity_eligible",
  "payment_plan",
  "actions_taken",
  "red_flags",
  "contacted_billing",
  "itemized_bill",
  "medical_records",

  // Results (filled at end)
  "savings_min",
  "savings_max",
  "urgency_level",

  // Full JSON data
  "full_answers_json",
  "savings_breakdown_json"
];

function doPost(e) {
  // Use lock to prevent concurrent writes creating duplicate rows
  const lock = LockService.getScriptLock();

  try {
    // Wait up to 30 seconds for lock
    lock.waitLock(30000);

    // Parse the POST data
    let data;
    if (e.postData && e.postData.type === "application/json") {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    const sessionId = data.session_id;
    if (!sessionId) {
      return createResponse(false, "Session ID is required");
    }

    // Get or create the sheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      // Create new sheet with headers
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.appendRow(QUIZ_COLUMNS);
      // Freeze header row
      sheet.setFrozenRows(1);
    }

    // Find existing row by session_id (column A)
    // Use getRange to ensure we're getting the latest data
    const lastRow = sheet.getLastRow();
    let existingRowIndex = -1;

    if (lastRow > 1) { // More than just header row
      const sessionIdColumn = sheet.getRange(2, 1, lastRow - 1, 1).getValues();

      for (let i = 0; i < sessionIdColumn.length; i++) {
        const cellSessionId = String(sessionIdColumn[i][0]).trim();
        const searchSessionId = String(sessionId).trim();

        if (cellSessionId && searchSessionId && cellSessionId === searchSessionId) {
          existingRowIndex = i + 2; // +2 because array is 0-indexed and row 1 is header
          break;
        }
      }
    }

    // Prepare row data
    const now = new Date();
    const rowData = prepareRowData(data, existingRowIndex === -1, now);

    if (existingRowIndex > 0) {
      // Update existing row
      const existingRowData = sheet.getRange(existingRowIndex, 1, 1, QUIZ_COLUMNS.length).getValues()[0];
      updateRow(sheet, existingRowIndex, rowData, existingRowData);
      return createResponse(true, "Progress updated successfully");
    } else {
      // Create new row
      sheet.appendRow(rowData);
      return createResponse(true, "Session started successfully");
    }

  } catch (error) {
    return createResponse(false, "Error: " + error.toString());
  } finally {
    // Always release the lock
    lock.releaseLock();
  }
}

function prepareRowData(data, isNewSession, now) {
  const rowData = new Array(QUIZ_COLUMNS.length).fill("");

  // Map data to columns
  QUIZ_COLUMNS.forEach((columnName, index) => {
    if (columnName === "session_id") {
      rowData[index] = data.session_id || "";
    } else if (columnName === "started_at") {
      // Only set on new sessions
      if (isNewSession) {
        rowData[index] = now;
      }
    } else if (columnName === "last_updated") {
      rowData[index] = now;
    } else if (columnName === "current_question") {
      rowData[index] = data.current_question || "";
    } else if (columnName === "completed") {
      rowData[index] = data.completed ? "yes" : "";
    } else if (columnName === "drop_off_point") {
      // Only set if explicitly provided (for tracking drop-offs)
      rowData[index] = data.drop_off_point || "";
    } else if (data[columnName] !== undefined && data[columnName] !== null) {
      // Handle arrays (multi-select questions)
      if (Array.isArray(data[columnName])) {
        rowData[index] = data[columnName].join(", ");
      } else {
        rowData[index] = data[columnName];
      }
    }
  });

  return rowData;
}

function updateRow(sheet, rowIndex, newRowData, existingRowData) {
  // Merge new data with existing data (don't overwrite with empty values)
  const mergedData = existingRowData.map((existingValue, colIndex) => {
    const newValue = newRowData[colIndex];

    // Special handling for certain columns
    const columnName = QUIZ_COLUMNS[colIndex];

    if (columnName === "last_updated") {
      // Always update timestamp
      return newValue;
    } else if (columnName === "started_at") {
      // Never overwrite started_at
      return existingValue || newValue;
    } else if (newValue !== "" && newValue !== null && newValue !== undefined) {
      // Update with new value if it's not empty
      return newValue;
    } else {
      // Keep existing value
      return existingValue;
    }
  });

  // Update the row
  const range = sheet.getRange(rowIndex, 1, 1, mergedData.length);
  range.setValues([mergedData]);
}

// Handle GET requests (for testing in browser)
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      message: "Medical Savings Quiz Progressive Tracking API is running",
      timestamp: new Date().toISOString(),
      endpoints: {
        POST: "Submit quiz progress with session_id and answers"
      }
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

// Handle preflight requests (REQUIRED for CORS)
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
