"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
}

export function ProgressBar({ currentStep, totalSteps, progress }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <motion.span
          key={currentStep}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-medium text-muted-foreground"
        >
          Question {currentStep + 1} of {totalSteps}
        </motion.span>
        <motion.span
          key={progress}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-primary font-semibold tabular-nums"
        >
          {progress}%
        </motion.span>
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  );
}
