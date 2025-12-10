'use client';

import { useEffect } from 'react';
import { initFacebookPixel } from '@/lib/fbPixel';

export default function FacebookPixelInit() {
  useEffect(() => {
    initFacebookPixel();
  }, []);

  return null;
}
