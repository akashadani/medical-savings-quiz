# Progressive Quiz Tracking System

## Overview

This quiz uses **progressive tracking** to monitor user journeys through each question. The system maintains **one row per user** in Google Sheets, updating it after each question is answered.

## Key Features

✅ **One Row Per User** - Each user session gets a unique ID and one row
✅ **Real-Time Updates** - Row updates after every question answered
✅ **Drop-Off Tracking** - See exactly where users abandon the quiz
✅ **Branching Logic** - Blank cells show questions not displayed (due to conditional logic)
✅ **Complete Journey** - Track from first question to email submission

## How It Works

### 1. Session Creation (Quiz Start)

When a user starts the quiz:
- A unique `session_id` is generated (e.g., `lp2x8zq-abc123`)
- Stored in browser localStorage to persist across page refreshes
- First question answer creates a new row in Google Sheets

### 2. Progressive Updates (Each Question)

After every question is answered:
- The same row is updated with the new answer
- `last_updated` timestamp is refreshed
- `current_question` field shows their progress
- All previous answers are preserved

### 3. Final Submission (Results Page)

When user submits email:
- Row is updated with email, name, phone
- `completed` field is set to "yes"
- Savings estimates are added
- Full JSON data is stored

## Google Sheet Structure

### Tracking Columns

| Column | Description | Example |
|--------|-------------|---------|
| session_id | Unique identifier | lp2x8zq-abc123 |
| started_at | When quiz began | 2025-12-09 10:30:15 |
| last_updated | Last interaction time | 2025-12-09 10:35:42 |
| current_question | Last answered question | delivery_type |
| completed | Quiz completion status | yes / blank |
| drop_off_point | Where they abandoned | (future feature) |

### Contact Info Columns

| Column | Description | When Filled |
|--------|-------------|-------------|
| email | User's email | At results submission |
| name | User's name (optional) | At results submission |
| phone | User's phone (optional) | At results submission |

### Quiz Answer Columns

All possible quiz questions appear as columns:

| Column | Description | Branching Behavior |
|--------|-------------|-------------------|
| situation | Current situation | Always shown |
| expected_delivery | Expected delivery type | Only if `situation = pregnant` |
| delivery_type | Actual delivery type | Only if `situation = baby` |
| multiples | Twins, triplets, etc. | Only if `situation = baby/pregnant` |
| complications | Pregnancy complications | Conditional based on situation |
| hospital_services | Services used | Array, shown if applicable |
| in_network | Hospital network status | Always shown |
| total_billed | Amount billed | Always shown |
| your_responsibility | Amount responsible for | Always shown |
| past_bills | Previous bills | Conditional |
| financial_hardship | Hardship indicators | Array, always shown |
| actions_taken | Actions already taken | Array, always shown |
| red_flags | Red flag indicators | Array, always shown |
| ... | (all 20+ questions) | ... |

### Results Columns

| Column | Description | When Filled |
|--------|-------------|-------------|
| savings_min | Minimum savings estimate | At results submission |
| savings_max | Maximum savings estimate | At results submission |
| urgency_level | normal/high/critical | At results submission |
| full_answers_json | Complete answers (JSON) | At results submission |
| savings_breakdown_json | Detailed breakdown (JSON) | At results submission |

## Understanding Branching Logic

### Example 1: Pregnant User

```
| session_id | situation | expected_delivery | delivery_type | past_bills |
|------------|-----------|-------------------|---------------|------------|
| abc123     | pregnant  | planned_csection  | [BLANK]       | no         |
```

**Why is `delivery_type` blank?**
- This question only shows if `situation = "baby"` (already delivered)
- Pregnant users skip it because they haven't delivered yet

### Example 2: Already Had Baby

```
| session_id | situation | expected_delivery | delivery_type | past_bills |
|------------|-----------|-------------------|---------------|------------|
| xyz789     | baby      | [BLANK]          | c_section     | yes        |
```

**Why is `expected_delivery` blank?**
- This question only shows if `situation = "pregnant"`
- Users who already had a baby skip it

### Example 3: Drop-Off

```
| session_id | started_at | last_updated | current_question | completed | situation | delivery_type |
|------------|------------|--------------|------------------|-----------|-----------|---------------|
| def456     | 10:30:15   | 10:31:22     | situation        |           | baby      | [BLANK]       |
```

**What happened?**
- User started at 10:30:15
- Answered "situation" question at 10:31:22
- Never answered the next question
- `completed` is blank = abandoned
- `current_question` shows they stopped after "situation"

## Analyzing the Data

### Calculate Completion Rate

```
Completion Rate = (Rows with completed = "yes") / (Total Rows)
```

### Find Drop-Off Points

Sort by `current_question` for incomplete rows:

