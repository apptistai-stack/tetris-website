// Configuration
// Paste your Web App URL here after deploying the Google Apps Script
// Example: 'https://script.google.com/macros/s/AKfycbx.../exec'
export const SCRIPT_URL = '';

export async function submitScore(name, score) {
    if (!SCRIPT_URL) {
        console.warn("Google Sheets Integration: SCRIPT_URL is not set.");
        return;
    }

    try {
        // We use 'no-cors' mode or simple POST. 
        // Note: Google Apps Script Web Apps with CORS can be tricky. 
        // Usually plain POST with text/plain body works best to avoid preflight issues if sending JSON.
        // Or using fetch with 'mode: no-cors' means we can't read the response, but the write happens.
        // For a public 'Anyone' script, standard POST often requires handling redirects.

        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Often necessary for GAS Web Apps called from client
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify({ name, score })
        });
        console.log("Score submitted via Google Sheets");
    } catch (e) {
        console.error("Error submitting score:", e);
    }
}

export async function getLeaderboard() {
    if (!SCRIPT_URL) return [];

    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        return data;
    } catch (e) {
        console.error("Error fetching leaderboard:", e);
        return [];
    }
}
