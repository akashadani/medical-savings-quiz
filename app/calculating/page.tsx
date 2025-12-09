'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CalculatingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if quiz answers exist
    const savedAnswers = localStorage.getItem('quizAnswers');
    if (!savedAnswers) {
      router.push('/');
      return;
    }
  }, [router]);

  // Variable speed progress animation
  useEffect(() => {
    let currentProgress = 0;

    const updateProgress = () => {
      if (currentProgress >= 100) {
        setProgress(100);
        setTimeout(() => {
          router.push('/results');
        }, 300);
        return;
      }

      // Variable speed - sometimes fast, sometimes slow
      const speeds = [1, 2, 3, 2, 1, 4, 2, 1, 3, 2, 5, 1, 2, 3];
      const randomSpeed = speeds[Math.floor(Math.random() * speeds.length)];

      currentProgress += randomSpeed;
      setProgress(Math.min(currentProgress, 100));

      // Variable delay between updates (50-150ms)
      const delay = 50 + Math.random() * 100;
      setTimeout(updateProgress, delay);
    };

    // Start after a brief delay
    const timer = setTimeout(updateProgress, 200);

    return () => clearTimeout(timer);
  }, [router]);

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
        <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          {/* Animated spinner */}
          <div
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 32px',
              border: '4px solid rgba(8, 145, 178, 0.1)',
              borderTop: '4px solid #0891b2',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />

          <style jsx>{`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>

          <h1
            style={{
              fontSize: '1.75rem',
              marginBottom: '48px',
              color: '#0f172a',
            }}
          >
            Calculating Your Savings...
          </h1>

          {/* Progress bar */}
          <div
            style={{
              marginTop: '40px',
              background: 'rgba(148, 163, 184, 0.2)',
              borderRadius: '10px',
              height: '8px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(90deg, #0891b2, #0e7490)',
                height: '100%',
                width: `${progress}%`,
                transition: 'width 0.3s ease',
                borderRadius: '10px',
              }}
            />
          </div>

          <p
            style={{
              marginTop: '16px',
              color: '#64748b',
              fontSize: '0.9rem',
            }}
          >
            {progress}%
          </p>
        </div>
      </div>
    </div>
  );
}
