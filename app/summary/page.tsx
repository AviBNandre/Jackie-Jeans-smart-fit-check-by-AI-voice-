"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { Navbar } from "@/components/shared/Navbar";
import { SummaryCard } from "@/components/manual/SummaryCard";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { QuizAnswers } from "@/types";

export default function SummaryPage() {
  const router = useRouter();
  const [answers] = useLocalStorage<QuizAnswers>("jackie-jeans-answers", {});

  const handleEdit = (step: number) => {
    // Store the step to resume at
    localStorage.setItem("jackie-jeans-resume-step", String(step));
    router.push("/manual");
  };

  const handleSubmit = () => {
    router.push("/complete");
  };

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />

      <div className="flex-1 pt-24 pb-8 px-5 max-w-lg mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">Quiz Complete</span>
            </div>
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Review your answers
            </h1>
            <p className="text-sm text-muted-foreground">
              Tap the edit icon to change any answer.
            </p>
          </div>

          {/* Summary */}
          <SummaryCard answers={answers} onEdit={handleEdit} />

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Button
              size="lg"
              onClick={handleSubmit}
              className="w-full gap-2"
            >
              <Send className="w-4 h-4" />
              Submit My Fit Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/manual")}
              className="w-full text-muted-foreground gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to questions
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
