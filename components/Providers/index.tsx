'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import AppThemeProvider from '../AppThemeProvider'

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <AppThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools />
          {children}
        </QueryClientProvider>
      </AppThemeProvider>
    </AppRouterCacheProvider>
  )
}
