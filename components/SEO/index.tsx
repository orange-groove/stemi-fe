'use client'

import { useEffect } from 'react'

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

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Update document title
    document.title = fullTitle

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`
      let meta = document.querySelector(selector) as HTMLMetaElement

      if (!meta) {
        meta = document.createElement('meta')
        if (property) {
          meta.setAttribute('property', name)
        } else {
          meta.setAttribute('name', name)
        }
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    // Update meta tags
    updateMetaTag('description', description)
    if (keywords.length > 0) {
      updateMetaTag('keywords', keywords.join(', '))
    }

    if (noIndex) {
      updateMetaTag('robots', 'noindex, nofollow')
    }

    // Open Graph tags
    updateMetaTag('og:type', type, true)
    updateMetaTag('og:title', fullTitle, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:url', fullUrl, true)
    updateMetaTag('og:image', fullImage, true)
    updateMetaTag('og:image:width', '1200', true)
    updateMetaTag('og:image:height', '630', true)
    updateMetaTag('og:site_name', 'Stemi', true)

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', fullTitle)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', fullImage)
    updateMetaTag('twitter:creator', '@stemi')

    // Canonical URL
    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', fullUrl)
  }, [fullTitle, description, keywords, fullUrl, fullImage, noIndex, type])

  return null
}
