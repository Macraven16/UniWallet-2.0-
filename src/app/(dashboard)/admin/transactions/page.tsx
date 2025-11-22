"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download, FileText } from "lucide-react";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("ALL");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await fetch("/api/admin/transactions");
            if (res.ok) {
                const data = await res.json();
                setTransactions(data);
            }
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter((tx) => {
        const matchesSearch =
            tx.wallet?.student?.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.reference?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === "ALL" || tx.type === filterType;

        const txDate = new Date(tx.date);
        const matchesStart = !dateRange.start || txDate >= new Date(dateRange.start);
        const matchesEnd = !dateRange.end || txDate <= new Date(dateRange.end);

        return matchesSearch && matchesType && matchesStart && matchesEnd;
    });

    const totalAmount = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);

    const handleExport = (format: 'csv' | 'pdf') => {
        // For now, just link to the API
        window.open(`/api/reports?format=${format}`, '_blank');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleExport('csv')}
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </button>
                    {/* PDF Export could be implemented similarly */}
                </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="h-9 w-[250px] rounded-md border border-input bg-background pl-9 pr-4 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="ALL">All Types</option>
                        <option value="TUITION">Tuition</option>
                        <option value="TOPUP">Top-up</option>
                        <option value="MARKETPLACE">Marketplace</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    />
                    <span className="text-muted-foreground">-</span>
                    <input
                        type="date"
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Volume</h3>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">GH₵ {totalAmount.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            {filteredTransactions.length} transactions found
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b bg-muted/30">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Student</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Reference</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">Loading transactions...</td>
                                </tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">No transactions found matching your filters.</td>
                                </tr>
                            ) : (
                                filteredTransactions.map((tx) => (
                                    <tr key={tx.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td className="p-4 align-middle font-medium">
                                            <div className="flex flex-col">
                                                <span>{tx.wallet?.student?.user?.name || "Unknown"}</span>
                                                <span className="text-xs text-muted-foreground">{tx.wallet?.studentId || "N/A"}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${tx.type === 'TOPUP' ? 'bg-green-100 text-green-800' :
                                                tx.type === 'TUITION' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground font-mono text-xs">{tx.reference}</td>
                                        <td className="p-4 align-middle font-bold">GH₵ {tx.amount.toFixed(2)}</td>
                                        <td className="p-4 align-middle text-right">
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${tx.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
