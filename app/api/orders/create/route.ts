// API Route: Create Order with Pine Labs
// POST /api/orders/create

import { NextRequest, NextResponse } from 'next/server';
import { getPineLabsClient, PineLabsClient } from '@/lib/pinelabs';
import { CustomerDetails, ApiResponse, OrderResponse } from '@/types/order';

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();
        const { customer }: { customer: CustomerDetails } = body;

        // Validate customer details
        if (!customer?.name || !customer?.email || !customer?.phone) {
            return NextResponse.json<ApiResponse<null>>(
                {
                    success: false,
                    error: 'Missing required customer details (name, email, phone)',
                },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customer.email)) {
            return NextResponse.json<ApiResponse<null>>(
                {
                    success: false,
                    error: 'Invalid email format',
                },
                { status: 400 }
            );
        }

        // Validate phone format (10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(customer.phone.replace(/\D/g, ''))) {
            return NextResponse.json<ApiResponse<null>>(
                {
                    success: false,
                    error: 'Invalid phone number. Please provide a 10-digit number',
                },
                { status: 400 }
            );
        }

        // Product details - Generative AI Course at ₹99.99
        const productName = process.env.PRODUCT_NAME || 'Generative AI Course';
        // Amount in paise: ₹99.99 = 9999 paise
        const productPrice = parseInt(process.env.PRODUCT_PRICE || '9999', 10);

        // Generate unique order reference
        const orderReferenceId = PineLabsClient.generateOrderReference();

        // Initialize Pine Labs client
        const pineLabsClient = getPineLabsClient();

        // Create order with Pine Labs
        const orderResponse = await pineLabsClient.createOrder({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            amount: productPrice, // Amount in paise: 9999 paise = ₹99.99
            orderReference: orderReferenceId,
            notes: productName,
        });

        console.log('Order created successfully:', orderResponse);

        return NextResponse.json<ApiResponse<any>>(
            {
                success: true,
                data: orderResponse,
                message: 'Order created successfully',
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create order API error:', error);

        return NextResponse.json<ApiResponse<null>>(
            {
                success: false,
                error: error.message || 'Failed to create order',
            },
            { status: 500 }
        );
    }
}
