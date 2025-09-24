import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Disallow only truly private/user-specific areas
        disallow: ['/profile'],
      },
    ],
    sitemap: 'https://www.stemi.app/sitemap.xml',
  }
}
