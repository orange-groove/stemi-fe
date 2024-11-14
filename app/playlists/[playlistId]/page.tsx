import SongDetail from '@/components/SongDetail'
import SongList from '@/components/SongList'
import { Box } from '@mui/material'

export default function PlaylistDetailPage() {
  return (
    <Box
      sx={{
        height: '100vh',
        width: 1,
        bgcolor: 'background.paper',
      }}
    >
      <SongList />
    </Box>
  )
}
