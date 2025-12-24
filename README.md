# Pine Labs Seamless Checkout Integration

A complete Next.js application demonstrating Pine Labs seamless checkout integration for selling a Generative AI Course.

## Features

- 🎨 **Premium UI Design**: Modern glassmorphism effects, gradient animations, and responsive design
- 🔐 **Secure Payments**: Direct server-to-server communication with Pine Labs API
- 💳 **Order Management**: Complete order creation and capture flow
- ✅ **Type Safety**: Full TypeScript implementation
- 🎯 **SEO Optimized**: Comprehensive metadata and semantic HTML

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Vanilla CSS with modern design system
- **API Integration**: Axios for HTTP requests
- **Payment Gateway**: Pine Labs Seamless Checkout

## Prerequisites

Before you begin, ensure you have:

1. **Node.js** 18+ and npm installed
2. **Pine Labs Account**: Sign up at [Pine Labs Dashboard](https://dashboard.pluralpay.in)
3. **API Credentials**: Merchant ID and API Key from Pine Labs dashboard

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the `.env.example` file and create `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Pine Labs credentials:

```env
# Pine Labs API Configuration
PINELABS_MERCHANT_ID=your_merchant_id_here
PINELABS_API_KEY=your_api_key_here
PINELABS_ENVIRONMENT=UAT

# Product Configuration
PRODUCT_NAME=Generative AI Course
PRODUCT_PRICE=9999
```

> **Note**: By default, the app uses Pine Labs UAT (testing) environment. Change `PINELABS_ENVIRONMENT` to `PRODUCTION` when going live.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
pinelabs-poc/
├── app/
│   ├── api/
│   │   └── orders/
│   │       ├── create/
│   │       │   └── route.ts        # Order creation API endpoint
│   │       └── capture/
│   │           └── route.ts        # Order capture API endpoint
│   ├── layout.tsx                  # Root layout with SEO
│   ├── page.tsx                    # Main product page
│   └── globals.css                 # Global styles & design system
├── lib/
│   └── pinelabs.ts                 # Pine Labs API client library
├── types/
│   └── order.ts                    # TypeScript type definitions
├── .env.example                    # Environment variables template
├── .env.local                      # Your local environment (gitignored)
├── package.json
├── tsconfig.json
└── next.config.js
```

## API Endpoints

### Create Order

**Endpoint**: `POST /api/orders/create`

**Request Body**:
```json
{
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "order_id": "PLO123456789",
    "merchant_id": "M123",
    "order_amount": 9999,
    "order_reference_id": "ORD-1234567890-ABC",
    "payment_status": "PENDING"
  },
  "message": "Order created successfully"
}
```

### Capture Order

**Endpoint**: `POST /api/orders/capture`

**Request Body**:
```json
{
  "order_id": "PLO123456789",
  "amount": 9999
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "order_id": "PLO123456789",
    "capture_status": "CAPTURED",
    "captured_amount": 9999,
    "message": "Payment captured successfully"
  }
}
```

## Pine Labs Integration

This app integrates with Pine Labs seamless checkout using their REST API:

- **UAT Environment**: `https://pluraluat.v2.pinepg.in/api/pay/v1`
- **Production Environment**: `https://api.pluralpay.in/api/pay/v1`

### Key Features:

1. **Order Creation**: Creates orders with customer details and product information
2. **Order Capture**: Captures authorized payments (when pre_auth is enabled)
3. **Error Handling**: Comprehensive error handling with user-friendly messages
4. **Validation**: Server-side validation for all customer inputs

## Testing

### Manual Testing Steps:

1. **Start the dev server**: `npm run dev`
2. **Open the app**: Navigate to `http://localhost:3000`
3. **Click "Enroll Now"**: Opens the checkout modal
4. **Fill in customer details**:
   - Name: John Doe
   - Email: john@example.com
   - Phone: 9876543210
5. **Submit the form**: Creates an order with Pine Labs
6. **Check the response**: Success modal with order ID and reference

### Expected Results:

- ✅ Order creation returns a valid order ID
- ✅ No console errors
- ✅ Success message displayed to user
- ✅ Pine Labs API responds with 200/201 status

## Security Notes

- ✅ API credentials stored in environment variables (never committed)
- ✅ Server-side API calls (credentials not exposed to client)
- ✅ Input validation on both client and server
- ✅ `.env.local` properly gitignored

## Customization

### Change Product Details

Edit `.env.local`:

```env
PRODUCT_NAME=Your Product Name
PRODUCT_PRICE=19999
```

### Change UI Colors

Edit `app/globals.css` and modify CSS custom properties:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  /* ... */
}
```

## Troubleshooting

### "Pine Labs credentials not configured"

- Ensure `.env.local` exists with valid credentials
- Restart the dev server after changing environment variables

### "Failed to create order"

- Check Pine Labs API credentials are correct
- Verify you're using the correct environment (UAT vs Production)
- Check server logs for detailed error messages

### Build Errors

- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (requires 18+)

## Documentation

- [Pine Labs Developer Docs](https://developer.pinelabsonline.com/docs/seamless-checkout)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## License

MIT

## Support

For Pine Labs API support, contact: [Pine Labs Support](https://www.pluralonline.com/support)
