'use client';

import Script from 'next/script';

export default function GoogleTagInit() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17390336929"
        strategy="afterInteractive"
      />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17390336929');
        `}
      </Script>
    </>
  );
}
