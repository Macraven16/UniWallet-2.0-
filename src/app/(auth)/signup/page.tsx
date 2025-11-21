"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { User } from "@/lib/types";

const GHANA_UNIVERSITIES = [
    "University of Ghana (UG)",
    "Kwame Nkrumah University of Science and Technology (KNUST)",
    "University of Cape Coast (UCC)",
    "University of Education, Winneba (UEW)",
    "Ghana Communication Technology University (GCTU)",
    "Ghana Institute of Management and Public Administration (GIMPA)",
    "University of Mines and Technology (UMaT)",
    "University of Professional Studies, Accra (UPSA)",
    "University of Health and Allied Sciences (UHAS)",
    "University of Energy and Natural Resources (UENR)",
    "University for Development Studies (UDS)",
    "Accra Technical University (ATU)",
    "Kumasi Technical University (KsTU)",
    "Ashesi University",
    "Central University",
    "Valley View University",
    "Other"
];

export default function SignupPage() {
    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState<User["role"]>("STUDENT");

    // New Fields
    const [university, setUniversity] = useState("");
    const [indexNumber, setIndexNumber] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !name) return;

        // In a real app, we would send all this data to the backend
        console.log("Signup Data:", { email, name, role, university, indexNumber, phone });

        // For prototype, signup just logs you in as a new user
        await login(email, role, name, "password");
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-8 shadow-lg border border-border">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Create Account</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Join the platform to manage education payments
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                            <label htmlFor="name" className="block text-sm font-medium text-foreground">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                placeholder="John Doe"
                            />
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

                        {role === "STUDENT" && (
                            <>
                                <div>
                                    <label htmlFor="university" className="block text-sm font-medium text-foreground">
                                        University / School
                                    </label>
                                    <select
                                        id="university"
                                        name="university"
                                        required
                                        value={university}
                                        onChange={(e) => setUniversity(e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                    >
                                        <option value="">Select University</option>
                                        {GHANA_UNIVERSITIES.map((uni) => (
                                            <option key={uni} value={uni}>
                                                {uni}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="indexNumber" className="block text-sm font-medium text-foreground">
                                            Index Number
                                        </label>
                                        <input
                                            id="indexNumber"
                                            name="indexNumber"
                                            type="text"
                                            required
                                            value={indexNumber}
                                            onChange={(e) => setIndexNumber(e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                            placeholder="10293847"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                                            Phone Number
                                        </label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                                            placeholder="024 123 4567"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <p className="text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
