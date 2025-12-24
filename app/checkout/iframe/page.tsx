'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import TestCardPanel from '@/components/TestCardPanel';
import { CustomerDetails, ApiResponse } from '@/types/order';

export default function IFrameCheckout() {
    const [showCheckout, setShowCheckout] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [iframeUrl, setIframeUrl] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const [formData, setFormData] = useState<CustomerDetails>({
        name: '',
        email: '',
        phone: '',
    });

    // Listen for messages from the iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Handle Pine Labs iframe messages
            console.log('iFrame message received:', event.data);
            
            if (event.data?.type === 'PAYMENT_SUCCESS') {
                setPaymentStatus('success');
                // Redirect to callback page with payment data
                const params = new URLSearchParams(event.data.payload || {});
                window.location.href = `/payment/callback?${params.toString()}`;
            } else if (event.data?.type === 'PAYMENT_FAILED') {
                setPaymentStatus('failed');
                const params = new URLSearchParams(event.data.payload || {});
                window.location.href = `/payment/failure?${params.toString()}`;
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBuyNow = () => {
        setShowCheckout(true);
        setError(null);
    };

    const handleCloseModal = () => {
        setShowCheckout(false);
        setError(null);
        setIframeUrl(null);
        setPaymentStatus('idle');
        setFormData({ name: '', email: '', phone: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer: formData,
                    checkoutType: 'iframe',
                }),
            });

            const result: ApiResponse<any> = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.error || 'Failed to create order');
            }

            // For iFrame, we load the payment URL in an iframe instead of redirecting
            if (result.data.redirect_url) {
                setIframeUrl(result.data.redirect_url);
                setPaymentStatus('processing');
            } else {
                throw new Error('No payment URL received');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
            {/* Back Link */}
            <Link
                href="/"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '2rem',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.9375rem',
                    transition: 'color 0.2s',
                }}
            >
                <span>←</span>
                <span>Back to all methods</span>
            </Link>

            {/* Product Section */}
            <section className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="badge">iFrame Checkout</span>
                        <span className="badge" style={{ 
                            background: 'rgba(245, 158, 11, 0.15)', 
                            borderColor: 'rgba(245, 158, 11, 0.3)', 
                            color: '#f59e0b' 
                        }}>
                            Medium Complexity
                        </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                        <h1 style={{ marginBottom: '0.75rem' }}>Generative AI Course</h1>
                        <p style={{ fontSize: '1.0625rem', maxWidth: '600px', marginBottom: 0 }}>
                            Embed Pine Labs payment form directly on your page. Customers stay on your 
                            site while completing the payment in a secure iframe.
                        </p>
                    </div>

                    {/* Price & CTA */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        <div>
                            <span className="price">₹99.99</span>
                            <span style={{ marginLeft: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹999</span>
                        </div>
                        <button className="btn btn-primary btn-lg" onClick={handleBuyNow}>
                            Enroll Now →
                        </button>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>How iFrame Checkout Works</h3>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { step: '01', title: 'Create Order', desc: 'Backend creates order and gets payment URL' },
                        { step: '02', title: 'Load iFrame', desc: 'Payment form loads in embedded iframe' },
                        { step: '03', title: 'Payment', desc: 'User completes payment without leaving page' },
                        { step: '04', title: 'Event', desc: 'Receive payment status via postMessage' },
                    ].map((item) => (
                        <div key={item.step} style={{ display: 'flex', gap: '1rem' }}>
                            <span className="mono" style={{ 
                                fontSize: '0.75rem', 
                                color: 'var(--text-muted)',
                                letterSpacing: '0.05em',
                            }}>
                                {item.step}
                            </span>
                            <div>
                                <h4 style={{ marginBottom: '0.25rem', fontSize: '1rem' }}>{item.title}</h4>
                                <p style={{ fontSize: '0.875rem', marginBottom: 0 }}>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits */}
            <section className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Benefits of iFrame Integration</h3>
                <div className="grid grid-2" style={{ gap: '1rem' }}>
                    {[
                        'No page redirect — seamless experience',
                        'User stays on your domain throughout',
                        'Fully PCI compliant — no card data on your server',
                        'Event-driven updates via window.postMessage',
                    ].map((benefit, index) => (
                        <div key={index} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.9375rem',
                        }}>
                            <span style={{ color: 'var(--success)' }}>✓</span>
                            <span>{benefit}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Test Cards */}
            <TestCardPanel compact />

            {/* Checkout Modal */}
            {showCheckout && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && !iframeUrl && handleCloseModal()}>
                    <div className="modal-content" style={{ maxWidth: iframeUrl ? '560px' : '460px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
                                {iframeUrl ? 'Complete Payment' : 'Complete Your Purchase'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    color: 'var(--text-secondary)', 
                                    fontSize: '1.25rem', 
                                    cursor: 'pointer',
                                    padding: '0.25rem',
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {!iframeUrl ? (
                            <>
                                {/* Order Summary */}
                                <div style={{ 
                                    background: 'var(--bg-card)', 
                                    padding: '1rem', 
                                    borderRadius: 'var(--radius-md)', 
                                    marginBottom: '1.5rem' 
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 500 }}>Generative AI Course</span>
                                        <span className="mono" style={{ fontWeight: 600 }}>₹99.99</span>
                                    </div>
                                </div>

                                {error && (
                                    <div className="alert alert-error">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-input"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-input"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-input"
                                            placeholder="9876543210"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            pattern="[0-9]{10}"
                                            title="Please enter a valid 10-digit phone number"
                                            disabled={loading}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-full"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner"></span>
                                                <span>Loading Payment Form...</span>
                                            </>
                                        ) : (
                                            'Load Payment Form →'
                                        )}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                {/* iFrame Container */}
                                <div style={{ 
                                    background: 'var(--bg-card)', 
                                    borderRadius: 'var(--radius-md)',
                                    overflow: 'hidden',
                                    border: '1px solid var(--border-color)',
                                }}>
                                    <iframe
                                        ref={iframeRef}
                                        src={iframeUrl}
                                        style={{
                                            width: '100%',
                                            height: '500px',
                                            border: 'none',
                                        }}
                                        allow="payment"
                                        title="Pine Labs Payment"
                                    />
                                </div>

                                <p style={{ 
                                    fontSize: '0.75rem', 
                                    color: 'var(--text-muted)', 
                                    textAlign: 'center', 
                                    marginTop: '1rem',
                                    marginBottom: 0,
                                }}>
                                    Complete payment in the form above. Use test card: 4012 0010 3714 1112
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}

