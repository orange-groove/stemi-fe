import SongDetail from '@/components/SongDetail'
import { Box } from '@mui/material'

export default function SongDetailPage() {
  return (
    <Box
      sx={{
        height: '100%',
        width: 1,
        backgroundColor: 'background.default',
      }}
    >
      <SongDetail />
    </Box>
  )
}
