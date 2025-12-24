'use client';

import { useState } from 'react';
import Link from 'next/link';
import TestCardPanel from '@/components/TestCardPanel';
import { CustomerDetails, ApiResponse } from '@/types/order';

export default function HostedCheckout() {
    const [showCheckout, setShowCheckout] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<CustomerDetails>({
        name: '',
        email: '',
        phone: '',
    });

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
                }),
            });

            const result: ApiResponse<any> = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.error || 'Failed to create order');
            }

            if (result.data.redirect_url) {
                window.location.href = result.data.redirect_url;
            } else {
                throw new Error('No redirect URL received');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
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
                        <span className="badge">Hosted Checkout</span>
                        <span className="badge badge-success">Easy Integration</span>
                    </div>

                    {/* Title & Description */}
                    <div>
                        <h1 style={{ marginBottom: '0.75rem' }}>Generative AI Course</h1>
                        <p style={{ fontSize: '1.0625rem', maxWidth: '600px', marginBottom: 0 }}>
                            Experience the simplest integration — customers are redirected to Pine Labs' 
                            secure payment page and returned after completion.
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
                <h3 style={{ marginBottom: '1.5rem' }}>How Hosted Checkout Works</h3>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { step: '01', title: 'Create Order', desc: 'Backend creates order via Pine Labs API' },
                        { step: '02', title: 'Redirect', desc: 'User redirects to Pine Labs payment page' },
                        { step: '03', title: 'Payment', desc: 'User completes payment on Pine Labs' },
                        { step: '04', title: 'Callback', desc: 'Pine Labs redirects back with status' },
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

            {/* Test Cards */}
            <TestCardPanel compact />

            {/* Checkout Modal */}
            {showCheckout && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCloseModal()}>
                    <div className="modal-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Complete Your Purchase</h2>
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
                                        <span>Redirecting to Pine Labs...</span>
                                    </>
                                ) : (
                                    'Proceed to Payment →'
                                )}
                            </button>
                        </form>

                        <p style={{ 
                            fontSize: '0.75rem', 
                            color: 'var(--text-muted)', 
                            textAlign: 'center', 
                            marginTop: '1rem',
                            marginBottom: 0,
                        }}>
                            You will be redirected to Pine Labs secure payment page
                        </p>
                    </div>
                </div>
            )}
        </main>
    );
}
