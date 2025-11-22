import { v4 as uuidv4 } from 'uuid';

const MOMO_BASE_URL = process.env.MOMO_ENVIRONMENT === 'production'
    ? 'https://proxy.momo.mtn.com'
    : 'https://sandbox.momodeveloper.mtn.com';

const COLLECTION_PRIMARY_KEY = process.env.MOMO_COLLECTION_PRIMARY_KEY;
const COLLECTION_USER_ID = process.env.MOMO_COLLECTION_USER_ID;
const COLLECTION_API_KEY = process.env.MOMO_COLLECTION_API_KEY;

const DISBURSEMENT_PRIMARY_KEY = process.env.MOMO_DISBURSEMENT_PRIMARY_KEY;
const DISBURSEMENT_USER_ID = process.env.MOMO_DISBURSEMENT_USER_ID;
const DISBURSEMENT_API_KEY = process.env.MOMO_DISBURSEMENT_API_KEY;

const REMITTANCE_PRIMARY_KEY = process.env.MOMO_REMITTANCE_PRIMARY_KEY;
const REMITTANCE_USER_ID = process.env.MOMO_REMITTANCE_USER_ID;
const REMITTANCE_API_KEY = process.env.MOMO_REMITTANCE_API_KEY;

type ProductType = 'collection' | 'disbursement' | 'remittance';

interface TokenCache {
    token: string;
    expiresAt: number;
}

const tokenCache: Record<ProductType, TokenCache | null> = {
    collection: null,
    disbursement: null,
    remittance: null,
};

/**
 * Generates a Basic Auth header for token generation.
 */
function getBasicAuth(userId: string, apiKey: string): string {
    return `Basic ${Buffer.from(`${userId}:${apiKey}`).toString('base64')}`;
}

/**
 * Gets the subscription key for a product.
 */
function getSubscriptionKey(product: ProductType): string | undefined {
    switch (product) {
        case 'collection': return COLLECTION_PRIMARY_KEY;
        case 'disbursement': return DISBURSEMENT_PRIMARY_KEY;
        case 'remittance': return REMITTANCE_PRIMARY_KEY;
    }
}

/**
 * Gets the User ID and API Key for a product.
 */
function getCredentials(product: ProductType): { userId?: string; apiKey?: string } {
    switch (product) {
        case 'collection': return { userId: COLLECTION_USER_ID, apiKey: COLLECTION_API_KEY };
        case 'disbursement': return { userId: DISBURSEMENT_USER_ID, apiKey: DISBURSEMENT_API_KEY };
        case 'remittance': return { userId: REMITTANCE_USER_ID, apiKey: REMITTANCE_API_KEY };
    }
}

/**
 * Fetches a new access token from MTN MoMo API.
 */
async function fetchToken(product: ProductType): Promise<string> {
    const { userId, apiKey } = getCredentials(product);
    const subscriptionKey = getSubscriptionKey(product);

    if (!userId || !apiKey || !subscriptionKey) {
        throw new Error(`Missing credentials for ${product}`);
    }

    const url = `${MOMO_BASE_URL}/${product}/token/`;
    const auth = getBasicAuth(userId, apiKey);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': auth,
            'Ocp-Apim-Subscription-Key': subscriptionKey,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get token for ${product}: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.access_token;
}

/**
 * Gets a valid access token, using cache if available.
 */
export async function getToken(product: ProductType): Promise<string> {
    const cache = tokenCache[product];
    const now = Date.now();

    if (cache && cache.expiresAt > now) {
        return cache.token;
    }

    const token = await fetchToken(product);
    // Token usually expires in 3600 seconds (1 hour). We cache for 55 minutes to be safe.
    tokenCache[product] = {
        token,
        expiresAt: now + 55 * 60 * 1000,
    };

    return token;
}

/**
 * Helper for making authenticated requests to MoMo API.
 */
export async function momoRequest(
    product: ProductType,
    endpoint: string,
    method: 'GET' | 'POST',
    body?: any,
    headers: Record<string, string> = {}
) {
    const token = await getToken(product);
    const subscriptionKey = getSubscriptionKey(product);

    if (!subscriptionKey) {
        throw new Error(`Missing subscription key for ${product}`);
    }

    const url = `${MOMO_BASE_URL}/${product}/v1_0/${endpoint}`;

    const defaultHeaders: Record<string, string> = {
        'Authorization': `Bearer ${token}`,
        'X-Target-Environment': process.env.MOMO_ENVIRONMENT || 'sandbox',
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-Type': 'application/json',
    };

    // Add X-Reference-Id if it's a POST request and not provided
    if (method === 'POST' && !headers['X-Reference-Id']) {
        defaultHeaders['X-Reference-Id'] = uuidv4();
    }

    const response = await fetch(url, {
        method,
        headers: { ...defaultHeaders, ...headers },
        body: body ? JSON.stringify(body) : undefined,
    });

    // Handle 401 specifically to clear cache? 
    // For simplicity, we just return the response and let the caller handle errors,
    // or we could throw if not OK.
    // MTN APIs return 202 Accepted for async requests, 200 for sync.

    return response;
}
