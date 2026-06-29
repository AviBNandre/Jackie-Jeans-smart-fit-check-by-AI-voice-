"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, SkipForward, Check } from "lucide-react";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { Navbar } from "@/components/shared/Navbar";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { QuestionCard } from "@/components/manual/QuestionCard";
import { BrandSelector } from "@/components/manual/BrandSelector";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { QuizAnswers } from "@/types";
import { QUESTIONS, HEIGHTS, WAIST_SIZES, HIP_SIZES } from "@/data/questions";

export default function ManualPage() {
  const router = useRouter();
  const [answers, setAnswers] = useLocalStorage<QuizAnswers>(
    "jackie-jeans-answers",
    {}
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<Record<number, string>>({});

  const question = QUESTIONS[currentStep];
  const progress = Math.round(((currentStep + 1) / QUESTIONS.length) * 100);

  const updateAnswer = useCallback(
    <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => {
      setAnswers((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [currentStep]: "" }));
    },
    [currentStep, setAnswers]
  );

  const validate = (): boolean => {
    if (question.optional) return true;
    if (question.key === "brands") {
      const brands = answers.brands || [];
      if (brands.length === 0) {
        setErrors((prev) => ({
          ...prev,
          [currentStep]: "Please select at least one brand, or skip.",
        }));
        return false;
      }
      return true;
    }
    if (question.key === "brandSizes") {
      const selectedBrands = answers.brands || [];
      const sizes = answers.brandSizes || {};
      for (const brand of selectedBrands) {
        if (!sizes[brand]) {
          setErrors((prev) => ({
            ...prev,
            [currentStep]: `Please select a size for ${brand}.`,
          }));
          return false;
        }
      }
      return true;
    }
    const value = answers[question.key];
    if (!value) {
      setErrors((prev) => ({
        ...prev,
        [currentStep]: "Please answer this question to continue.",
      }));
      return false;
    }
    return true;
  };

  const handleNext = () => {
    // Skip Q9 if no brands selected
    if (currentStep === 7 && (!answers.brands || answers.brands.length === 0)) {
      setDirection(1);
      setCurrentStep(9); // skip to Q10
      return;
    }

    if (!validate()) return;

    if (currentStep === QUESTIONS.length - 1) {
      router.push("/summary");
      return;
    }

    setDirection(1);
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 0) {
      router.push("/");
      return;
    }
    // Skip back over Q9 if no brands
    if (currentStep === 9 && (!answers.brands || answers.brands.length === 0)) {
      setDirection(-1);
      setCurrentStep(7);
      return;
    }
    setDirection(-1);
    setCurrentStep((prev) => prev - 1);
  };

  const handleSkip = () => {
    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, QUESTIONS.length - 1));
  };

  const renderInput = () => {
    switch (question.type) {
      case "dropdown": {
        const options =
          question.key === "height"
            ? HEIGHTS
            : question.key === "waist"
            ? WAIST_SIZES
            : HIP_SIZES;
        const label =
          question.key === "height"
            ? "Select height"
            : question.key === "waist"
            ? "Select waist (inches)"
            : "Select hip (inches)";

        return (
          <Select
            value={String(answers[question.key] ?? "")}
            onValueChange={(v) =>
              updateAnswer(question.key as keyof QuizAnswers, v)
            }
          >
            <SelectTrigger aria-label={label}>
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                  {question.key !== "height" ? '"' : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      case "number":
        return (
          <div className="space-y-2">
            <div className="relative">
              <input
                type="number"
                min={50}
                max={500}
                placeholder="e.g. 145"
                value={String(answers.weight ?? "")}
                onChange={(e) => updateAnswer("weight", e.target.value)}
                className="w-full h-12 px-4 pr-16 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                aria-label="Weight in lbs"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                lbs
              </span>
            </div>
          </div>
        );

      case "radio":
        return (
          <RadioGroup
            value={String(answers[question.key] ?? "")}
            onValueChange={(v) =>
              updateAnswer(question.key as keyof QuizAnswers, v)
            }
            className="space-y-2"
          >
            {question.options?.map((opt) => (
              <motion.div
                key={opt}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Label
                  htmlFor={opt}
                  className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    answers[question.key] === opt
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/40 hover:bg-secondary/50"
                  }`}
                >
                  <RadioGroupItem value={opt} id={opt} />
                  <span className="font-medium text-sm">{opt}</span>
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        );

      case "multiselect":
        return (
          <BrandSelector
            selected={answers.brands || []}
            onChange={(brands) => updateAnswer("brands", brands)}
          />
        );

      case "dynamic-brands": {
        const selectedBrands = answers.brands || [];
        if (selectedBrands.length === 0) return null;
        return (
          <div className="space-y-3">
            {selectedBrands.map((brand) => (
              <div key={brand} className="space-y-1.5">
                <Label className="text-sm font-medium text-muted-foreground">
                  {brand}
                </Label>
                <Select
                  value={String(answers.brandSizes?.[brand] ?? "")}
                  onValueChange={(v) =>
                    updateAnswer("brandSizes", {
                      ...(answers.brandSizes || {}),
                      [brand]: v,
                    })
                  }
                >
                  <SelectTrigger aria-label={`Size in ${brand}`}>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {WAIST_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}"
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />

      <div className="flex-1 flex flex-col pt-24 pb-8 px-5 max-w-lg mx-auto w-full">
        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <ProgressBar
            currentStep={currentStep}
            totalSteps={QUESTIONS.length}
            progress={progress}
          />
        </motion.div>

        {/* Question */}
        <div className="flex-1">
          <QuestionCard
            questionNumber={question.id}
            question={question.question}
            direction={direction}
          >
            {renderInput()}

            {/* Error */}
            <AnimatePresence>
              {errors[currentStep] && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-destructive mt-3 font-medium"
                >
                  {errors[currentStep]}
                </motion.p>
              )}
            </AnimatePresence>
          </QuestionCard>
        </div>

        {/* Navigation */}
        <div className="mt-6 space-y-3">
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              className="flex-none"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <Button
              size="lg"
              onClick={handleNext}
              className="flex-1 gap-2"
            >
              {currentStep === QUESTIONS.length - 1 ? (
                <>
                  Review Answers
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {question.optional && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="w-full text-muted-foreground gap-1.5"
            >
              <SkipForward className="w-3.5 h-3.5" />
              Skip this question
            </Button>
          )}

          {/* Brand skip */}
          {question.key === "brands" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                updateAnswer("brands", []);
                handleNext();
              }}
              className="w-full text-muted-foreground gap-1.5"
            >
              <SkipForward className="w-3.5 h-3.5" />
              I haven't worn any of these
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
