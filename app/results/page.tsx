'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QuizAnswers } from '@/lib/quizConfig';
import { calculateSavings, SavingsEstimate } from '@/lib/savingsCalculator';
import { getSessionId } from '@/lib/sessionManager';
import { trackPageView, trackEmailSubmission, identifyUser } from '@/lib/mixpanel';
import { trackFbCompleteRegistration } from '@/lib/fbPixel';

export default function ResultsPage() {
  const router = useRouter();
  const [estimate, setEstimate] = useState<SavingsEstimate | null>(null);
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    trackPageView('Results', {
      savings_min: estimate?.totalMin,
      savings_max: estimate?.totalMax,
      urgency_level: estimate?.urgencyLevel,
    });

    if (typeof window !== 'undefined') {
      const savedAnswers = localStorage.getItem('quizAnswers');
      if (savedAnswers) {
        const parsedAnswers: QuizAnswers = JSON.parse(savedAnswers);
        setAnswers(parsedAnswers);
        const savingsEstimate = calculateSavings(parsedAnswers);
        setEstimate(savingsEstimate);
      } else {
        // No answers found, redirect to start
        router.push('/');
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ||
      'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

    try {
      const sessionId = getSessionId();

      if (!sessionId) {
        console.error('No session ID found');
        setSubmitError('Session error. Please try completing the quiz again.');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          current_question: 'results_submitted',
          completed: true, // Mark as completed
          email: email,
          name: name,
          phone: phone,
          savings_min: estimate?.totalMin || 0,
          savings_max: estimate?.totalMax || 0,
          urgency_level: estimate?.urgencyLevel || 'normal',
          full_answers_json: JSON.stringify(answers),
          savings_breakdown_json: JSON.stringify(estimate?.breakdown || []),
          ...answers, // Include all quiz answers
        }),
        mode: 'no-cors', // Required for Google Apps Script
      });

      // Note: With no-cors mode, we can't read the response
      // We assume success if no error is thrown
      console.log('Form submitted successfully:', { email, name, phone, estimate });

      // Track email submission in Mixpanel
      identifyUser(email, {
        name: name,
        phone: phone,
        savings_min: estimate?.totalMin || 0,
        savings_max: estimate?.totalMax || 0,
        urgency_level: estimate?.urgencyLevel || 'normal',
      });

      trackEmailSubmission({
        email: email,
        name: name,
        phone: phone,
        savings_min: estimate?.totalMin || 0,
        savings_max: estimate?.totalMax || 0,
        urgency_level: estimate?.urgencyLevel || 'normal',
      });

      // Track Facebook Pixel CompleteRegistration event
      trackFbCompleteRegistration({
        content_name: 'Medical Savings Quiz',
        value: estimate?.totalMin || 0,
        currency: 'USD',
      });

      setSubmitted(true);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('There was an error submitting the form. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!estimate) {
    return (
      <div className="page-wrapper">
        <div className="loading">Calculating your savings...</div>
      </div>
    );
  }

  const formattedMin = estimate.totalMin.toLocaleString();
  const formattedMax = estimate.totalMax.toLocaleString();

  // Handle edge case: currently pregnant (no bills yet)
  const isPregnant = answers?.situation === 'pregnant';

  // Handle edge case: already done everything (minimal savings)
  const minimalSavings = estimate.totalMax < 1000;

  if (submitted) {
    return (
      <div className="page-wrapper">
        <div style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div className="brand">BillRelief</div>

          <div
            style={{
              fontSize: '4rem',
              marginBottom: '16px',
            }}
          >
            ✅
          </div>

          <h1 style={{ marginBottom: '16px' }}>Thank You!</h1>

          <p
            style={{
              color: '#475569',
              fontSize: '1.1rem',
              marginBottom: '28px',
              lineHeight: '1.6',
              maxWidth: '480px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            We've received your information and will be in touch shortly with
            your detailed savings analysis and next steps.
          </p>

          <div className="card gradient-card">
            <h3 style={{ marginBottom: '12px' }}>What Happens Next?</h3>

            <div style={{ textAlign: 'left', color: '#334155' }}>
              <p style={{ marginBottom: '12px' }}>
                1. <strong>Review:</strong> Our team will analyze your specific
                situation
              </p>
              <p style={{ marginBottom: '12px' }}>
                2. <strong>Consultation:</strong> We'll schedule a free call to
                discuss your options
              </p>
              <p style={{ marginBottom: '12px' }}>
                3. <strong>Action:</strong> If you choose to proceed, we'll
                start fighting for your savings immediately
              </p>
            </div>

            <div
              className="info-box"
              style={{
                marginTop: '24px',
                textAlign: 'center',
              }}
            >
              <strong style={{ color: '#0891b2', fontSize: '1.1rem' }}>
                Remember: No savings = $0 cost to you
              </strong>
            </div>
          </div>

          <button
            onClick={() => router.push('/')}
            className="button-secondary"
            style={{ marginTop: '24px', maxWidth: '300px' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div style={{ padding: '40px 24px' }}>
        <div className="brand">BillRelief</div>

        <h1
          style={{
            fontSize: '1.5rem',
            marginBottom: '8px',
            textAlign: 'center',
          }}
        >
          YOUR SAVINGS POTENTIAL
        </h1>

        {/* Main Estimate */}
        {isPregnant ? (
          <>
            <div className="stat-highlight" style={{ marginTop: '24px' }}>
              <p
                style={{
                  color: '#475569',
                  fontSize: '0.9rem',
                  marginBottom: '12px',
                }}
              >
                Estimated Potential Savings After Delivery
              </p>
              <div
                className="stat-highlight-value"
                style={{ fontSize: '3rem', marginBottom: '8px' }}
              >
                ${formattedMin} - ${formattedMax}
              </div>
              <div className="stat-highlight-label">
                Based on your expected delivery and circumstances
              </div>
            </div>
            <p
              style={{
                color: '#64748b',
                fontSize: '0.8rem',
                textAlign: 'center',
                marginTop: '16px',
                fontStyle: 'italic',
                lineHeight: '1.4',
              }}
            >
              *This is a preliminary estimate. Actual savings will depend on your delivery details and bills. We'll review everything after your baby arrives.
            </p>
          </>
        ) : minimalSavings ? (
          <div className="stat-highlight" style={{ marginTop: '24px' }}>
            <p
              style={{
                color: '#475569',
                fontSize: '0.9rem',
                marginBottom: '12px',
              }}
            >
              Potential Additional Savings
            </p>
            <div
              className="stat-highlight-value"
              style={{ fontSize: '3rem', marginBottom: '8px' }}
            >
              {formattedMin === formattedMax
                ? `Up to $${formattedMax}`
                : `$${formattedMin} - $${formattedMax}`}
            </div>
            <div className="stat-highlight-label">
              You've done great work already! We may still find a few opportunities.
            </div>
          </div>
        ) : (
          <div className="stat-highlight" style={{ marginTop: '24px' }}>
            <p
              style={{
                color: '#475569',
                fontSize: '0.9rem',
                marginBottom: '12px',
              }}
            >
              You Could Recover
            </p>
            <div
              className="stat-highlight-value"
              style={{ fontSize: '3rem', marginBottom: '8px' }}
            >
              ${formattedMin} - ${formattedMax}
            </div>
            <div className="stat-highlight-label">
              Based on your specific situation
            </div>
          </div>
        )}

        {/* Disclaimer - only show if not pregnant */}
        {!isPregnant && (
          <p
            style={{
              color: '#64748b',
              fontSize: '0.8rem',
              textAlign: 'center',
              marginTop: '16px',
              fontStyle: 'italic',
              lineHeight: '1.4',
            }}
          >
            *This is an estimate based on the information you provided. Actual savings may vary and are not guaranteed. Final results depend on a detailed review of your bills.
            {(answers?.your_responsibility === 'not_sure' || answers?.total_billed === 'not_sure') && (
              <span style={{ display: 'block', marginTop: '8px' }}>
                Since you're still receiving bills, your actual savings potential may be higher or lower than this estimate.
              </span>
            )}
          </p>
        )}

        {/* Urgency Message */}
        {estimate.urgencyMessage && (
          <div
            style={{
              background:
                estimate.urgencyLevel === 'critical'
                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))'
                  : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
              border: `2px solid ${
                estimate.urgencyLevel === 'critical' ? '#ef4444' : '#f59e0b'
              }`,
              borderRadius: '16px',
              padding: '16px 20px',
              marginTop: '24px',
              textAlign: 'center',
            }}
          >
            <strong
              style={{
                color:
                  estimate.urgencyLevel === 'critical' ? '#dc2626' : '#d97706',
                fontSize: '0.95rem',
              }}
            >
              ⚠️ {estimate.urgencyMessage}
            </strong>
          </div>
        )}

        {/* Breakdown */}
        <div className="card gradient-card" style={{ marginTop: '32px' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>
            HERE'S WHERE YOUR MONEY IS:
          </h2>

          {estimate.breakdown.map((item, index) => (
            <div
              key={index}
              style={{
                borderLeft: '3px solid #0891b2',
                background: 'rgba(8, 145, 178, 0.03)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '4px',
                }}
              >
                <strong style={{ color: '#0891b2', fontSize: '0.95rem' }}>
                  ✓ {item.category}
                </strong>
                <strong style={{ color: '#0891b2', fontSize: '0.95rem' }}>
                  ${item.min.toLocaleString()} - ${item.max.toLocaleString()}
                </strong>
              </div>
              <p
                style={{
                  color: '#64748b',
                  fontSize: '0.85rem',
                  lineHeight: '1.4',
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* What's Next */}
        <div className="card gradient-card" style={{ marginTop: '32px' }}>
          <h2 style={{ marginBottom: '16px', fontSize: '1.3rem', textAlign: 'center' }}>
            How Do You Get This Money Back?
          </h2>

          <p
            style={{
              color: '#475569',
              fontSize: '1rem',
              lineHeight: '1.6',
              textAlign: 'center',
              marginBottom: '24px',
            }}
          >
            Most people don't know where to start—and that's where{' '}
            <strong style={{ color: '#0891b2' }}>BillRelief</strong> comes in.
            We handle everything for you.
          </p>

          <div
            style={{
              background: 'rgba(8, 145, 178, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
            }}
          >
            <p
              style={{
                color: '#334155',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                marginBottom: '12px',
              }}
            >
              ✓ We review every line of your medical bills
            </p>
            <p
              style={{
                color: '#334155',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                marginBottom: '12px',
              }}
            >
              ✓ We identify all overcharges and billing errors
            </p>
            <p
              style={{
                color: '#334155',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                marginBottom: '12px',
              }}
            >
              ✓ We negotiate with hospitals and insurance on your behalf
            </p>
            <p
              style={{
                color: '#334155',
                fontSize: '0.95rem',
                lineHeight: '1.6',
              }}
            >
              ✓ You keep 80% of everything we recover
            </p>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, rgba(8, 145, 178, 0.08), rgba(224, 242, 254, 0.5))',
              border: '2px solid #0891b2',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontWeight: '600', color: '#0f172a', fontSize: '1rem' }}>
              No savings = $0 cost to you
            </p>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
              We only get paid when you save money
            </p>
          </div>
        </div>

        {/* Email Capture Form */}
        <div className="card gradient-card" style={{ marginTop: '32px' }}>
          <h2
            style={{
              marginBottom: '8px',
              fontSize: '1.3rem',
              textAlign: 'center',
            }}
          >
            {isPregnant ? 'Get Prepared Now' : 'Ready to Get Your Money Back?'}
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: '#475569',
              fontSize: '0.95rem',
              marginBottom: '24px',
              lineHeight: '1.5',
            }}
          >
            {isPregnant
              ? "Enter your email and we'll send you a free checklist for reviewing your bills after delivery. When the time comes, we'll be ready to help."
              : "Enter your email to get started. We'll review your bills for free and negotiate on your behalf."}
          </p>

          <form onSubmit={handleSubmit}>
            {submitError && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid #ef4444',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px',
                  color: '#dc2626',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                }}
              >
                {submitError}
              </div>
            )}

            <div style={{ marginBottom: '12px' }}>
              <input
                type="email"
                placeholder="Email address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Full name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <input
                type="tel"
                placeholder="Phone number (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <button type="submit" className="button" disabled={isSubmitting}>
              {isSubmitting
                ? 'Submitting...'
                : isPregnant
                ? 'Send Me the Checklist →'
                : 'Get My Free Bill Review →'}
            </button>

            <p
              style={{
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: '0.75rem',
                marginTop: '16px',
                lineHeight: '1.5',
              }}
            >
              By submitting, you agree to our terms. We'll review your bills
              for free and only charge 20% of verified savings. No savings = no
              fee.
            </p>
          </form>
        </div>

        {/* Social Proof */}
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>
            {answers?.situation === 'baby' ||
             answers?.situation === 'pregnant' ||
             estimate.breakdown.some(b => b.category.includes('NICU')) ||
             estimate.breakdown.some(b => b.category.includes('C-Section')) ||
             estimate.breakdown.some(b => b.category.includes('Delivery'))
              ? 'WHAT OTHER PARENTS SAY:'
              : 'WHAT OTHERS SAY:'}
          </h3>

          {/* Show NICU testimonial if relevant */}
          {estimate.breakdown.some(b => b.category.includes('NICU')) && (
            <div className="card" style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#0f172a' }}>Sarah M., Boston</strong>
              </div>
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '8px' }}>
                "They found $14,000 in errors on my NICU bill. I only paid them
                $2,800 - saved over $11,000!"
              </p>
              <p style={{ color: '#0891b2', fontWeight: '600', fontSize: '0.85rem' }}>
                💰 Total Saved: $14,000
              </p>
            </div>
          )}

          {/* Show air ambulance testimonial if relevant */}
          {estimate.breakdown.some(b => b.category.includes('Air Ambulance')) && (
            <div className="card" style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#0f172a' }}>Mike T., Phoenix</strong>
              </div>
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '8px' }}>
                "Air ambulance bill went from $47,000 to $8,000. Best decision I
                ever made."
              </p>
              <p style={{ color: '#0891b2', fontWeight: '600', fontSize: '0.85rem' }}>
                💰 Total Saved: $39,000
              </p>
            </div>
          )}

          {/* Show surprise billing testimonial if relevant */}
          {estimate.breakdown.some(b => b.category.includes('Surprise')) && (
            <div className="card" style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#0f172a' }}>Jennifer L., Austin</strong>
              </div>
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '8px' }}>
                "Got hit with $12,000 in surprise out-of-network bills. BillRelief
                got it down to what I would have paid in-network - saved me $9,500!"
              </p>
              <p style={{ color: '#0891b2', fontWeight: '600', fontSize: '0.85rem' }}>
                💰 Total Saved: $9,500
              </p>
            </div>
          )}

          {/* Show ER/chronic care testimonial if relevant */}
          {(answers?.situation === 'er' || answers?.situation === 'chronic' ||
            (Array.isArray(answers?.hospital_services) && answers.hospital_services.includes('er'))) && (
            <div className="card" style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '12px' }}>
                <strong style={{ color: '#0f172a' }}>Rachel K., Denver</strong>
              </div>
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '8px' }}>
                "Multiple ER visits added up fast. BillRelief found $6,800 in duplicate
                charges and services billed twice. Couldn't have done it myself."
              </p>
              <p style={{ color: '#0891b2', fontWeight: '600', fontSize: '0.85rem' }}>
                💰 Total Saved: $6,800
              </p>
            </div>
          )}

          {/* Default/general testimonial - show if no specific matches or always show at least one */}
          {(!estimate.breakdown.some(b => b.category.includes('NICU')) &&
            !estimate.breakdown.some(b => b.category.includes('Air Ambulance')) &&
            !estimate.breakdown.some(b => b.category.includes('Surprise')) &&
            answers?.situation !== 'er' && answers?.situation !== 'chronic') && (
            <>
              <div className="card" style={{ marginBottom: '16px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#0f172a' }}>David R., Seattle</strong>
                </div>
                <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '8px' }}>
                  "Found over $5,000 in billing errors and duplicate charges I never
                  would have caught on my own. Worth every penny."
                </p>
                <p style={{ color: '#0891b2', fontWeight: '600', fontSize: '0.85rem' }}>
                  💰 Total Saved: $5,200
                </p>
              </div>

              <div className="card">
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: '#0f172a' }}>Maria G., Chicago</strong>
                </div>
                <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '8px' }}>
                  "Hospital said I qualified for charity care but never told me.
                  BillRelief applied for me and eliminated 70% of my bill."
                </p>
                <p style={{ color: '#0891b2', fontWeight: '600', fontSize: '0.85rem' }}>
                  💰 Total Saved: $8,400
                </p>
              </div>
            </>
          )}
        </div>

        {/* Trust Badges */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginTop: '32px',
            paddingBottom: '32px',
          }}
        >
          <div className="trust-badge-top">No upfront fees</div>
          <div className="trust-badge-top">Free bill review</div>
          <div className="trust-badge-top">20% success fee only</div>
          <div className="trust-badge-top">No savings = $0 cost</div>
        </div>
      </div>
    </div>
  );
}
