"use client";

import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { QuizAnswers } from "@/types";
import { QUESTIONS } from "@/data/questions";

export function useQuiz() {
  const [answers, setAnswers] = useLocalStorage<QuizAnswers>(
    "jackie-jeans-answers",
    {}
  );
  const [currentStep, setCurrentStep] = useState(0);

  const totalSteps = () => {
    const base = QUESTIONS.length;
    return base;
  };

  const updateAnswer = <K extends keyof QuizAnswers>(
    key: K,
    value: QuizAnswers[K]
  ) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const goNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, QUESTIONS.length - 1));
  };

  const goBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentStep(0);
  };

  const progress =
    QUESTIONS.length > 0
      ? Math.round(((currentStep + 1) / QUESTIONS.length) * 100)
      : 0;

  return {
    answers,
    currentStep,
    totalSteps: QUESTIONS.length,
    progress,
    updateAnswer,
    goNext,
    goBack,
    goToStep,
    resetQuiz,
    currentQuestion: QUESTIONS[currentStep],
  };
}
