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

