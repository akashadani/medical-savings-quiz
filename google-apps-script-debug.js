const SPREADSHEET_ID = "19g0Bf1QgAnZeFkfxXV0ELrUJjvs3zg4EvIGAmdZOTtY";
const SHEET_NAME = "MedicalSavingsQuiz";

function doPost(e) {
  try {
    Logger.log("=== START doPost ===");

    // Parse the POST data
    let data;
    if (e.postData && e.postData.type === "application/json") {
      data = JSON.parse(e.postData.contents);
      Logger.log("Parsed JSON data: " + JSON.stringify(data));
    } else {
      data = e.parameter;
      Logger.log("Using parameter data: " + JSON.stringify(data));
    }

    const sessionId = data.session_id;
    Logger.log("Session ID: " + sessionId);

    if (!sessionId) {
      Logger.log("ERROR: No session ID");
      return createResponse(false, "Session ID is required");
    }

    // Get or create the sheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    Logger.log("Sheet found: " + (sheet !== null));

    if (!sheet) {
      Logger.log("Creating new sheet");
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.appendRow(["session_id", "started_at", "last_updated", "current_question", "situation"]);
      sheet.setFrozenRows(1);
    }

    // Find existing row by session_id
    const allData = sheet.getDataRange().getValues();
    Logger.log("Total rows in sheet: " + allData.length);

    let existingRowIndex = -1;
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][0] === sessionId) {
        existingRowIndex = i + 1;
        Logger.log("Found existing row at index: " + existingRowIndex);
        break;
      }
    }

    const now = new Date();

    if (existingRowIndex > 0) {
      // Update existing row
      Logger.log("Updating existing row " + existingRowIndex);
      const range = sheet.getRange(existingRowIndex, 1, 1, 5);
      range.setValues([[
        sessionId,
        allData[existingRowIndex - 1][1], // keep original started_at
        now,
        data.current_question || "",
        data.situation || ""
      ]]);
      Logger.log("Row updated successfully");
      return createResponse(true, "Progress updated");
    } else {
      // Create new row
      Logger.log("Creating new row");
      const rowData = [
        sessionId,
        now,
        now,
        data.current_question || "",
        data.situation || ""
      ];
      Logger.log("Row data to append: " + JSON.stringify(rowData));
      sheet.appendRow(rowData);
      Logger.log("Row appended successfully");
      return createResponse(true, "Session started");
    }

  } catch (error) {
    Logger.log("ERROR: " + error.toString());
    Logger.log("Stack: " + error.stack);
    return createResponse(false, "Error: " + error.toString());
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("");
}

function createResponse(success, message) {
  return ContentService.createTextOutput(
    JSON.stringify({
      success: success,
      message: message,
    })
  ).setMimeType(ContentService.MimeType.JSON);
}
