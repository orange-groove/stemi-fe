'use client'

import { useEffect } from 'react'
import Script from 'next/script'

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: Record<string, any>,
    ) => void
  }
}

// Google Analytics 4
export function GoogleAnalytics({
  GA_TRACKING_ID,
}: {
  GA_TRACKING_ID: string
}) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.gtag('config', GA_TRACKING_ID, {
        page_title: document.title,
        page_location: window.location.href,
      })
    }
  }, [GA_TRACKING_ID])

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  )
}

// Google Search Console verification
export function GoogleSearchConsole({
  verificationCode,
}: {
  verificationCode: string
}) {
  return <meta name="google-site-verification" content={verificationCode} />
}
