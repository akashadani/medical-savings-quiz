export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  multiSelect?: boolean;
  whyItMatters?: string;
  conditional?: (answers: QuizAnswers) => boolean;
}

export interface QuizOption {
  value: string;
  label: string;
  description?: string;
}

export interface InfoPage {
  id: string;
  headline: string;
  stats: string[];
  cta: string;
  conditional?: (answers: QuizAnswers) => boolean;
}

export interface QuizAnswers {
  [key: string]: string | string[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'situation',
    question: "What's your current situation?",
    options: [
      { value: 'baby', label: 'I just had a baby' },
      { value: 'pregnant', label: 'I am currently pregnant' },
      { value: 'hospital', label: 'My child had a hospital stay or surgery' },
      { value: 'er', label: "We've had multiple ER visits" },
      { value: 'chronic', label: 'Ongoing treatment for a chronic condition' },
      { value: 'mix', label: 'Mix of various medical expenses' },
    ],
  },
  {
    id: 'expected_delivery',
    question: 'What type of delivery are you expecting?',
    options: [
      { value: 'vaginal', label: 'Vaginal delivery (standard)' },
      { value: 'planned_csection', label: 'Planned C-section' },
      { value: 'high_risk', label: 'High-risk pregnancy' },
      { value: 'not_sure', label: 'Not sure yet / too early to tell' },
    ],
    conditional: (answers) => answers.situation === 'pregnant',
  },
  {
    id: 'multiples',
    question: 'Are you expecting twins or multiples?',
    options: [
      { value: 'no', label: 'No, single baby' },
      { value: 'twins', label: 'Yes, twins' },
      { value: 'multiples', label: 'Yes, triplets or more' },
    ],
    conditional: (answers) => answers.situation === 'pregnant',
  },
  {
    id: 'pregnancy_complications',
    question: 'Has your doctor mentioned any potential complications or risks?',
    multiSelect: true,
    options: [
      { value: 'none', label: 'No, everything is normal so far' },
      { value: 'gestational_diabetes', label: 'Gestational diabetes' },
      { value: 'preeclampsia', label: 'Preeclampsia or high blood pressure' },
      { value: 'preterm_risk', label: 'Risk of preterm delivery' },
      { value: 'other', label: 'Other complications' },
    ],
    whyItMatters:
      'Complications often mean higher bills and more opportunities for billing errors',
    conditional: (answers) => answers.situation === 'pregnant',
  },
  {
    id: 'hospital_network',
    question: 'Is your planned hospital in-network with your insurance?',
    options: [
      { value: 'yes', label: 'Yes, confirmed in-network' },
      { value: 'no', label: 'No, out-of-network' },
      { value: 'not_sure', label: 'Not sure / haven\'t checked' },
    ],
    whyItMatters:
      'Out-of-network hospitals can result in surprise bills, but federal law may protect you',
    conditional: (answers) => answers.situation === 'pregnant',
  },
  {
    id: 'insurance_deductible',
    question: 'What\'s your insurance deductible and out-of-pocket max?',
    options: [
      { value: 'low', label: 'Low deductible (under $1,500)' },
      { value: 'medium', label: 'Medium deductible ($1,500-$5,000)' },
      { value: 'high', label: 'High deductible ($5,000+)' },
      { value: 'not_sure', label: 'Not sure' },
    ],
    whyItMatters:
      'Higher deductibles mean you\'ll pay more out-of-pocket, making savings more valuable',
    conditional: (answers) => answers.situation === 'pregnant',
  },
  {
    id: 'reviewed_coverage',
    question: 'Have you reviewed your insurance maternity coverage?',
    options: [
      { value: 'yes_detailed', label: 'Yes, I know what\'s covered in detail' },
      { value: 'yes_basic', label: 'Yes, I have a basic understanding' },
      { value: 'no', label: 'No, not yet' },
      { value: 'confused', label: 'I tried but it\'s confusing' },
    ],
    conditional: (answers) => answers.situation === 'pregnant',
  },
  {
    id: 'delivery',
    question: 'Did your delivery involve any of these?',
    multiSelect: true,
    options: [
      { value: 'csection', label: 'C-section' },
      { value: 'nicu', label: 'NICU stay' },
      { value: 'extended', label: 'Extended hospital stay (3+ days)' },
      { value: 'complications', label: 'Complications requiring additional care' },
      { value: 'none', label: 'None, standard delivery' },
    ],
    conditional: (answers) => answers.situation === 'baby',
  },
  {
    id: 'nicu_duration',
    question: 'How long was the NICU stay?',
    options: [
      { value: 'under1week', label: 'Less than 1 week' },
      { value: '1-2weeks', label: '1-2 weeks' },
      { value: '2-4weeks', label: '2-4 weeks' },
      { value: 'over1month', label: 'Over a month' },
      { value: 'ongoing', label: 'Still ongoing' },
    ],
    conditional: (answers) =>
      Array.isArray(answers.delivery) && answers.delivery.includes('nicu'),
  },
  {
    id: 'hospital_services',
    question: 'What type of care did you or your family member receive?',
    multiSelect: true,
    options: [
      { value: 'overnight', label: 'Overnight hospital stay' },
      { value: 'surgery', label: 'Surgery or procedure' },
      { value: 'er', label: 'Emergency room visit(s)' },
      { value: 'tests', label: 'Specialized tests (MRI, CT scan, ultrasound)' },
      { value: 'icu', label: 'ICU or intensive care' },
      { value: 'none', label: 'None of the above' },
    ],
    conditional: (answers) =>
      answers.situation === 'baby' ||
      answers.situation === 'hospital' ||
      answers.situation === 'er' ||
      answers.situation === 'chronic' ||
      answers.situation === 'mix',
  },
  {
    id: 'emergency',
    question: 'Was this an emergency situation or planned care?',
    options: [
      { value: 'emergency', label: 'Emergency/urgent - no time to plan' },
      { value: 'planned', label: 'Scheduled procedure or planned delivery' },
      { value: 'mix', label: 'Mix of both' },
    ],
    whyItMatters:
      'Emergencies often mean less choice in providers and more billing protections',
    conditional: (answers) => answers.situation !== 'pregnant',
  },
  {
    id: 'ambulance',
    question: 'Did you have an ambulance ride or medical transport?',
    options: [
      { value: 'no', label: 'No' },
      { value: 'ground', label: 'Ground ambulance' },
      { value: 'air', label: 'Helicopter/air ambulance' },
      { value: 'transfer', label: 'Inter-facility transfer (between hospitals)' },
    ],
    whyItMatters:
      'Air ambulance bills average $30k-$50k and often have huge savings opportunities',
    conditional: (answers) => answers.situation !== 'pregnant',
  },
  {
    id: 'out_of_network',
    question: 'Were any of your providers out-of-network?',
    options: [
      { value: 'in_network', label: 'Everything was in-network' },
      { value: 'chose_oon', label: 'I chose to go out-of-network' },
      {
        value: 'surprise',
        label: "I got surprise out-of-network bills (didn't know they were OON)",
      },
      { value: 'not_sure', label: 'Not sure how to tell' },
    ],
    whyItMatters:
      'Surprise out-of-network bills may be illegal under federal law',
    conditional: (answers) => answers.situation !== 'pregnant',
  },
  {
    id: 'total_billed',
    question: 'What\'s the total amount billed (before insurance)?',
    options: [
      { value: 'under5k', label: 'Under $5,000' },
      { value: '5k-20k', label: '$5,000 - $20,000' },
      { value: '20k-50k', label: '$20,000 - $50,000' },
      { value: '50k-100k', label: '$50,000 - $100,000' },
      { value: 'over100k', label: 'Over $100,000' },
      { value: 'not_sure', label: 'Not sure yet' },
    ],
    conditional: (answers) => answers.situation !== 'pregnant',
  },
  {
    id: 'your_responsibility',
    question: 'How much are YOU responsible for paying (after insurance)?',
    options: [
      { value: 'under1k', label: 'Under $1,000' },
      { value: '1k-5k', label: '$1,000 - $5,000' },
      { value: '5k-15k', label: '$5,000 - $15,000' },
      { value: 'over15k', label: 'Over $15,000' },
      { value: 'not_sure', label: 'Not sure yet (still getting bills)' },
    ],
    conditional: (answers) => answers.situation !== 'pregnant',
  },
  {
    id: 'bill_status',
    question: "What's the status of your bills?",
    options: [
      { value: 'current', label: 'All current, no past due' },
      { value: 'past_due', label: 'Some are past due (30-90 days)' },
      { value: 'collections', label: 'In collections' },
      { value: 'legal', label: 'Getting threats of legal action' },
      { value: 'payment_plan', label: 'In a payment plan' },
    ],
    whyItMatters:
      'Past due bills need immediate action to protect your credit',
    conditional: (answers) => answers.situation !== 'pregnant',
  },
  {
    id: 'financial_hardship',
    question: 'Are you struggling to pay these medical bills?',
    options: [
      { value: 'cant_afford', label: "Yes, I can't afford them" },
      {
        value: 'tight',
        label: "It's tight but manageable with payment plan",
      },
      { value: 'can_pay', label: "No, I can pay but don't want to overpay" },
      {
        value: 'wipe_savings',
        label: 'I could pay but it would wipe out savings',
      },
    ],
    whyItMatters:
      'You may qualify for financial assistance or charity care programs that could reduce/eliminate bills',
    conditional: (answers) => answers.situation !== 'pregnant',
  },
  {
    id: 'actions_taken',
    question: 'Have you done any of these?',
    multiSelect: true,
    options: [
      { value: 'itemized', label: 'Requested itemized bills' },
      { value: 'compared_eob', label: 'Compared charges to insurance EOB' },
      { value: 'assistance', label: 'Asked about financial assistance' },
      { value: 'negotiate', label: 'Called to negotiate' },
      { value: 'payment_plan', label: 'Set up a payment plan' },
      { value: 'charity', label: 'Applied for charity care' },
      { value: 'none', label: 'None of the above' },
    ],
    conditional: (answers) => answers.situation !== 'pregnant',
  },
  {
    id: 'red_flags',
    question: 'Have you noticed any of these?',
    multiSelect: true,
    options: [
      { value: 'duplicates', label: 'Same charge listed multiple times' },
      {
        value: 'should_cover',
        label: 'Bills for services insurance should cover',
      },
      { value: 'too_high', label: 'Charges that seem way too high' },
      { value: 'late_bills', label: 'Bills still coming months later' },
      { value: 'denials', label: 'Insurance denied claims unexpectedly' },
      {
        value: 'multiple',
        label: 'Multiple bills from different providers for same visit',
      },
      { value: 'not_looked', label: "Haven't looked closely at the bills" },
    ],
    conditional: (answers) => answers.situation !== 'pregnant',
  },
];

