"use client";

import { useEffect, useState } from "react";
import { Bug, AlertTriangle, Lightbulb } from "lucide-react";

// Use simple relative time function instead of date-fns
function getRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function IssueReportsList() {
    const [issues, setIssues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIssues = async () => {
            const token = localStorage.getItem("school_fintech_token");
            try {
                const res = await fetch("/api/issues", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.issues) setIssues(data.issues);
            } catch (err) {
                console.error("Error loading issues:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }, []);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "Bug": return <Bug className="h-4 w-4 text-red-500" />;
            case "Feature": return <Lightbulb className="h-4 w-4 text-yellow-500" />;
            default: return <AlertTriangle className="h-4 w-4 text-blue-500" />;
        }
    };

    if (loading) return <div className="p-4 text-sm text-muted-foreground">Loading reports...</div>;

    return (
        <div className="rounded-md border bg-card text-card-foreground shadow-sm">
            <div className="p-4 border-b bg-muted/20">
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                    Recent Issue Reports
                    <span className="text-xs font-normal text-muted-foreground ml-auto bg-background px-2 py-0.5 rounded-full border">
                        {issues.length}
                    </span>
                </h3>
            </div>
            <div className="divide-y max-h-[300px] overflow-y-auto">
                {issues.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-xs">
                        No issues reported yet.
                    </div>
                ) : (
                    issues.map((issue) => (
                        <div key={issue.id} className="p-3 flex items-start justify-between hover:bg-muted/10 transition-colors">
                            <div className="space-y-1 w-full">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        {getTypeIcon(issue.type)}
                                        <span className="font-medium text-xs">{issue.type}</span>
                                    </div>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${issue.priority === 'High' || issue.priority === 'Critical'
                                        ? 'bg-red-50 text-red-600 border-red-200'
                                        : 'bg-slate-50 text-slate-600 border-slate-200'
                                        }`}>
                                        {issue.priority}
                                    </span>
                                </div>
                                <p className="text-xs text-foreground/80 line-clamp-2">{issue.description}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                        <span>{issue.user?.name || "User"}</span>
                                        <span>•</span>
                                        <span>{getRelativeTime(issue.createdAt)}</span>
                                    </div>
                                    {issue.attachment && (
                                        <a
                                            href={issue.attachment}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] text-blue-600 hover:underline"
                                        >
                                            View Image
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
