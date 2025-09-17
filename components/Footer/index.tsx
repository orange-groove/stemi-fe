import { Box, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

export default function Footer({ sx, ...props }: { sx?: any }) {
  const router = useRouter()
  return (
    <Box component="footer" sx={{ width: 1, height: 200, ...sx }} {...props}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Box>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ fontSize: 20, fontWeight: 'bold' }}>stemi</Box>
            <Typography
              sx={{
                fontSize: 14,
                color: 'text.secondary',
                ':hover': { color: 'orange', cursor: 'pointer' },
              }}
              onClick={() => router.push('https://orange-groove.com')}
            >
              © 2024 Orange Groove Solutions, LLC
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
