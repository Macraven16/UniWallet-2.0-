import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { invoiceId, amount, method } = body;

        if (!invoiceId || !amount || !method) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.userId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const student = await prisma.student.findUnique({
            where: { userId: decoded.userId },
            include: { wallet: true }
        });

        if (!student) {
            return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
        }

        const invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: { feeStructure: true }
        });

        if (!invoice) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        // Calculate new amount paid
        const newAmountPaid = invoice.amountPaid + parseFloat(amount);
        const isFullyPaid = newAmountPaid >= invoice.feeStructure.amount;
        const newStatus = isFullyPaid ? "PAID" : "PARTIALLY_PAID";

        // Database transaction
        const result = await prisma.$transaction(async (prisma) => {
            // 1. Update Invoice
            const updatedInvoice = await prisma.invoice.update({
                where: { id: invoiceId },
                data: {
                    amountPaid: newAmountPaid,
                    status: newStatus,
                },
            });

            // 2. Create Transaction Record
            // If method is WALLET, we would deduct balance.
            // If method is MOMO/CARD, we just record it.
            // For now, assuming MOMO/CARD doesn't affect wallet balance directly unless we implemented a "Topup & Pay" flow.
            // But we still want it in the history.

            let balanceBefore = student.wallet?.balance || 0;
            let balanceAfter = student.wallet?.balance || 0;

            if (method === 'WALLET') {
                if (balanceBefore < parseFloat(amount)) {
                    throw new Error("Insufficient wallet balance");
                }
                balanceAfter = balanceBefore - parseFloat(amount);

                // Update wallet balance
                if (student.wallet) {
                    await prisma.wallet.update({
                        where: { id: student.wallet.id },
                        data: { balance: balanceAfter }
                    });
                }
            }

            if (student.wallet) {
                await prisma.transaction.create({
                    data: {
                        walletId: student.wallet.id,
                        amount: parseFloat(amount),
                        type: "TUITION",
                        status: "COMPLETED",
                        method: method.toUpperCase(), // MOMO, CARD, WALLET
                        description: `Payment for ${invoice.feeStructure.name}`,
                        balanceBefore: balanceBefore,
                        balanceAfter: balanceAfter,
                    },
                });
            }

            return updatedInvoice;
        });

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("Payment processing error:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
