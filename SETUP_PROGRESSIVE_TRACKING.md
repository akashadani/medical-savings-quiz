# Quick Setup Guide: Progressive Quiz Tracking

## What's New?

Your quiz now tracks users progressively through each question with **one row per user** in Google Sheets. This gives you:

✅ **Drop-off tracking** - See exactly where users abandon
✅ **Funnel analysis** - Measure completion rates by question
✅ **Branching visibility** - Understand which questions users see
✅ **Complete journey** - Track from first click to email submission

## Setup Steps (5 minutes)

### Step 1: Update Google Apps Script

1. Open your Google Sheet:
   ```
   https://docs.google.com/spreadsheets/d/19g0Bf1QgAnZeFkfxXV0ELrUJjvs3zg4EvIGAmdZOTtY
   ```

2. Go to **Extensions > Apps Script**

3. **Replace the entire code** with the contents of:
   ```
   google-apps-script-progressive.js
   ```

4. Click **Save** (💾)

5. Click **Deploy > Manage deployments**
   - Click the pencil icon (✏️) to edit
   - Under "Version", select **New version**
   - Click **Deploy**
   - **Copy the Web App URL**

### Step 2: Configure Environment Variable

Create or update `.env.local` in the project root:

```bash
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Replace `YOUR_DEPLOYMENT_ID` with the ID from your Web App URL.

### Step 3: Redeploy (Already Done! ✅)

The app has been rebuilt and redeployed with progressive tracking:

**Live URL**: https://medical-savings-quiz.vercel.app

If you make changes to the environment variable, redeploy with:
```bash
npm run build
vercel --prod
```

## How to Test

### Test the Full Flow

1. Visit https://medical-savings-quiz.vercel.app

2. Start the quiz (this creates a session ID)

3. Answer a few questions

4. Open your Google Sheet and look for the "MedicalSavingsQuiz" tab

5. You should see a new row with:
   - Your session_id
   - started_at timestamp
   - Answers to questions you've completed
   - Blank cells for questions you haven't reached

6. Continue answering questions - watch the row update in real-time!

7. Submit your email on the results page

8. The row should now have:
   - Your email/name/phone
   - `completed` = "yes"
   - Savings estimates

### Test Drop-Off Tracking

1. Start the quiz in incognito mode

2. Answer 2-3 questions

3. Close the browser tab (abandon the quiz)

4. Check Google Sheet - you'll see:
   - Incomplete row (no email, `completed` is blank)
   - `last_updated` shows when they abandoned
   - `current_question` shows their last answered question
   - Some answer columns filled, rest are blank

## Understanding Your Data

### Sheet Structure

The Google Sheet will have these column groups:

**1. Tracking Columns**
```
session_id | started_at | last_updated | current_question | completed | drop_off_point
```

**2. Contact Info**
```
email | name | phone
```

**3. Quiz Answers (one column per question)**
```
situation | delivery_type | multiples | complications | hospital_services | ...
```
- **Filled cell** = User answered this question
- **Blank cell** = Question not shown (branching) OR user didn't reach it yet

**4. Results**
```
savings_min | savings_max | urgency_level | full_answers_json | savings_breakdown_json
```

### Example Rows

**Completed User:**
```
session_id: abc123
started_at: 2025-12-09 10:30:15
last_updated: 2025-12-09 10:35:42
current_question: results_submitted
completed: yes
email: john@example.com
situation: baby
delivery_type: c_section
multiples: twins
savings_min: 3500
savings_max: 8000
```

**Abandoned User:**
```
session_id: xyz789
started_at: 2025-12-09 11:15:22
last_updated: 2025-12-09 11:16:08
current_question: delivery_type
completed: [blank]
email: [blank]
situation: baby
delivery_type: c_section
multiples: [blank] (didn't reach this question)
```

**Pregnant User (Branching):**
```
session_id: def456
situation: pregnant
expected_delivery: planned_csection (conditional - only shown to pregnant users)
delivery_type: [blank] (not shown - they haven't delivered yet)
past_bills: no
```

## Analyzing Your Data

### Find Drop-Off Points

1. Filter by `completed` = blank (incomplete sessions)
2. Create a pivot table with `current_question` as rows
3. Count how many users dropped off at each question

This shows your "leaky" questions that cause abandonment.

### Calculate Completion Rate

```
Completion Rate = (Rows with completed = "yes") / (Total Rows)
```

### Measure Time to Complete

```
Time to Complete = last_updated - started_at
```

For completed users, this shows how long the quiz takes.

### Segment Users

Filter by `situation` to analyze different user types:

- **Pregnant** (`situation = "pregnant"`)
- **New Parents** (`situation = "baby"`)
- **ER Visits** (`situation = "er"`)
- **Chronic Conditions** (`situation = "chronic"`)

Compare completion rates and savings estimates across segments.

## Troubleshooting

### Not Seeing Data in Google Sheet?

**Check 1**: Verify the Google Script URL is set
```bash
echo $NEXT_PUBLIC_GOOGLE_SCRIPT_URL
```

**Check 2**: Open browser console (F12)
- Look for "Progress submitted" messages
- Check for any errors

**Check 3**: Check Google Apps Script logs
- Go to Apps Script editor
- Click "Executions" in left sidebar
- Look for errors

### Multiple Rows for Same User?

This can happen if:
- User cleared browser cache mid-quiz
- User used incognito mode
- Different devices/browsers

Solution: Filter by email to identify duplicates and merge manually.

### Session Not Persisting?

Make sure cookies/localStorage is enabled in the browser.

## Privacy Considerations

- Session IDs are random and contain no personal information
- Quiz answers may contain health data (HIPAA considerations)
- Email/name/phone only collected at final submission
- Restrict Google Sheet access to authorized team members only

## Next Steps

Now that you have progressive tracking:

1. **Monitor Drop-Offs**: Check daily for high-abandon questions
2. **A/B Test**: Try different question wording to improve completion
3. **Email Recovery**: Reach out to users who abandoned (if you captured email earlier)
4. **Funnel Optimization**: Focus on improving your weakest conversion points

## Documentation

For more details:

- **PROGRESSIVE_TRACKING_GUIDE.md** - Complete technical documentation
- **GOOGLE_SHEETS_SETUP.md** - Original setup guide (still relevant for basics)
- **google-apps-script-progressive.js** - Server-side code with comments

## Support

If you encounter issues:

1. Check browser console for client-side errors
2. Check Apps Script execution logs for server errors
3. Verify environment variables are set correctly
4. Test in incognito mode for clean session

---

**Current Deployment**: https://medical-savings-quiz.vercel.app
**Last Updated**: 2025-12-09
