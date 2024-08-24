import { Box } from '@mui/material'
import SongList from '@/components/SongList'

const SongsPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <SongList />
    </Box>
  )
}

export default SongsPage
