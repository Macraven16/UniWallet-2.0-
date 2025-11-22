"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { User } from "@/lib/types";
import { Eye, EyeOff, GraduationCap, ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<User["role"]>("STUDENT");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }

        const result = await login(email, role, undefined, password);
        if (!result.success) {
            setError(result.error || "Invalid credentials. Please check your email and password.");
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-background">
            {/* Left Side - Form */}
            <div className="flex w-full flex-col justify-center p-8 md:w-1/2 lg:p-12 xl:p-24">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </div>

                <div className="mx-auto w-full max-w-sm space-y-6">
                    <div className="space-y-2 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                                <GraduationCap className="h-7 w-7" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                        <p className="text-muted-foreground">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    I am a...
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setRole("STUDENT")}
                                        className={`flex items-center justify-center rounded-lg border p-3 text-sm font-medium transition-all duration-200 ${role === "STUDENT"
                                            ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                                            : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                                            }`}
                                    >
                                        Student
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRole("ADMIN")}
                                        className={`flex items-center justify-center rounded-lg border p-3 text-sm font-medium transition-all duration-200 ${role === "ADMIN"
                                            ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                                            : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                                            }`}
                                    >
                                        Admin
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setRole("MASTER_ADMIN")}
                                    className={`flex w-full items-center justify-center rounded-lg border p-2 text-xs font-medium transition-all duration-200 ${role === "MASTER_ADMIN"
                                        ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                                        : "border-input bg-background hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                                        }`}
                                >
                                    Master Admin Login
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-medium text-primary hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Image/Pattern */}
            <div className="hidden w-1/2 bg-muted lg:block relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="relative z-10 flex h-full flex-col justify-end p-12 text-foreground">
                    <div className="space-y-4 max-w-lg">
                        <h2 className="text-3xl font-bold leading-tight">
                            "EduPay has transformed how we manage school fees. It's secure, fast, and incredibly easy to use."
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                DK
                            </div>
                            <div>
                                <p className="font-semibold">Dr. Kwame</p>
                                <p className="text-sm text-muted-foreground">University Administrator</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
