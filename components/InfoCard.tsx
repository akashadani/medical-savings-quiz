import { InfoPage } from '@/lib/quizConfig';

interface InfoCardProps {
  infoPage: InfoPage;
  onContinue: () => void;
}

export default function InfoCard({ infoPage, onContinue }: InfoCardProps) {
  // Pages that show problems/issues should use X marks
  const isProblemPage = infoPage.id === 'overpay_info';

  return (
    <div className="card gradient-card fade-in">
      <div className="info-box-headline">{infoPage.headline}</div>

      <ul className="info-box-list">
        {infoPage.stats.map((stat, index) => (
          <li
            key={index}
            style={{
              color: '#334155',
              fontSize: '0.95rem',
              lineHeight: '1.7',
              marginBottom: '12px',
              paddingLeft: '24px',
              position: 'relative',
              listStyle: 'none',
            }}
          >
            <span
              style={{
                color: isProblemPage ? '#ef4444' : '#0891b2',
                fontWeight: '700',
                position: 'absolute',
                left: '0',
              }}
            >
              {isProblemPage ? '✗' : '✓'}
            </span>
            {stat}
          </li>
        ))}
      </ul>

      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <p
          style={{
            color: '#475569',
            fontSize: '0.9rem',
            marginBottom: '16px',
          }}
        >
          Don't worry - we'll help you find every opportunity.
        </p>
        <button onClick={onContinue} className="button">
          {infoPage.cta} →
        </button>
      </div>
    </div>
  );
}
