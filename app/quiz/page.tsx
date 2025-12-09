'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/quizContext';
import { quizQuestions, infoPages } from '@/lib/quizConfig';
import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';
import InfoCard from '@/components/InfoCard';

export default function QuizPage() {
  const router = useRouter();
  const { answers, setAnswer } = useQuiz();
  const [currentStep, setCurrentStep] = useState(0);
  const [flowItems, setFlowItems] = useState<Array<{ type: 'question' | 'info'; index: number }>>([]);

  // Build the flow based on current answers
  useEffect(() => {
    const items: Array<{ type: 'question' | 'info'; index: number }> = [];
    let questionCount = 0;

    quizQuestions.forEach((question, index) => {
      // Check if question should be shown
      if (!question.conditional || question.conditional(answers)) {
        items.push({ type: 'question', index });
        questionCount++;

        // Check for info pages after this question
        if (question.id === 'nicu_duration') {
          const nicuInfo = infoPages.find((p) => p.id === 'nicu_info');
          if (nicuInfo && (!nicuInfo.conditional || nicuInfo.conditional(answers))) {
            items.push({ type: 'info', index: infoPages.indexOf(nicuInfo) });
          }
        } else if (question.id === 'ambulance') {
          const airInfo = infoPages.find((p) => p.id === 'air_ambulance_info');
          if (airInfo && (!airInfo.conditional || airInfo.conditional(answers))) {
            items.push({ type: 'info', index: infoPages.indexOf(airInfo) });
          }
        } else if (question.id === 'out_of_network') {
          const oonInfo = infoPages.find((p) => p.id === 'surprise_oon_info');
          if (oonInfo && (!oonInfo.conditional || oonInfo.conditional(answers))) {
            items.push({ type: 'info', index: infoPages.indexOf(oonInfo) });
          }
        } else if (question.id === 'your_responsibility') {
          const overpayInfo = infoPages.find((p) => p.id === 'overpay_info');
          if (overpayInfo) {
            items.push({ type: 'info', index: infoPages.indexOf(overpayInfo) });
          }
        } else if (question.id === 'bill_status') {
          const optionsInfo = infoPages.find((p) => p.id === 'options_info');
          if (optionsInfo && (!optionsInfo.conditional || optionsInfo.conditional(answers))) {
            items.push({ type: 'info', index: infoPages.indexOf(optionsInfo) });
          }
        } else if (question.id === 'red_flags') {
          const redFlagsInfo = infoPages.find((p) => p.id === 'red_flags_info');
          if (redFlagsInfo) {
            items.push({ type: 'info', index: infoPages.indexOf(redFlagsInfo) });
          }
        }
      }
    });

    setFlowItems(items);
  }, [answers]);

  const currentItem = flowItems[currentStep];
  const isLastStep = currentStep === flowItems.length - 1;

  // Count actual questions for progress bar
  const totalQuestions = flowItems.filter((item) => item.type === 'question').length;
  const currentQuestionNumber = flowItems
    .slice(0, currentStep + 1)
    .filter((item) => item.type === 'question').length;

  const handleNext = () => {
    if (isLastStep) {
      // Save answers to localStorage for results page
      if (typeof window !== 'undefined') {
        localStorage.setItem('quizAnswers', JSON.stringify(answers));
      }
      router.push('/calculating');
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.push('/');
    }
  };

  const handleSelect = (questionId: string, value: string | string[], isMultiSelect: boolean) => {
    setAnswer(questionId, value);

    // Auto-advance for single select questions
    if (!isMultiSelect) {
      setTimeout(() => {
        handleNext();
      }, 300);
    }
  };

  const canProceed = () => {
    if (!currentItem || currentItem.type === 'info') {
      return true;
    }

    const question = quizQuestions[currentItem.index];
    const answer = answers[question.id];

    if (question.multiSelect) {
      return Array.isArray(answer) && answer.length > 0;
    }

    return !!answer;
  };

  if (!currentItem) {
    return (
      <div className="page-wrapper">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {currentItem.type === 'question' && (
        <>
          <ProgressBar current={currentQuestionNumber} total={totalQuestions} />
          <div style={{ padding: '24px' }}>
            <QuestionCard
              question={quizQuestions[currentItem.index]}
              selectedValue={answers[quizQuestions[currentItem.index].id]}
              onSelect={(value) =>
                handleSelect(quizQuestions[currentItem.index].id, value, quizQuestions[currentItem.index].multiSelect || false)
              }
            />

            {quizQuestions[currentItem.index].multiSelect && (
              <div style={{ marginTop: '32px' }}>
                <button
                  onClick={handleNext}
                  className="button"
                  disabled={!canProceed()}
                >
                  {isLastStep ? 'See Results →' : 'Continue →'}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {currentItem.type === 'info' && (
        <div style={{ padding: '24px', paddingTop: '60px' }}>
          <InfoCard
            infoPage={infoPages[currentItem.index]}
            onContinue={handleNext}
          />
        </div>
      )}
    </div>
  );
}
