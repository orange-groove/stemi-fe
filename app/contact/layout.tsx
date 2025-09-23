import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - Stemi',
  description:
    'Get in touch with the Stemi team for support, feedback, or business inquiries.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
