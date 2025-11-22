"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { PieChart, Target, TrendingUp, Plus, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface Budget {
    id: string;
    category: string;
    amount: number;
    spent: number;
}

interface Savings {
    id: string;
    goalName: string;
    targetAmount: number;
    currentAmount: number;
}

export default function PlanningPage() {
    const { user } = useAuth();
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [savings, setSavings] = useState<Savings[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal States
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);

    // Form States
    const [newBudget, setNewBudget] = useState({ category: "", amount: "" });
    const [newSavings, setNewSavings] = useState({ goalName: "", targetAmount: "" });

    useEffect(() => {
        if (user?.student?.id) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const [budgetRes, savingsRes] = await Promise.all([
                fetch(`/api/budget?studentId=${user?.student?.id}`),
                fetch(`/api/savings?studentId=${user?.student?.id}`)
            ]);

            if (budgetRes.ok) setBudgets(await budgetRes.json());
            if (savingsRes.ok) setSavings(await savingsRes.json());
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddBudget = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.student?.id) return;

        try {
            const res = await fetch("/api/budget", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId: user.student.id,
                    category: newBudget.category,
                    amount: newBudget.amount,
                    period: "Monthly"
                }),
            });

            if (res.ok) {
                setIsBudgetModalOpen(false);
                setNewBudget({ category: "", amount: "" });
                fetchData();
            }
        } catch (error) {
            console.error("Failed to add budget", error);
        }
    };

    const handleAddSavings = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.student?.id) return;

        try {
            const res = await fetch("/api/savings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId: user.student.id,
                    goalName: newSavings.goalName,
                    targetAmount: newSavings.targetAmount,
                }),
            });

            if (res.ok) {
                setIsSavingsModalOpen(false);
                setNewSavings({ goalName: "", targetAmount: "" });
                fetchData();
            }
        } catch (error) {
            console.error("Failed to add savings", error);
        }
    };

    // Calculate totals
    const totalBudget = budgets.reduce((acc, b) => acc + b.amount, 0);
    const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);

    // For demo, we use the first savings goal as the main one
    const mainGoal = savings[0];
    const savingsProgress = mainGoal ? (mainGoal.currentAmount / mainGoal.targetAmount) * 100 : 0;

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Financial Planning</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsBudgetModalOpen(true)}
                        className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                    >
                        <Plus className="h-4 w-4" /> Budget
                    </button>
                    <button
                        onClick={() => setIsSavingsModalOpen(true)}
                        className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4" /> Savings Goal
                    </button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Savings Goal */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {mainGoal ? mainGoal.goalName : "No Savings Goal"}
                        </CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {mainGoal ? (
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Progress</span>
                                    <span className="font-medium">{savingsProgress.toFixed(0)}%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-secondary">
                                    <div
                                        className="h-2 rounded-full bg-primary transition-all"
                                        style={{ width: `${savingsProgress}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                                    <span>GHS {mainGoal.currentAmount} saved</span>
                                    <span>Goal: GHS {mainGoal.targetAmount}</span>
                                </div>
                                <div className="mt-6">
                                    <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                        Add Funds
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 text-center text-sm text-muted-foreground">
                                Create a savings goal to start tracking.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Monthly Budget */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="mt-4 space-y-4">
                            {budgets.length > 0 ? (
                                budgets.map((budget) => (
                                    <div key={budget.id} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>{budget.category}</span>
                                            <span className="font-medium">GHS {budget.spent} / {budget.amount}</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-secondary">
                                            <div
                                                className="h-2 rounded-full bg-blue-500"
                                                style={{ width: `${Math.min((budget.spent / budget.amount) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-sm text-muted-foreground">
                                    No budgets set.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Modals */}
            <Modal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} title="Add Budget">
                <form onSubmit={handleAddBudget} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Category</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                            value={newBudget.category}
                            onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                            placeholder="e.g., Food"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Amount (GHS)</label>
                        <input
                            type="number"
                            required
                            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                            value={newBudget.amount}
                            onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                            placeholder="0.00"
                        />
                    </div>
                    <button type="submit" className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                        Save Budget
                    </button>
                </form>
            </Modal>

            <Modal isOpen={isSavingsModalOpen} onClose={() => setIsSavingsModalOpen(false)} title="New Savings Goal">
                <form onSubmit={handleAddSavings} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Goal Name</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                            value={newSavings.goalName}
                            onChange={(e) => setNewSavings({ ...newSavings, goalName: e.target.value })}
                            placeholder="e.g., New Laptop"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Target Amount (GHS)</label>
                        <input
                            type="number"
                            required
                            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                            value={newSavings.targetAmount}
                            onChange={(e) => setNewSavings({ ...newSavings, targetAmount: e.target.value })}
                            placeholder="0.00"
                        />
                    </div>
                    <button type="submit" className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                        Create Goal
                    </button>
                </form>
            </Modal>
        </div>
    );
}
