"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
    LayoutDashboard,
    Users,
    CreditCard,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Users, label: "Users", href: "/admin/users/students" },
    { icon: CreditCard, label: "Fees & Payments", href: "/admin/fees" },
    { icon: FileText, label: "Reports", href: "/admin/reports" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { logout, user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-card transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/admin" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <GraduationCap className="h-6 w-6" />
                        <span>EduPay Admin</span>
                    </Link>
                </div>

                <div className="flex flex-col justify-between h-[calc(100vh-4rem)] p-4">
                    <nav className="space-y-1">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="space-y-4 border-t pt-4">
                        <div className="px-3 py-2">
                            <p className="text-xs font-medium text-muted-foreground">Logged in as</p>
                            <p className="text-sm font-medium truncate">{user?.name || "Admin User"}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6">
                    <button
                        className="lg:hidden p-2 -ml-2 rounded-md hover:bg-accent"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                    <div className="flex items-center gap-4 ml-auto">
                        <div className="relative group">
                            <button className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold hover:bg-primary/30 transition-colors">
                                {user?.name?.[0] || "A"}
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg border py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                <div className="px-4 py-2 border-b">
                                    <p className="text-sm font-medium">{user?.name || "Admin User"}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                </div>
                                <Link href="/admin/settings" className="block px-4 py-2 text-sm hover:bg-accent">
                                    Settings
                                </Link>
                                <button
                                    onClick={logout}
                                    className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-4 lg:p-6 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
