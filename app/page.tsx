"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mic, ClipboardList, Sparkles, ArrowRight } from "lucide-react";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden">
      <AnimatedBackground />

      <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center space-y-3"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Smart Fit Technology
          </motion.div>

          <h1 className="font-display text-5xl font-semibold text-foreground leading-none tracking-tight">
            Jackie
            <br />
            <span className="text-primary italic">Jeans</span>
          </h1>

          <p className="text-muted-foreground text-base leading-relaxed max-w-xs mx-auto">
            Find your perfect fit in under 2 minutes.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full space-y-4"
        >
          {/* Manual */}
          <motion.div
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <button
              onClick={() => router.push("/manual")}
              className="w-full group bg-card border border-border/60 hover:border-primary/30 rounded-3xl p-6 text-left shadow-sm shadow-black/5 hover:shadow-md hover:shadow-primary/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-foreground">
                      Manual Fit Quiz
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Answer 10 quick questions at your own pace
                    </p>
                  </div>
                </div>
                <motion.div
                  className="mt-1 w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  whileHover={{ x: 3 }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>

              <div className="mt-4 flex gap-2">
                {["Height", "Waist", "Brands", "Style"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-secondary text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          </motion.div>

          {/* Voice */}
          <motion.div
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <button
              onClick={() => router.push("/voice")}
              className="w-full group bg-gradient-to-br from-primary to-violet-600 rounded-3xl p-6 text-left shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-white">
                      AI Voice Stylist
                    </h2>
                    <p className="text-sm text-white/75 mt-1">
                      Chat with your personal AI fitting assistant
                    </p>
                  </div>
                </div>
                <motion.div
                  className="mt-1 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
                  whileHover={{ x: 3 }}
                >
                  <ArrowRight className="w-4 h-4 text-white" />
                </motion.div>
              </div>

              <div className="mt-4 flex gap-2">
                {["Voice", "AI", "Fast", "Fun"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/20 text-white/90"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-muted-foreground text-center"
        >
          Your data stays on your device. We never share your measurements.
        </motion.p>
      </div>
    </main>
  );
}
