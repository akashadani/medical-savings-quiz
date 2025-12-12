# Medical Savings Quiz - Baby Bill Relief

A Next.js quiz flow application to help parents discover potential savings on their medical bills.

## Features

- **Smart Quiz Flow**: Dynamic question flow based on user answers
- **Conditional Logic**: Questions and info pages appear based on relevance
- **Savings Calculator**: Realistic estimate based on specific situation
- **Info Pages**: Educational moments throughout the quiz
- **Responsive Design**: Mobile-first, matches Baby Bill Relief branding
- **Email Capture**: Collect leads with breakdown of potential savings

## Project Structure

```
medical-savings-quiz/
├── app/
│   ├── layout.tsx          # Root layout with QuizProvider
│   ├── page.tsx             # Landing page (Page 0)
│   ├── globals.css          # Global styles matching Baby Bill Relief branding
│   ├── quiz/
│   │   └── page.tsx         # Main quiz flow page
│   └── results/
│       └── page.tsx         # Results page with savings estimate
├── components/
│   ├── ProgressBar.tsx      # Progress indicator
│   ├── QuestionCard.tsx     # Question display component
│   └── InfoCard.tsx         # Info page component
├── lib/
│   ├── quizConfig.ts        # All questions and info pages
│   ├── quizContext.tsx      # React context for quiz state
│   └── savingsCalculator.ts # Savings calculation logic
├── next.config.js
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd medical-savings-quiz
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
```

This will create a static export in the `out/` directory.

## Deploying to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link to your Vercel account

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your git repository
4. Vercel will automatically detect Next.js and configure settings
5. Click "Deploy"

### Option 3: Deploy from Local Directory

1. Build the project:
```bash
npm run build
```

2. Deploy the `out` folder:
```bash
vercel --prod
```

## Customization

### Updating Questions

Edit `lib/quizConfig.ts` to add, remove, or modify questions and info pages.

### Modifying Savings Calculator

Update the calculation logic in `lib/savingsCalculator.ts` to adjust savings estimates.

### Styling Changes

All styles are in `app/globals.css` and match the Baby Bill Relief branding:
- Primary color: `#0891b2` (cyan)
- Background: Light blue gradient
- Fonts: System fonts

### Email Integration

To integrate with your email service or Google Sheets:

1. Open `app/results/page.tsx`
2. Find the `handleSubmit` function
3. Add your API call or Google Apps Script endpoint (similar to the existing landing page)

Example:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Send to your backend or Google Sheets
  await fetch('YOUR_ENDPOINT', {
    method: 'POST',
    body: JSON.stringify({ email, name, phone, estimate }),
  });

  setSubmitted(true);
};
```

## Quiz Flow Logic

The quiz automatically handles:
- **Conditional questions**: Shows/hides questions based on previous answers
- **Info pages**: Displays educational content at strategic points
- **Progress tracking**: Shows current position in the quiz
- **Answer persistence**: Saves answers for the results page
- **Back navigation**: Allows users to change previous answers

## Question Types Supported

- Single choice (radio buttons)
- Multiple choice (checkboxes)
- Conditional display based on previous answers
- "Why it matters" explanations

## Savings Calculation

The calculator considers:
- NICU stay duration and complexity
- Type of procedures (C-section, surgeries, etc.)
- Ambulance services (especially air ambulance)
- Out-of-network billing
- Bill amounts and status
- Financial hardship indicators
- Actions already taken
- Red flags identified

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

Proprietary - Baby Bill Relief

## Support

For questions or issues, contact the development team.
