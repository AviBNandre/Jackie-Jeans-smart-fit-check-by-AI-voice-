"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface QuestionCardProps {
  questionNumber: number;
  question: string;
  children: ReactNode;
  direction?: number;
}

export function QuestionCard({
  questionNumber,
  question,
  children,
  direction = 1,
}: QuestionCardProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={questionNumber}
        custom={direction}
        initial={{ opacity: 0, x: direction * 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: direction * -40 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-card border border-border/60 rounded-3xl p-7 shadow-sm shadow-black/5"
      >
        <div className="space-y-5">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-primary/70 uppercase tracking-widest">
              Question {questionNumber}
            </span>
            <h2 className="text-xl font-display font-medium text-foreground leading-snug">
              {question}
            </h2>
          </div>
          <div className="pt-1">{children}</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
