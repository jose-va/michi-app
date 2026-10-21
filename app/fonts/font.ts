import { Bodoni_Moda, Montserrat, Poppins } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import localFont from "next/font/local";

export const montserrat = Montserrat({ subsets: ["latin"] });

export const bodoni = Bodoni_Moda({
    subsets: ["latin"],
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
});

export const sigokae = localFont({
  src: "./Sigokae Demo.otf",
});

export const centuryGothic = localFont({
  src: "./centurygothic.ttf",
});

