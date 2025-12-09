'use client';

import { useEffect } from 'react';
import LogRocket from 'logrocket';

export default function LogRocketInit() {
  useEffect(() => {
    // Initialize LogRocket
    const appId = process.env.NEXT_PUBLIC_LOGROCKET_APP_ID || 'dhqzb7/billrelief';

    if (typeof window !== 'undefined') {
      LogRocket.init(appId);
    }
  }, []);

  return null;
}
