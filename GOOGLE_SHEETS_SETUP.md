# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration to capture quiz results and lead information.

## Overview

When users complete the quiz and submit their email, all their information will be automatically sent to a Google Sheet including:
- Contact info (email, name, phone)
- Estimated savings (min-max range)
- Urgency level
- All quiz answers
- Savings breakdown by category

## Step 1: Prepare Your Google Sheet

1. Go to your existing Google Sheet:
   - https://docs.google.com/spreadsheets/d/19g0Bf1QgAnZeFkfxXV0ELrUJjvs3zg4EvIGAmdZOTtY
   - Or create a new Google Sheet if you prefer

2. The script will automatically create a new sheet tab called "MedicalSavingsQuiz" with all the necessary columns on the first submission.

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, go to **Extensions > Apps Script**

2. You'll see the Apps Script editor open with a `doPost` function

3. Copy the entire contents of `google-apps-script.js` from this project

4. Paste it into the Apps Script editor (you can replace the existing `doPost` function or add it if using a new project)

5. Update the `SPREADSHEET_ID` constant if you're using a different sheet:
   ```javascript
   const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
   ```
   (The ID is in the URL: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`)

6. Click **Save** (💾 icon or Ctrl+S / Cmd+S)

## Step 3: Deploy as Web App

1. In the Apps Script editor, click **Deploy > New deployment**

2. Click the gear icon ⚙️ next to "Select type"

3. Choose **Web app**

4. Configure the deployment:
   - **Description**: "Medical Savings Quiz Capture" (or any name you prefer)
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone

5. Click **Deploy**

6. Review and authorize:
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" > "Go to [Project Name] (unsafe)" if you see a warning
   - Click "Allow"

7. **Copy the Web App URL** - you'll need this in the next step!
   - It will look like: `https://script.google.com/macros/s/[LONG_ID]/exec`

## Step 4: Update Your Next.js App

### Option A: Using Environment Variable (Recommended)

1. Create a `.env.local` file in the project root (if it doesn't exist)

2. Add this line with your Web App URL:
   ```
   NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

### Option B: Hardcode the URL

1. Open `app/results/page.tsx`

2. Find this line (around line 41):
   ```typescript
   const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
     'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```

3. Replace `'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'` with your actual Web App URL:
   ```typescript
   const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
     'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
   ```

## Step 5: Rebuild and Redeploy

After updating the configuration:

1. Rebuild the app:
   ```bash
   npm run build
   ```

2. Redeploy to Vercel:
   ```bash
   vercel --prod
   ```

## Step 6: Test the Integration

1. Visit your deployed app: https://medical-savings-quiz.vercel.app

2. Complete the quiz

3. Submit your email on the results page

4. Check your Google Sheet - you should see a new row in the "MedicalSavingsQuiz" tab!

## What Data is Captured?

The Google Sheet will include these columns:

| Column | Description |
|--------|-------------|
| Timestamp | When the form was submitted |
| Email | User's email address (required) |
| Name | User's name (optional) |
| Phone | User's phone number (optional) |
| Savings Min | Minimum estimated savings |
| Savings Max | Maximum estimated savings |
| Urgency Level | normal, high, or critical |
| Situation | baby, pregnant, hospital stay, etc. |
| Delivery Type | vaginal, c-section, etc. |
| Multiples | none, twins, triplets+ |
| Complications | List of pregnancy complications |
| Hospital Services | List of hospital services used |
| In Network | yes, no, not_sure |
| Total Billed | Amount billed by hospital |
| Your Responsibility | Amount user is responsible for |
| Past Bills | yes, no |
| Insurance Type | Type of insurance |
| Financial Hardship | Financial hardship indicators |
| Actions Taken | Actions already taken |
| Red Flags | Red flag indicators |
| Full Quiz Answers (JSON) | Complete quiz answers in JSON format |
| Savings Breakdown (JSON) | Detailed savings breakdown by category |

## Troubleshooting

### "Email already registered" message

The script checks for duplicate emails. If you want to allow duplicate submissions, you can remove this check from the Google Apps Script.

### Form doesn't submit

1. Check the browser console for errors
2. Verify the Web App URL is correct
3. Make sure the Apps Script is deployed with "Anyone" access
4. Check that the spreadsheet ID is correct in the script

### Data not appearing in sheet

1. Check the Apps Script execution logs:
   - Go to Extensions > Apps Script
   - Click "Executions" in the left sidebar
   - Look for any errors

2. Verify the sheet permissions - make sure your account has edit access

### Need to Update the Script?

If you make changes to the Google Apps Script:

1. Save your changes in the Apps Script editor
2. Go to **Deploy > Manage deployments**
3. Click the pencil icon ✏️ to edit the deployment
4. Under "Version", select **New version**
5. Click **Deploy**

The Web App URL will stay the same, so you don't need to update your app.

## Security Notes

- The Web App URL is public but can only write to your specific Google Sheet
- Email addresses are checked for duplicates to prevent spam
- The script uses CORS headers to allow requests from any domain
- All data is stored in your private Google Sheet that only you can access

## Questions?

If you run into any issues, check:
1. The Google Apps Script execution logs for errors
2. The browser console for client-side errors
3. The Vercel deployment logs for build errors
