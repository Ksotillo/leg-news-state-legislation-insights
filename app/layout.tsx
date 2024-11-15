import type { Metadata } from "next";
import { Poppins, Aleo } from "next/font/google";
import "./globals.css";
import Providers from "@/context/providers";
import { Toaster } from "@/components/ui/toaster";
import UserProfileInitializer from "@/components/user-profile-initializer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const aleo = Aleo({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-aleo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LegNews",
  description: "State legislative insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${aleo.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
          <UserProfileInitializer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
