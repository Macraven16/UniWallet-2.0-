"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { User } from "@/lib/types";

export default function LoginPage() {
    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<User["role"]>("STUDENT");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }

        const success = await login(email, role, undefined, password);
        if (!success) {
            setError("Invalid credentials. Please check your email and password.");
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-8 shadow-lg border border-border">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Welcome Back</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to manage your school finances
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {error && (
                        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
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
                                    className={`flex items-center justify-center rounded-lg border p-3 text-sm font-medium transition-colors ${role === "STUDENT"
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-input bg-background text-muted-foreground hover:bg-accent"
                                        }`}
                                >
                                    Student / Parent
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("ADMIN")}
                                    className={`flex items-center justify-center rounded-lg border p-3 text-sm font-medium transition-colors ${role === "ADMIN"
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-input bg-background text-muted-foreground hover:bg-accent"
                                        }`}
                                >
                                    School Admin
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
                                className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <p className="text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-medium text-primary hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
