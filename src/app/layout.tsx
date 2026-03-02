import type { Metadata } from "next";
import { Montserrat, Tenor_Sans } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const tenorSans = Tenor_Sans({
  variable: "--font-tenor",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Course Hunter - 360 Degree Marketing Solution Provider",
  description: "We are a leading marketing agency dedicated to transforming businesses through innovative digital solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${tenorSans.variable} font-serif antialiased`}>
        {children}
      </body>
    </html>
  );
}
