// Google Apps Script Code
// 1. Create a new Google Sheet
// 2. Go to Extensions > Apps Script
// 3. Paste this code into 'Code.gs'
// 4. Save and Deploy > New Deployment
// 5. Select type: Web App
// 6. Execute as: Me (your email)
// 7. Who has access: Anyone (to allow the game to post scores)
// 8. Copy the 'Web App URL' and paste it into src/integrations/sheets.js

const SHEET_NAME = 'Leaderboard';

function doGet(e) {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();

    // Assoc array structure
    const headers = data[0]; // Assuming Row 1 is headers: Name, Score, Date
    const rows = data.slice(1);

    // Sort by Score (column index 1), descending
    rows.sort((a, b) => b[1] - a[1]);

    // Take top 10
    const top10 = rows.slice(0, 10).map(row => ({
        name: row[0],
        score: row[1],
        date: row[2]
    }));

    return ContentService.createTextOutput(JSON.stringify(top10))
        .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
    try {
        const params = JSON.parse(e.postData.contents);
        const name = params.name || 'Anonymous';
        const score = parseInt(params.score, 10) || 0;
        const date = new Date().toISOString();

        const sheet = getSheet();
        sheet.appendRow([name, score, date]);

        return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function getSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME);
        sheet.appendRow(['Name', 'Score', 'Date']);
    }
    return sheet;
}
