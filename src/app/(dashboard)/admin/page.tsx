"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    DollarSign,
    Users,
    School,
    CreditCard,
    Clock,
    Activity,
    UserPlus,
    Settings,
    FileText,
    ArrowUpRight,
    ArrowDownRight,
    Wallet
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import AuditLogViewer from "@/components/AuditLogViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthMonitor } from "@/components/admin/health-monitor";
import { IssueReportsList } from "@/components/admin/issue-reports-list";

function DashboardCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    trendValue,
    href,
    colorClass = "bg-primary/10 text-primary"
}: {
    title: string;
    value: string;
    icon: React.ElementType;
    description: string;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    href?: string;
    colorClass?: string;
}) {
    const Content = (
        <div className={`group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50 ${href ? 'cursor-pointer' : ''}`}>
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
                <div className={`p-2 rounded-full transition-colors ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <div className="p-6 pt-0">
                <div className="text-2xl font-bold tracking-tight">{value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {trend === "up" && <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />}
                    {trend === "down" && <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />}
                    <span className={trend === "up" ? "text-green-600 font-medium" : trend === "down" ? "text-red-600 font-medium" : ""}>
                        {trendValue}
                    </span>
                    <span className="ml-1">{description}</span>
                </div>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href}>{Content}</Link>;
    }

    return Content;
}

// Removed recharts imports due to installation failure
// import { ... } from "recharts";

// ... (DashboardCard component remains the same)

// Mock data for the graph
// const financialData = [
//     { name: 'Jan', amount: 4000 },
//     { name: 'Feb', amount: 3000 },
//     { name: 'Mar', amount: 2000 },
//     { name: 'Apr', amount: 2780 },
//     { name: 'May', amount: 1890 },
//     { name: 'Jun', amount: 2390 },
//     { name: 'Jul', amount: 3490 },
//     { name: 'Aug', amount: 4000 },
//     { name: 'Sep', amount: 3000 },
//     { name: 'Oct', amount: 2000 },
//     { name: 'Nov', amount: 2780 },
//     { name: 'Dec', amount: 3890 },
// ];

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalStaff: 0,
        totalSchools: 0,
        totalRevenue: 0,
        paymentsToday: 0,
        pendingPayments: 0,
        outstandingFees: 0,
        activityData: [] as any[], // Add activityData
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await fetch("/api/dashboard/stats");
                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setStats(prev => ({ ...prev, ...data }));
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Dynamic Greeting
    const greetingName = user?.name || "Admin";
    const greetingRole = user?.role === "ADMIN" ? "System Admin" : user?.role || "User";

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative z-0">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Welcome back, {greetingName}
                        </h1>
                        <p className="text-muted-foreground">
                            Overview of your institution's financial performance and system status.
                        </p>
                    </div>
                </div>
            </div>

            {/* QUICK ACTIONS SECTION - Hidden for Staff */}
            {user?.role !== 'STAFF' && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                        <Link href="/admin/users?tab=add" className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border bg-card hover:bg-accent/50 transition-all hover:shadow-md group">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                <UserPlus className="h-6 w-6" />
                            </div>
                            <span className="font-medium text-sm">Add New User</span>
                        </Link>
                        <Link href="/admin/users" className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border bg-card hover:bg-accent/50 transition-all hover:shadow-md group">
                            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                <Users className="h-6 w-6" />
                            </div>
                            <span className="font-medium text-sm">Manage Users</span>
                        </Link>
                        <Link href="/admin/fees" className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border bg-card hover:bg-accent/50 transition-all hover:shadow-md group">
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <span className="font-medium text-sm">Fees Management</span>
                        </Link>
                        <Link href="/admin/reports" className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border bg-card hover:bg-accent/50 transition-all hover:shadow-md group">
                            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                <FileText className="h-6 w-6" />
                            </div>
                            <span className="font-medium text-sm">Payments Summary</span>
                        </Link>
                        <Link href="/admin/schools/add" className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border bg-card hover:bg-accent/50 transition-all hover:shadow-md group">
                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:scale-110 transition-transform">
                                <School className="h-6 w-6" />
                            </div>
                            <span className="font-medium text-sm">Add School</span>
                        </Link>
                    </div>
                </div>
            )}

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="activity">Activity Logs</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    {/* SYSTEM HEALTH & ISSUES - NEW MODULES */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-8">
                        <div className="col-span-2">
                            <HealthMonitor />
                        </div>
                        <div className="col-span-5">
                            <IssueReportsList />
                        </div>
                    </div>

                    {/* TOP SECTION: Key Metrics */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <DashboardCard
                            title="Total Students"
                            value={loading ? "..." : stats.totalStudents.toString()}
                            icon={Users}
                            description="Enrolled"
                            colorClass="bg-blue-100 text-blue-600"
                            href="/admin/users/students"
                        />
                        <DashboardCard
                            title="Total Staff"
                            value={loading ? "..." : stats.totalStaff.toString()}
                            icon={Users}
                            description="Active"
                            colorClass="bg-purple-100 text-purple-600"
                            href="/admin/users"
                        />
                        <DashboardCard
                            title="Schools"
                            value={loading ? "..." : (stats.totalSchools || 0).toString()}
                            icon={School}
                            description="Registered"
                            colorClass="bg-orange-100 text-orange-600"
                        />
                        <DashboardCard
                            title="Payments Today"
                            value={loading ? "..." : `GHS ${(stats.paymentsToday || 0).toLocaleString()}`}
                            icon={CreditCard}
                            description="Collected"
                            colorClass="bg-green-100 text-green-600"
                            trend="up"
                            trendValue="+12%"
                        />
                        <DashboardCard
                            title="Pending"
                            value={loading ? "..." : `GHS ${(stats.pendingPayments || 0).toLocaleString()}`}
                            icon={Clock}
                            description="To be cleared"
                            colorClass="bg-yellow-100 text-yellow-600"
                        />
                    </div>

                    {/* MIDDLE SECTION: Financial Overview */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="col-span-2 border-none shadow-md">
                            <CardHeader>
                                <CardTitle>Financial Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] flex items-end justify-between gap-2 p-4 border rounded-lg bg-muted/10 relative">
                                    {/* Fallback Graph using CSS */}
                                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                                        <div key={i} className="w-full bg-gradient-to-t from-primary/20 to-primary/60 hover:from-primary/40 hover:to-primary/80 rounded-t-md relative group transition-all" style={{ height: `${h}%` }}>
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-sm whitespace-nowrap z-10">
                                                GHS {(h * 100).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}

                                </div>
                                <div className="flex justify-between mt-4 text-sm">
                                    <div className="flex flex-col">
                                        <span className="text-muted-foreground">Daily Collections</span>
                                        <span className="font-bold">GHS 12,450</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-muted-foreground">Monthly Collections</span>
                                        <span className="font-bold">GHS 345,200</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-muted-foreground">Outstanding Fees</span>
                                        <span className="font-bold text-red-500">GHS {stats.outstandingFees?.toLocaleString() || '0'}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                    {/* SYSTEM STATUS & ACTIVITY LOG */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>School Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                {/* Real Activity Graph */}
                                <div className="h-[350px] w-full flex items-end justify-between gap-2 p-4">
                                    {stats.activityData ? (
                                        stats.activityData.map((day: any, i: number) => {
                                            // Normalize height (max 100%)
                                            const maxAmount = Math.max(...stats.activityData.map((d: any) => d.amount), 1); // Avoid div by 0
                                            const height = (day.amount / maxAmount) * 100;

                                            return (
                                                <div key={i} className="w-full bg-primary/10 rounded-t-md relative group">
                                                    <div
                                                        className="absolute bottom-0 w-full bg-primary rounded-t-md transition-all duration-500 group-hover:bg-primary/80"
                                                        style={{ height: `${Math.max(height, 5)}%` }} // Min 5% height for visibility
                                                    >
                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-sm whitespace-nowrap z-10">
                                                            GHS {day.amount.toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className="absolute -bottom-6 left-0 w-full text-center text-xs text-muted-foreground">
                                                        {day.day}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                                            No activity data available
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>System Activity Log</CardTitle>
                                <CardDescription>
                                    Recent actions performed by administrators and staff.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AuditLogViewer />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div >
    );
}

