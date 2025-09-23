import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/stems', '/subscribe', '/profile'],
      },
    ],
    sitemap: 'https://www.stemi.app/sitemap.xml',
  }
}
