// atoms/snackbarAtom.js
import { atom } from 'jotai'

export const snackbarAtom = atom({
  open: false,
  message: '',
  type: 'info', // 'error', 'info', 'success', 'warning'
})

export const pushSnackbarAtom = atom(
  null,
  (get, set, { message, type = 'info' }) => {
    set(snackbarAtom, { open: true, message, type })
  },
)

export const closeSnackbarAtom = atom(null, (get, set) => {
  set(snackbarAtom, { ...get(snackbarAtom), open: false })
})
