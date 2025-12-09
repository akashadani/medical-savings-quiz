import { QuizQuestion, QuizOption } from '@/lib/quizConfig';

interface QuestionCardProps {
  question: QuizQuestion;
  selectedValue: string | string[] | undefined;
  onSelect: (value: string | string[]) => void;
}

export default function QuestionCard({
  question,
  selectedValue,
  onSelect,
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

  return (
    <div className="card gradient-card fade-in">
      <h1 style={{ marginBottom: '32px' }}>{question.question}</h1>

      <div className="answer-options">
        {question.options.map((option) => (
          <button
            key={option.value}
            className={`answer-option ${
              isSelected(option.value) ? 'selected' : ''
            }`}
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
                <span>{option.label}</span>
              </div>
            ) : (
              option.label
            )}
          </button>
        ))}
      </div>

      {question.whyItMatters && (
        <div className="why-it-matters">
          <strong>Why it matters:</strong> {question.whyItMatters}
        </div>
      )}
    </div>
  );
}
