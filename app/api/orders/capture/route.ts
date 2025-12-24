// API Route: Capture Order Payment
// POST /api/orders/capture

import { NextRequest, NextResponse } from 'next/server';
import { getPineLabsClient } from '@/lib/pinelabs';
import { ApiResponse, CaptureResponse } from '@/types/order';

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();
        const { order_id, amount } = body;

        // Validate order ID
        if (!order_id) {
            return NextResponse.json<ApiResponse<null>>(
                {
                    success: false,
                    error: 'Order ID is required',
                },
                { status: 400 }
            );
        }

        // Validate amount if provided (for partial capture)
        if (amount && (typeof amount !== 'number' || amount <= 0)) {
            return NextResponse.json<ApiResponse<null>>(
                {
                    success: false,
                    error: 'Invalid capture amount',
                },
                { status: 400 }
            );
        }

        // Initialize Pine Labs client
        const pineLabsClient = getPineLabsClient();

        // Capture the order
        const captureResponse = await pineLabsClient.captureOrder(order_id, amount);

        console.log('Order captured successfully:', captureResponse);

        return NextResponse.json<ApiResponse<CaptureResponse>>(
            {
                success: true,
                data: captureResponse,
                message: 'Payment captured successfully',
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Capture order API error:', error);

        return NextResponse.json<ApiResponse<null>>(
            {
                success: false,
                error: error.message || 'Failed to capture payment',
            },
            { status: 500 }
        );
    }
}
