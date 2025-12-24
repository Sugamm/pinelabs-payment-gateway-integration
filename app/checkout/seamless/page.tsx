'use client';

import { useState } from 'react';
import Link from 'next/link';
import TestCardPanel from '@/components/TestCardPanel';
import { CustomerDetails, ApiResponse } from '@/types/order';

type PaymentMethod = 'card' | 'upi' | 'netbanking';
type CheckoutStep = 'details' | 'otp' | 'processing' | 'result';

interface PaymentResult {
    success: boolean;
    orderId?: string;
    transactionId?: string;
    message?: string;
    errorCode?: string;
}

export default function SeamlessCheckout() {
    const [showCheckout, setShowCheckout] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
    const [step, setStep] = useState<CheckoutStep>('details');
    const [otp, setOtp] = useState('');
    const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

    const [formData, setFormData] = useState<CustomerDetails>({
        name: '',
        email: '',
        phone: '',
    });

    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: '',
    });

    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        if (name === 'number') {
            const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            setCardData((prev) => ({ ...prev, [name]: formatted.slice(0, 19) }));
            return;
        }
        
        if (name === 'expiry') {
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length >= 2) {
                const formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
                setCardData((prev) => ({ ...prev, [name]: formatted }));
            } else {
                setCardData((prev) => ({ ...prev, [name]: cleaned }));
            }
            return;
        }

        setCardData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBuyNow = () => {
        setShowCheckout(true);
        setError(null);
        setStep('details');
        setPaymentResult(null);
    };

    const handleCloseModal = () => {
        setShowCheckout(false);
        setError(null);
        setStep('details');
        setFormData({ name: '', email: '', phone: '' });
        setCardData({ number: '', expiry: '', cvv: '', name: '' });
        setUpiId('');
        setSelectedBank('');
        setOtp('');
        setPaymentResult(null);
    };

    // Step 1: Submit payment details
    const handleSubmitDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Simulate API call to create order with Pine Labs
            // In real implementation, this would call the Pine Labs Seamless API
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Check if using test decline card
            const cardNum = cardData.number.replace(/\s/g, '');
            if (cardNum === '4012001037141120') {
                throw new Error('Card declined by issuer');
            }

            // Move to OTP verification step (simulating 3DS)
            setStep('otp');
        } catch (err: any) {
            setError(err.message || 'Payment initiation failed');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP (3DS Authentication)
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Simulate OTP verification
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (otp !== '123456') {
                throw new Error('Invalid OTP. Please try again.');
            }

            // Processing payment
            setStep('processing');
            
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Generate mock transaction details
            const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            const transactionId = `TXN${Date.now()}`;

            setPaymentResult({
                success: true,
                orderId,
                transactionId,
                message: 'Payment successful',
            });
            setStep('result');

        } catch (err: any) {
            setError(err.message || 'OTP verification failed');
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'details':
                return (
                    <form onSubmit={handleSubmitDetails}>
                        {/* Customer Details */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Contact Details
                            </h4>
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

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
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
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-input"
                                        placeholder="9876543210"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        pattern="[0-9]{10}"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="divider" />

                        {/* Payment Method Selector */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Payment Method
                            </h4>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {[
                                    { id: 'card', label: 'Card' },
                                    { id: 'upi', label: 'UPI' },
                                    { id: 'netbanking', label: 'NetBanking' },
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            background: paymentMethod === method.id ? 'var(--mono-700)' : 'var(--bg-card)',
                                            border: `1px solid ${paymentMethod === method.id ? 'var(--mono-500)' : 'var(--border-color)'}`,
                                            borderRadius: 'var(--radius-md)',
                                            color: paymentMethod === method.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                                            cursor: 'pointer',
                                            fontWeight: 500,
                                            fontSize: '0.875rem',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {method.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Card Payment Form */}
                        {paymentMethod === 'card' && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Card Number</label>
                                    <input
                                        type="text"
                                        name="number"
                                        className="form-input mono"
                                        placeholder="4012 0010 3714 1112"
                                        value={cardData.number}
                                        onChange={handleCardInputChange}
                                        required
                                        disabled={loading}
                                        maxLength={19}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Name on Card</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-input"
                                        placeholder="JOHN DOE"
                                        value={cardData.name}
                                        onChange={handleCardInputChange}
                                        required
                                        disabled={loading}
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Expiry</label>
                                        <input
                                            type="text"
                                            name="expiry"
                                            className="form-input mono"
                                            placeholder="12/25"
                                            value={cardData.expiry}
                                            onChange={handleCardInputChange}
                                            required
                                            disabled={loading}
                                            maxLength={5}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">CVV</label>
                                        <input
                                            type="password"
                                            name="cvv"
                                            className="form-input mono"
                                            placeholder="•••"
                                            value={cardData.cvv}
                                            onChange={handleCardInputChange}
                                            required
                                            disabled={loading}
                                            maxLength={4}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* UPI Payment Form */}
                        {paymentMethod === 'upi' && (
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label">UPI ID</label>
                                <input
                                    type="text"
                                    className="form-input mono"
                                    placeholder="yourname@upi"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: 0 }}>
                                    For testing, use: success@upi
                                </p>
                            </div>
                        )}

                        {/* NetBanking */}
                        {paymentMethod === 'netbanking' && (
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label">Select Bank</label>
                                <select
                                    className="form-input"
                                    value={selectedBank}
                                    onChange={(e) => setSelectedBank(e.target.value)}
                                    required
                                    disabled={loading}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <option value="">Choose your bank...</option>
                                    <option value="sbi">State Bank of India</option>
                                    <option value="hdfc">HDFC Bank</option>
                                    <option value="icici">ICICI Bank</option>
                                    <option value="axis">Axis Bank</option>
                                    <option value="kotak">Kotak Mahindra Bank</option>
                                </select>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    <span>Initiating Payment...</span>
                                </>
                            ) : (
                                `Pay ₹99.99 →`
                            )}
                        </button>
                    </form>
                );

            case 'otp':
                return (
                    <form onSubmit={handleVerifyOtp}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                background: 'var(--bg-card)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                                border: '1px solid var(--border-color)',
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                            </div>
                            <h3 style={{ marginBottom: '0.5rem' }}>3D Secure Verification</h3>
                            <p style={{ fontSize: '0.9375rem', marginBottom: 0 }}>
                                Enter the OTP sent to your registered mobile number
                            </p>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">One-Time Password</label>
                            <input
                                type="text"
                                className="form-input mono"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                required
                                disabled={loading}
                                maxLength={6}
                                style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.5em' }}
                                autoFocus
                            />
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: 0, textAlign: 'center' }}>
                                For testing, use: <code style={{ background: 'var(--bg-card)', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>123456</code>
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={loading || otp.length !== 6}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                'Verify & Pay →'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => { setStep('details'); setOtp(''); }}
                            className="btn btn-secondary w-full"
                            style={{ marginTop: '0.75rem' }}
                            disabled={loading}
                        >
                            ← Back
                        </button>
                    </form>
                );

            case 'processing':
                return (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 1.5rem', borderWidth: '3px' }}></div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Processing Payment</h3>
                        <p style={{ marginBottom: 0 }}>Please wait while we process your payment...</p>
                    </div>
                );

            case 'result':
                return (
                    <div style={{ textAlign: 'center' }}>
                        {paymentResult?.success ? (
                            <>
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

                                <h2 style={{ marginBottom: '0.5rem', color: 'var(--success)' }}>Payment Successful!</h2>
                                <p style={{ marginBottom: '1.5rem' }}>Your enrollment is confirmed.</p>

                                {/* Transaction Details */}
                                <div style={{
                                    background: 'var(--bg-card)',
                                    padding: '1.25rem',
                                    borderRadius: 'var(--radius-md)',
                                    textAlign: 'left',
                                    marginBottom: '1.5rem',
                                }}>
                                    <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Transaction Details
                                    </h4>
                                    <div className="data-grid">
                                        <div className="data-row">
                                            <span className="data-label">Order ID</span>
                                            <span className="data-value">{paymentResult.orderId}</span>
                                        </div>
                                        <div className="data-row">
                                            <span className="data-label">Transaction ID</span>
                                            <span className="data-value">{paymentResult.transactionId}</span>
                                        </div>
                                        <div className="data-row">
                                            <span className="data-label">Amount</span>
                                            <span className="data-value">₹99.99</span>
                                        </div>
                                        <div className="data-row">
                                            <span className="data-label">Status</span>
                                            <span className="data-value" style={{ color: 'var(--success)' }}>SUCCESS</span>
                                        </div>
                                        <div className="data-row">
                                            <span className="data-label">Payment Method</span>
                                            <span className="data-value">{paymentMethod.toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ 
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '1.5rem',
                                    fontSize: '0.875rem',
                                    color: 'var(--info)',
                                }}>
                                    <strong>Note:</strong> This is a simulated seamless checkout flow. 
                                    No actual payment was processed.
                                </div>
                            </>
                        ) : (
                            <>
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

                                <h2 style={{ marginBottom: '0.5rem', color: 'var(--error)' }}>Payment Failed</h2>
                                <p style={{ marginBottom: '1.5rem' }}>{paymentResult?.message || 'Transaction could not be completed.'}</p>
                            </>
                        )}

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={handleCloseModal} className="btn btn-primary" style={{ flex: 1 }}>
                                Close
                            </button>
                            {!paymentResult?.success && (
                                <button 
                                    onClick={() => { setStep('details'); setError(null); }} 
                                    className="btn btn-secondary" 
                                    style={{ flex: 1 }}
                                >
                                    Try Again
                                </button>
                            )}
                        </div>
                    </div>
                );
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
                        <span className="badge">Seamless Checkout</span>
                        <span className="badge" style={{ 
                            background: 'rgba(239, 68, 68, 0.15)', 
                            borderColor: 'rgba(239, 68, 68, 0.3)', 
                            color: '#ef4444' 
                        }}>
                            Advanced
                        </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                        <h1 style={{ marginBottom: '0.75rem' }}>Generative AI Course</h1>
                        <p style={{ fontSize: '1.0625rem', maxWidth: '600px', marginBottom: 0 }}>
                            Build your own custom payment UI with full control. Payment is processed 
                            directly via API — <strong>no redirect to Pine Labs</strong>.
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
                <h3 style={{ marginBottom: '1.5rem' }}>How Seamless Checkout Works (No Redirect)</h3>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { step: '01', title: 'Custom UI', desc: 'Your own payment form collects card details' },
                        { step: '02', title: 'API Call', desc: 'Submit payment directly to Pine Labs API' },
                        { step: '03', title: '3DS Auth', desc: 'Handle OTP/authentication inline or in popup' },
                        { step: '04', title: 'Response', desc: 'Receive result directly — no redirects' },
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

            {/* Key Difference */}
            <div className="alert alert-info" style={{ marginBottom: '2rem' }}>
                <strong>Key Difference:</strong> Unlike Hosted/Infinity checkout, Seamless checkout keeps 
                the user on your page throughout the entire payment flow. The 3DS OTP verification happens 
                inline or in a controlled popup — never a full page redirect.
            </div>

            {/* Important Notice */}
            <div className="alert alert-warning" style={{ marginBottom: '2rem' }}>
                <strong>PCI Compliance Note:</strong> Handling card data directly requires PCI DSS compliance. 
                This demo simulates the flow — production uses Pine Labs SDK for secure tokenization.
            </div>

            {/* Test Cards */}
            <TestCardPanel compact />

            {/* Checkout Modal */}
            {showCheckout && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && step === 'details' && handleCloseModal()}>
                    <div className="modal-content" style={{ maxWidth: '480px' }}>
                        {step !== 'result' && step !== 'processing' && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
                                    {step === 'otp' ? '3DS Verification' : 'Complete Your Purchase'}
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
                        )}

                        {step === 'details' && (
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
                        )}

                        {error && (
                            <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                                {error}
                            </div>
                        )}

                        {renderStep()}

                        {step === 'details' && (
                            <p style={{ 
                                fontSize: '0.75rem', 
                                color: 'var(--text-muted)', 
                                textAlign: 'center', 
                                marginTop: '1rem',
                                marginBottom: 0,
                            }}>
                                Payment processed inline — no page redirect
                            </p>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
