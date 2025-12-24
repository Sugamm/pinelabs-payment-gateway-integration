// Type definitions for Pine Labs Order APIs

export interface CustomerDetails {
    name: string;
    email: string;
    phone: string;
}

// Pine Labs API Request/Response Types
export interface PineLabsOrderRequest {
    merchant_order_reference: string;
    order_amount: {
        value: number; // Amount in smallest currency unit (paise for INR)
        currency: string;
    };
    purchase_details: {
        customer: {
            email_id: string;
            first_name: string;
            last_name: string;
            mobile_number: string;
            country_code: string;
            customer_id?: string;
        };
    };
    callback_url?: string;
    failure_callback_url?: string;
    pre_auth?: boolean;
    notes?: string;
}

export interface PineLabsOrderResponse {
    payment_id: string;
    merchant_id: string;
    merchant_order_reference: string;
    order_amount: {
        value: number;
        currency: string;
    };
    payment_status: PaymentStatus;
    payment_gateway_url?: string;
    token?: string;
}

// Legacy types for backwards compatibility
export interface OrderRequest {
    merchant_id: string;
    order_amount: number;
    order_reference_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    product_details: string;
    callback_url?: string;
    pre_auth?: boolean;
}

export interface OrderResponse {
    order_id: string;
    merchant_id: string;
    order_reference_id: string;
    payment_status: PaymentStatus;
    payment_url?: string;
    token?: string;
}

export interface CaptureRequest {
    order_id: string;
    amount?: number; // Optional for partial capture
}

export interface CaptureResponse {
    order_id: string;
    capture_status: string;
    captured_amount: number;
    message: string;
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    CAPTURED = 'CAPTURED',
    AUTHORIZED = 'AUTHORIZED',
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
