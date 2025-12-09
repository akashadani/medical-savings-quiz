# Quick Deployment Guide

## Deploy to Vercel (Recommended)

### Method 1: Using Vercel CLI (Fastest)

1. Install dependencies:
```bash
cd medical-savings-quiz
npm install
```

2. Install Vercel CLI globally:
```bash
npm i -g vercel
```

3. Login to Vercel:
```bash
vercel login
```

4. Deploy:
```bash
vercel --prod
```

5. Follow the prompts:
   - Link to existing project? **No**
   - Project name? **medical-savings-quiz** (or your preferred name)
   - Directory? **./** (press Enter)
   - Build settings? **Yes** (use defaults)

Your quiz will be live at: `https://medical-savings-quiz-xxxx.vercel.app`

### Method 2: Using Vercel Dashboard

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit - Medical Savings Quiz"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com/new)

3. Import your GitHub repository

4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `out`

5. Click **Deploy**

Your quiz will be live in ~2 minutes!

## Custom Domain Setup

After deploying:

1. Go to your project settings on Vercel
2. Navigate to **Domains**
3. Add your custom domain (e.g., `quiz.billrelief.com`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic, takes 1-2 minutes)

## Environment Variables

If you add environment variables later:

1. Go to Project Settings → Environment Variables
2. Add your variables:
   - `GOOGLE_SHEETS_API_KEY`
   - `GOOGLE_SCRIPT_URL`
   - etc.

3. Redeploy for changes to take effect

## Connecting to Google Sheets (Optional)

To connect the email capture to Google Sheets (like the existing landing page):

1. Use the same Google Apps Script endpoint from `medical-advocate-landing-pages`
2. Update `app/results/page.tsx` line ~30:
```typescript
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Create form data
  const formData = new FormData();
  formData.append('email', email);
  formData.append('name', name);
  formData.append('phone', phone);
  formData.append('project', 'medical-savings-quiz');
  formData.append('estimated_savings', `$${estimate.totalMin}-$${estimate.totalMax}`);

  // Submit to Google Sheets
  await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    body: formData,
  });

  setSubmitted(true);
};
```

3. Redeploy

## Testing Before Production

Test your quiz locally before deploying:

```bash
npm run dev
```

Test checklist:
- [ ] Landing page loads correctly
- [ ] Quiz flow works (all questions appear)
- [ ] Conditional questions show/hide properly
- [ ] Info pages appear at right times
- [ ] Back button works
- [ ] Results page calculates correctly
- [ ] Email form submits successfully
- [ ] Mobile responsive (test on phone)

## Performance Optimization

The app is already optimized with:
- Static export for fast loading
- Minimal JavaScript bundle
- CSS-based animations
- localStorage for state persistence

## Monitoring

After deployment, monitor:
- Vercel Analytics (automatic)
- Form submissions (if connected to Google Sheets)
- Error logs in Vercel dashboard

## Troubleshooting

**Build fails:**
- Run `npm install` to ensure all dependencies are installed
- Check `npm run build` locally first

**Quiz doesn't progress:**
- Check browser console for errors
- Ensure localStorage is enabled

**Results page blank:**
- User must complete quiz first
- Check localStorage has `quizAnswers` saved

**Styles look wrong:**
- Clear browser cache
- Check `app/globals.css` is imported in `layout.tsx`

## Support

Questions? Check:
1. README.md for detailed docs
2. Vercel deployment logs
3. Browser console for errors
