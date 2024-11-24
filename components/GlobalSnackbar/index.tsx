import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import { useAtom } from 'jotai'
import { snackbarAtom, closeSnackbarAtom } from '@/state/snackbar'

export default function GlobalSnackbar() {
  const [snackbar, setSnackbar] = useAtom(snackbarAtom)
  const closeSnackbar = useAtom(closeSnackbarAtom)[1]

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return
    closeSnackbar()
  }

  return (
    snackbar.message && (
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={snackbar.message}
      />
    )
  )
}
