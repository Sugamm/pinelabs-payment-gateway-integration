// Pine Labs API Integration Library

import axios, { AxiosInstance } from 'axios';
import { OrderRequest, OrderResponse, CaptureRequest, CaptureResponse } from '@/types/order';

// Pine Labs API URLs
// Hosted Checkout uses /api/checkout/v1 (returns payment_gateway_url)
// Seamless Checkout uses /api/pay/v1 (requires frontend implementation)
const PINELABS_UAT_URL = 'https://pluraluat.v2.pinepg.in/api/checkout/v1';
const PINELABS_PROD_URL = 'https://api.pluralpay.in/api/checkout/v1';
const PINELABS_UAT_AUTH_URL = 'https://pluraluat.v2.pinepg.in/api/auth/v1/token';
const PINELABS_PROD_AUTH_URL = 'https://api.pluralpay.in/api/auth/v1/token';

export class PineLabsClient {
    private client: AxiosInstance;
    private merchantId: string;
    private clientId: string;
    private clientSecret: string;
    private authUrl: string;
    private accessToken: string | null = null;
    private tokenExpiry: number = 0;

    constructor() {
        const environment = process.env.PINELABS_ENVIRONMENT || 'UAT';
        const baseURL = environment === 'PRODUCTION' ? PINELABS_PROD_URL : PINELABS_UAT_URL;
        this.authUrl = environment === 'PRODUCTION' ? PINELABS_PROD_AUTH_URL : PINELABS_UAT_AUTH_URL;

        this.merchantId = process.env.PINELABS_MERCHANT_ID || '';
        this.clientId = process.env.PINELABS_CLIENT_ID || '';
        this.clientSecret = process.env.PINELABS_CLIENT_SECRET || '';

        // Debug logging
        console.log('🔧 Pine Labs Client Initialized:');
        console.log('Environment:', environment);
        console.log('Base URL:', baseURL);
        console.log('Auth URL:', this.authUrl);
        console.log('Merchant ID:', this.merchantId || 'MISSING');
        console.log('Client ID:', this.clientId ? `${this.clientId.substring(0, 8)}***` : 'MISSING');
        console.log('Client Secret:', this.clientSecret ? `${this.clientSecret.substring(0, 8)}***` : 'MISSING');

        if (!this.merchantId || !this.clientId || !this.clientSecret) {
            throw new Error('Pine Labs credentials not configured. Check your .env.local file.');
        }

        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 30000, // 30 seconds
        });
    }

    /**
     * Get OAuth access token using Client Credentials flow
     */
    private async getAccessToken(): Promise<string> {
        // Return cached token if still valid
        if (this.accessToken && Date.now() < this.tokenExpiry) {
            console.log('✅ Using cached access token');
            return this.accessToken;
        }

        try {
            console.log('🔑 Requesting new access token from Pine Labs...');

            // Pine Labs uses JSON body format (not standard OAuth Basic Auth)

            const response = await axios.post(
                this.authUrl,
                {
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    grant_type: 'client_credentials',
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                }
            );

            const token = response.data.access_token;
            
            if (!token) {
                throw new Error('No access token received from Pine Labs');
            }
            
            this.accessToken = token;

            // Handle both expires_in (seconds) and expires_at (ISO date) formats
            let expiresIn = 3600; // Default 1 hour
            if (response.data.expires_in) {
                expiresIn = response.data.expires_in;
            } else if (response.data.expires_at) {
                const expiresAt = new Date(response.data.expires_at).getTime();
                expiresIn = Math.floor((expiresAt - Date.now()) / 1000);
            }

            // Set expiry to 5 minutes before actual expiry
            this.tokenExpiry = Date.now() + (expiresIn - 300) * 1000;

            console.log('✅ Access token obtained successfully');
            console.log('Token expires in:', expiresIn, 'seconds');

            return token;
        } catch (error: any) {
            console.error('❌ Failed to get access token:');
            console.error('Status:', error.response?.status);
            console.error('Response:', JSON.stringify(error.response?.data, null, 2));
            throw new Error('Failed to authenticate with Pine Labs');
        }
    }

    /**
     * Create a new order in Pine Labs
     */
    async createOrder(customerData: {
        name: string;
        email: string;
        phone: string;
        amount: number;
        orderReference: string;
        notes?: string;
    }): Promise<any> {
        try {
            // Get valid access token
            const token = await this.getAccessToken();

            // Split customer name into first and last name
            const nameParts = customerData.name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || firstName;

            // Build Pine Labs request payload
            const payload = {
                merchant_order_reference: customerData.orderReference,
                order_amount: {
                    value: customerData.amount, // Amount in paise (smallest currency unit)
                    currency: 'INR',
                },
                purchase_details: {
                    customer: {
                        email_id: customerData.email,
                        first_name: firstName,
                        last_name: lastName,
                        mobile_number: customerData.phone.replace(/\D/g, ''), // Remove non-digits
                        country_code: '91', // India country code
                    },
                },
                callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/callback`,
                failure_callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/failure`,
                pre_auth: false,
                notes: customerData.notes || 'Order from Generative AI Course',
            };

            console.log('📤 Sending Order Request to Pine Labs:');
            console.log('Endpoint:', this.client.defaults.baseURL + '/orders');
            console.log('Payload:', JSON.stringify(payload, null, 2));

            const response = await this.client.post('/orders', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('✅ Pine Labs Response:', JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error: any) {
            console.error('❌ Pine Labs Create Order Error:');
            console.error('Status:', error.response?.status);
            console.error('Status Text:', error.response?.statusText);
            console.error('Response Data:', JSON.stringify(error.response?.data, null, 2));
            console.error('Error Message:', error.message);

            throw new Error(
                error.response?.data?.message || error.response?.data?.error || 'Failed to create order with Pine Labs'
            );
        }
    }

    /**
     * Capture payment for an authorized order
     */
    async captureOrder(orderId: string, amount?: number): Promise<CaptureResponse> {
        try {
            // Get valid access token
            const token = await this.getAccessToken();

            const payload: Partial<CaptureRequest> = amount ? { amount } : {};

            const response = await this.client.post<CaptureResponse>(
                `/orders/${orderId}/capture`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Pine Labs Capture Order Error:', error.response?.data || error.message);
            throw new Error(
                error.response?.data?.message || 'Failed to capture order'
            );
        }
    }

    /**
     * Generate a unique order reference ID
     */
    static generateOrderReference(): string {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 10);
        return `ORD-${timestamp}-${random}`.toUpperCase();
    }
}

// Helper function to get Pine Labs client instance
export function getPineLabsClient(): PineLabsClient {
    return new PineLabsClient();
}
