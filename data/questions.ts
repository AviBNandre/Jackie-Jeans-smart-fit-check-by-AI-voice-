import { Question } from "@/types";

export const HEIGHTS = [
  "4'10\"", "4'11\"",
  "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"",
  "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"",
  "6'0\"", "6'1\"", "6'2\"",
];

export const WAIST_SIZES = Array.from({ length: 29 }, (_, i) =>
  String(i + 24)
);

export const HIP_SIZES = Array.from({ length: 29 }, (_, i) =>
  String(i + 32)
);

export const BRANDS = [
  "Levi's",
  "Lee",
  "Wrangler",
  "Diesel",
  "American Eagle",
  "Gap",
  "Uniqlo",
  "H&M",
  "Zara",
  "Old Navy",
  "Calvin Klein",
  "Jack & Jones",
  "Pepe Jeans",
  "True Religion",
  "Lucky Brand",
  "G-Star RAW",
  "Tommy Hilfiger",
  "Armani Exchange",
  "Lee Cooper",
  "Forever 21",
];

export const QUESTIONS: Question[] = [
  {
    id: 1,
    key: "height",
    question: "What's your height?",
    type: "dropdown",
    options: HEIGHTS,
  },
  {
    id: 2,
    key: "weight",
    question: "What's your weight? (Optional)",
    type: "number",
    optional: true,
  },
  {
    id: 3,
    key: "waist",
    question: "What's your waist measurement?",
    type: "dropdown",
    options: WAIST_SIZES,
  },
  {
    id: 4,
    key: "hip",
    question: "What's your hip measurement?",
    type: "dropdown",
    options: HIP_SIZES,
  },
  {
    id: 5,
    key: "waistFit",
    question: "How do you like your waist fit?",
    type: "radio",
    options: ["Snug", "Slightly Relaxed", "Relaxed"],
  },
  {
    id: 6,
    key: "rise",
    question: "What rise do you prefer?",
    type: "radio",
    options: ["High Rise", "Mid Rise", "Low Rise"],
  },
  {
    id: 7,
    key: "thighFit",
    question: "How do you like the thigh fit?",
    type: "radio",
    options: ["Fitted", "Relaxed", "Loose"],
  },
  {
    id: 8,
    key: "brands",
    question: "Which denim brands have you worn before?",
    type: "multiselect",
    options: BRANDS,
  },
  {
    id: 9,
    key: "brandSizes",
    question: "What size do you wear in each brand?",
    type: "dynamic-brands",
  },
  {
    id: 10,
    key: "fitFrustration",
    question: "What's your biggest fit frustration with jeans?",
    type: "radio",
    options: [
      "Waist Gap",
      "Hip Tightness",
      "Wrong Length",
      "Thigh Fit",
      "Rise",
      "Other",
    ],
  },
];
