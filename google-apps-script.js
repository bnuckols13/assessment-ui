/**
 * Google Apps Script — Paste this into your Google Sheet's Apps Script editor.
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet (this will be your assessment results dashboard)
 * 2. Click Extensions > Apps Script
 * 3. Delete the default code and paste this entire file
 * 4. Click Deploy > New deployment
 * 5. Type: "Web app"
 * 6. Execute as: "Me"
 * 7. Who has access: "Anyone"
 * 8. Click Deploy and copy the URL
 * 9. Paste that URL into client-reflections.js as GOOGLE_SHEETS_WEBHOOK_URL
 *
 * The sheet will auto-create headers on the first submission.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var raw = e.postData.contents;
    // Handle both application/json and text/plain (from sendBeacon)
    var data = JSON.parse(raw);

    // Auto-create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp",
        "Client Name",
        "Gender",
        "Form",
        "Profile Elevation",
        "Safety Level",
        "Crisis Resource Shown",
        "High-Risk SI Count",
        // Validity scales
        "VRIN", "TRIN", "L", "F", "Fb", "Fp", "K", "S",
        // Clinical scales
        "Hs", "D", "Hy", "Pd", "Mf", "Pa", "Pt", "Sc", "Ma", "Si",
        // Content scales
        "ANX", "FRS", "OBS", "DEP", "HEA", "BIZ", "ANG", "CYN", "ASP", "TPA", "LSE", "SOD", "FAM", "WRK", "TRT",
        // Supplementary
        "A", "R", "Es", "MAC-R", "AAS", "APS", "MDS",
        // Summary
        "True Count",
        "False Count",
        "Cannot Say",
        "Critical Groups Endorsed",
        "Critical Group Names",
        "Answer String",
        "Report ID"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    // Extract scale T-scores into a lookup
    var tScores = {};
    var allScales = [].concat(
      data.scoring.inconsistencyResults || [],
      data.scoring.validityScales || [],
      data.scoring.clinicalScales || [],
      data.scoring.contentScales || [],
      data.scoring.supplementaryScales || []
    );
    allScales.forEach(function(s) {
      tScores[s.code] = s.tScore;
    });

    // Critical group names
    var criticalNames = (data.scoring.criticalItems || []).map(function(g) {
      return g.name;
    }).join("; ");

    // Build the row
    var row = [
      data.timestamp || new Date().toISOString(),
      data.client.clientName || "",
      data.client.gender || "",
      data.client.formLength || "",
      data.scoring.profileElevation,
      data.safetyFlags.level,
      data.safetyFlags.showCrisisResource,
      data.safetyFlags.endorsedHighRiskCount,
      // Validity
      tScores["VRIN"] || "", tScores["TRIN"] || "",
      tScores["L"] || "", tScores["F"] || "",
      tScores["Fb"] || "", tScores["Fp"] || "",
      tScores["K"] || "", tScores["S"] || "",
      // Clinical
      tScores["Hs"] || "", tScores["D"] || "",
      tScores["Hy"] || "", tScores["Pd"] || "",
      tScores["Mf"] || "", tScores["Pa"] || "",
      tScores["Pt"] || "", tScores["Sc"] || "",
      tScores["Ma"] || "", tScores["Si"] || "",
      // Content
      tScores["ANX"] || "", tScores["FRS"] || "",
      tScores["OBS"] || "", tScores["DEP"] || "",
      tScores["HEA"] || "", tScores["BIZ"] || "",
      tScores["ANG"] || "", tScores["CYN"] || "",
      tScores["ASP"] || "", tScores["TPA"] || "",
      tScores["LSE"] || "", tScores["SOD"] || "",
      tScores["FAM"] || "", tScores["WRK"] || "",
      tScores["TRT"] || "",
      // Supplementary
      tScores["A"] || "", tScores["R"] || "",
      tScores["Es"] || "", tScores["MAC-R"] || "",
      tScores["AAS"] || "", tScores["APS"] || "",
      tScores["MDS"] || "",
      // Summary
      data.scoring.counts.trueCount,
      data.scoring.counts.falseCount,
      data.scoring.counts.cantSay,
      (data.scoring.criticalItems || []).length,
      criticalNames,
      data.answerString || "",
      data.id || ""
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "ok", row: sheet.getLastRow() })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function — run this manually to verify the sheet writes correctly
function testDoPost() {
  var mockData = {
    postData: {
      contents: JSON.stringify({
        id: "test_123",
        timestamp: new Date().toISOString(),
        client: { clientName: "Test P", gender: "male", formLength: "short" },
        scoring: {
          profileElevation: 58.5,
          counts: { trueCount: 180, falseCount: 170, cantSay: 20 },
          inconsistencyResults: [
            { code: "VRIN", tScore: 52 },
            { code: "TRIN", tScore: 50 }
          ],
          validityScales: [
            { code: "L", tScore: 48 }, { code: "F", tScore: 62 },
            { code: "Fb", tScore: 55 }, { code: "Fp", tScore: 50 },
            { code: "K", tScore: 52 }, { code: "S", tScore: 46 }
          ],
          clinicalScales: [
            { code: "Hs", tScore: 55 }, { code: "D", tScore: 60 },
            { code: "Hy", tScore: 58 }, { code: "Pd", tScore: 62 },
            { code: "Mf", tScore: 45 }, { code: "Pa", tScore: 56 },
            { code: "Pt", tScore: 64 }, { code: "Sc", tScore: 58 },
            { code: "Ma", tScore: 52 }, { code: "Si", tScore: 50 }
          ],
          contentScales: [],
          supplementaryScales: [],
          criticalItems: [
            { name: "Acute Anxiety State" },
            { name: "Family Conflict" }
          ]
        },
        safetyFlags: {
          showCrisisResource: false, level: "none",
          endorsedHighRiskCount: 0
        },
        answerString: "TFTFTF..."
      })
    }
  };
  doPost(mockData);
}
