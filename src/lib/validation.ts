import { z } from 'zod';

export const payerSchema = z.object({
    partyIdType: z.enum(['MSISDN', 'EMAIL', 'PARTY_CODE']),
    partyId: z.string().min(1, "Party ID is required"),
});

export const collectionRequestSchema = z.object({
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
    currency: z.enum(['GHS', 'EUR', 'USD']).default('GHS'),
    payer: payerSchema,
    payerMessage: z.string().optional(),
    payeeNote: z.string().optional(),
});

export const disbursementRequestSchema = z.object({
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
    currency: z.enum(['GHS', 'EUR', 'USD']).default('GHS'),
    payee: payerSchema,
    payerMessage: z.string().optional(),
    payeeNote: z.string().optional(),
});

export const remittanceRequestSchema = z.object({
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
    currency: z.enum(['GHS', 'EUR', 'USD']).default('GHS'),
    payee: payerSchema,
    payerMessage: z.string().optional(),
    payeeNote: z.string().optional(),
});
