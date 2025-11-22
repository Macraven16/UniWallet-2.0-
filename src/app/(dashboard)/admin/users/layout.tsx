"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function UsersLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const tabs = [
        { name: "Students", href: "/admin/users/students" },
        { name: "Staff", href: "/admin/users/staff" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            </div>

            <div className="border-b border-border">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => {
                        const isActive = pathname.startsWith(tab.href);
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={cn(
                                    "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
                                    isActive
                                        ? "border-primary text-primary"
                                        : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                                )}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {tab.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {children}
        </div>
    );
}
