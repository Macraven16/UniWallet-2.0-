"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { User } from "@/lib/types";
import { Eye, EyeOff } from "lucide-react";

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
    "Knutsford University College",
    "Other"
];

export default function SignupPage() {
    const { login, isLoading: authLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<User["role"]>("STUDENT");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // New Fields
    const [university, setUniversity] = useState("");
    const [indexNumber, setIndexNumber] = useState("");
    const [phone, setPhone] = useState("");
    const [universities, setUniversities] = useState<string[]>([]);

    const [customUniversity, setCustomUniversity] = useState("");

    useEffect(() => {
        // Fetch universities
        fetch("/api/universities")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Remove duplicates from API if any
                    const uniqueUniversities = Array.from(new Set(data.map((u: any) => u.name)));
                    setUniversities(uniqueUniversities as string[]);
                }
            })
            .catch(err => console.error("Failed to fetch universities", err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!email || !name || !password) {
            setError("Please fill in all required fields");
            setLoading(false);
            return;
        }

        const finalUniversity = university === "Other" ? customUniversity : university;

        if (role === "STUDENT" && !finalUniversity) {
            setError("Please select or enter your university");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                    name,
                    role,
                    university: finalUniversity,
                    indexNumber,
                    phone
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Signup failed");
                setLoading(false);
                return;
            }

            // Auto login
            await login(email, role, name, password);
        } catch (err) {
            setError("An error occurred. Please try again.");
            setLoading(false);
        }
    };

    const isLoading = authLoading || loading;

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
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Create Account</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Join the platform to manage education payments
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
                                className="mt-1 block w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
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
                                    autoComplete="new-password"
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
                                        className="mt-1 block w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                                    >
                                        <option value="">Select University</option>
                                        {(universities.length > 0 ? universities : GHANA_UNIVERSITIES).map((uni) => (
                                            <option key={uni} value={uni}>
                                                {uni}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {university === "Other" && (
                                    <div>
                                        <label htmlFor="customUniversity" className="block text-sm font-medium text-foreground">
                                            Enter School Name
                                        </label>
                                        <input
                                            id="customUniversity"
                                            name="customUniversity"
                                            type="text"
                                            required
                                            value={customUniversity}
                                            onChange={(e) => setCustomUniversity(e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                                            placeholder="Enter your school name"
                                        />
                                    </div>
                                )}

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
                                            className="mt-1 block w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
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
                                            className="mt-1 block w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
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
                        className="flex w-full justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                    >
                        {isLoading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <div className="text-center text-sm">
                    <p className="text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-primary hover:underline hover:text-primary/80 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
