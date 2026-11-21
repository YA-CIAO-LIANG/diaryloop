import { Lora, Nunito_Sans } from "next/font/google";

// Diary text and headings: a warm book serif, with italics for quotes.
const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-lora",
});

// Interface: a soft, rounded sans that stays readable at small sizes.
const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito-sans",
});

// Chinese uses the system's fonts (--dl-cjk-sans / --dl-cjk-serif).
export const fontVariables = [lora, nunitoSans]
  .map((f) => f.variable)
  .join(" ");
