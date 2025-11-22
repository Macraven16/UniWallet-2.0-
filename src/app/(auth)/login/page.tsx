"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { User } from "@/lib/types";
import { Eye, EyeOff } from "lucide-react";

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
        <div className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/5/59/Coat_of_arms_of_Ghana.svg')",
                    backgroundSize: "500px auto",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    opacity: 0.8,
                }}
            />
            {/* Blurred Overlay */}
            <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-sm" />

            <div className="relative z-10 w-full max-w-md space-y-8 rounded-xl bg-card/95 p-8 shadow-2xl border border-border/50 backdrop-blur-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Welcome Back</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to manage your school finances
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {error && (
                        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-foreground">
                                I am a...
                            </label>
                            <div className="mt-1 grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole("STUDENT")}
                                    className={`flex items-center justify-center rounded-lg border p-3 text-sm font-medium transition-all duration-200 ${role === "STUDENT"
                                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                                        : "border-input bg-background/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                >
                                    Student / Parent
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("ADMIN")}
                                    className={`flex items-center justify-center rounded-lg border p-3 text-sm font-medium transition-all duration-200 ${role === "ADMIN"
                                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                                        : "border-input bg-background/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                >
                                    School Admin
                                </button>
                            </div>
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={() => setRole("MASTER_ADMIN")}
                                    className={`flex w-full items-center justify-center rounded-lg border p-3 text-sm font-medium transition-all duration-200 ${role === "MASTER_ADMIN"
                                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                                        : "border-input bg-background/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                >
                                    Master Admin
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground">
                                Password
                            </label>
                            <div className="relative mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-lg border border-input bg-background/50 px-3 py-2 pr-10 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <p className="text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-medium text-primary hover:underline hover:text-primary/80 transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
