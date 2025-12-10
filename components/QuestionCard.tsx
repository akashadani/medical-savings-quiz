import { QuizQuestion, QuizOption, QuizAnswers } from '@/lib/quizConfig';

interface QuestionCardProps {
  question: QuizQuestion;
  selectedValue: string | string[] | undefined;
  onSelect: (value: string | string[]) => void;
  allAnswers?: QuizAnswers;
}

export default function QuestionCard({
  question,
  selectedValue,
  onSelect,
  allAnswers = {},
}: QuestionCardProps) {
  const handleOptionClick = (value: string) => {
    if (question.multiSelect) {
      const currentValues = Array.isArray(selectedValue) ? selectedValue : [];

      // If "none" is selected, clear all others
      if (value === 'none') {
        onSelect(['none']);
      } else {
        // Remove "none" if selecting something else
        const withoutNone = currentValues.filter((v) => v !== 'none');

        if (currentValues.includes(value)) {
          // Deselect
          onSelect(withoutNone.filter((v) => v !== value));
        } else {
          // Select
          onSelect([...withoutNone, value]);
        }
      }
    } else {
      onSelect(value);
    }
  };

  const isSelected = (value: string): boolean => {
    if (question.multiSelect) {
      return Array.isArray(selectedValue) && selectedValue.includes(value);
    }
    return selectedValue === value;
  };

  // Resolve dynamic question text
  const questionText = typeof question.question === 'function'
    ? question.question(allAnswers)
    : question.question;

  // Resolve dynamic whyItMatters text
  const whyItMattersText = question.whyItMatters
    ? (typeof question.whyItMatters === 'function'
        ? question.whyItMatters(allAnswers)
        : question.whyItMatters)
    : undefined;

  // Determine layout based on displayType
  const displayType = question.displayType || 'default';
  const isCompact = displayType === 'compact';
  const isIconGrid = displayType === 'icon-grid';

  return (
    <div className="card gradient-card fade-in">
      <h1 style={{ marginBottom: '24px' }}>{questionText}</h1>

      {question.encouragement && (
        <div style={{
          fontSize: '0.9rem',
          color: '#64748b',
          marginBottom: '24px',
          fontStyle: 'italic'
        }}>
          {question.encouragement}
        </div>
      )}

      <div className={`answer-options ${isCompact ? 'compact' : ''} ${isIconGrid ? 'icon-grid' : ''}`}>
        {question.options.map((option) => (
          <button
            key={option.value}
            className={`answer-option ${
              isSelected(option.value) ? 'selected' : ''
            } ${isCompact ? 'compact' : ''} ${option.icon ? 'has-icon' : ''}`}
            onClick={() => handleOptionClick(option.value)}
          >
            {question.multiSelect ? (
              <div className="answer-option-checkbox">
                <input
                  type="checkbox"
                  checked={isSelected(option.value)}
                  onChange={() => {}}
                  onClick={(e) => e.stopPropagation()}
                />
                {option.icon && <span className="option-icon">{option.icon}</span>}
                <span>{option.label}</span>
              </div>
            ) : (
              <>
                {option.icon && <span className="option-icon">{option.icon}</span>}
                <span>{option.label}</span>
              </>
            )}
          </button>
        ))}
      </div>

      {whyItMattersText && (
        <div className="why-it-matters">
          <strong>Why it matters:</strong> {whyItMattersText}
        </div>
      )}
    </div>
  );
}
