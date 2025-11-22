"use client";

import { useState, useEffect } from "react";

import { useAuth } from "@/lib/auth-context";
import { MOCK_STUDENTS, MOCK_SCHOOLS } from "@/lib/mock-data";
import { User, Mail, School, Hash, GraduationCap, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function StudentProfilePage() {
    const { user } = useAuth();
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("school_fintech_token");
                if (!token) return;

                const res = await fetch("/api/students/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    const data = await res.json();
                    setStudent(data);
                } else {
                    // Fallback to mock if API fails (for demo without DB)
                    console.warn("Failed to fetch profile, using fallback");
                    // setError("Failed to load profile");
                }
            } catch (err) {
                console.error("Profile fetch error", err);
                // setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <p className="text-muted-foreground">Loading profile...</p>
            </div>
        );
    }

    // Fallback data if API failed or no data
    const displayStudent = student || {
        grade: "Level 100",
        studentIdNumber: "GCTU-2023-001",
        campus: "Main Campus",
        school: { name: "Ghana Communication Technology University (GCTU)" }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                <p className="text-muted-foreground">Manage your personal and academic information.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                {/* Profile Card */}
                <Card>
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl mb-4">
                            {user?.name?.[0] || "S"}
                        </div>
                        <h2 className="text-xl font-bold">{user?.name}</h2>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                        <div className="mt-4 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                            Student
                        </div>
                    </CardContent>
                </Card>

                {/* Details */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Academic Information</CardTitle>
                            <CardDescription>Details about your enrollment.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <School className="h-4 w-4" /> School
                                    </label>
                                    <p className="font-medium">{displayStudent.school?.name || "Ghana Communication Technology University (GCTU)"}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Hash className="h-4 w-4" /> Student ID
                                    </label>
                                    <p className="font-medium">{displayStudent.studentIdNumber}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4" /> Grade/Level
                                    </label>
                                    <p className="font-medium">{displayStudent.grade}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <MapPin className="h-4 w-4" /> Campus
                                    </label>
                                    <p className="font-medium">{displayStudent.campus}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                            <CardDescription>Your personal contact details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Mail className="h-4 w-4" /> Email
                                    </label>
                                    <p className="font-medium">{user?.email}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Phone className="h-4 w-4" /> Phone
                                    </label>
                                    <p className="font-medium">+233 50 000 0000</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
