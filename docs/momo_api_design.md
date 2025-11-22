# MTN MoMo API Integration Design

This document outlines the backend API design for integrating MTN Mobile Money (MoMo) into the School Management System.

## Overview

The integration covers three main products:
1.  **Collections (C2B)**: Receiving payments from students/parents.
2.  **Disbursements (B2C)**: Sending money to staff/students (e.g., refunds, salary).
3.  **Remittances**: Transfers between wallets.

## Environment Setup

### Sandbox vs Production
- **Sandbox**: Uses a specific `Ocp-Apim-Subscription-Key` and `X-Reference-Id` (UUID) to generate an API User and API Key. The base URL is `https://sandbox.momodeveloper.mtn.com`.
- **Production**: Uses live keys provided by MTN. Base URL is `https://proxy.momo.mtn.com`.

### Required Environment Variables
```bash
MOMO_COLLECTION_PRIMARY_KEY=...
MOMO_COLLECTION_SECONDARY_KEY=...
MOMO_DISBURSEMENT_PRIMARY_KEY=...
MOMO_DISBURSEMENT_SECONDARY_KEY=...
MOMO_REMITTANCE_PRIMARY_KEY=...
MOMO_API_USER_ID=... # Generated UUID
MOMO_API_KEY=... # Generated via API
MOMO_ENVIRONMENT=sandbox # or production
MOMO_CALLBACK_HOST=https://your-domain.com
```

---

## 1. Collections APIs (Customer-to-Business)

### 1.1 Request Payment (C2B)
Initiates a payment request to the customer's mobile phone.

- **Endpoint**: `POST /api/momo/collect/request-payment`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "amount": "50.00",
  "currency": "GHS",
  "payer": {
    "partyIdType": "MSISDN",
    "partyId": "233244567890"
  },
  "payerMessage": "School Fees Payment",
  "payeeNote": "Term 1 Tuition"
}
```
- **Response (202 Accepted)**:
```json
{
  "status": "PENDING",
  "referenceId": "a1b2c3d4-e5f6-...",
  "message": "Payment request initiated. Check status for updates."
}
```

### 1.2 Check Payment Status
Checks the status of a specific payment request.

- **Endpoint**: `GET /api/momo/collect/status/{referenceId}`
- **Response (200 OK)**:
```json
{
  "referenceId": "a1b2c3d4-e5f6-...",
  "status": "SUCCESSFUL", // PENDING, SUCCESSFUL, FAILED
  "amount": "50.00",
  "currency": "GHS",
  "financialTransactionId": "123456789",
  "externalId": "12345"
}
```

### 1.3 Receive Webhook
Endpoint called by MTN MoMo when a transaction status changes.

- **Endpoint**: `POST /api/momo/collect/webhook`
- **Headers**: `X-Callback-Url`, `X-Reference-Id`
- **Request Body**:
```json
{
  "financialTransactionId": "123456789",
  "externalId": "12345",
  "amount": "50.00",
  "currency": "GHS",
  "payer": {
    "partyIdType": "MSISDN",
    "partyId": "233244567890"
  },
  "status": "SUCCESSFUL"
}
```
- **Response (200 OK)**: Empty body.

### 1.4 Get Balance
Retrieves the balance of the collection account.

- **Endpoint**: `GET /api/momo/collect/balance`
- **Response (200 OK)**:
```json
{
  "availableBalance": "1500.00",
  "currency": "GHS"
}
```

### 1.5 Validate Account
Validates if a mobile number is active and registered.

- **Endpoint**: `GET /api/momo/collect/validate-account/{number}`
- **Response (200 OK)**:
```json
{
  "isValid": true,
  "accountHolderName": "John Doe" // Only available in some environments/permissions
}
```

---

## 2. Disbursement APIs (Business-to-Customer)

### 2.1 Send Money (B2C)
Sends money from the organization to a user.

- **Endpoint**: `POST /api/momo/disburse/send-money`
- **Request Body**:
```json
{
  "amount": "200.00",
  "currency": "GHS",
  "payee": {
    "partyIdType": "MSISDN",
    "partyId": "233244567890"
  },
  "payerMessage": "Refund",
  "payeeNote": "Refund for overpayment"
}
```
- **Response (202 Accepted)**:
```json
{
  "status": "PENDING",
  "referenceId": "b2c3d4e5-f6g7-..."
}
```

### 2.2 Track Payout Status
- **Endpoint**: `GET /api/momo/disburse/status/{referenceId}`
- **Response**: Similar to Collection Status.

### 2.3 Check Disbursement Balance
- **Endpoint**: `GET /api/momo/disburse/balance`

### 2.4 Validate Recipient
- **Endpoint**: `GET /api/momo/disburse/validate-account/{number}`

---

## 3. Remittances APIs (Wallet Transfers)

### 3.1 Transfer
Transfers funds between wallets.

- **Endpoint**: `POST /api/momo/remit/transfer`
- **Request Body**:
```json
{
  "amount": "100.00",
  "currency": "GHS",
  "payee": {
    "partyIdType": "MSISDN",
    "partyId": "233555555555"
  },
  "payerMessage": "Transfer",
  "payeeNote": "Wallet Transfer"
}
```

### 3.2 Check Status
- **Endpoint**: `GET /api/momo/remit/status/{referenceId}`

---

## 4. Authentication APIs

### 4.1 Generate Token
Generates an access token using the subscription key and API user/key. This is usually handled internally by the backend but exposed if needed for debugging or manual triggers.

- **Endpoint**: `POST /api/momo/token`
- **Request Body**:
```json
{
  "product": "collection" // collection, disbursement, remittance
}
```
- **Response (200 OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1Ni...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

---

## 5. System APIs

### 5.1 Generate Idempotency Keys
Helper to generate UUID v4 keys for `X-Reference-Id`.

- **Endpoint**: `POST /api/momo/idempotency`
- **Response**: `{"key": "uuid-v4-string"}`

### 5.2 Fetch Transaction Logs
Retrieves internal logs of MoMo interactions.

- **Endpoint**: `GET /api/momo/logs`
- **Response**: List of logs from `AuditLog` or specific MoMo log table.

### 5.3 Verify Webhook Signature
Verifies that the webhook request is genuinely from MTN.

- **Endpoint**: `POST /api/momo/webhook/verify`
- **Description**: Validates the HMAC signature (if provided by MTN in headers, usually `X-Callback-Signature` or similar depending on setup).

---

## Best Practices

1.  **Idempotency**: Always use a unique `X-Reference-Id` (UUID) for every transaction request. Retry with the same ID if a network error occurs.
2.  **Token Management**: Cache access tokens until they expire (usually 1 hour). Do not request a new token for every transaction.
3.  **Secure Storage**: Never commit API keys or Subscription keys to version control. Use `.env` files.
4.  **Asynchronous Processing**: Payment requests are asynchronous. Always rely on the `status` endpoint or Webhooks to confirm final status. Do not assume success immediately after the initial POST.
5.  **Error Handling**: Handle 401 (Unauthorized) by refreshing the token and retrying. Handle 409 (Conflict) if a reference ID is reused incorrectly.
