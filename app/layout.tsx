import ScrollProgress from "@/components/ui/ScrollProgress";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ContentProvider } from "@/contexts/ContentContext";

export const metadata: Metadata = {
  title: "Akintola Samuel",
  description:
    "Teaching, courses, and books from Akintola Samuel — Founder and Senior Pastor of Gateway Nation.",
  icons: {
    icon: [
      { url: "/brand/akintola-logo.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/brand/akintola-logo.svg",
    apple: "/brand/akintola-logo.svg",
  },
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
        <link rel="icon" type="image/svg+xml" href="/brand/akintola-logo.svg" />
        <link rel="apple-touch-icon" href="/brand/akintola-logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className="font-body bg-paper text-ink dark:bg-ink dark:text-paper transition-colors duration-300"
      >
        <ScrollProgress />
        <AuthProvider>
          <ContentProvider>{children}</ContentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
