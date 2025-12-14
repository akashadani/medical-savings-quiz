'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { trackPageView } from '@/lib/mixpanel';

export default function Home() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredFaq, setHoveredFaq] = useState<number | null>(null);

  useEffect(() => {
    trackPageView('Home');
  }, []);

  const testimonials = [
    { name: 'Sarah M.', saved: '$8,240', quote: 'Our NICU stay left us with overwhelming bills. Baby Bill Relief found billing errors we never would have caught and negotiated our balance down significantly. Such a relief!' },
    { name: 'James T.', saved: '$12,500', quote: 'After our twins were born prematurely, the hospital bills were devastating. This service was a lifesaver - they handled everything while we focused on our babies.' },
    { name: 'Maria G.', saved: '$5,780', quote: "I was shocked at how many overcharges were on our bill. Even with insurance, we were being charged incorrectly. They saved us thousands and I didn't have to do anything." },
  ];

  const steps = [
    { step: '1', title: 'Share your bill', description: 'Upload or forward your hospital bill. We retrieve all the itemized details and start our review immediately.' },
    { step: '2', title: 'We find savings', description: 'Our medical billing experts identify overcharges, coding errors, and negotiable charges. Most bills have $2,000-$15,000 in potential savings.' },
    { step: '3', title: 'We negotiate, you save', description: 'We handle all negotiations with the hospital. Once we secure your savings, you only pay 20% of what we saved you. Zero risk.' },
  ];

  const trustPoints = [
    { title: 'Nearly every baby\'s hospital bill has errors', description: 'Studies show 80% of medical bills contain billing errors or overcharges. From duplicate charges to incorrect coding, these mistakes add up quickly - especially for NICU stays and birth complications.' },
    { title: 'You only pay if we save you money', description: 'Zero upfront cost, zero risk. We only get paid when you save money - 20% of your savings. If we don\'t find savings, you pay nothing.' },
    { title: 'We do all the work', description: 'Being a new parent is exhausting enough. We handle all communication with the hospital, insurance companies, and billing departments so you can focus on your baby.' },
    { title: 'Your information is secure', description: 'We use bank-level encryption and are fully HIPAA compliant. Your medical and financial information is protected with the highest security standards.' },
  ];

  const faqs = [
    { q: 'What if my bill is already being sent to collections?', a: 'No problem! We can still help negotiate your bill even if it\'s in collections. In many cases, collection agencies are more willing to negotiate than hospitals.' },
    { q: 'How long does the process take?', a: 'Most negotiations are completed within 30-60 days. We\'ll keep you updated throughout the entire process.' },
    { q: 'Do you work with all hospitals?', a: 'Yes! We work with hospitals nationwide, including major hospital systems and independent facilities.' },
    { q: 'What if I already paid some of my bill?', a: 'We can still help! We negotiate the remaining balance and in some cases can even help you get refunds for overpayments.' },
    { q: 'Will this affect my credit score?', a: 'No. Our negotiation process does not impact your credit score in any way.' },
  ];

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <div style={{ padding: 'clamp(20px, 5vw, 40px) 20px clamp(30px, 6vw, 50px)', background: 'linear-gradient(to bottom, #f0f9ff, #ffffff)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ color: '#0891b2', fontSize: 'clamp(0.85rem, 2vw, 1rem)', fontWeight: '700', marginBottom: 'clamp(16px, 4vw, 24px)', textAlign: 'center', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Baby Bill Relief
          </div>

          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center', padding: '0 8px' }}>
            <h1 style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)', marginBottom: 'clamp(20px, 4vw, 28px)', lineHeight: '1.15', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.02em' }}>
              Lower your baby's hospital bill by <span style={{ color: '#0891b2', background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>up to 90%</span>
            </h1>

            <p style={{ color: '#475569', fontSize: 'clamp(1.05rem, 3vw, 1.35rem)', marginBottom: 'clamp(16px, 3vw, 20px)', lineHeight: '1.6', fontWeight: '400' }}>
              Expert medical bill negotiation for parents. We handle everything while you focus on your little one.
            </p>

            <div style={{ background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)', border: '2px solid #06b6d4', borderRadius: '12px', padding: 'clamp(18px, 4vw, 24px) clamp(20px, 5vw, 32px)', margin: 'clamp(16px, 3vw, 24px) auto', display: 'inline-block', boxShadow: '0 10px 40px rgba(6, 182, 212, 0.15)', maxWidth: '100%' }}>
              <p style={{ color: '#0e7490', fontSize: 'clamp(1.05rem, 3vw, 1.25rem)', fontWeight: '800', margin: 0, letterSpacing: '-0.01em' }}>
                100% free unless we save you money
              </p>
              <p style={{ color: '#0891b2', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', margin: '8px 0 0 0', fontWeight: '500' }}>
                You only pay 20% of what we save you
              </p>
            </div>

            <button
              onClick={() => router.push('/quiz')}
              className="button"
              style={{
                fontSize: 'clamp(1.05rem, 3vw, 1.25rem)',
                padding: 'clamp(18px, 4vw, 24px) clamp(32px, 8vw, 52px)',
                marginBottom: '16px',
                width: '100%',
                maxWidth: '420px',
                background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(8, 145, 178, 0.3)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(8, 145, 178, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(8, 145, 178, 0.3)';
              }}
            >
              Get Started For Free →
            </button>

            <p style={{ color: '#94a3b8', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', fontWeight: '500' }}>
              Takes 2 minutes • No credit card required
            </p>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div style={{ padding: 'clamp(60px, 12vw, 100px) 20px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: '800', textAlign: 'center', marginBottom: 'clamp(16px, 3vw, 20px)', color: '#0f172a', letterSpacing: '-0.02em', padding: '0 12px' }}>
            Parents are saving thousands on their baby's medical bills
          </h2>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', marginBottom: 'clamp(40px, 8vw, 64px)', maxWidth: '600px', margin: '0 auto clamp(40px, 8vw, 64px)', padding: '0 12px' }}>
            Real families, real savings. Here's what parents are saying.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(20px, 4vw, 28px)', marginBottom: 'clamp(40px, 8vw, 64px)' }}>
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderLeft: '4px solid #0891b2',
                  borderRadius: '12px',
                  padding: 'clamp(20px, 4vw, 32px)',
                  boxShadow: hoveredCard === idx ? '0 20px 50px rgba(0, 0, 0, 0.12)' : '0 4px 20px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === idx ? 'translateY(-4px)' : 'translateY(0)'
                }}
              >
                <div style={{ color: '#0891b2', fontSize: 'clamp(1.35rem, 4vw, 1.75rem)', fontWeight: '800', marginBottom: 'clamp(12px, 2vw, 16px)', letterSpacing: '-0.01em' }}>
                  Saved {testimonial.saved}
                </div>
                <p style={{ color: '#475569', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', lineHeight: '1.7', marginBottom: 'clamp(16px, 3vw, 20px)', fontStyle: 'italic' }}>
                  "{testimonial.quote}"
                </p>
                <p style={{ color: '#94a3b8', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', fontWeight: '600', margin: 0 }}>
                  — {testimonial.name}
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 'clamp(28px, 6vw, 40px)', padding: 'clamp(40px, 8vw, 56px) 12px', borderTop: '2px solid #e2e8f0', borderBottom: '2px solid #e2e8f0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: '900', color: '#0891b2', marginBottom: 'clamp(8px, 2vw, 12px)', letterSpacing: '-0.02em' }}>2,847</div>
              <div style={{ color: '#64748b', fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)', fontWeight: '600' }}>Families helped</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: '900', color: '#0891b2', marginBottom: 'clamp(8px, 2vw, 12px)', letterSpacing: '-0.02em' }}>$6,800</div>
              <div style={{ color: '#64748b', fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)', fontWeight: '600' }}>Average savings</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: '900', color: '#0891b2', marginBottom: 'clamp(8px, 2vw, 12px)', letterSpacing: '-0.02em' }}>67%</div>
              <div style={{ color: '#64748b', fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)', fontWeight: '600' }}>Average bill reduction</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div style={{ padding: 'clamp(60px, 12vw, 100px) 20px', background: 'linear-gradient(to bottom, #f8fafc, #ffffff)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: '800', textAlign: 'center', marginBottom: 'clamp(16px, 3vw, 20px)', color: '#0f172a', letterSpacing: '-0.02em', padding: '0 12px' }}>
            Here's how it works
          </h2>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: 'clamp(1.05rem, 3vw, 1.2rem)', marginBottom: 'clamp(48px, 10vw, 72px)', maxWidth: '640px', margin: '0 auto clamp(48px, 10vw, 72px)', padding: '0 12px' }}>
            We make it simple. You focus on your baby, we handle the bills.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 'clamp(32px, 6vw, 48px)' }}>
            {steps.map((item) => (
              <div key={item.step} style={{ textAlign: 'center', position: 'relative', padding: '0 12px' }}>
                <div style={{ width: 'clamp(64px, 12vw, 80px)', height: 'clamp(64px, 12vw, 80px)', borderRadius: '50%', background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: '900', margin: '0 auto clamp(16px, 3vw, 24px)', boxShadow: '0 8px 24px rgba(8, 145, 178, 0.3)' }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.5rem)', fontWeight: '700', marginBottom: 'clamp(12px, 2vw, 16px)', color: '#0f172a', letterSpacing: '-0.01em' }}>
                  {item.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', lineHeight: '1.7' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'clamp(48px, 10vw, 72px)', padding: '0 12px' }}>
            <button
              onClick={() => router.push('/quiz')}
              className="button"
              style={{
                fontSize: 'clamp(1.05rem, 3vw, 1.2rem)',
                padding: 'clamp(18px, 4vw, 22px) clamp(32px, 8vw, 48px)',
                maxWidth: '420px',
                width: '100%',
                background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(8, 145, 178, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(8, 145, 178, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(8, 145, 178, 0.3)';
              }}
            >
              Check My Eligibility →
            </button>
          </div>
        </div>
      </div>

      {/* Why Parents Trust Us */}
      <div style={{ padding: 'clamp(60px, 12vw, 100px) 20px', background: '#ffffff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: '800', textAlign: 'center', marginBottom: 'clamp(40px, 8vw, 64px)', color: '#0f172a', letterSpacing: '-0.02em', padding: '0 12px' }}>
            Why parents trust us with their medical bills
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(28px, 5vw, 40px)', padding: '0 12px' }}>
            {trustPoints.map((item, idx) => (
              <div key={idx}>
                <div>
                  <h3 style={{ fontSize: 'clamp(1.15rem, 3vw, 1.4rem)', fontWeight: '700', marginBottom: 'clamp(10px, 2vw, 12px)', color: '#0f172a', letterSpacing: '-0.01em' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: 'clamp(1rem, 2.5vw, 1.1rem)', lineHeight: '1.8' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: 'clamp(60px, 12vw, 100px) 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: '800', textAlign: 'center', marginBottom: 'clamp(40px, 8vw, 64px)', color: '#0f172a', letterSpacing: '-0.02em', padding: '0 12px' }}>
            Common questions from parents
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 3vw, 20px)', padding: '0 4px' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredFaq(idx)}
                onMouseLeave={() => setHoveredFaq(null)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: 'clamp(20px, 4vw, 28px) clamp(20px, 5vw, 32px)',
                  boxShadow: hoveredFaq === idx ? '0 8px 24px rgba(0, 0, 0, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.3s ease'
                }}
              >
                <h3 style={{ fontSize: 'clamp(1.05rem, 2.8vw, 1.2rem)', fontWeight: '700', marginBottom: 'clamp(10px, 2vw, 12px)', color: '#0f172a' }}>
                  {faq.q}
                </h3>
                <p style={{ color: '#64748b', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', lineHeight: '1.7', margin: 0 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div style={{ padding: 'clamp(60px, 12vw, 100px) 20px', background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, padding: '0 12px' }}>
          <h2 style={{ fontSize: 'clamp(1.85rem, 5.5vw, 2.75rem)', fontWeight: '900', marginBottom: 'clamp(20px, 4vw, 24px)', color: 'white', letterSpacing: '-0.02em' }}>
            Ready to lower your baby's hospital bill?
          </h2>
          <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', marginBottom: 'clamp(32px, 6vw, 48px)', color: 'rgba(255, 255, 255, 0.95)', lineHeight: '1.7', fontWeight: '400' }}>
            Join thousands of parents who have saved an average of $6,800. No risk, no upfront cost.
          </p>
          <button
            onClick={() => router.push('/quiz')}
            style={{
              fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
              padding: 'clamp(18px, 4vw, 24px) clamp(36px, 8vw, 56px)',
              background: 'white',
              color: '#0891b2',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
              width: '100%',
              maxWidth: '440px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
            }}
          >
            Get Started For Free →
          </button>
          <p style={{ marginTop: 'clamp(16px, 3vw, 20px)', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>
            Takes just 2 minutes to see your potential savings
          </p>
        </div>
      </div>
    </div>
  );
}
