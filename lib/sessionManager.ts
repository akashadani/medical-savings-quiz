/**
 * Session Manager for Progressive Quiz Tracking
 *
 * Manages unique session IDs for tracking users through the quiz.
 * Each user gets one session ID that persists across the entire quiz journey.
 */

// Generate a unique session ID
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${randomPart}`;
}

// Get or create session ID from localStorage
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';

  const storageKey = 'quizSessionId';
  let sessionId = localStorage.getItem(storageKey);

  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(storageKey, sessionId);
  }

  return sessionId;
}

// Get session ID (without creating if doesn't exist)
export function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('quizSessionId');
}

// Clear session ID (useful for testing or starting fresh)
export function clearSessionId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('quizSessionId');
}

// Get session metadata
export function getSessionMetadata() {
  if (typeof window === 'undefined') return null;

  const metadata = localStorage.getItem('quizSessionMetadata');
  if (metadata) {
    try {
      return JSON.parse(metadata);
    } catch {
      return null;
    }
  }
  return null;
}

// Save session metadata
export function saveSessionMetadata(data: {
  startedAt?: string;
  lastUpdatedAt?: string;
  currentQuestion?: string;
  questionsAnswered?: number;
}) {
  if (typeof window === 'undefined') return;

  const existing = getSessionMetadata() || {};
  const updated = { ...existing, ...data };
  localStorage.setItem('quizSessionMetadata', JSON.stringify(updated));
}
