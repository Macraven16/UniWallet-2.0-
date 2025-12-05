"use client";

import { useState, useEffect } from "react";

interface AuditLog {
    id: string;
    action: string;
    details: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
}

export default function AuditLogViewer() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem("school_fintech_token");
            const res = await fetch("/api/audit", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (error) {
            console.error("Failed to fetch audit logs", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-sm text-muted-foreground">Loading activity...</div>;
    }

    return (
        <div className="h-[300px] w-full rounded-md border p-4 overflow-auto">
            <div className="space-y-4">
                {logs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No recent activity.</p>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="flex flex-col gap-1 border-b pb-2 last:border-0">
                            <div className="flex justify-between items-start">
                                <span className="font-medium text-sm">{log.action}</span>
                                <span className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{log.details}</p>
                            <div className="text-xs text-muted-foreground">
                                By: <span className="font-medium">{log.user?.name || log.user?.email || "Unknown User"}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
