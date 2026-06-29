"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ShoppingBag, Star } from "lucide-react";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { Button } from "@/components/ui/button";

const confettiColors = [
  "bg-blue-400",
  "bg-violet-400",
  "bg-pink-400",
  "bg-yellow-400",
  "bg-emerald-400",
  "bg-indigo-400",
];

export default function CompletePage() {
  const handleContinue = () => {
    window.location.href = "https://jackie-jeans.vercel.app/";
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden">
      <AnimatedBackground />

      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-sm ${confettiColors[i % confettiColors.length]}`}
            initial={{
              top: "-5%",
              left: `${Math.random() * 100}%`,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              top: "110%",
              rotate: Math.random() * 720 - 360,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              delay: Math.random() * 2,
              ease: "easeIn",
              repeat: Infinity,
              repeatDelay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-sm mx-auto text-center space-y-8 relative">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className="inline-flex"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-xl shadow-primary/30">
              <span className="text-4xl">🎉</span>
            </div>
            {/* Stars */}
            {[
              { top: "-8px", right: "-8px" },
              { bottom: "-4px", left: "-8px" },
              { top: "50%", right: "-12px" },
            ].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={pos}
                animate={{ rotate: 360, scale: [1, 1.3, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              >
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <h1 className="font-display text-4xl font-semibold text-foreground">
            You're all set!
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            We've built your personal fit profile. Your perfect pair of Jackie Jeans is waiting.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { value: "98%", label: "Fit accuracy" },
            { value: "2min", label: "Time taken" },
            { value: "100+", label: "Styles matched" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="bg-card border border-border/60 rounded-2xl p-3 text-center"
            >
              <p className="text-xl font-bold text-primary font-display">{value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <Button
            size="xl"
            onClick={handleContinue}
            className="w-full gap-2 bg-gradient-to-r from-primary to-violet-600 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Your fit profile has been saved</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
