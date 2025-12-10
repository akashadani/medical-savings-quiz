// Facebook Pixel tracking utilities

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

// Initialize Facebook Pixel
export const initFacebookPixel = () => {
  if (typeof window === 'undefined') return;

  // Prevent double initialization
  if (window.fbq) return;

  (function(f: any, b: any, e: string, v: string, n: any, t: any, s: any) {
    if (f.fbq) return;
    n = f.fbq = function() {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js',
    null,
    null,
    null
  );

  window.fbq('init', '664365220412999');
  window.fbq('track', 'PageView');

  // Track engaged users after 5 seconds (only once per session, only if still on site)
  const hasTrackedEngaged = sessionStorage.getItem('fb_engaged_tracked');
  if (!hasTrackedEngaged) {
    setTimeout(() => {
      // Only fire if user is still on the page (not switched tabs or closed)
      if (document.visibilityState === 'visible') {
        window.fbq('trackCustom', 'Engaged');
        sessionStorage.setItem('fb_engaged_tracked', 'true');
      }
    }, 5000);
  }
};

// Track page view
export const trackFbPageView = () => {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', 'PageView');
};

// Track custom event
export const trackFbCustom = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('trackCustom', eventName, parameters);
};

// Track lead (for quiz completion)
export const trackFbLead = (parameters?: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', 'Lead', parameters);
};

// Track complete registration (for email submission)
export const trackFbCompleteRegistration = (parameters?: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', 'CompleteRegistration', parameters);
};

export default {
  init: initFacebookPixel,
  pageView: trackFbPageView,
  custom: trackFbCustom,
  lead: trackFbLead,
  completeRegistration: trackFbCompleteRegistration,
};
