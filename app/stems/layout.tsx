import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stem Separation Studio - Stemi',
  description:
    'Upload and separate your songs into individual stems. Professional AI-powered stem separation with real-time preview and download capabilities.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function StemsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
