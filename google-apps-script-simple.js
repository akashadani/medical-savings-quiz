/**
 * Simple Google Apps Script - Final Submission Only
 * Records quiz results when user submits email
 */

const SPREADSHEET_ID = "19g0Bf1QgAnZeFkfxXV0ELrUJjvs3zg4EvIGAmdZOTtY";
const SHEET_NAME = "MedicalSavingsQuiz";

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    const data = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      sheet.appendRow([
        "Timestamp",
        "Email",
        "Name",
        "Phone",
        "Referral Source",
        "Situation",
        "Expected Delivery",
        "Delivery Type",
        "Multiples",
        "Complications",
        "Hospital Services",
        "Hospital Days",
        "Procedures",
        "In Network",
        "Surprise Bills",
        "Air Ambulance",
        "Total Billed",
        "Your Responsibility",
        "Past Bills",
        "Insurance Type",
        "Insurance Coverage",
        "Financial Hardship",
        "Charity Eligible",
        "Payment Plan",
        "Actions Taken",
        "Red Flags",
        "Contacted Billing",
        "Itemized Bill",
        "Medical Records",
        "Savings Min",
        "Savings Max",
        "Urgency Level",
        "Full JSON"
      ]);
      sheet.setFrozenRows(1);
    }

    // Helper to handle arrays
    const formatValue = (val) => {
      if (Array.isArray(val)) return val.join(", ");
      return val || "";
    };

    sheet.appendRow([
      new Date(),
      data.email || "",
      data.name || "",
      data.phone || "",
      formatValue(data.referral_source),
      formatValue(data.situation),
      formatValue(data.expected_delivery),
      formatValue(data.delivery_type),
      formatValue(data.multiples),
      formatValue(data.complications),
      formatValue(data.hospital_services),
      formatValue(data.hospital_days),
      formatValue(data.procedures),
      formatValue(data.in_network),
      formatValue(data.surprise_bills),
      formatValue(data.air_ambulance),
      formatValue(data.total_billed),
      formatValue(data.your_responsibility),
      formatValue(data.past_bills),
      formatValue(data.insurance_type),
      formatValue(data.insurance_coverage),
      formatValue(data.financial_hardship),
      formatValue(data.charity_eligible),
      formatValue(data.payment_plan),
      formatValue(data.actions_taken),
      formatValue(data.red_flags),
      formatValue(data.contacted_billing),
      formatValue(data.itemized_bill),
      formatValue(data.medical_records),
      data.savings_min || "",
      data.savings_max || "",
      data.urgency_level || "",
      JSON.stringify(data)
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      message: "Quiz API is running"
    })
  ).setMimeType(ContentService.MimeType.JSON);
}
