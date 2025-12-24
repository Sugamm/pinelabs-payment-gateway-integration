'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentCallbackContent() {
    const searchParams = useSearchParams();
    const [paymentData, setPaymentData] = useState<Record<string, string>>({});
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const data: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            data[key] = value;
        });
        setPaymentData(data);
        console.log('Payment callback data:', data);
    }, [searchParams]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(paymentData, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Format amount from paise to rupees
    const formatAmount = (paise: string) => {
        const amount = parseInt(paise, 10);
        if (isNaN(amount)) return paise;
        return `₹${(amount / 100).toFixed(2)}`;
    };

    // Key fields to highlight
    const keyFields = [
        { key: 'order_id', label: 'Order ID' },
        { key: 'plural_order_id', label: 'Plural Order ID' },
        { key: 'merchant_order_reference', label: 'Merchant Reference' },
        { key: 'transaction_id', label: 'Transaction ID' },
        { key: 'payment_id', label: 'Payment ID' },
        { key: 'amount', label: 'Amount', formatter: formatAmount },
        { key: 'status', label: 'Status' },
        { key: 'payment_status', label: 'Payment Status' },
        { key: 'payment_mode', label: 'Payment Mode' },
        { key: 'card_type', label: 'Card Type' },
        { key: 'bank_name', label: 'Bank Name' },
    ];

    return (
        <main className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', minHeight: '100vh' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                {/* Success Header */}
                <div className="card" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ 
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'rgba(34, 197, 94, 0.15)',
                        border: '2px solid var(--success)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>

                    <h1 style={{ marginBottom: '0.75rem', fontSize: '1.75rem' }}>
                        Payment Successful
                    </h1>

                    <p style={{ marginBottom: '1.5rem' }}>
                        Thank you for enrolling in the Generative AI Course!
                    </p>

                    {paymentData.amount && (
                        <div style={{ 
                            display: 'inline-block',
                            background: 'var(--bg-secondary)',
                            padding: '0.75rem 1.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                        }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Amount Paid</span>
                            <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                                {formatAmount(paymentData.amount)}
                            </div>
                        </div>
                    )}
                </div>

                {/* Payment Details */}
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>Payment Details</h3>
                        <span className="badge badge-success">Confirmed</span>
                    </div>

                    <div className="data-grid">
                        {keyFields.map(({ key, label, formatter }) => {
                            const value = paymentData[key];
                            if (!value) return null;
                            return (
                                <div key={key} className="data-row">
                                    <span className="data-label">{label}</span>
                                    <span className="data-value">
                                        {formatter ? formatter(value) : value}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Raw Response */}
                {Object.keys(paymentData).length > 0 && (
                    <div className="card" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h4 style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Raw PG Response
                            </h4>
                            <button
                                onClick={copyToClipboard}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.375rem 0.75rem' }}
                            >
                                {copied ? 'Copied!' : 'Copy JSON'}
                            </button>
                        </div>
                        
                        <pre style={{ 
                            background: 'var(--bg-secondary)',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            overflow: 'auto',
                            fontSize: '0.8125rem',
                            fontFamily: "'JetBrains Mono', monospace",
                            color: 'var(--text-secondary)',
                            margin: 0,
                            maxHeight: '200px',
                        }}>
                            {JSON.stringify(paymentData, null, 2)}
                        </pre>
                    </div>
                )}

                {/* Next Steps */}
                <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
                    <strong>What's Next?</strong>
                    <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                        Check your email for course access details and login credentials.
                    </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link href="/" className="btn btn-primary" style={{ flex: 1 }}>
                        ← Back to Home
                    </Link>
                    <button
                        className="btn btn-secondary"
                        onClick={() => window.print()}
                        style={{ flex: 1 }}
                    >
                        Print Receipt
                    </button>
                </div>
            </div>
        </main>
    );
}

export default function PaymentCallback() {
    return (
        <Suspense fallback={
            <main className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', minHeight: '100vh' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                    <p style={{ marginTop: '1rem' }}>Loading payment details...</p>
                </div>
            </main>
        }>
            <PaymentCallbackContent />
        </Suspense>
    );
}
