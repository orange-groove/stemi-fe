export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Stemi',
    description:
      'Professional AI-powered stem separation tool for music producers',
    url: 'https://www.stemi.app',
    applicationCategory: 'MusicApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '5.00',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: '5.00',
        priceCurrency: 'USD',
        billingIncrement: 'P1M',
      },
    },
    featureList: [
      'AI-powered stem separation',
      'High-quality audio processing',
      'Multiple download formats',
      'Real-time preview',
      'Custom mixdown creation',
    ],
    screenshot: 'https://www.stemi.app/og-image.png',
    author: {
      '@type': 'Organization',
      name: 'Stemi',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
