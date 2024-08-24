import { userAtom } from '@/state/user'
import { Avatar, Box } from '@mui/material'
import { useAtomValue } from 'jotai'

export default function Header() {
  const user = useAtomValue(userAtom)

  return (
    <Box sx={{ width: 1, height: 100 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
        }}
      >
        <Avatar
          alt={user?.user_metadata.name}
          src={user?.user_metadata?.image}
        />
      </Box>
    </Box>
  )
}
