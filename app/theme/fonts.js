import { Nunito } from "next/font/google";

const nunito = Nunito({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-nunito",
});

//TODO: Cambiar a guente de gotham
const gotham = Nunito({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-gotham",
});

const fonts = {
  gotham,
  nunito,
};
export default fonts;
