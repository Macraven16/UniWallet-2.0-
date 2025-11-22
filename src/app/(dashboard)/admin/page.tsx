"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, TrendingUp, Activity, UserCheck, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import UserManagementTable from "@/components/UserManagementTable";

function DashboardCard({
    title,
    value,
    icon: Icon,
    description,
    trend
}: {
    title: string;
    value: string;
    icon: any;
    description: string;
    trend?: "up" | "down";
}) {
    return (
        <div className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
                <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
            </div>
            <div className="p-6 pt-0">
                <div className="text-2xl font-bold tracking-tight">{value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {trend === "up" && <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />}
                    {trend === "down" && <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />}
                    {description}
                </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
    );
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalStaff: 0,
        totalRevenue: 0,
        recentUsers: []
    });
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, txRes] = await Promise.all([
                    fetch("/api/dashboard/stats"),
                    fetch("/api/transactions")
                ]);

                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setStats(data);
                }
                if (txRes.ok) {
                    const data = await txRes.json();
                    setTransactions(data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Dashboard
                </h1>
                <p className="text-muted-foreground">
                    Welcome back, {user?.name || "Admin"}. Here's what's happening today.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                    title="Total Users"
                    value={loading ? "..." : stats.totalUsers.toString()}
                    icon={Users}
                    description={`${stats.recentUsers.length} new this month`}
                    trend="up"
                />
                <DashboardCard
                    title="Active Students"
                    value={loading ? "..." : stats.totalStudents.toString()}
                    icon={UserCheck}
                    description="Enrolled and active"
                    trend="up"
                />
                <DashboardCard
                    title="Staff Members"
                    value={loading ? "..." : stats.totalStaff.toString()}
                    icon={Activity}
                    description="Teaching and non-teaching"
                />
                <DashboardCard
                    title="Total Revenue"
                    value={loading ? "..." : `GHS ${stats.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    description="Total fees collected"
                    trend="up"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                    <div className="p-6 border-b bg-muted/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold leading-none tracking-tight">Recent Transactions</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Latest financial activities across the platform.
                                </p>
                            </div>
                            <Link href="/admin/transactions" className="text-sm font-medium text-primary hover:underline">
                                View All
                            </Link>
                        </div>
                    </div>
                    <div className="p-0">
                        <div className="divide-y">
                            {loading ? (
                                <div className="p-8 text-center text-muted-foreground">Loading transactions...</div>
                            ) : transactions.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">No transactions found.</div>
                            ) : (
                                transactions.slice(0, 5).map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.type === 'TOPUP' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                <DollarSign className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {tx.type === 'TUITION' ? 'Tuition Payment' :
                                                        tx.type === 'TOPUP' ? 'Wallet Top-up' : tx.type}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{tx.studentName} • {new Date(tx.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`font-bold text-sm ${tx.type === 'TOPUP' ? 'text-green-600' : 'text-foreground'
                                                }`}>
                                                {tx.type === 'TOPUP' ? '+' : ''}GHS {tx.amount.toLocaleString()}
                                            </span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${tx.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                    tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-span-3 space-y-6">
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                        <div className="p-6 border-b bg-muted/30">
                            <h3 className="font-semibold leading-none tracking-tight">Quick Actions</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Common administrative tasks.
                            </p>
                        </div>
                        <div className="p-4 space-y-2">
                            <Link href="/admin/fees" className="flex items-center w-full p-3 rounded-lg border hover:bg-accent transition-all hover:shadow-sm group">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20">
                                    <DollarSign className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-sm font-medium">Create Fee Structure</span>
                            </Link>
                            <Link href="/admin/users/students" className="flex items-center w-full p-3 rounded-lg border hover:bg-accent transition-all hover:shadow-sm group">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20">
                                    <UserCheck className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-sm font-medium">Enroll New Student</span>
                            </Link>
                            <button
                                onClick={() => alert("Payment reminders sent to all students with outstanding balances.")}
                                className="flex items-center w-full p-3 rounded-lg border hover:bg-accent transition-all hover:shadow-sm group text-left"
                            >
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20">
                                    <Activity className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-sm font-medium">Send Payment Reminders</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <h3 className="text-lg font-semibold mb-4">User Management</h3>
                <UserManagementTable />
            </div>
        </div>
    );
}
