import SongDetail from '@/components/SongDetail'
import { Box } from '@mui/material'

export default function SongDetailPage() {
  return (
    <Box
      sx={{
        height: '100vh',
        width: 1,
        backgroundColor: 'background.default',
      }}
    >
      <SongDetail />
    </Box>
  )
}
