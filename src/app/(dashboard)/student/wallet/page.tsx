"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";
import { Wallet, ArrowUpRight, ArrowDownLeft, QrCode, History, Filter, X, ScanLine } from "lucide-react";

export default function WalletPage() {
    const [showTopUp, setShowTopUp] = useState(false);
    const [showScan, setShowScan] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [filterType, setFilterType] = useState<"ALL" | "CREDIT" | "DEBIT">("ALL");
    const [topUpAmount, setTopUpAmount] = useState("");

    const [balance, setBalance] = useState(0.00);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWallet = async () => {
        try {
            const token = localStorage.getItem("school_fintech_token");
            if (!token) return;

            const res = await fetch("/api/wallet", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setBalance(data.balance);
                setTransactions(data.transactions);
            }
        } catch (error) {
            console.error("Failed to fetch wallet", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, []);

    const handleTopUp = async () => {
        if (!topUpAmount) return;

        try {
            const token = localStorage.getItem("school_fintech_token");
            if (!token) return;

            const res = await fetch("/api/wallet", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ amount: topUpAmount }),
            });

            if (res.ok) {
                const data = await res.json();
                setBalance(data.balance);
                setShowTopUp(false);
                setTopUpAmount("");
                alert("Top Up Successful!");
                fetchWallet(); // Refresh transactions
            } else {
                alert("Top Up Failed");
            }
        } catch (error) {
            console.error("Top up error", error);
            alert("An error occurred");
        }
    };

    const filteredTransactions = transactions.filter(tx => {
        if (filterType === "ALL") return true;
        if (filterType === "CREDIT") return tx.type === "TOPUP"; // Match API enum
        if (filterType === "DEBIT") return tx.type !== "TOPUP";
        return true;
    });

    if (loading) {
        return <div className="p-8 text-center">Loading wallet...</div>;
    }

    return (
        <div className="space-y-6 relative">
            <h1 className="text-2xl font-bold tracking-tight">Digital Wallet</h1>

            {/* Top Up Modal */}
            {showTopUp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl border animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Top Up Wallet</h3>
                            <button onClick={() => setShowTopUp(false)} className="p-1 hover:bg-muted rounded-full">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Amount (GHS)</label>
                                <input
                                    type="number"
                                    value={topUpAmount}
                                    onChange={(e) => setTopUpAmount(e.target.value)}
                                    className="w-full p-2 border rounded-lg bg-background"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {[50, 100, 200].map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => setTopUpAmount(amt.toString())}
                                        className="py-1 px-2 border rounded hover:bg-muted text-sm"
                                    >
                                        GHS {amt}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleTopUp}
                                className="w-full mt-2 bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90"
                            >
                                Proceed to Pay
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Scan Modal */}
            {showScan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-sm rounded-xl bg-card p-6 shadow-xl border animate-in zoom-in-95 duration-200 text-center">
                        <div className="flex justify-end">
                            <button onClick={() => setShowScan(false)} className="p-1 hover:bg-muted rounded-full">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="h-48 w-48 bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
                                <ScanLine className="h-32 w-32 text-primary/50 animate-pulse" />
                                <div className="absolute inset-0 border-2 border-primary/30 rounded-lg"></div>
                            </div>
                            <p className="text-sm text-muted-foreground">Align QR code within the frame to pay</p>
                            <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium">
                                Upload from Gallery
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {/* Wallet Card */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white shadow-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-400">Current Balance</p>
                            <h2 className="mt-2 text-4xl font-bold">GHS {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                        </div>
                        <Wallet className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={() => setShowTopUp(true)}
                            className="flex-1 rounded-lg bg-white/10 py-2 text-sm font-medium backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowDownLeft className="h-4 w-4" /> Top Up
                        </button>
                        <button
                            onClick={() => setShowScan(true)}
                            className="flex-1 rounded-lg bg-white py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                        >
                            <QrCode className="h-4 w-4" /> Pay
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">GHS 450.00</div>
                            <p className="text-xs text-muted-foreground mt-1">This month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Savings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">GHS 50.00</div>
                            <p className="text-xs text-green-600 mt-1">+10% goal</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Transaction History */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <History className="h-5 w-5" /> Transaction History
                    </h2>
                    <div className="relative">
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className={`text-sm flex items-center gap-1 hover:underline ${showFilter ? 'text-primary font-bold' : 'text-muted-foreground'}`}
                        >
                            <Filter className="h-4 w-4" /> Filter
                        </button>
                        {showFilter && (
                            <div className="absolute right-0 top-full mt-2 w-40 rounded-lg border bg-card shadow-lg z-10 p-1">
                                <button
                                    onClick={() => { setFilterType("ALL"); setShowFilter(false); }}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted ${filterType === 'ALL' ? 'bg-primary/10 text-primary' : ''}`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => { setFilterType("CREDIT"); setShowFilter(false); }}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted ${filterType === 'CREDIT' ? 'bg-primary/10 text-primary' : ''}`}
                                >
                                    Money In
                                </button>
                                <button
                                    onClick={() => { setFilterType("DEBIT"); setShowFilter(false); }}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted ${filterType === 'DEBIT' ? 'bg-primary/10 text-primary' : ''}`}
                                >
                                    Money Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-xl border bg-card shadow-sm divide-y">
                    {filteredTransactions.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">No transactions found</div>
                    ) : (
                        filteredTransactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.type === 'TOPUP' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                        {tx.type === 'TOPUP' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{tx.type.replace('_', ' ')}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString()} • {tx.reference || tx.id.slice(0, 8)}</p>
                                    </div>
                                </div>
                                <span className={`font-bold text-sm ${tx.type === 'TOPUP' ? 'text-green-600' : 'text-foreground'
                                    }`}>
                                    {tx.type === 'TOPUP' ? '+' : '-'}GHS {tx.amount.toLocaleString()}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
