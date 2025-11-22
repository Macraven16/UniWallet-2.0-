"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types";
import { MOCK_USERS } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    login: (email: string, role: User["role"], name?: string, password?: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("school_fintech_token");
            if (token) {
                try {
                    const res = await fetch("/api/auth/me", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUser(data.user);
                    } else {
                        localStorage.removeItem("school_fintech_token");
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Auth check failed", error);
                    localStorage.removeItem("school_fintech_token");
                    setUser(null);
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email: string, role: User["role"], name?: string, password?: string) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                setIsLoading(false);
                return { success: false, error: errorData.error || "Login failed" };
            }

            const data = await res.json();
            setUser(data.user);
            localStorage.setItem("school_fintech_token", data.token);

            // Redirect based on role
            if (data.user.role === "ADMIN" || data.user.role === "MASTER_ADMIN" || data.user.role === "STAFF") {
                router.push("/admin");
            } else {
                router.push("/student");
            }
            setIsLoading(false);
            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            setIsLoading(false);
            return { success: false, error: "Network error" };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("school_fintech_token");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
