'use client';

import Link from 'next/link';
import TestCardPanel from './TestCardPanel';

interface CheckoutType {
    id: string;
    name: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Advanced';
    features: string[];
    route: string;
}

const checkoutTypes: CheckoutType[] = [
    {
        id: 'hosted',
        name: 'Hosted Checkout',
        description: 'Full-page redirect to Pine Labs secure payment page',
        difficulty: 'Easy',
        features: [
            'Fastest implementation',
            'Fully PCI compliant',
            'All payment methods',
        ],
        route: '/checkout/hosted',
    },
    {
        id: 'infinity',
        name: 'Infinity Checkout',
        description: 'Premium checkout with smart payment routing',
        difficulty: 'Easy',
        features: [
            'Enhanced conversion',
            'Brand customization',
            'Intelligent routing',
        ],
        route: '/checkout/infinity',
    },
    {
        id: 'iframe',
        name: 'iFrame Checkout',
        description: 'Embedded payment form within your page',
        difficulty: 'Medium',
        features: [
            'No page redirect',
            'Seamless experience',
            'Event-driven updates',
        ],
        route: '/checkout/iframe',
    },
    {
        id: 'seamless',
        name: 'Seamless Checkout',
        description: 'Full control with your own payment UI',
        difficulty: 'Advanced',
        features: [
            'Complete customization',
            'Native experience',
            'Direct API integration',
        ],
        route: '/checkout/seamless',
    },
];

const difficultyStyles = {
    Easy: { bg: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' },
    Medium: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
    Advanced: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
};

export default function CheckoutTypeSelector() {
    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            {/* Header */}
            <header style={{ marginBottom: '3rem' }}>
                <div className="badge" style={{ marginBottom: '1rem' }}>Pine Labs Integration Demo</div>
                <h1 style={{ marginBottom: '0.75rem' }}>Generative AI Course</h1>
                <p style={{ fontSize: '1.125rem', maxWidth: '600px', marginBottom: '1.5rem' }}>
                    Explore 4 different checkout integration methods. Select one to see it in action.
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                    <span className="price">₹99.99</span>
                    <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹999</span>
                    <span className="badge badge-success">90% OFF</span>
                </div>
            </header>

            {/* Checkout Type Cards */}
            <section className="grid grid-4" style={{ marginBottom: '3rem' }}>
                {checkoutTypes.map((type) => (
                    <Link
                        key={type.id}
                        href={type.route}
                        className="card"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{type.name}</h3>
                            <span
                                style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.6875rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.03em',
                                    background: difficultyStyles[type.difficulty].bg,
                                    color: difficultyStyles[type.difficulty].color,
                                    border: `1px solid ${difficultyStyles[type.difficulty].border}`,
                                }}
                            >
                                {type.difficulty}
                            </span>
                        </div>

                        {/* Description */}
                        <p style={{ fontSize: '0.9375rem', marginBottom: '1.25rem', flexGrow: 1 }}>
                            {type.description}
                        </p>

                        {/* Features */}
                        <ul style={{ listStyle: 'none', marginBottom: '1.5rem', padding: 0 }}>
                            {type.features.map((feature, index) => (
                                <li
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '0.375rem',
                                        fontSize: '0.875rem',
                                        color: 'var(--text-secondary)',
                                    }}
                                >
                                    <span style={{ color: 'var(--mono-400)' }}>+</span>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {/* CTA */}
                        <div
                            style={{
                                padding: '0.75rem',
                                background: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                transition: 'background 0.2s ease',
                            }}
                        >
                            Try this method →
                        </div>
                    </Link>
                ))}
            </section>

            {/* Comparison Table */}
            <section className="card" style={{ marginBottom: '3rem', overflowX: 'auto' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Quick Comparison</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem' }}>Feature</th>
                            <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem' }}>Hosted</th>
                            <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem' }}>Infinity</th>
                            <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem' }}>iFrame</th>
                            <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem' }}>Seamless</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ['Implementation', '~1 hour', '~1 hour', '~4 hours', '~8+ hours'],
                            ['PCI Compliance', 'Automatic', 'Automatic', 'Automatic', 'Self-managed'],
                            ['UI Customization', 'Limited', 'Medium', 'Medium', 'Full control'],
                            ['User Experience', 'Redirect', 'Redirect', 'Embedded', 'Native'],
                        ].map((row, i) => (
                            <tr
                                key={i}
                                style={{ borderBottom: '1px solid var(--border-color)' }}
                            >
                                <td style={{ padding: '0.875rem 1rem', fontWeight: 500, fontSize: '0.875rem' }}>{row[0]}</td>
                                {row.slice(1).map((cell, j) => (
                                    <td
                                        key={j}
                                        style={{
                                            padding: '0.875rem 1rem',
                                            textAlign: 'center',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.875rem',
                                            fontFamily: j === 0 ? "'JetBrains Mono', monospace" : 'inherit',
                                        }}
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Test Card Panel */}
            <TestCardPanel />
        </div>
    );
}
