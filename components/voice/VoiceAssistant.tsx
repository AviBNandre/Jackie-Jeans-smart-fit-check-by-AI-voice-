"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { QuizAnswers, VoiceMessage, VoiceState } from "@/types";
import { BRANDS, HEIGHTS, WAIST_SIZES, HIP_SIZES } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type VoiceStep =
  | "intro"
  | "height"
  | "weight"
  | "waist"
  | "hip"
  | "waistFit"
  | "rise"
  | "thighFit"
  | "brands"
  | "brandSizes"
  | "fitFrustration"
  | "complete";

interface VoiceAssistantProps {
  onComplete: () => void;
}

function parseHeight(text: string): string | null {
  const lower = text.toLowerCase().trim();

  // Handle "five foot six" style
  const wordMap: Record<string, number> = {
    zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
    seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
  };

  const feetWords = ["foot", "feet", "ft"];
  const inchWords = ["inch", "inches", "in"];

  let feet: number | null = null;
  let inches: number | null = null;

  // Numeric patterns like "5'6" or "5 6" or "5 foot 6"
  const numericMatch = lower.match(/(\d+)['\s][\s]?(\d+)/);
  if (numericMatch) {
    feet = parseInt(numericMatch[1]);
    inches = parseInt(numericMatch[2]);
  } else {
    // Word patterns
    const words = lower.split(/\s+/);
    let i = 0;
    while (i < words.length) {
      const word = words[i].replace(/[^a-z0-9]/g, "");
      const num = wordMap[word] ?? parseInt(word);
      if (!isNaN(num)) {
        const nextWord = words[i + 1]?.replace(/[^a-z]/g, "");
        if (nextWord && feetWords.some((fw) => nextWord.includes(fw))) {
          feet = num;
          i += 2;
          continue;
        } else if (feet !== null) {
          inches = num;
        }
      }
      i++;
    }
    if (feet === null) {
      // Just a number? Assume feet
      const single = lower.match(/\d+/);
      if (single) feet = parseInt(single[0]);
    }
  }

  if (feet !== null && feet >= 4 && feet <= 6) {
    const inStr = inches !== null ? `${inches}"` : "";
    const heightStr = `${feet}'${inStr}`;
    // Find closest in HEIGHTS
    const target = HEIGHTS.find((h) => h.startsWith(`${feet}'`));
    if (inches !== null) {
      const exact = HEIGHTS.find((h) => h === `${feet}'${inches}"`);
      if (exact) return exact;
    }
    return target || HEIGHTS[6]; // default to 5'6"
  }
  return null;
}

function parseNumber(text: string): string | null {
  const wordMap: Record<string, number> = {
    zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
    seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
    thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
    eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40,
    fifty: 50, sixty: 60,
  };

  const lower = text.toLowerCase().trim();

  // Try direct number
  const numMatch = lower.match(/\d+/);
  if (numMatch) return numMatch[0];

  // Try words
  const words = lower.split(/\s+/);
  let total = 0;
  let found = false;
  for (const word of words) {
    const clean = word.replace(/[^a-z]/g, "");
    if (wordMap[clean] !== undefined) {
      total += wordMap[clean];
      found = true;
    }
  }
  return found ? String(total) : null;
}

function parseBrands(text: string): string[] {
  const lower = text.toLowerCase();
  return BRANDS.filter((brand) =>
    lower.includes(brand.toLowerCase().replace(/[^a-z0-9 ]/g, ""))
  );
}

function parseWaistFit(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes("snug") || lower.includes("tight")) return "Snug";
  if (lower.includes("relax")) {
    if (lower.includes("slightly") || lower.includes("little")) return "Slightly Relaxed";
    return "Relaxed";
  }
  return null;
}

function parseRise(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes("high")) return "High Rise";
  if (lower.includes("low")) return "Low Rise";
  if (lower.includes("mid")) return "Mid Rise";
  return null;
}

function parseThighFit(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes("fitted") || lower.includes("fit")) return "Fitted";
  if (lower.includes("loose")) return "Loose";
  if (lower.includes("relax")) return "Relaxed";
  return null;
}

function parseFrustration(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes("waist") || lower.includes("gap")) return "Waist Gap";
  if (lower.includes("hip") || lower.includes("tight")) return "Hip Tightness";
  if (lower.includes("length") || lower.includes("short") || lower.includes("long")) return "Wrong Length";
  if (lower.includes("thigh")) return "Thigh Fit";
  if (lower.includes("rise")) return "Rise";
  if (lower.includes("other")) return "Other";
  return null;
}

