"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { Navbar } from "@/components/shared/Navbar";
import { VoiceAssistant } from "@/components/voice/VoiceAssistant";

export default function VoicePage() {
  const router = useRouter();
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    setTimeout(() => {
      router.push("/complete");
    }, 2000);
  };

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />

      <div className="flex-1 flex flex-col pt-24 pb-8 px-5 max-w-lg mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">JJ</span>
              </div>
              <motion.div
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-background"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">Jackie AI Stylist</p>
              <p className="text-xs text-emerald-500 font-medium">Online · Ready to help</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 bg-card/80 backdrop-blur-sm border border-border/60 rounded-3xl p-5 shadow-sm flex flex-col"
          style={{ minHeight: "calc(100vh - 240px)" }}
        >
          <VoiceAssistant onComplete={handleComplete} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-xs text-center text-muted-foreground"
        >
          Tap the mic button to respond · Speak clearly in English
        </motion.p>
      </div>
    </main>
  );
}
