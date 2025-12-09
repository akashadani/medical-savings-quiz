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

  // Helper function to proportionally scale all breakdown items to fit within max
  const scaleBreakdownToMax = (
    items: SavingsBreakdown[],
    maxAllowed: number
  ): SavingsBreakdown[] => {
    const currentMax = items.reduce((sum, item) => sum + item.max, 0);
    const currentMin = items.reduce((sum, item) => sum + item.min, 0);

    // If we're already under the max, no scaling needed
    if (currentMax <= maxAllowed) {
      return items;
    }

    // Scale down proportionally
    const scaleFactor = maxAllowed / currentMax;

    return items.map(item => ({
      ...item,
      min: Math.round(item.min * scaleFactor),
      max: Math.round(item.max * scaleFactor),
    }));
  };

  // If someone is currently pregnant (no bills yet), calculate potential savings
  if (answers.situation === 'pregnant') {
    const pregnantBreakdown: SavingsBreakdown[] = [];

    // Base delivery savings potential
    let baseMin = 1500;
    let baseMax = 4000;

    // C-section adds significant potential
    if (answers.expected_delivery === 'planned_csection') {
      baseMin = 2500;
      baseMax = 6000;
    }

    // High-risk pregnancy
    if (answers.expected_delivery === 'high_risk') {
      baseMin = 3000;
      baseMax = 8000;
    }

    // Multiples increase base
    if (answers.multiples === 'twins') {
      baseMin = Math.round(baseMin * 1.5);
      baseMax = Math.round(baseMax * 1.8);
    } else if (answers.multiples === 'multiples') {
      baseMin = Math.round(baseMin * 2);
      baseMax = Math.round(baseMax * 2.5);
    }

    // ALWAYS add base delivery estimate first
    let deliveryDescription = 'Standard delivery';
    if (answers.expected_delivery === 'planned_csection') {
      deliveryDescription = 'Planned C-section';
    } else if (answers.expected_delivery === 'high_risk') {
      deliveryDescription = 'High-risk pregnancy care';
    }
    if (answers.multiples === 'twins') {
      deliveryDescription += ' (twins)';
    } else if (answers.multiples === 'multiples') {
      deliveryDescription += ' (multiples)';
    }

    pregnantBreakdown.push({
      category: 'Delivery Bill Review',
      description: `${deliveryDescription} - hospitals average 50+ billable items`,
      min: baseMin,
      max: baseMax,
    });

    // Complications
    if (Array.isArray(answers.pregnancy_complications) &&
        !answers.pregnancy_complications.includes('none')) {
      const complications = answers.pregnancy_complications.filter(c => c !== 'none');
      if (complications.length > 0) {
        pregnantBreakdown.push({
          category: 'Complication Management',
          description: 'Additional monitoring and treatment creates billing complexity',
          min: 800,
          max: 3000,
        });
      }
    }

    // Out-of-network risk
    if (answers.hospital_network === 'no' || answers.hospital_network === 'not_sure') {
      pregnantBreakdown.push({
        category: 'Network Status Verification',
        description: 'Ensuring no surprise out-of-network bills after delivery',
        min: 500,
        max: 2000,
      });
    }

    // High deductible means more at stake
    if (answers.insurance_deductible === 'high') {
      pregnantBreakdown.push({
        category: 'High Deductible Review',
        description: 'With a high deductible, maximizing savings is critical',
        min: 1000,
        max: 3000,
      });
    }

    // Haven't reviewed coverage
    if (answers.reviewed_coverage === 'no' || answers.reviewed_coverage === 'confused') {
      pregnantBreakdown.push({
        category: 'Coverage Gap Identification',
        description: 'Understanding your coverage can prevent surprise bills',
        min: 500,
        max: 1500,
      });
    }

    const totalMinPregnant = pregnantBreakdown.reduce((sum, item) => sum + item.min, 0);
    const totalMaxPregnant = pregnantBreakdown.reduce((sum, item) => sum + item.max, 0);

    return {
      totalMin: Math.round(totalMinPregnant),
      totalMax: Math.round(totalMaxPregnant),
      breakdown: pregnantBreakdown,
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

    breakdown.push({
      category: 'NICU Billing Errors',
      description: `${durationText} NICU stays average 200+ charges per day`,
      min: nicuMin,
      max: nicuMax,
    });
  }

  // Delivery baseline for "baby" situation
  if (answers.situation === 'baby') {
    if (Array.isArray(answers.delivery) && answers.delivery.includes('csection')) {
      breakdown.push({
        category: 'C-Section Billing Review',
        description: 'Surgical deliveries have more complex billing',
        min: 1500,
        max: 4500,
      });
    } else if (Array.isArray(answers.delivery) && answers.delivery.includes('none')) {
      // Standard vaginal delivery
      breakdown.push({
        category: 'Standard Delivery Bill Review',
        description: 'Even uncomplicated deliveries average 50+ separate charges',
        min: 1000,
        max: 3000,
      });
    }
  }

  // Air ambulance
  if (answers.ambulance === 'air') {
    breakdown.push({
      category: 'Air Ambulance Bill Reduction',
      description: 'Protected under federal No Surprises Act',
      min: 12000,
      max: 30000,
    });
  } else if (answers.ambulance === 'ground' || answers.ambulance === 'transfer') {
    breakdown.push({
      category: 'Ambulance Bill Reduction',
      description: 'Ambulance bills often have inflated charges',
      min: 500,
      max: 2000,
    });
  }

  // Surprise out-of-network
  if (answers.out_of_network === 'surprise') {
    breakdown.push({
      category: 'Surprise Out-of-Network Bills',
      description: 'Protected under federal No Surprises Act',
      min: 2500,
      max: 8000,
    });
  }

  // Emergency situation (additional protections)
  if (answers.emergency === 'emergency') {
    breakdown.push({
      category: 'Emergency Billing Protections',
      description: 'Emergency situations have additional billing protections',
      min: 500,
      max: 2000,
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

    breakdown.push({
      category: 'Financial Assistance Programs',
      description: 'You may qualify for hospital charity care',
      min: charityMin,
      max: charityMax,
    });
  }

  // Haven't requested itemized bills
  if (
    !Array.isArray(answers.actions_taken) ||
    !answers.actions_taken.includes('itemized')
  ) {
    breakdown.push({
      category: 'Billing Code Errors',
      description: "You haven't reviewed itemized bills yet",
      min: 1000,
      max: 2500,
    });
  }

  // Haven't compared to EOB
  if (
    !Array.isArray(answers.actions_taken) ||
    !answers.actions_taken.includes('compared_eob')
  ) {
    breakdown.push({
      category: 'Insurance Claim Review',
      description: 'Comparing to EOB often reveals errors',
      min: 500,
      max: 1500,
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
      breakdown.push({
        category: 'Billing Error Corrections',
        description: 'Based on red flags you identified',
        min: redFlagMin,
        max: redFlagMax,
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

  // If breakdown is empty or totals are too low, provide a baseline estimate
  if (breakdown.length === 0) {
    breakdown.push({
      category: 'General Bill Review',
      description: 'Standard billing error review and negotiation',
      min: Math.round(400 * actionMultiplier * collectionsMultiplier),
      max: Math.round(1200 * actionMultiplier * collectionsMultiplier),
    });
  }

  // Scale down all items proportionally if they exceed maxPossibleSavings
  const scaledBreakdown = scaleBreakdownToMax(breakdown, maxPossibleSavings);

  // Calculate final totals (these should now add up correctly)
  const totalMin = scaledBreakdown.reduce((sum, item) => sum + item.min, 0);
  const totalMax = scaledBreakdown.reduce((sum, item) => sum + item.max, 0);

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
    breakdown: scaledBreakdown,
    urgencyLevel,
    urgencyMessage,
  };
}
