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

            {/* Footer */}
            <footer style={{
                marginTop: '4rem',
                paddingTop: '2rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        Built by
                    </span>
                    <a
                        href="https://www.linkedin.com/in/sugammalviya/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#0A66C2' }}>
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        Sugam Malviya
                    </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <a
                        href="https://github.com/Sugamm/pinelabs-payment-gateway-integration"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: 'var(--text-primary)',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        View on GitHub
                    </a>

                    <a
                        href="https://developer.pinelabsonline.com/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            fontSize: '0.875rem',
                            color: 'var(--text-muted)',
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                        }}
                    >
                        Pine Labs Docs →
                    </a>
                </div>
            </footer>
        </div>
    );
}
