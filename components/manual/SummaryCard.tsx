"use client";

import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import { QuizAnswers } from "@/types";
import { Button } from "@/components/ui/button";

interface SummaryCardProps {
  answers: QuizAnswers;
  onEdit: (step: number) => void;
}

const FIELD_LABELS: { key: keyof QuizAnswers; label: string; step: number }[] = [
  { key: "height", label: "Height", step: 0 },
  { key: "weight", label: "Weight", step: 1 },
  { key: "waist", label: "Waist", step: 2 },
  { key: "hip", label: "Hip", step: 3 },
  { key: "waistFit", label: "Waist Fit", step: 4 },
  { key: "rise", label: "Rise", step: 5 },
  { key: "thighFit", label: "Thigh Fit", step: 6 },
  { key: "brands", label: "Brands", step: 7 },
  { key: "fitFrustration", label: "Fit Frustration", step: 9 },
];

export function SummaryCard({ answers, onEdit }: SummaryCardProps) {
  const formatValue = (key: keyof QuizAnswers, value: QuizAnswers[keyof QuizAnswers]) => {
    if (!value) return "—";
    if (key === "brands" && Array.isArray(value)) {
      return value.join(", ") || "—";
    }
    if (key === "weight") return `${value} lbs`;
    if (key === "waist" || key === "hip") return `${value}"`;
    return String(value);
  };

  return (
    <div className="space-y-3">
      {FIELD_LABELS.map(({ key, label, step }, i) => {
        const value = answers[key];
        const isEmpty = !value || (Array.isArray(value) && value.length === 0);

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-secondary/50 border border-border/40"
          >
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {label}
              </p>
              <p className={`text-sm font-medium ${isEmpty ? "text-muted-foreground/50" : "text-foreground"}`}>
                {formatValue(key, value)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(step)}
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              aria-label={`Edit ${label}`}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
        );
      })}

      {/* Brand sizes */}
      {answers.brandSizes && Object.keys(answers.brandSizes).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-4 py-3.5 rounded-2xl bg-secondary/50 border border-border/40"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Brand Sizes
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(8)}
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              aria-label="Edit brand sizes"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(answers.brandSizes).map(([brand, size]) => (
              <div key={brand} className="text-sm">
                <span className="text-muted-foreground">{brand}:</span>{" "}
                <span className="font-medium">{size}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
