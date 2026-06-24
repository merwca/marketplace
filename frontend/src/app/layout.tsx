import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth";
import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Ultra-minimal Craigslist-style marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 max-w-6xl w-full mx-auto px-3 md:px-4 py-6 md:py-8">
                  {children}
                </main>
                <Footer />
              </div>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
