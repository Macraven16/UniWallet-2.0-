import Link from "next/link";
import { ArrowRight, ShieldCheck, Wallet, GraduationCap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <GraduationCap className="h-6 w-6" />
            <span>EduPay</span>
          </div>
          <nav className="flex gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        <section className="w-full space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 flex flex-col items-center justify-center">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center px-4">
            <h1 className="font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              The Future of School Payments
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Seamless fees payment, digital wallets, and financial planning for students and schools.
              Secure, fast, and verified.
            </p>
            <div className="flex gap-4">
              <Link
                href="/signup"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        <section className="container space-y-6 py-8 md:py-12 lg:py-24 px-4 flex flex-col items-center">
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <ShieldCheck className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Verified Payments</h3>
                  <p className="text-sm text-muted-foreground">
                    Pay directly to verified school accounts. No more fraud or fake numbers.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Wallet className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Digital Wallet</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage cafeteria, hostel, and bookstore payments from one secure wallet.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <GraduationCap className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Financial Planning</h3>
                  <p className="text-sm text-muted-foreground">
                    Track tuition, set savings goals, and pay in flexible installments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <GraduationCap className="h-6 w-6 text-primary" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © {new Date().getFullYear()} EduPay. All rights reserved.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground md:flex-row md:gap-6">
            <div className="flex items-center gap-2">
              <span>Contact:</span>
              <a href="tel:0504654589" className="hover:text-foreground transition-colors">050 465 4589</a>
              <span>|</span>
              <a href="mailto:admin@raventech.com.gh" className="hover:text-foreground transition-colors">admin@raventech.com.gh</a>
            </div>
            <div className="flex gap-4">
              <Link href="#" className="hover:underline underline-offset-4">Terms</Link>
              <Link href="#" className="hover:underline underline-offset-4">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
