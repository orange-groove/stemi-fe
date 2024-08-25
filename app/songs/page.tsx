import { Box } from '@mui/material'
import SongList from '@/components/SongList'
import NewSongModal from '@/components/NewSongModal'

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