export function VoiceAssistant({ onComplete }: VoiceAssistantProps) {
  const [answers, setAnswers] = useLocalStorage<QuizAnswers>("jackie-jeans-answers", {});
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [currentStep, setCurrentStep] = useState<VoiceStep>("intro");
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [pendingBrands, setPendingBrands] = useState<string[]>([]);
  const [currentBrandIndex, setCurrentBrandIndex] = useState(0);
  const [brandSizes, setBrandSizes] = useState<Record<string, string>>({});
  const [errorCount, setErrorCount] = useState(0);

  const { transcript, isListening, startListening, stopListening, resetTranscript, isSupported } =
    useSpeechRecognition();
  const { speak, cancel } = useSpeechSynthesis();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processingRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = useCallback((role: "ai" | "user", text: string) => {
    setMessages((prev) => [
      ...prev,
      { role, text, timestamp: Date.now() },
    ]);
  }, []);

  const sayAndListen = useCallback(
    async (text: string) => {
      if (processingRef.current) return;
      processingRef.current = true;

      addMessage("ai", text);
      setVoiceState("speaking");
      cancel();

      await speak(text);

      setVoiceState("listening");
      resetTranscript();
      startListening();
      processingRef.current = false;
    },
    [addMessage, cancel, speak, resetTranscript, startListening]
  );

  const sayOnly = useCallback(
    async (text: string) => {
      addMessage("ai", text);
      setVoiceState("speaking");
      cancel();
      await speak(text);
      setVoiceState("idle");
    },
    [addMessage, cancel, speak]
  );

  // Start the flow
  useEffect(() => {
    const timer = setTimeout(() => {
      sayAndListen(
        "Hello! I'm your Jackie Jeans AI stylist. Let's find your perfect fit in just a few questions. First, what's your height?"
      );
      setCurrentStep("height");
    }, 800);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle transcript when listening stops
  useEffect(() => {
    if (!isListening && transcript && voiceState === "listening") {
      handleUserResponse(transcript);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, transcript]);

  const handleUserResponse = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        sayAndListen("I didn't catch that. Could you please repeat?");
        return;
      }

      addMessage("user", text);
      stopListening();
      setVoiceState("processing");

      const lower = text.toLowerCase();
      const isSkip = lower.includes("skip") || lower.includes("pass") || lower.includes("no");

      switch (currentStep) {
        case "height": {
          const height = parseHeight(text);
          if (height) {
            setAnswers((prev) => ({ ...prev, height }));
            setErrorCount(0);
            await sayAndListen(
              `Great! Height recorded as ${height}. Now, what's your weight in pounds? You can say skip if you'd prefer not to share.`
            );
            setCurrentStep("weight");
          } else {
            setErrorCount((c) => c + 1);
            await sayAndListen(
              "I didn't quite catch that. Please say your height like five foot six, or five six."
            );
          }
          break;
        }

        case "weight": {
          if (isSkip) {
            setErrorCount(0);
            await sayAndListen(
              "No problem! Let's move on. What's your waist measurement in inches?"
            );
            setCurrentStep("waist");
          } else {
            const weight = parseNumber(text);
            if (weight && parseInt(weight) > 50 && parseInt(weight) < 500) {
              setAnswers((prev) => ({ ...prev, weight }));
              setErrorCount(0);
              await sayAndListen(`Got it, ${weight} pounds. What's your waist measurement in inches?`);
              setCurrentStep("waist");
            } else {
              await sayAndListen(
                "Please say your weight in pounds, or say skip to move on."
              );
            }
          }
          break;
        }

        case "waist": {
          const waist = parseNumber(text);
          if (waist && parseInt(waist) >= 24 && parseInt(waist) <= 52) {
            setAnswers((prev) => ({ ...prev, waist }));
            setErrorCount(0);
            await sayAndListen(
              `Perfect, ${waist} inch waist. What's your hip measurement in inches?`
            );
            setCurrentStep("hip");
          } else {
            await sayAndListen(
              "Please say your waist size in inches, between 24 and 52."
            );
          }
          break;
        }

        case "hip": {
          const hip = parseNumber(text);
          if (hip && parseInt(hip) >= 32 && parseInt(hip) <= 60) {
            setAnswers((prev) => ({ ...prev, hip }));
            setErrorCount(0);
            await sayAndListen(
              `Got it, ${hip} inches. How do you like your waist fit? You can say snug, slightly relaxed, or relaxed.`
            );
            setCurrentStep("waistFit");
          } else {
            await sayAndListen(
              "Please say your hip measurement in inches, between 32 and 60."
            );
          }
          break;
        }

        case "waistFit": {
          const waistFit = parseWaistFit(text);
          if (waistFit) {
            setAnswers((prev) => ({ ...prev, waistFit }));
            setErrorCount(0);
            await sayAndListen(
              `${waistFit} noted. What rise do you prefer? High rise, mid rise, or low rise?`
            );
            setCurrentStep("rise");
          } else {
            await sayAndListen(
              "Please say snug, slightly relaxed, or relaxed."
            );
          }
          break;
        }

        case "rise": {
          const rise = parseRise(text);
          if (rise) {
            setAnswers((prev) => ({ ...prev, rise }));
            setErrorCount(0);
            await sayAndListen(
              `${rise} it is. How do you like the thigh fit? Fitted, relaxed, or loose?`
            );
            setCurrentStep("thighFit");
          } else {
            await sayAndListen(
              "Please say high rise, mid rise, or low rise."
            );
          }
          break;
        }

        case "thighFit": {
          const thighFit = parseThighFit(text);
          if (thighFit) {
            setAnswers((prev) => ({ ...prev, thighFit }));
            setErrorCount(0);
            await sayAndListen(
              `${thighFit} thigh fit. Now, which denim brands have you worn before? You can name as many as you like, such as Levis, Wrangler, Gap, or others.`
            );
            setCurrentStep("brands");
          } else {
            await sayAndListen(
              "Please say fitted, relaxed, or loose."
            );
          }
          break;
        }

        case "brands": {
          const foundBrands = parseBrands(text);
          if (foundBrands.length > 0) {
            setPendingBrands(foundBrands);
            setAnswers((prev) => ({ ...prev, brands: foundBrands }));
            setCurrentBrandIndex(0);
            setErrorCount(0);
            await sayAndListen(
              `I heard ${foundBrands.join(", ")}. What size do you wear in ${foundBrands[0]}?`
            );
            setCurrentStep("brandSizes");
          } else if (isSkip || lower.includes("none") || lower.includes("don't")) {
            setAnswers((prev) => ({ ...prev, brands: [] }));
            setErrorCount(0);
            await sayAndListen(
              "No problem. Finally, what's your biggest fit frustration with jeans? Options are waist gap, hip tightness, wrong length, thigh fit, rise, or other."
            );
            setCurrentStep("fitFrustration");
          } else {
            await sayAndListen(
              "I didn't recognize those brands. Try saying names like Levis, Wrangler, Gap, Zara, or Calvin Klein."
            );
          }
          break;
        }

        case "brandSizes": {
          const size = parseNumber(text);
          if (size) {
            const newSizes = { ...brandSizes, [pendingBrands[currentBrandIndex]]: size };
            setBrandSizes(newSizes);
            setErrorCount(0);

            const nextIndex = currentBrandIndex + 1;
            if (nextIndex < pendingBrands.length) {
              setCurrentBrandIndex(nextIndex);
              await sayAndListen(
                `${size} in ${pendingBrands[currentBrandIndex]}. What size do you wear in ${pendingBrands[nextIndex]}?`
              );
            } else {
              setAnswers((prev) => ({ ...prev, brandSizes: newSizes }));
              await sayAndListen(
                "Great! Last question — what's your biggest fit frustration with jeans? Waist gap, hip tightness, wrong length, thigh fit, rise, or other?"
              );
              setCurrentStep("fitFrustration");
            }
          } else {
            await sayAndListen(
              `Please say a size number for ${pendingBrands[currentBrandIndex]}, like 28 or 32.`
            );
          }
          break;
        }

        case "fitFrustration": {
          const frustration = parseFrustration(text);
          if (frustration) {
            setAnswers((prev) => ({ ...prev, fitFrustration: frustration }));
            setErrorCount(0);
            await sayOnly(
              "Perfect! I've built your complete fit profile. You're all set to find your perfect Jackie Jeans!"
            );
            setTimeout(() => {
              setCurrentStep("complete");
              onComplete();
            }, 1500);
          } else {
            await sayAndListen(
              "Please say one of: waist gap, hip tightness, wrong length, thigh fit, rise, or other."
            );
          }
          break;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentStep, pendingBrands, currentBrandIndex, brandSizes, addMessage, sayAndListen, sayOnly, stopListening]
  );

  const handleManualListen = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      setVoiceState("listening");
      startListening();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "flex",
                msg.role === "ai" ? "justify-start" : "justify-end"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                  msg.role === "ai"
                    ? "bg-card border border-border/60 text-foreground rounded-tl-sm"
                    : "bg-primary text-primary-foreground rounded-tr-sm"
                )}
              >
                {msg.role === "ai" && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                      Jackie AI
                    </span>
                  </div>
                )}
                <p>{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {voiceState === "processing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-card border border-border/60 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1.5 items-center">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-primary/60"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-primary/60"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
                />
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-primary/60"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice controls */}
      <div className="mt-4 space-y-4">
        {/* Live transcript */}
        <AnimatePresence>
          {(isListening || transcript) && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="bg-secondary/50 border border-border/40 rounded-2xl px-4 py-3"
            >
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                {isListening ? "Listening…" : "Heard:"}
              </p>
              <p className="text-sm text-foreground min-h-[1.25rem]">
                {transcript || (
                  <span className="text-muted-foreground/50">Say something…</span>
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mic button */}
        <div className="flex items-center justify-center gap-4">
          {voiceState === "speaking" && (
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-primary" />
              <div className="flex gap-0.5 items-end h-5">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="voice-bar w-1 bg-primary/60 rounded-full"
                    style={{ height: `${Math.random() * 100}%`, minHeight: 4 }}
                  />
                ))}
              </div>
            </div>
          )}

          <motion.button
            onClick={handleManualListen}
            disabled={voiceState === "speaking" || voiceState === "processing"}
            whileTap={{ scale: 0.93 }}
            className={cn(
              "relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200",
              isListening
                ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                : voiceState === "speaking" || voiceState === "processing"
                ? "bg-secondary text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50"
            )}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            {isListening && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-red-400"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            {isListening ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </motion.button>
        </div>

        {!isSupported && (
          <p className="text-xs text-center text-destructive">
            Voice recognition is not supported in this browser. Please use Chrome or Edge.
          </p>
        )}
      </div>
    </div>
  );
}
