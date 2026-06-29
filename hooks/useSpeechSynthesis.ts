"use client";

import { useCallback, useRef } from "react";

export function useSpeechSynthesis() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback(
    (text: string, onEnd?: () => void): Promise<void> => {
      return new Promise((resolve) => {
        if (typeof window === "undefined" || !window.speechSynthesis) {
          onEnd?.();
          resolve();
          return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.volume = 1;

        // Try to use a pleasant voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice =
          voices.find(
            (v) =>
              v.name.includes("Samantha") ||
              v.name.includes("Karen") ||
              v.name.includes("Google UK English Female") ||
              (v.lang === "en-US" && v.name.includes("Female"))
          ) || voices.find((v) => v.lang === "en-US");

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => {
          onEnd?.();
          resolve();
        };

        utterance.onerror = () => {
          onEnd?.();
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      });
    },
    []
  );

  const cancel = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const isSpeaking = () => {
    if (typeof window === "undefined") return false;
    return window.speechSynthesis?.speaking ?? false;
  };

  return { speak, cancel, isSpeaking };
}
