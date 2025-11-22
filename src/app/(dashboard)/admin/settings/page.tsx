"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Camera, Save, History } from "lucide-react";

export default function SettingsPage() {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        image: "",
    });
    const [activityLog, setActivityLog] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/users/profile");
            if (res.ok) {
                const data = await res.json();
                setProfile({
                    name: data.name || "",
                    email: data.email || "",
                    phoneNumber: data.phoneNumber || "",
                    image: data.image || "",
                });
                setActivityLog(data.auditLogs || []);
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            const res = await fetch("/api/users/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile),
            });

            if (res.ok) {
                setMessage("Profile updated successfully!");
                fetchProfile(); // Refresh logs
            } else {
                setMessage("Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile", error);
            setMessage("An error occurred.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Settings */}
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 border-b">
                        <h3 className="font-semibold flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Profile Information
                        </h3>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleSave} className="space-y-4">
                            {message && (
                                <div className={`p-3 text-sm rounded-md ${message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                    {message}
                                </div>
                            )}

                            <div className="flex justify-center mb-6">
                                <div className="relative h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                                    {profile.image ? (
                                        <img src={profile.image} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-12 w-12 text-muted-foreground" />
                                    )}
                                    <button type="button" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <Camera className="h-6 w-6 text-white" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="email"
                                        className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="tel"
                                        className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm"
                                        value={profile.phoneNumber}
                                        onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                                        placeholder="024 123 4567"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-xl border bg-card text-card-foreground shadow h-fit">
                    <div className="p-6 border-b">
                        <h3 className="font-semibold flex items-center gap-2">
                            <History className="h-4 w-4" />
                            Recent Activity
                        </h3>
                    </div>
                    <div className="p-6">
                        {activityLog.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center">No recent activity.</p>
                        ) : (
                            <div className="space-y-4">
                                {activityLog.map((log) => (
                                    <div key={log.id} className="flex gap-3 items-start">
                                        <div className="h-2 w-2 mt-2 rounded-full bg-primary shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium">{log.action}</p>
                                            <p className="text-xs text-muted-foreground">{log.details}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
