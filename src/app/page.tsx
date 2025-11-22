import Link from "next/link";
import { ArrowRight, ShieldCheck, Wallet, GraduationCap, CheckCircle2, Globe, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">EduPay</span>
          </div>
          <nav className="flex gap-4 items-center">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
          <div className="container px-4 md:px-6 flex flex-col items-center text-center">
            <div className="inline-flex items-center rounded-full border bg-background/50 px-3 py-1 text-sm font-medium backdrop-blur-sm mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2" />
              Trusted by 50+ Universities
            </div>
            <h1 className="font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              The Future of <br />
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">School Payments</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 mb-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
              Seamless fees payment, digital wallets, and financial planning for students and schools.
              Secure, fast, and verified.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-105"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full border border-input bg-background px-8 text-base font-medium shadow-sm transition-all hover:bg-accent hover:text-accent-foreground hover:scale-105"
              >
                Login to Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container py-12 md:py-24 lg:py-32 px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Verified Payments</h3>
              <p className="text-muted-foreground">
                Pay directly to verified school accounts. Eliminate fraud and ensure your fees reach the right destination instantly.
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Digital Wallet</h3>
              <p className="text-muted-foreground">
                Manage cafeteria, hostel, and bookstore payments from one secure wallet. Top up easily via Mobile Money or Card.
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Financial Planning</h3>
              <p className="text-muted-foreground">
                Track tuition, set savings goals, and pay in flexible installments. Stay on top of your education finances.
              </p>
            </div>
          </div>
        </section>

        {/* Social Proof / Stats */}
        <section className="border-y bg-muted/50 py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-3 text-center">
              <div className="space-y-2">
                <h4 className="text-4xl font-bold text-primary">GHS 50M+</h4>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Processed Securely</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-4xl font-bold text-primary">50,000+</h4>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Students Active</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-4xl font-bold text-primary">99.9%</h4>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Uptime Reliability</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-24 px-4">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center shadow-2xl sm:px-16 md:py-24">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to modernize your campus?
              </h2>
              <p className="text-lg text-primary-foreground/80">
                Join thousands of students and schools already using EduPay for a smarter financial future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="/signup"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-background px-8 text-base font-medium text-primary shadow transition-colors hover:bg-background/90"
                >
                  Create Account
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-8 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/20"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          </div>
        </section>
      </main>

      <footer className="border-t bg-background py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-xl text-primary">
                <GraduationCap className="h-6 w-6" />
                <span>EduPay</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering education through seamless financial solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">About Us</Link></li>
                <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} EduPay. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
