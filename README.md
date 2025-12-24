# Pine Labs Checkout Integration Demo

A complete Next.js application demonstrating **all 4 Pine Labs checkout integration methods** for selling a Generative AI Course at ₹99.99.

![Pine Labs Demo](https://img.shields.io/badge/Pine%20Labs-Integration-green) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🎯 Checkout Types

| Type | Complexity | Redirect | Best For |
|------|------------|----------|----------|
| **Hosted Checkout** | Easy | ✅ Yes | Quick implementation, full PCI compliance |
| **Infinity Checkout** | Easy | ✅ Yes | Premium UX, smart payment routing |
| **iFrame Checkout** | Medium | ❌ No | Embedded form, seamless experience |
| **Seamless Checkout** | Advanced | ❌ No | Full UI control, native experience |

## ✨ Features

- 🎨 **Modern Dark Theme**: Minimalistic mono-color design with glassmorphism
- 💳 **4 Checkout Methods**: Hosted, Infinity, iFrame, and Seamless
- 🔐 **Secure Payments**: Server-side API integration with Pine Labs
- 📱 **Responsive Design**: Works on all devices
- 🧪 **Test Cards Included**: Copy-to-clipboard test card panel
- ✅ **TypeScript**: Full type safety

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Pine Labs Credentials (from dashboard.pluralpay.in)
PINELABS_MERCHANT_ID=your_merchant_id
PINELABS_CLIENT_ID=your_client_id
PINELABS_CLIENT_SECRET=your_client_secret
PINELABS_ENVIRONMENT=UAT

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
PRODUCT_NAME=Generative AI Course
PRODUCT_PRICE=9999
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🧪 Test Card Details

Use these cards in the **UAT environment**:

| Card Type | Number | Expiry | CVV | Result |
|-----------|--------|--------|-----|--------|
| Visa | `4012 0010 3714 1112` | 12/25 | 123 | ✅ Success |
| Mastercard | `5123 4500 0000 0008` | 12/25 | 100 | ✅ Success |
| Visa (Decline) | `4012 0010 3714 1120` | 12/25 | 123 | ❌ Failure |

**OTP for 3DS verification**: `123456`

**UPI for testing**: `success@upi` or `fail@upi`

## 📁 Project Structure

```
pinelabs-poc/
├── app/
│   ├── api/orders/
│   │   ├── create/route.ts      # Order creation API
│   │   └── capture/route.ts     # Payment capture API
│   ├── checkout/
│   │   ├── hosted/page.tsx      # Hosted checkout page
│   │   ├── infinity/page.tsx    # Infinity checkout page
│   │   ├── iframe/page.tsx      # iFrame checkout page
│   │   └── seamless/page.tsx    # Seamless checkout page
│   ├── payment/
│   │   ├── callback/page.tsx    # Success callback
│   │   └── failure/page.tsx     # Failure callback
│   ├── layout.tsx
│   ├── page.tsx                 # Home page with all options
│   └── globals.css              # Design system
├── components/
│   ├── CheckoutTypeSelector.tsx # Home page component
│   └── TestCardPanel.tsx        # Test card display
├── lib/
│   └── pinelabs.ts              # Pine Labs API client
├── types/
│   └── order.ts                 # TypeScript definitions
└── .env.example
```

## 🔄 Checkout Flow Comparison

### Hosted & Infinity Checkout
```
Your Site → Pine Labs Page → OTP/3DS → Pine Labs → Your Callback URL
```

### iFrame Checkout
```
Your Site → Embedded iFrame (Pine Labs) → OTP/3DS (in iframe) → postMessage → Your Handler
```

### Seamless Checkout
```
Your Site → Custom Form → API Call → Inline OTP Modal → API Response → Your Handler
```

## 📡 API Endpoints

### Create Order

```bash
POST /api/orders/create

{
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  },
  "checkoutType": "hosted" | "infinity" | "iframe" | "seamless"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order_id": "PLO123456789",
    "payment_gateway_url": "https://...",
    "order_reference_id": "ORD-xxx"
  }
}
```

### Capture Payment

```bash
POST /api/orders/capture

{
  "order_id": "PLO123456789",
  "amount": 9999
}
```

## 🎨 Customization

### Change Product

Edit `.env.local`:
```env
PRODUCT_NAME=Your Product
PRODUCT_PRICE=19999  # Amount in paise (₹199.99)
```

### Change Theme Colors

Edit `app/globals.css`:
```css
:root {
  --mono-900: #0a0a0a;
  --mono-800: #171717;
  --accent: #f59e0b;
  /* ... */
}
```

## 🔒 Security

- ✅ API credentials in environment variables (never committed)
- ✅ Server-side API calls only
- ✅ Input validation on client and server
- ✅ `.env.local` in `.gitignore`
- ✅ PCI compliance handled by Pine Labs (except Seamless)

## 🐛 Troubleshooting

### "Pine Labs credentials not configured"
- Check `.env.local` has all required values
- Restart dev server after changes

### "Failed to create order"
- Verify API credentials are correct
- Check you're using UAT credentials with UAT environment
- Check server console for detailed errors

### OTP not working in UAT
- Use `123456` as the test OTP
- Some test scenarios may fail intentionally

## 📚 Documentation

- [Pine Labs Developer Docs](https://developer.pinelabsonline.com/docs)
- [Hosted Checkout](https://developer.pinelabsonline.com/docs/hosted-checkouts)
- [Infinity Checkout](https://developer.pinelabsonline.com/docs/checkout-infinity)
- [iFrame Checkout](https://developer.pinelabsonline.com/docs/iframes)
- [Seamless Checkout](https://developer.pinelabsonline.com/docs/seamless-checkout)
- [Test Cards](https://developer.pinelabsonline.com/docs/payments-test-card-details)

## 📄 License

MIT

## 🤝 Support

- Pine Labs: [support@pluralonline.com](mailto:support@pluralonline.com)
- Dashboard: [dashboard.pluralpay.in](https://dashboard.pluralpay.in)
