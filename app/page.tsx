'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { trackPageView } from '@/lib/mixpanel';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    trackPageView('Home');
  }, []);

  return (
    <div className="page-wrapper">
      <div
        style={{
          minHeight: '100vh',
          padding: '40px 24px 60px',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/* Main Headline */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '2.5rem',
              marginBottom: '20px',
              lineHeight: '1.15',
            }}
          >
            Facing High Hospital Bills for Your Baby?
          </h1>

          <p
            style={{
              color: '#475569',
              fontSize: '1.2rem',
              marginBottom: '12px',
              lineHeight: '1.6',
              fontWeight: '500',
            }}
          >
            We negotiate with hospitals and insurance companies on your behalf to lower your bills by 40-80%.
          </p>

          <p
            style={{
              color: '#0891b2',
              fontSize: '1.15rem',
              fontWeight: '600',
            }}
          >
            Most parents save $2,000-$15,000.
          </p>
        </div>

        {/* Quick Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '48px',
          }}
        >
          <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📉</div>
            <div style={{ fontWeight: '600', color: '#0891b2', marginBottom: '4px' }}>
              Average Savings
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>$5,200</div>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💰</div>
            <div style={{ fontWeight: '600', color: '#0891b2', marginBottom: '4px' }}>
              100% Risk-Free
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>You only pay 20%</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>of what we save</div>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚡</div>
            <div style={{ fontWeight: '600', color: '#0891b2', marginBottom: '4px' }}>
              Fast Results
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>2-4 weeks</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>typical</div>
          </div>
        </div>

        {/* Social Proof */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '1.5rem' }}>
            Real Results from Real Parents
          </h2>

          <div className="card" style={{ marginBottom: '16px', padding: '20px' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#0f172a' }}>Sarah M., Boston</strong>
            </div>
            <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '8px', lineHeight: '1.5' }}>
              "They found $14,000 in errors on my NICU bill. I only paid them $2,800 - saved over $11,000!"
            </p>
            <p style={{ color: '#0891b2', fontWeight: '600', fontSize: '0.9rem' }}>
              ✅ NICU bill reduced from $47,000 to $8,000
            </p>
          </div>

          <div className="card" style={{ marginBottom: '16px', padding: '20px' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#0f172a' }}>Jennifer L., Austin</strong>
            </div>
            <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '8px', lineHeight: '1.5' }}>
              "Got hit with surprise out-of-network bills. Baby Bill Relief got it down to what I should have paid in-network."
            </p>
            <p style={{ color: '#0891b2', fontWeight: '600', fontSize: '0.9rem' }}>
              ✅ C-Section bill reduced from $23,000 to $6,000
            </p>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#0f172a' }}>David R., Seattle</strong>
            </div>
            <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '8px', lineHeight: '1.5' }}>
              "Found over $5,000 in billing errors and duplicate charges I never would have caught on my own."
            </p>
            <p style={{ color: '#0891b2', fontWeight: '600', fontSize: '0.9rem' }}>
              ✅ Total savings: $5,200
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '1.5rem' }}>
            How It Works
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  margin: '0 auto 16px',
                }}
              >
                1
              </div>
              <h3 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>Tell Us About Your Bills</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Take our 2-minute quiz so we understand your situation
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  margin: '0 auto 16px',
                }}
              >
                2
              </div>
              <h3 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>We Review & Find Errors</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Our experts identify overcharges, errors, and negotiation opportunities
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  margin: '0 auto 16px',
                }}
              >
                3
              </div>
              <h3 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>We Negotiate, You Save</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                We handle everything - you keep 80% of all savings
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '40px',
          }}
        >
          <div className="trust-badge-top">✓ No upfront fees</div>
          <div className="trust-badge-top">✓ 100% risk-free</div>
          <div className="trust-badge-top">✓ We handle everything</div>
          <div className="trust-badge-top">✓ No savings = $0 cost</div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button
            onClick={() => router.push('/quiz')}
            className="button"
            style={{
              fontSize: '1.2rem',
              padding: '20px 40px',
              maxWidth: '400px',
              width: '100%',
            }}
          >
            Get My Free Bill Review →
          </button>

          <p
            style={{
              color: '#94a3b8',
              fontSize: '0.85rem',
              marginTop: '12px',
            }}
          >
            No commitment required. See your potential savings in 2 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
