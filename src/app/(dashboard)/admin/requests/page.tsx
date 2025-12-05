"use client";

import { useState, useEffect } from "react";
import { Check, X, AlertOctagon } from "lucide-react";

export default function RequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("school_fintech_token");
            const res = await fetch("/api/admin/requests", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (requestId: string, action: 'APPROVE' | 'REJECT') => {
        if (!confirm(`Are you sure you want to ${action} this request?`)) return;

        try {
            const token = localStorage.getItem("school_fintech_token");
            const res = await fetch("/api/admin/requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ requestId, action })
            });

            if (res.ok) {
                const result = await res.json();
                alert(result.message);
                fetchRequests(); // Refresh list
            } else {
                alert("Action failed");
            }
        } catch (error) {
            console.error("Action error", error);
        }
    };

    if (loading) return <div className="p-8">Loading requests...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Deletion Requests</h1>
            <p className="text-muted-foreground">Review and approve deletion requests from Staff.</p>

            <div className="border rounded-md bg-card">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            <th className="p-4 text-left font-medium">Requester</th>
                            <th className="p-4 text-left font-medium">Resource</th>
                            <th className="p-4 text-left font-medium">Reason</th>
                            <th className="p-4 text-left font-medium">Date</th>
                            <th className="p-4 text-right font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                    No pending requests.
                                </td>
                            </tr>
                        ) : (
                            requests.map((req) => (
                                <tr key={req.id} className="border-b last:border-0 hover:bg-muted/10">
                                    <td className="p-4">
                                        <div className="font-medium">{req.staff?.name}</div>
                                        <div className="text-xs text-muted-foreground">{req.staff?.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] px-1.5 py-0.5 rounded border bg-slate-100 uppercase font-semibold">
                                                {req.resourceType}
                                            </span>
                                            <span className="font-medium">
                                                {req.resourceType === 'FEE' && req.feeStructure?.name}
                                                {req.resourceType === 'STUDENT' && req.student?.user?.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-muted-foreground">{req.reason}</td>
                                    <td className="p-4 text-xs text-muted-foreground">
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleAction(req.id, 'APPROVE')}
                                                className="p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200" title="Approve">
                                                <Check className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleAction(req.id, 'REJECT')}
                                                className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200" title="Reject">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
