'use client';

import { useState } from 'react';

interface TestCard {
    type: string;
    number: string;
    expiry: string;
    cvv: string;
    name: string;
    result: 'Success' | 'Failure';
}

const testCards: TestCard[] = [
    {
        type: 'Visa',
        number: '4012 0010 3714 1112',
        expiry: '12/25',
        cvv: '123',
        name: 'Test User',
        result: 'Success',
    },
    {
        type: 'Mastercard',
        number: '5123 4500 0000 0008',
        expiry: '12/25',
        cvv: '100',
        name: 'Test User',
        result: 'Success',
    },
    {
        type: 'Visa (Decline)',
        number: '4012 0010 3714 1120',
        expiry: '12/25',
        cvv: '123',
        name: 'Test User',
        result: 'Failure',
    },
];

interface TestCardPanelProps {
    compact?: boolean;
}

export default function TestCardPanel({ compact = false }: TestCardPanelProps) {
    const [copied, setCopied] = useState<string | null>(null);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text.replace(/\s/g, ''));
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
    };

    if (compact) {
        return (
            <div className="test-card-panel">
                <h4>Test Card for UAT</h4>
                <div className="test-card-item">
                    <span className="test-card-label">Card Number</span>
                    <button
                        onClick={() => copyToClipboard(testCards[0].number, 'number')}
                        className="test-card-value"
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Click to copy"
                    >
                        {copied === 'number' ? 'Copied!' : testCards[0].number}
                    </button>
                </div>
                <div className="test-card-item">
                    <span className="test-card-label">Expiry</span>
                    <span className="test-card-value">{testCards[0].expiry}</span>
                </div>
                <div className="test-card-item">
                    <span className="test-card-label">CVV</span>
                    <span className="test-card-value">{testCards[0].cvv}</span>
                </div>
                <div className="test-card-item">
                    <span className="test-card-label">OTP</span>
                    <span className="test-card-value">123456</span>
                </div>
            </div>
        );
    }

    return (
        <div className="card" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Test Card Details</h3>
                <span className="badge">UAT Environment</span>
            </div>
            
            <p style={{ fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
                Use these test cards for payment testing. For OTP verification, use <code style={{ background: 'var(--bg-elevated)', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>123456</code>
            </p>

            <div className="grid grid-2" style={{ gap: '1rem' }}>
                {testCards.map((card, index) => (
                    <div
                        key={index}
                        style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1.25rem',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ fontWeight: 600 }}>{card.type}</span>
                            <span className={`badge ${card.result === 'Success' ? 'badge-success' : 'badge-error'}`}>
                                {card.result}
                            </span>
                        </div>
                        
                        <div className="data-grid">
                            <div className="data-row" style={{ padding: '0.375rem 0' }}>
                                <span className="data-label">Number</span>
                                <button
                                    onClick={() => copyToClipboard(card.number, `card-${index}`)}
                                    className="data-value"
                                    style={{ 
                                        cursor: 'pointer', 
                                        background: 'var(--bg-card)', 
                                        border: 'none',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                    }}
                                    title="Click to copy"
                                >
                                    {copied === `card-${index}` ? 'Copied!' : card.number}
                                </button>
                            </div>
                            <div className="data-row" style={{ padding: '0.375rem 0' }}>
                                <span className="data-label">Expiry / CVV</span>
                                <span className="data-value">{card.expiry} / {card.cvv}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ 
                marginTop: '1.5rem', 
                padding: '1rem', 
                background: 'var(--bg-elevated)', 
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)'
            }}>
                <strong style={{ color: 'var(--text-primary)' }}>Note:</strong> For UPI testing, use any VPA like <code style={{ background: 'var(--bg-card)', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>success@upi</code>
            </div>
        </div>
    );
}

