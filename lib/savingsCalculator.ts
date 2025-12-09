import { QuizAnswers } from './quizConfig';

export interface SavingsBreakdown {
  category: string;
  description: string;
  min: number;
  max: number;
}

export interface SavingsEstimate {
  totalMin: number;
  totalMax: number;
  breakdown: SavingsBreakdown[];
  urgencyLevel: 'normal' | 'high' | 'critical';
  urgencyMessage?: string;
}

export function calculateSavings(answers: QuizAnswers): SavingsEstimate {
  const breakdown: SavingsBreakdown[] = [];

  // Get the amount they're actually responsible for
  let maxPossibleSavings = 15000; // default cap

  if (answers.your_responsibility) {
    switch (answers.your_responsibility) {
      case 'under1k':
        maxPossibleSavings = 800; // Can't save more than 80% of $1k
        break;
      case '1k-5k':
        maxPossibleSavings = 3000; // ~60% of $5k
        break;
      case '5k-15k':
        maxPossibleSavings = 9000; // ~60% of $15k
        break;
      case 'over15k':
        maxPossibleSavings = 30000; // 50-60% of higher amounts
        break;
      case 'not_sure':
        maxPossibleSavings = 10000; // Reasonable estimate
        break;
    }
  }

  // Helper function to cap individual breakdown items realistically
  const capBreakdownItem = (min: number, max: number): { min: number; max: number } => {
    // Don't let any single item exceed the total max possible savings
    const cappedMax = Math.min(max, maxPossibleSavings);
    const cappedMin = Math.min(min, cappedMax * 0.4); // Min should be reasonable relative to max
    return { min: Math.round(cappedMin), max: Math.round(cappedMax) };
  };

  // If someone is currently pregnant (no bills yet), give minimal estimate
  if (answers.situation === 'pregnant') {
    return {
      totalMin: 0,
      totalMax: 0,
      breakdown: [{
        category: 'Future Savings Opportunity',
        description: 'We can help review your bills after delivery',
        min: 0,
        max: 0,
      }],
      urgencyLevel: 'normal',
      urgencyMessage: undefined,
    };
  }

  // If they've done everything already, minimal savings
  if (Array.isArray(answers.actions_taken) &&
      answers.actions_taken.includes('itemized') &&
      answers.actions_taken.includes('compared_eob') &&
      (answers.actions_taken.includes('negotiate') || answers.actions_taken.includes('charity'))) {
    // Cap based on what they owe, but minimal
    const minSavings = Math.min(200, maxPossibleSavings * 0.1);
    const maxSavings = Math.min(800, maxPossibleSavings * 0.2);

    return {
      totalMin: Math.round(minSavings),
      totalMax: Math.round(maxSavings),
      breakdown: [{
        category: 'Additional Review',
        description: "You've done great work! We may find a few more opportunities",
        min: Math.round(minSavings),
        max: Math.round(maxSavings),
      }],
      urgencyLevel: 'normal',
    };
  }

  // Base calculation - NICU stay
  if (
    Array.isArray(answers.delivery) &&
    answers.delivery.includes('nicu') &&
    answers.nicu_duration
  ) {
    let nicuMin = 0;
    let nicuMax = 0;
    let durationText = '';

    switch (answers.nicu_duration) {
      case 'under1week':
        nicuMin = 2000;
        nicuMax = 5000;
        durationText = 'Under 1 week';
        break;
      case '1-2weeks':
        nicuMin = 4000;
        nicuMax = 10000;
        durationText = '1-2 week';
        break;
      case '2-4weeks':
        nicuMin = 8000;
        nicuMax = 18000;
        durationText = '2-4 week';
        break;
      case 'over1month':
        nicuMin = 15000;
        nicuMax = 35000;
        durationText = 'Extended';
        break;
      case 'ongoing':
        nicuMin = 15000;
        nicuMax = 35000;
        durationText = 'Ongoing';
        break;
    }

    const capped = capBreakdownItem(nicuMin, nicuMax);
    breakdown.push({
      category: 'NICU Billing Errors',
      description: `${durationText} NICU stays average 200+ charges per day`,
      min: capped.min,
      max: capped.max,
    });
  }

  // C-section
  if (Array.isArray(answers.delivery) && answers.delivery.includes('csection')) {
    const capped = capBreakdownItem(800, 3000);
    breakdown.push({
      category: 'C-Section Billing Review',
      description: 'Additional surgical procedures often have billing errors',
      min: capped.min,
      max: capped.max,
    });
  }

  // Air ambulance
  if (answers.ambulance === 'air') {
    const capped = capBreakdownItem(12000, 30000);
    breakdown.push({
      category: 'Air Ambulance Bill Reduction',
      description: 'Protected under federal No Surprises Act',
      min: capped.min,
      max: capped.max,
    });
  } else if (answers.ambulance === 'ground' || answers.ambulance === 'transfer') {
    const capped = capBreakdownItem(500, 2000);
    breakdown.push({
      category: 'Ambulance Bill Reduction',
      description: 'Ambulance bills often have inflated charges',
      min: capped.min,
      max: capped.max,
    });
  }

  // Surprise out-of-network
  if (answers.out_of_network === 'surprise') {
    const capped = capBreakdownItem(2500, 8000);
    breakdown.push({
      category: 'Surprise Out-of-Network Bills',
      description: 'Protected under federal No Surprises Act',
      min: capped.min,
      max: capped.max,
    });
  }

  // Emergency situation (additional protections)
  if (answers.emergency === 'emergency') {
    const capped = capBreakdownItem(500, 2000);
    breakdown.push({
      category: 'Emergency Billing Protections',
      description: 'Emergency situations have additional billing protections',
      min: capped.min,
      max: capped.max,
    });
  }

  // Reduce savings if they've already taken some actions
  let actionMultiplier = 1.0;
  if (Array.isArray(answers.actions_taken)) {
    // Filter out "none" to count actual actions
    const actualActions = answers.actions_taken.filter(a => a !== 'none');
    const actionsTaken = actualActions.length;

    if (actionsTaken >= 4) {
      actionMultiplier = 0.3; // Already did a lot
    } else if (actionsTaken >= 2) {
      actionMultiplier = 0.6; // Did some work
    } else if (actionsTaken === 1) {
      actionMultiplier = 0.8; // Did a little
    }
    // If they selected "none" or nothing, multiplier stays at 1.0
  }

  // Financial hardship (charity care potential)
  if (
    answers.financial_hardship === 'cant_afford' ||
    answers.financial_hardship === 'wipe_savings'
  ) {
    let charityMin = 1000;
    let charityMax = 5000;

    // If they have high bills, charity care could be more significant
    if (answers.your_responsibility === '5k-15k') {
      charityMin = 2500;
      charityMax = 7500;
    } else if (answers.your_responsibility === 'over15k') {
      charityMin = 5000;
      charityMax = 15000;
    }

    const capped = capBreakdownItem(charityMin, charityMax);
    breakdown.push({
      category: 'Financial Assistance Programs',
      description: 'You may qualify for hospital charity care',
      min: capped.min,
      max: capped.max,
    });
  }

  // Haven't requested itemized bills
  if (
    !Array.isArray(answers.actions_taken) ||
    !answers.actions_taken.includes('itemized')
  ) {
    const capped = capBreakdownItem(1000, 2500);
    breakdown.push({
      category: 'Billing Code Errors',
      description: "You haven't reviewed itemized bills yet",
      min: capped.min,
      max: capped.max,
    });
  }

  // Haven't compared to EOB
  if (
    !Array.isArray(answers.actions_taken) ||
    !answers.actions_taken.includes('compared_eob')
  ) {
    const capped = capBreakdownItem(500, 1500);
    breakdown.push({
      category: 'Insurance Claim Review',
      description: 'Comparing to EOB often reveals errors',
      min: capped.min,
      max: capped.max,
    });
  }

  // Red flags
  if (Array.isArray(answers.red_flags)) {
    let redFlagMin = 0;
    let redFlagMax = 0;

    if (answers.red_flags.includes('duplicates')) {
      redFlagMin += 800;
      redFlagMax += 2500;
    }
    if (answers.red_flags.includes('denials')) {
      redFlagMin += 1200;
      redFlagMax += 4000;
    }
    if (answers.red_flags.includes('too_high')) {
      redFlagMin += 1000;
      redFlagMax += 3500;
    }
    if (answers.red_flags.includes('late_bills')) {
      redFlagMin += 600;
      redFlagMax += 1800;
    }
    if (answers.red_flags.includes('multiple')) {
      redFlagMin += 500;
      redFlagMax += 2000;
    }

    if (redFlagMin > 0) {
      const capped = capBreakdownItem(redFlagMin, redFlagMax);
      breakdown.push({
        category: 'Billing Error Corrections',
        description: 'Based on red flags you identified',
        min: capped.min,
        max: capped.max,
      });
    }
  }

  // Collections status increases negotiation leverage (slightly)
  let collectionsMultiplier = 1.0;
  if (answers.bill_status === 'collections') {
    collectionsMultiplier = 1.15;
  } else if (answers.bill_status === 'legal') {
    collectionsMultiplier = 1.2;
  } else if (answers.bill_status === 'past_due') {
    collectionsMultiplier = 1.08;
  }

  // Apply multipliers to each item
  breakdown.forEach((item) => {
    item.min = Math.round(item.min * actionMultiplier * collectionsMultiplier);
    item.max = Math.round(item.max * actionMultiplier * collectionsMultiplier);
  });

  // Calculate totals
  let totalMin = breakdown.reduce((sum, item) => sum + item.min, 0);
  let totalMax = breakdown.reduce((sum, item) => sum + item.max, 0);

  // Final safety cap at what they can realistically save
  totalMax = Math.min(totalMax, maxPossibleSavings);
  totalMin = Math.min(totalMin, totalMax); // Ensure min doesn't exceed max

  // If breakdown is empty or totals are too low, provide a baseline estimate
  if (breakdown.length === 0 || totalMax < 500) {
    const capped = capBreakdownItem(400, 1200);
    breakdown.push({
      category: 'General Bill Review',
      description: 'Standard billing error review and negotiation',
      min: capped.min,
      max: capped.max,
    });
    totalMin = capped.min;
    totalMax = capped.max;
  }

  // Determine urgency
  let urgencyLevel: 'normal' | 'high' | 'critical' = 'normal';
  let urgencyMessage: string | undefined;

  if (answers.bill_status === 'legal') {
    urgencyLevel = 'critical';
    urgencyMessage = 'URGENT: Legal action threatened - Act now to protect your credit and finances';
  } else if (answers.bill_status === 'collections') {
    urgencyLevel = 'critical';
    urgencyMessage = 'URGENT: Bills in collections - Act now for maximum negotiation leverage';
  } else if (answers.bill_status === 'past_due') {
    urgencyLevel = 'high';
    urgencyMessage = 'Bills are past due - Act soon to avoid collections';
  }

  return {
    totalMin: Math.round(totalMin),
    totalMax: Math.round(totalMax),
    breakdown,
    urgencyLevel,
    urgencyMessage,
  };
}