```
| current_question | Count | Drop-Off Rate |
|------------------|-------|---------------|
| situation        | 45    | 15%           |
| delivery_type    | 32    | 11%           |
| in_network       | 28    | 9%            |
| your_responsibility | 41 | 14%           |
```

### Identify Conversion Funnel

```
1. Started Quiz: COUNT(session_id)
2. Answered Q1: COUNT(situation != blank)
3. Answered Q5: COUNT(in_network != blank)
4. Reached Results: COUNT(savings_min != blank)
5. Submitted Email: COUNT(email != blank AND completed = "yes")
```

### Segment by User Type

Filter by `situation` column:

```
- Pregnant users: situation = "pregnant"
- New parents: situation = "baby"
- ER visits: situation = "er"
- Chronic conditions: situation = "chronic"
```

## Understanding Data Gaps

### Intentional Blanks (Branching Logic)

These are NORMAL and expected:

1. **Conditional Questions**: Questions that don't apply to user's situation
   - Example: `expected_delivery` is blank for users who already had baby

2. **Not Yet Answered**: Questions the user hasn't reached yet
   - Example: User just started, only `situation` is filled

3. **Optional Fields**: User chose not to provide
   - Example: Name and phone are optional at results

### Concerning Blanks (Drop-Offs)

These indicate problems:

1. **Abrupt Stop**: User answered several questions, then nothing
   - Check `last_updated` - long time ago?
   - Check `current_question` - where did they stop?

2. **No Email**: User reached results but didn't submit
   - `savings_min` is filled but `email` is blank
   - `completed` is blank

## Data Export & Analysis

### Export to Excel/CSV

1. In Google Sheets, go to **File > Download > CSV**
2. Open in Excel or data analysis tool
3. Use pivot tables to analyze:
   - Completion rates by question
   - Drop-off points
   - Time to complete
   - Conversion by segment

### Connect to Data Studio/Looker

1. In Google Sheets, click **Data > Data Studio**
2. Create dashboard with:
   - Completion funnel chart
   - Drop-off heatmap by question
   - Time-to-complete distribution
   - Conversion rate by traffic source

## Troubleshooting

### Row Not Updating

**Check 1**: Verify Google Script URL is configured
```bash
# In .env.local:
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/[ID]/exec
```

**Check 2**: Check browser console for errors
- Open DevTools (F12)
- Look for "Progress submitted" messages
- Check for any fetch errors

**Check 3**: Verify Google Apps Script deployment
- Go to Apps Script editor
- Check "Executions" tab for errors
- Ensure "Who has access" is set to "Anyone"

### Duplicate Rows for Same User

This shouldn't happen but if it does:

**Cause**: User cleared browser cache or used incognito mode

**Solution**:
- Filter by email to group duplicates
- Keep the row with `completed = "yes"`
- Merge data manually if needed

### Session ID Not Persisting

**Cause**: User has cookies/localStorage disabled

**Impact**: New session ID on each page refresh

**Solution**: Inform user they need to enable cookies for best experience

## Privacy & Security

### Data Retention

- Session IDs are random and don't contain personal info
- Personal data (email, name, phone) only added at final submission
- Quiz answers may contain health information (HIPAA considerations)

### Recommendations

1. **Add Privacy Policy Link** to quiz
2. **Encrypt Sensitive Data** at rest
3. **Set Data Retention Policy** (e.g., delete after 90 days)
4. **Restrict Sheet Access** to authorized team only
5. **Regular Audits** of who has sheet access

## Technical Implementation

### File Structure

```
lib/
  sessionManager.ts         # Session ID generation & storage
  quizContext.tsx           # Quiz state & progress submission

app/
  quiz/page.tsx             # Main quiz with progressive tracking
  results/page.tsx          # Final submission with contact info

google-apps-script-progressive.js  # Server-side sheet updates
```

### Key Functions

**`getOrCreateSessionId()`**
- Generates unique session ID
- Stores in localStorage
- Returns existing ID if present

**`submitProgress(question, completed, additionalAnswers)`**
- Called after each question answered
- Sends data to Google Apps Script
- Updates row in Google Sheets

**`doPost(e)` (Google Apps Script)**
- Receives data from quiz
- Finds row by session_id
- Updates or creates row
- Preserves existing data

## Future Enhancements

### Planned Features

1. **Drop-Off Email Recovery**
   - Capture email earlier in flow
   - Send reminder emails to incomplete sessions

2. **A/B Testing Support**
   - Track which variant user saw
   - Compare completion rates

3. **Time Tracking**
   - Time spent on each question
   - Identify confusing questions

4. **Browser Fingerprinting**
   - Alternative to session ID
   - Track across devices

## Questions?

If you encounter issues or have questions:

1. Check the browser console for errors
2. Review Google Apps Script execution logs
3. Verify all environment variables are set
4. Test with incognito mode for clean session
