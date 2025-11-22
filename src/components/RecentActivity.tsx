"use client";

import { useEffect, useState } from "react";
import { CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface Transaction {
    id: string;
    type: string;
    amount: number;
    date: string;
    status: string;
    description?: string;
}

export function RecentActivity() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user?.student?.id) {
            fetch(`/api/transactions?studentId=${user.student.id}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setTransactions(data);
                    }
                })
                .catch(err => console.error("Failed to fetch transactions", err))
                .finally(() => setIsLoading(false));
        }
    }, [user]);

    if (isLoading) return <div className="text-sm text-muted-foreground">Loading activity...</div>;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
                <Link href="/student/wallet" className="text-sm font-medium text-primary hover:underline">
                    View All
                </Link>
            </div>
            <div className="rounded-xl border bg-card shadow-sm">
                <div className="divide-y">
                    {transactions.length > 0 ? (
                        transactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${tx.type === 'TOPUP' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        <CreditCard className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            {tx.type === "TUITION" ? "School Fees" :
                                                tx.type === "TOPUP" ? "Wallet Top-up" : tx.type}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(tx.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-sm font-bold ${tx.type === 'TOPUP' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {tx.type === 'TOPUP' ? '+' : '-'}GHS {tx.amount.toLocaleString()}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No recent activity.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
