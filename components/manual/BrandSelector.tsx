"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { BRANDS } from "@/data/questions";
import { cn } from "@/lib/utils";

interface BrandSelectorProps {
  selected: string[];
  onChange: (brands: string[]) => void;
}

export function BrandSelector({ selected, onChange }: BrandSelectorProps) {
  const toggle = (brand: string) => {
    if (selected.includes(brand)) {
      onChange(selected.filter((b) => b !== brand));
    } else {
      onChange([...selected, brand]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {BRANDS.map((brand, i) => {
        const isSelected = selected.includes(brand);
        return (
          <motion.button
            key={brand}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            onClick={() => toggle(brand)}
            type="button"
            className={cn(
              "relative flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 text-left",
              isSelected
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background border-border hover:border-primary/50 hover:bg-primary/5 text-foreground"
            )}
          >
            <div
              className={cn(
                "flex-shrink-0 w-4 h-4 rounded-md border transition-all duration-200 flex items-center justify-center",
                isSelected
                  ? "bg-white/30 border-white/50"
                  : "border-border"
              )}
            >
              {isSelected && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="truncate">{brand}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
