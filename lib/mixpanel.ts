import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel
const initMixpanel = () => {
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

  if (token && typeof window !== 'undefined') {
    mixpanel.init(token, {
      debug: process.env.NODE_ENV === 'development',
      track_pageview: false, // We'll track manually for better control
      persistence: 'localStorage',
    });
  }
};

// Track page view
export const trackPageView = (pageName: string, properties?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  initMixpanel();
  mixpanel.track('Page View', {
    page: pageName,
    ...properties,
  });
};

// Track quiz answer
export const trackQuizAnswer = (questionId: string, answer: string | string[], properties?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  initMixpanel();
  mixpanel.track('Quiz Answer', {
    question_id: questionId,
    answer: Array.isArray(answer) ? answer.join(', ') : answer,
    ...properties,
  });
};

// Track quiz completion
export const trackQuizComplete = (totalQuestions: number, properties?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  initMixpanel();
  mixpanel.track('Quiz Completed', {
    total_questions: totalQuestions,
    ...properties,
  });
};

// Track email submission
export const trackEmailSubmission = (properties?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  initMixpanel();
  mixpanel.track('Email Submitted', properties);
};

// Identify user (when they submit email)
export const identifyUser = (email: string, properties?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  initMixpanel();
  mixpanel.identify(email);

  if (properties) {
    mixpanel.people.set(properties);
  }
};

export default mixpanel;
