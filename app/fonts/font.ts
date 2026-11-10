import { Geist, Montserrat } from "next/font/google";
import localFont from "next/font/local";

export const montserrat = Montserrat({ subsets: ["latin"] });

export const geistSans = Geist({ subsets: ["latin"] });


export const sigokae = localFont({
  src: "./Sigokae Demo.otf",
});

export const centuryGothic = localFont({
  src: "./centurygothic.ttf",
});

export const cabinetGrotesk = localFont({
  src: [
    {
      path: "./cabinet-grotesk-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./cabinet-grotesk-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

