import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Register - Stemi',
  description:
    'Create your Stemi account to start using professional stem separation tools.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
