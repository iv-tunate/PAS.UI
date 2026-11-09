import ScrollProgress from "@/components/ui/ScrollProgress";
import type { Metadata } from "next";
import { Manrope, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ContentProvider } from "@/contexts/ContentContext";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// Only for the "Akintola Samuel" wordmark.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
  style: ["normal", "italic"],
  variable: "--font-logo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Akintola Samuel",
  description:
    "Teaching, courses, and books from Akintola Samuel — Founder and Senior Pastor of Gateway Nation.",
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored ? stored : 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${manrope.variable} ${inter.variable} ${playfair.variable} font-body bg-paper text-ink dark:bg-ink dark:text-paper transition-colors duration-300`}
      >
        <ScrollProgress />
        <AuthProvider>
          <ContentProvider>{children}</ContentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
