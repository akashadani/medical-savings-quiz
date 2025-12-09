'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="page-wrapper">
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
        }}
      >
        <div style={{ maxWidth: '540px', width: '100%', textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '2.5rem',
              marginBottom: '20px',
              lineHeight: '1.15',
            }}
          >
            Your Child's Medical Bills Have Hidden Overcharges
          </h1>

          <p
            style={{
              color: '#475569',
              fontSize: '1.15rem',
              marginBottom: '36px',
              lineHeight: '1.6',
            }}
          >
            Parents are being overcharged{' '}
            <span style={{ color: '#0891b2', fontWeight: '600' }}>
              $2,000-$15,000
            </span>{' '}
            and don't even know it. Discover where you're being overcharged and
            recover what's rightfully yours.
          </p>

          <button
            onClick={() => router.push('/quiz')}
            className="button"
            style={{
              fontSize: '1.15rem',
              padding: '20px 32px',
            }}
          >
            Discover My Savings →
          </button>
        </div>
      </div>
    </div>
  );
}
