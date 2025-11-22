import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { studentId, feeStructureId, amount, method, reference } = body;

        if (!studentId || !feeStructureId || !amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const result = await prisma.$transaction(async (tx) => {
            // 1. Get Student and Wallet
            const student = await tx.student.findUnique({
                where: { id: studentId },
                include: { wallet: true, user: true },
            });

            if (!student || !student.wallet) {
                throw new Error('Student or wallet not found');
            }

            // 2. Get Fee Structure
            const feeStructure = await tx.feeStructure.findUnique({
                where: { id: feeStructureId },
            });

            if (!feeStructure) {
                throw new Error('Fee structure not found');
            }

            // 3. Check for Invoice or Create one
            let invoice = await tx.invoice.findFirst({
                where: { studentId, feeStructureId },
            });

            if (!invoice) {
                invoice = await tx.invoice.create({
                    data: {
                        studentId,
                        feeStructureId,
                        amountPaid: 0,
                        status: 'PENDING',
                    },
                });
            }

            // 4. Calculate Payment Logic
            const amountToPay = parseFloat(amount);
            const remainingFee = feeStructure.amount - invoice.amountPaid;

            let paymentForFee = amountToPay;
            let paymentToWallet = 0;

            if (amountToPay > remainingFee) {
                paymentForFee = remainingFee;
                paymentToWallet = amountToPay - remainingFee;
            }

            // 5. Update Invoice
            const updatedInvoice = await tx.invoice.update({
                where: { id: invoice.id },
                data: {
                    amountPaid: { increment: paymentForFee },
                    status: (invoice.amountPaid + paymentForFee) >= feeStructure.amount ? 'PAID' : 'PARTIAL',
                },
            });

            // 6. Create Transaction for Fee Payment
            await tx.transaction.create({
                data: {
                    walletId: student.wallet.id,
                    amount: paymentForFee,
                    type: 'TUITION',
                    status: 'COMPLETED',
                    reference: reference || `FEE-${Date.now()}`,
                    method: method || 'MOMO',
                    description: `Payment for ${feeStructure.name}`,
                    balanceBefore: student.wallet.balance,
                    balanceAfter: student.wallet.balance, // Balance doesn't change for direct fee payment unless wallet is used
                },
            });

            // 7. Handle Overpayment (Add to Wallet)
            if (paymentToWallet > 0) {
                const balanceBefore = student.wallet.balance;
                const balanceAfter = balanceBefore + paymentToWallet;

                await tx.transaction.create({
                    data: {
                        walletId: student.wallet.id,
                        amount: paymentToWallet,
                        type: 'TOPUP',
                        status: 'COMPLETED',
                        reference: `OVERPAY-${Date.now()}`,
                        method: 'WALLET', // Or SYSTEM
                        description: `Overpayment for ${feeStructure.name} added to wallet`,
                        balanceBefore,
                        balanceAfter,
                    },
                });

                await tx.wallet.update({
                    where: { id: student.wallet.id },
                    data: {
                        balance: { increment: paymentToWallet },
                    },
                });
            }

            return { invoice: updatedInvoice, overpayment: paymentToWallet };
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Fee payment error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
