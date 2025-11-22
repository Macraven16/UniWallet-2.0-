"use client";

import { useState, useEffect } from "react";
import { Plus, Search, FileText, Trash2, Pencil } from "lucide-react";

export default function FeesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFee, setNewFee] = useState({
        name: "",
        amount: "",
        dueDate: "",
        schoolId: "",
    });
    const [universities, setUniversities] = useState<any[]>([]);
    const [fees, setFees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchFees();
        fetchUniversities();
    }, []);

    const fetchUniversities = async () => {
        try {
            const res = await fetch("/api/universities");
            if (res.ok) {
                const data = await res.json();
                setUniversities(data);
            }
        } catch (error) {
            console.error("Failed to fetch universities", error);
        }
    };

    const fetchFees = async () => {
        try {
            const res = await fetch("/api/fees");
            if (res.ok) {
                const data = await res.json();
                setFees(data);
            }
        } catch (error) {
            console.error("Failed to fetch fees", error);
        } finally {
            setLoading(false);
        }
    };

    const [editingFee, setEditingFee] = useState<any>(null);

    const handleEditClick = (fee: any) => {
        setEditingFee({
            id: fee.id,
            name: fee.name,
            amount: fee.amount,
            dueDate: new Date(fee.dueDate).toISOString().split('T')[0],
            schoolId: fee.schoolId,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this fee structure?")) {
            try {
                const res = await fetch(`/api/fees/${id}`, {
                    method: "DELETE",
                });
                if (res.ok) {
                    setFees(fees.filter((f) => f.id !== id));
                } else {
                    alert("Failed to delete fee");
                }
            } catch (error) {
                console.error("Error deleting fee", error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEditing = !!editingFee;
        const url = isEditing ? `/api/fees/${editingFee.id}` : "/api/fees";
        const method = isEditing ? "PUT" : "POST";
        const body = isEditing ? editingFee : newFee;

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setIsModalOpen(false);
                setNewFee({ name: "", amount: "", dueDate: "", schoolId: "" });
                setEditingFee(null);
                fetchFees();
            } else {
                alert(`Failed to ${isEditing ? "update" : "create"} fee structure`);
            }
        } catch (error) {
            console.error(`Error ${isEditing ? "updating" : "creating"} fee`, error);
        }
    };

    const filteredFees = fees.filter((fee) =>
        fee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Fees & Payments</h1>
                <button
                    onClick={() => {
                        setEditingFee(null);
                        setNewFee({ name: "", amount: "", dueDate: "", schoolId: "" });
                        setIsModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Fee Structure
                </button>
            </div>

            {/* Create/Edit Fee Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg border">
                        <h2 className="text-xl font-bold mb-4">{editingFee ? "Edit Fee Structure" : "Create Fee Structure"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Fee Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={editingFee ? editingFee.name : newFee.name}
                                    onChange={(e) => editingFee ? setEditingFee({ ...editingFee, name: e.target.value }) : setNewFee({ ...newFee, name: e.target.value })}
                                    placeholder="e.g., Term 1 Tuition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Amount (GH₵)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={editingFee ? editingFee.amount : newFee.amount}
                                    onChange={(e) => editingFee ? setEditingFee({ ...editingFee, amount: e.target.value }) : setNewFee({ ...newFee, amount: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Due Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={editingFee ? editingFee.dueDate : newFee.dueDate}
                                    onChange={(e) => editingFee ? setEditingFee({ ...editingFee, dueDate: e.target.value }) : setNewFee({ ...newFee, dueDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">University</label>
                                <select
                                    required
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={editingFee ? editingFee.schoolId : newFee.schoolId}
                                    onChange={(e) => editingFee ? setEditingFee({ ...editingFee, schoolId: e.target.value }) : setNewFee({ ...newFee, schoolId: e.target.value })}
                                >
                                    <option value="">Select University</option>
                                    {universities.map((uni) => (
                                        <option key={uni.id} value={uni.id}>
                                            {uni.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-accent"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                                >
                                    {editingFee ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-2">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search fees..."
                        className="h-9 w-[250px] rounded-md border border-input bg-background pl-9 pr-4 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Due Date</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">School</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center">Loading...</td>
                                </tr>
                            ) : filteredFees.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center">No fee structures found.</td>
                                </tr>
                            ) : (
                                filteredFees.map((fee) => (
                                    <tr key={fee.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">{fee.name}</td>
                                        <td className="p-4 align-middle">GH₵ {fee.amount.toFixed(2)}</td>
                                        <td className="p-4 align-middle">{new Date(fee.dueDate).toLocaleDateString()}</td>
                                        <td className="p-4 align-middle">{fee.school?.name}</td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(fee)}
                                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(fee.id)}
                                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                                                >
                                                    <Trash2 className="h-4 w-4" />
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
        </div>
    );
}
