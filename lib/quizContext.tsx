'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { QuizAnswers } from './quizConfig';

interface QuizContextType {
  answers: QuizAnswers;
  setAnswer: (questionId: string, answer: string | string[]) => void;
  clearAnswers: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<QuizAnswers>({});

  const setAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const clearAnswers = () => {
    setAnswers({});
  };

  return (
    <QuizContext.Provider value={{ answers, setAnswer, clearAnswers }}>
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
