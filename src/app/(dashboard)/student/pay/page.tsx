"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Smartphone, CheckCircle2, Loader2, Home, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("");
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState<"momo" | "card">("momo");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await fetch("/api/student/invoices");
            if (res.ok) {
                const data = await res.json();
                setInvoices(data);
                if (data.length > 0) {
                    setSelectedInvoiceId(data[0].id);
                    // Pre-fill amount with remaining balance if possible, or just leave empty
                }
            }
        } catch (error) {
            console.error("Failed to fetch invoices", error);
        } finally {
            setIsFetching(false);
        }
    };

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/fees/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    invoiceId: selectedInvoiceId,
                    amount: amount,
                    method: method // 'momo' or 'card'
                })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Payment failed");
            }

            setStep(3);
        } catch (error) {
            console.error("Payment error:", error);
            alert("Payment failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const selectedInvoice = invoices.find((inv) => inv.id === selectedInvoiceId);

    if (isFetching) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6 max-w-xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Make a Payment</h1>
                <div className="text-sm text-muted-foreground">Step {step} of 3</div>
            </div>

            {step === 1 && (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Fee to Pay</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {invoices.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">No pending fees found.</p>
                            ) : (
                                invoices.map((inv) => (
                                    <div
                                        key={inv.id}
                                        className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors ${selectedInvoiceId === inv.id ? "border-primary bg-primary/5" : "hover:bg-accent"
                                            }`}
                                        onClick={() => setSelectedInvoiceId(inv.id)}
                                    >
                                        <div>
                                            <p className="font-medium">{inv.feeStructure.name}</p>
                                            <p className="text-sm text-muted-foreground">Due: {new Date(inv.feeStructure.dueDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">GHS {inv.feeStructure.amount.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">Paid: GHS {inv.amountPaid.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {invoices.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Enter Amount</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">GHS</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full rounded-md border border-input bg-background pl-12 py-2 text-lg font-medium shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Minimum payment: GHS 50.00
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <button
                        onClick={() => setStep(2)}
                        disabled={!amount || Number(amount) < 50 || !selectedInvoiceId}
                        className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
                    >
                        Continue to Payment
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div
                                className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${method === "momo" ? "border-primary bg-primary/5" : "hover:bg-accent"
                                    }`}
                                onClick={() => setMethod("momo")}
                            >
                                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                    <Smartphone className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Mobile Money</p>
                                    <p className="text-xs text-muted-foreground">MTN, Vodafone, AirtelTigo</p>
                                </div>
                                <div className="h-4 w-4 rounded-full border border-primary flex items-center justify-center">
                                    {method === "momo" && <div className="h-2 w-2 rounded-full bg-primary" />}
                                </div>
                            </div>

                            <div
                                className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${method === "card" ? "border-primary bg-primary/5" : "hover:bg-accent"
                                    }`}
                                onClick={() => setMethod("card")}
                            >
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Card Payment</p>
                                    <p className="text-xs text-muted-foreground">Visa, Mastercard</p>
                                </div>
                                <div className="h-4 w-4 rounded-full border border-primary flex items-center justify-center">
                                    {method === "card" && <div className="h-2 w-2 rounded-full bg-primary" />}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep(1)}
                            className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm font-semibold shadow-sm hover:bg-accent"
                        >
                            Back
                        </button>
                        <button
                            onClick={handlePayment}
                            disabled={isLoading}
                            className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                                </>
                            ) : (
                                `Pay GHS ${Number(amount).toLocaleString()}`
                            )}
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col items-center justify-center space-y-6 py-8 text-center animate-in fade-in zoom-in duration-500">
                    <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Payment Successful!</h2>
                        <p className="text-muted-foreground">
                            Your payment of GHS {Number(amount).toLocaleString()} has been processed.
                        </p>
                    </div>
                    <div className="w-full max-w-xs space-y-3">
                        <Link
                            href={`/student/invoices/${selectedInvoiceId}`}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                        >
                            <Download className="h-4 w-4" />
                            Download Receipt
                        </Link>
                        <Link
                            href="/student"
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-3 text-sm font-semibold shadow-sm hover:bg-accent"
                        >
                            <Home className="h-4 w-4" />
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
