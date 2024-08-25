import { Box, Button, CircularProgress } from '@mui/material'

export default function LoadingButton({
  isLoading,
  children,
  loadingText = 'Loading...',
  ...props
}: {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
}) {
  return (
    <Box sx={{ m: 1, position: 'relative' }}>
      <Button variant="contained" disabled={isLoading} {...props}>
        {loadingText || children}
      </Button>
      {isLoading && (
        <CircularProgress
          size={24}
          sx={{
            color: 'green.500',
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
    </Box>
  )
}
