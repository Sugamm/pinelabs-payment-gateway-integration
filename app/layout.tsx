import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Generative AI Course | ₹99.99 - Pine Labs Checkout Demo',
    description: 'Experience different Pine Labs payment integration methods: Hosted Checkout, Infinity Checkout, iFrame Checkout, and Seamless Checkout. Demo for Generative AI Course at ₹99.99.',
    keywords: 'Pine Labs, Payment Gateway, Checkout Integration, Generative AI Course, Payment Demo',
    authors: [{ name: 'GrowthSchool' }],
    openGraph: {
        title: 'Generative AI Course | Pine Labs Checkout Demo',
        description: 'Explore 4 different Pine Labs checkout integration methods.',
        type: 'website',
        locale: 'en_US',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#09090b',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body>{children}</body>
        </html>
    );
}
