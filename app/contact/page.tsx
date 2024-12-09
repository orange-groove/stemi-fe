import ContactForm from '@/components/ContactForm'
import { Box } from '@mui/material'

export default function ContactPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: 1,
        backgroundColor: 'background.default',
      }}
    >
      <ContactForm />
    </Box>
  )
}
