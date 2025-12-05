"use client";

import { useState, useEffect } from "react";
import { Activity, CheckCircle, AlertCircle, Database, Server, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HealthMonitor() {
    const [health, setHealth] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const checkHealth = async () => {
        try {
            const res = await fetch("/api/health");
            if (res.ok) {
                const data = await res.json();
                setHealth(data);
                setError(false);
            } else {
                setError(true);
            }
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkHealth();
        const interval = setInterval(checkHealth, 10000); // Check every 10s
        return () => clearInterval(interval);
    }, []);

    if (loading && !health) {
        return <div className="animate-pulse h-32 bg-muted rounded-lg w-full"></div>;
    }

    return (
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                {error ? (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                ) : (
                    <Activity className="h-4 w-4 text-green-500" />
                )}
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Database className="h-3 w-3" /> Database
                        </span>
                        <span className={`text-sm font-bold ${error ? "text-red-500" : "text-green-600"}`}>
                            {error ? "Disconnected" : "Connected"}
                        </span>
                        {health?.db && (
                            <span className="text-[10px] text-muted-foreground">
                                {health.db.latency || "0ms"} latency
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Server className="h-3 w-3" /> API Status
                        </span>
                        <span className={`text-sm font-bold ${error ? "text-red-500" : "text-green-600"}`}>
                            {error ? "Errors Detected" : "Operational"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                            Uptime: {Math.floor(health?.uptime || 0)}s
                        </span>
                    </div>
                </div>
                {health?.recentErrors && health.recentErrors.length > 0 && (
                    <div className="mt-4 rounded bg-red-50 p-2 text-xs text-red-800">
                        <strong>Recent Error:</strong>
                        <div className="truncate mt-1">{health.recentErrors[health.recentErrors.length - 1]}</div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
