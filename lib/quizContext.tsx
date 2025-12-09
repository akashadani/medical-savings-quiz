'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { QuizAnswers } from './quizConfig';
import { getOrCreateSessionId } from './sessionManager';

interface QuizContextType {
  answers: QuizAnswers;
  sessionId: string;
  setAnswer: (questionId: string, answer: string | string[]) => void;
  clearAnswers: () => void;
  submitProgress: (currentQuestion: string, completed?: boolean, additionalAnswers?: QuizAnswers) => Promise<void>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [sessionId, setSessionId] = useState<string>('');

  // Initialize session ID on mount
  useEffect(() => {
    const id = getOrCreateSessionId();
    setSessionId(id);
  }, []);

  const setAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const clearAnswers = () => {
    setAnswers({});
  };

  // Submit final results to Google Sheets (called from results page only)
  const submitProgress = async (
    currentQuestion: string,
    completed: boolean = false,
    additionalAnswers?: QuizAnswers
  ) => {
    // Only submit if completed (final submission)
    if (!completed) {
      return;
    }

    const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      console.warn('Google Script URL not configured. Skipping submission.');
      return;
    }

    try {
      // Merge current answers with any additional answers
      const allAnswers = { ...answers, ...additionalAnswers };

      console.log('=== SUBMITTING TO GOOGLE SHEETS ===');
      console.log('Full Payload:', JSON.stringify(allAnswers, null, 2));

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allAnswers),
        mode: 'no-cors', // Required for Google Apps Script
      });

      console.log('Submission successful');
    } catch (error) {
      console.error('Error submitting:', error);
    }
  };

  return (
    <QuizContext.Provider value={{ answers, sessionId, setAnswer, clearAnswers, submitProgress }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
