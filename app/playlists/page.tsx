import { Box } from '@mui/material'
import PlaylistList from '@/components/PlaylistList'

const PlaylistsPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <PlaylistList />
    </Box>
  )
}

export default PlaylistsPage
