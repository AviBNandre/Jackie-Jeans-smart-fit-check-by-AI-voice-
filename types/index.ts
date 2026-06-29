export interface QuizAnswers {
  height?: string;
  weight?: string;
  waist?: string;
  hip?: string;
  waistFit?: string;
  rise?: string;
  thighFit?: string;
  brands?: string[];
  brandSizes?: Record<string, string>;
  fitFrustration?: string;
}

export interface Question {
  id: number;
  key: keyof QuizAnswers;
  question: string;
  type: "dropdown" | "number" | "radio" | "multiselect" | "dynamic-brands";
  options?: string[];
  optional?: boolean;
}

export type VoiceState =
  | "idle"
  | "speaking"
  | "listening"
  | "processing"
  | "error";

export interface VoiceMessage {
  role: "ai" | "user";
  text: string;
  timestamp: number;
}