export const infoPages: InfoPage[] = [
  {
    id: 'pregnant_preparation',
    headline: 'Get Ready Now, Save Money Later',
    stats: [
      'Average hospital delivery bill: $10,000-$30,000 (before insurance)',
      '80% of delivery bills contain billing errors or overcharges',
      'Parents who review bills carefully save an average of $2,000-$8,000',
      'We\'ll help you review everything after your baby arrives',
    ],
    cta: 'Continue',
    conditional: (answers) => answers.situation === 'pregnant',
  },
  {
    id: 'nicu_info',
    headline: 'NICU Bills Are Especially Complex',
    stats: [
      'NICU stays generate an average of 50-200+ separate charges per day',
      'Studies show 90% of NICU bills contain billing errors or duplicate charges',
      'Average NICU overcharge: $3,500 - $12,000',
    ],
    cta: 'Continue',
    conditional: (answers) =>
      Array.isArray(answers.delivery) && answers.delivery.includes('nicu'),
  },
  {
    id: 'air_ambulance_info',
    headline: 'Air Ambulance Bills Are Notoriously Inflated',
    stats: [
      'Average air ambulance bill: $40,000',
      'These bills are often 5-10x higher than the actual cost',
      'Good news: New federal laws protect you from surprise air ambulance bills',
    ],
    cta: "Let's keep going",
    conditional: (answers) => answers.ambulance === 'air',
  },
  {
    id: 'surprise_oon_info',
    headline: 'Surprise Bills May Be Illegal',
    stats: [
      'The No Surprises Act protects you from most surprise out-of-network bills',
      'You may only owe the in-network rate, not what you were billed',
      'Average savings from challenging surprise bills: $2,800',
    ],
    cta: 'Continue',
    conditional: (answers) => answers.out_of_network === 'surprise',
  },
  {
    id: 'overpay_info',
    headline: "Here's Why Most People Overpay",
    stats: [
      '80% of medical bills contain errors',
      'The average hospital bill has $1,400 in overcharges',
      '90% of people never check their bills for errors',
      'Most hospital visits generate bills with 10-30+ separate charges that are never reviewed',
    ],
    cta: 'Continue',
  },
  {
    id: 'options_info',
    headline: 'You Have More Options Than You Think',
    stats: [
      '60% of patients qualify for financial assistance but never apply',
      'Hospitals are required to offer charity care programs - many people just don\'t know about them',
      'You could qualify for 50-100% bill reduction based on income',
    ],
    cta: 'See if you qualify',
    conditional: (answers) => {
      // Only show if they're struggling financially AND haven't already applied for assistance
      const isStrugglingFinancially =
        answers.financial_hardship === 'cant_afford' ||
        answers.financial_hardship === 'wipe_savings';

      const hasntAppliedForHelp =
        !Array.isArray(answers.actions_taken) ||
        (!answers.actions_taken.includes('assistance') &&
         !answers.actions_taken.includes('charity'));

      return isStrugglingFinancially && hasntAppliedForHelp;
    },
  },
  {
    id: 'red_flags_info',
    headline: "Those Red Flags? They're Worth Money.",
    stats: [
      'Each of those red flags typically represents $200-$2,000+ in overcharges',
      'Duplicate charges alone account for 30% of billing errors',
      'Insurance denials are often wrong - 50% of appeals succeed',
    ],
    cta: 'Continue to results',
  },
];
