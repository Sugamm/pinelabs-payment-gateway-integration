'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentFailureContent() {
    const searchParams = useSearchParams();
    const [paymentData, setPaymentData] = useState<Record<string, string>>({});
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const data: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            data[key] = value;
        });
        setPaymentData(data);
        console.log('Payment failure data:', data);
    }, [searchParams]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(paymentData, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Key fields to display
    const keyFields = [
        { key: 'order_id', label: 'Order ID' },
        { key: 'plural_order_id', label: 'Plural Order ID' },
        { key: 'merchant_order_reference', label: 'Merchant Reference' },
        { key: 'transaction_id', label: 'Transaction ID' },
        { key: 'payment_id', label: 'Payment ID' },
        { key: 'status', label: 'Status' },
        { key: 'payment_status', label: 'Payment Status' },
        { key: 'error_code', label: 'Error Code' },
        { key: 'error_message', label: 'Error Message' },
        { key: 'reason', label: 'Reason' },
        { key: 'bank_error_code', label: 'Bank Error Code' },
        { key: 'bank_error_message', label: 'Bank Error' },
    ];

    return (
        <main className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', minHeight: '100vh' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                {/* Failure Header */}
                <div className="card" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ 
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '2px solid var(--error)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </div>

                    <h1 style={{ marginBottom: '0.75rem', fontSize: '1.75rem', color: 'var(--error)' }}>
                        Payment Failed
                    </h1>

                    <p style={{ marginBottom: 0 }}>
                        We couldn't complete your payment. Please try again.
                    </p>
                </div>

                {/* Error Details */}
                {(paymentData.error_message || paymentData.reason) && (
                    <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
                        <strong>Error:</strong> {paymentData.error_message || paymentData.reason || 'Payment was declined'}
                    </div>
                )}

                {/* Transaction Details */}
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>Transaction Details</h3>
                        <span className="badge badge-error">Failed</span>
                    </div>

                    <div className="data-grid">
                        {keyFields.map(({ key, label }) => {
                            const value = paymentData[key];
                            if (!value) return null;
                            return (
                                <div key={key} className="data-row">
                                    <span className="data-label">{label}</span>
                                    <span className="data-value" style={{ 
                                        color: key.includes('error') ? 'var(--error)' : 'var(--text-primary)'
                                    }}>
                                        {value}
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

                {/* Common Reasons */}
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Common Reasons for Failure</h4>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Insufficient funds in your account</li>
                        <li style={{ marginBottom: '0.5rem' }}>Incorrect card details or OTP</li>
                        <li style={{ marginBottom: '0.5rem' }}>Transaction limit exceeded</li>
                        <li style={{ marginBottom: '0.5rem' }}>Card expired or blocked</li>
                        <li style={{ marginBottom: 0 }}>Network or bank server issues</li>
                    </ul>
                </div>

                {/* Help */}
                <div style={{ 
                    background: 'var(--bg-secondary)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                }}>
                    <p style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                        Need help? Contact our support team
                    </p>
                    <a 
                        href="mailto:support@growthschool.com" 
                        style={{ color: 'var(--text-primary)', fontWeight: 500 }}
                    >
                        support@growthschool.com
                    </a>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link href="/" className="btn btn-primary" style={{ flex: 1 }}>
                        ← Try Again
                    </Link>
                    <Link href="/" className="btn btn-secondary" style={{ flex: 1 }}>
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default function PaymentFailure() {
    return (
        <Suspense fallback={
            <main className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', minHeight: '100vh' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                    <p style={{ marginTop: '1rem' }}>Loading...</p>
                </div>
            </main>
        }>
            <PaymentFailureContent />
        </Suspense>
    );
}
