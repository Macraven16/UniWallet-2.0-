"use client";

import { useState } from "react";
import { Bug, Paperclip, Loader2, X } from "lucide-react";
import { Modal } from "./ui/modal";
import { useAuth } from "@/lib/auth-context";

export function IssueReporter() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form state
    const [type, setType] = useState("Bug");
    const [priority, setPriority] = useState("Medium");
    const [description, setDescription] = useState("");
    const [attachment, setAttachment] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachment(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/issues", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type,
                    priority,
                    description,
                    attachment,
                    userId: user?.id,
                    role: user?.role,
                    email: user?.email
                })
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    setIsOpen(false);
                    setDescription("");
                    setAttachment(null);
                }, 2000);
            }
        } catch (error) {
            console.error("Failed to report issue", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <>
            {/* Floating Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-destructive px-4 py-3 text-white shadow-lg transition-transform hover:scale-105 hover:bg-destructive/90"
            >
                <Bug className="h-5 w-5" />
                <span className="font-medium">Report Issue</span>
            </button>

            {/* Modal */}
            <Modal
                title="Report an Issue"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                {success ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600">
                            <Bug className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-green-700">Report Sent!</h3>
                        <p className="text-muted-foreground">Thank you for helping us improve.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="Bug">Bug Report</option>
                                    <option value="Feature">Feature Request</option>
                                    <option value="Support">Support Help</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Priority</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the issue or feature..."
                                required
                                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Attachment (Screenshot)</label>
                            <div className="flex items-center gap-2">
                                <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-input px-3 py-2 text-sm hover:bg-accent  w-full">
                                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                        {attachment ? "Image attached" : "Attach image"}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                {attachment && (
                                    <button
                                        type="button"
                                        onClick={() => setAttachment(null)}
                                        className="rounded-full p-1 hover:bg-destructive/10 text-destructive"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                            >
                                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                Submit Report
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </>
    );
}
