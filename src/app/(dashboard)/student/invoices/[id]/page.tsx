"use client";

import { useState, useEffect, use } from "react";
import { Loader2, Printer, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Unwrap params using use() hook for Next.js 15+ compatibility
    const { id } = use(params);

    useEffect(() => {
        fetchInvoice();
    }, [id]);

    const fetchInvoice = async () => {
        try {
            const res = await fetch(`/api/student/invoices/${id}`);
            if (res.ok) {
                const data = await res.json();
                setInvoice(data);
            } else {
                const err = await res.json();
                setError(err.error || "Failed to load invoice");
            }
        } catch (error) {
            console.error("Error fetching invoice", error);
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (error) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                <p className="text-destructive font-medium">{error}</p>
                <Link href="/student/pay" className="text-primary hover:underline">
                    Return to Payments
                </Link>
            </div>
        );
    }

    if (!invoice) return null;

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            {/* Header / Actions - Hidden when printing */}
            <div className="mb-8 flex items-center justify-between print:hidden">
                <Link href="/student/pay" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Payments
                </Link>
                <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                    <Printer className="h-4 w-4" />
                    Print / Download PDF
                </button>
            </div>

            {/* Invoice Content */}
            <div className="bg-white p-8 shadow-sm border rounded-lg print:shadow-none print:border-none print:p-0 text-black">
                {/* Invoice Header */}
                <div className="flex justify-between border-b pb-8 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
                        <p className="text-sm text-gray-500 mt-1">#{invoice.id.slice(-8).toUpperCase()}</p>
                        <div className="mt-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                    invoice.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                }`}>
                                {invoice.status}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-semibold text-primary">{invoice.feeStructure.school.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">{invoice.feeStructure.school.address || "University Address"}</p>
                        <p className="text-sm text-gray-500">{invoice.feeStructure.school.contactEmail}</p>
                        <p className="text-sm text-gray-500">{invoice.feeStructure.school.contactPhone}</p>
                    </div>
                </div>

                {/* Bill To */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Bill To</h3>
                    <p className="font-medium text-gray-900">{invoice.student.user.name}</p>
                    <p className="text-sm text-gray-500">{invoice.student.user.email}</p>
                    <p className="text-sm text-gray-500">Student ID: {invoice.student.studentIdNumber}</p>
                </div>

                {/* Invoice Details */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Fee Details</h3>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="pb-2 font-medium text-gray-500">Description</th>
                                <th className="pb-2 font-medium text-gray-500 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-100">
                                <td className="py-4 text-gray-900">
                                    <p className="font-medium">{invoice.feeStructure.name}</p>
                                    <p className="text-sm text-gray-500">Due Date: {new Date(invoice.feeStructure.dueDate).toLocaleDateString()}</p>
                                </td>
                                <td className="py-4 text-right font-medium text-gray-900">
                                    GH₵ {invoice.feeStructure.amount.toFixed(2)}
                                </td>
                            </tr>
                            {/* Breakdown items if any */}
                            {Array.isArray(invoice.feeStructure.breakdown) && invoice.feeStructure.breakdown.map((item: any, idx: number) => (
                                <tr key={idx} className="border-b border-gray-50">
                                    <td className="py-2 pl-4 text-sm text-gray-500">- {item.item || item.name}</td>
                                    <td className="py-2 text-right text-sm text-gray-500">
                                        GH₵ {Number(item.amount).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-64 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-medium">GH₵ {invoice.feeStructure.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Amount Paid</span>
                            <span className="font-medium text-green-600">- GH₵ {invoice.amountPaid.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-3 text-lg font-bold">
                            <span>Total Due</span>
                            <span>GH₵ {(invoice.feeStructure.amount - invoice.amountPaid).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t text-center text-sm text-gray-500">
                    <p>Thank you for your payment.</p>
                    <p className="mt-1">This is a computer-generated invoice.</p>
                </div>
            </div>
        </div>
    );
}
