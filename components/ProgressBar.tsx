interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div style={{ padding: '24px 24px 0' }}>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div
        style={{
          textAlign: 'center',
          color: '#64748b',
          fontSize: '0.85rem',
          marginTop: '8px',
        }}
      >
        Question {current} of {total}
      </div>
    </div>
  );
}
