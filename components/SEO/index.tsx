import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  noIndex?: boolean
  type?: 'website' | 'article'
}

export default function SEO({
  title = 'Stemi - Professional Stem Separation Tool',
  description = 'Separate any song into individual stems with AI-powered precision. Upload, preview, and download isolated tracks for vocals, drums, bass, and more.',
  keywords = [
    'stem separation',
    'AI music',
    'audio processing',
    'music production',
    'isolated tracks',
    'vocals',
    'drums',
    'bass',
    'piano',
    'guitar',
    'karaoke',
    'instrumental',
    'acapella',
    'music remix',
    'audio stem',
    'song separation',
    'track isolation',
    'music stem',
    'audio stem separation',
    'AI audio',
    'music AI',
    'stem extractor',
    'vocal isolation',
    'drum separation',
    'bass extraction',
    'music stem separation',
    'online stem separator',
    'professional stem separation',
    'music production tool',
    'audio editing',
    'music mixing',
    'stem creator',
    'track splitter',
    'music analyzer',
  ],
  image = '/og-image.png',
  url = 'https://www.stemi.app',
  noIndex = false,
  type = 'website',
}: SEOProps) {
  const fullTitle = title.includes('Stemi') ? title : `${title} | Stemi`
  const fullUrl = url.startsWith('http') ? url : `https://www.stemi.app${url}`
  const fullImage = image.startsWith('http')
    ? image
    : `https://www.stemi.app${image}`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Stemi" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:creator" content="@stemi" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </Head>
  )
}
