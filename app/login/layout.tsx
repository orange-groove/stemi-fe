import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - Stemi',
  description:
    'Sign in to your Stemi account to access professional stem separation tools.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
