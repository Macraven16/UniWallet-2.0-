import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { IssueReporter } from "@/components/issue-reporter";
import { ThemeProvider } from "@/components/ThemeProvider";
// ... imports removed

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduPay - School Fintech Platform",
  description: "Next-gen payments and financial planning for education",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            {children}
            {/* <IssueReporter /> */}
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
