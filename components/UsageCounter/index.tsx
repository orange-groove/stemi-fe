'use client'

import { Box, Typography, LinearProgress, Chip, Button } from '@mui/material'
import { useUsage } from '@/hooks/useUsage'
import { useRouter } from 'next/navigation'

export default function UsageCounter() {
  const { usage, loading } = useUsage()
  const router = useRouter()

  console.log('UsageCounter - Usage:', usage, 'Loading:', loading)

  if (loading || !usage) {
    console.log(
      'UsageCounter - Not rendering, loading:',
      loading,
      'usage:',
      usage,
    )
    return null
  }

  const usagePercentage = (usage.current_usage / usage.monthly_limit) * 100
  const isNearLimit = usagePercentage >= 80
  const isAtLimit = !usage.can_process

  const handleUpgrade = () => {
    router.push('/subscribe')
  }

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, mb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Songs this month
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" fontWeight="medium">
            {usage.current_usage}/{usage.monthly_limit}
          </Typography>
          {usage.is_premium ? (
            <Chip label="Premium" size="small" color="primary" />
          ) : (
            <Chip label="Free" size="small" color="default" />
          )}
        </Box>
      </Box>

      <LinearProgress
        aria-label={`Monthly usage: ${usage.current_usage} of ${usage.monthly_limit}`}
        variant="determinate"
        value={Math.min(usagePercentage, 100)}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: isAtLimit
            ? 'error.light'
            : isNearLimit
              ? 'warning.light'
              : 'grey.200',
          '& .MuiLinearProgress-bar': {
            bgcolor: isAtLimit
              ? 'error.main'
              : isNearLimit
                ? 'warning.main'
                : 'primary.main',
          },
        }}
      />

      {!usage.is_premium && (
        <Box
          sx={{
            mt: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {usage.current_usage >= usage.monthly_limit
              ? 'Monthly limit reached'
              : `${usage.monthly_limit - usage.current_usage} songs remaining`}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={handleUpgrade}
            sx={{ ml: 1 }}
          >
            Upgrade
          </Button>
        </Box>
      )}

      {usage.is_premium && usage.current_usage >= usage.monthly_limit && (
        <Typography
          variant="caption"
          color="error"
          sx={{ mt: 1, display: 'block' }}
        >
          Monthly limit reached. Resets next month.
        </Typography>
      )}
    </Box>
  )
}
