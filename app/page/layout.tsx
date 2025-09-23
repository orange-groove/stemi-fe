import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professional Stem Separation Tool - Stemi',
  description:
    'Separate any song into individual stems with AI-powered precision. Upload, preview, and download isolated tracks for vocals, drums, bass, and more. Professional stem separation for music producers.',
  keywords: [
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
    'beat maker',
    'music producer',
    'sound engineer',
    'audio engineer',
    'music technology',
    'digital audio',
    'music software',
    'audio software',
    'music tools',
    'audio tools',
    'stem isolation',
    'music separation',
    'audio separation',
    'track separation',
    'instrument separation',
    'vocal extraction',
    'instrumental extraction',
    'music stem extractor',
    'AI stem separation',
    'machine learning audio',
    'neural network audio',
    'deep learning music',
    'AI music production',
    'automated stem separation',
    'intelligent audio processing',
  ],
  openGraph: {
    title: 'Professional Stem Separation Tool - Stemi',
    description:
      'Separate any song into individual stems with AI-powered precision. Upload, preview, and download isolated tracks for vocals, drums, bass, and more.',
    url: 'https://www.stemi.app',
    siteName: 'Stemi',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Stemi - Professional Stem Separation Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Stem Separation Tool - Stemi',
    description:
      'Separate any song into individual stems with AI-powered precision. Upload, preview, and download isolated tracks for vocals, drums, bass, and more.',
    images: ['/og-image.png'],
  },
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
