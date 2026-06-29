"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-2xl mx-auto">
        <div className="backdrop-blur-xl bg-white/70 dark:bg-black/40 border border-white/50 dark:border-white/10 rounded-2xl px-5 py-3 flex items-center justify-between shadow-sm">
          <Link href="/" className="font-display font-semibold text-lg tracking-tight text-foreground hover:text-primary transition-colors">
            Jackie<span className="text-primary">.</span>
          </Link>
          <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
            Smart Fit
          </span>
        </div>
      </div>
    </motion.nav>
  );
}
