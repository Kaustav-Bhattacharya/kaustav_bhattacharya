import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Loader } from "@/components/loader";
import { Grain } from "@/components/grain";
import { PhysicsOverlay } from "@/components/physics-overlay";
import content from "@/content.json";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} ${caveat.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider>
          <Loader>
            <Grain />
            {children}
            <PhysicsOverlay />
          </Loader>
        </ThemeProvider>
      </body>
    </html>
  );
}
