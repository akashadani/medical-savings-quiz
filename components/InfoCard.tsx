import { InfoPage, QuizAnswers } from '@/lib/quizConfig';

interface InfoCardProps {
  infoPage: InfoPage;
  onContinue: () => void;
  allAnswers?: QuizAnswers;
}

export default function InfoCard({ infoPage, onContinue, allAnswers = {} }: InfoCardProps) {
  // Pages that show problems/issues should use X marks
  const isProblemPage = infoPage.id === 'overpay_info';

  // Personalize headline based on answers
  let personalizedHeadline = infoPage.headline;

  if (infoPage.id === 'nicu_info' && allAnswers.nicu_duration) {
    const durationMap: Record<string, string> = {
      'under1week': 'Even Short NICU Stays Are Complex',
      '1-2weeks': 'A 1-2 Week NICU Stay Generates Hundreds of Charges',
      '2-4weeks': 'A Month in the NICU? Thousands of Line Items to Review',
      'over1month': 'Extended NICU Stays Have Massive Billing Complexity',
      'ongoing': 'Ongoing NICU Care Requires Constant Bill Monitoring',
    };
    personalizedHeadline = durationMap[allAnswers.nicu_duration as string] || infoPage.headline;
  }

  if (infoPage.id === 'surprise_oon_info' && allAnswers.emergency === 'emergency') {
    personalizedHeadline = 'Emergency Care? You Have Extra Protections';
  }

  if (infoPage.id === 'options_info') {
    if (allAnswers.bill_status === 'collections' || allAnswers.bill_status === 'legal') {
      personalizedHeadline = "Don't Panic - You Still Have Options";
    } else if (allAnswers.financial_hardship === 'cant_afford') {
      personalizedHeadline = 'You Likely Qualify for Financial Assistance';
    }
  }

  return (
    <div className="card gradient-card fade-in">
      <div className="info-box-headline">{personalizedHeadline}</div>

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
