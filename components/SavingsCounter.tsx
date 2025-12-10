'use client';

import { useState, useEffect } from 'react';
import { QuizAnswers } from '@/lib/quizConfig';
import { calculateSavings } from '@/lib/savingsCalculator';

interface SavingsCounterProps {
  answers: QuizAnswers;
}

export default function SavingsCounter({ answers }: SavingsCounterProps) {
  const [displayMin, setDisplayMin] = useState(0);
  const [displayMax, setDisplayMax] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show counter if they have a meaningful situation selected
    if (!answers.situation || answers.situation === '') {
      setIsVisible(false);
      return;
    }

    const estimate = calculateSavings(answers);

    // Only show if there's a meaningful estimate
    if (estimate.totalMax > 500) {
      setIsVisible(true);

      // Animate the numbers growing
      const duration = 800;
      const steps = 40;
      const stepDuration = duration / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3); // Ease-out cubic

        setDisplayMin(Math.round(estimate.totalMin * easeOut));
        setDisplayMax(Math.round(estimate.totalMax * easeOut));

        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    } else {
      setIsVisible(false);
    }
  }, [answers]);

  if (!isVisible) {
    return null;
  }

  const formattedMin = displayMin.toLocaleString();
  const formattedMax = displayMax.toLocaleString();

  return (
    <div
      className="fade-in"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
        color: '#ffffff',
        padding: '16px 24px',
        borderRadius: '16px',
        boxShadow: '0 8px 30px rgba(8, 145, 178, 0.4)',
        zIndex: 1000,
        maxWidth: '90%',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '4px' }}>
        Estimated Savings So Far:
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
        ${formattedMin} - ${formattedMax}
      </div>
    </div>
  );
}
