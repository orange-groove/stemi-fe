import { atom } from 'jotai'
import { tracksAtom } from './tracks'

export const songAtom = atom((get) => {
  const tracks = get(tracksAtom)

  return {
    tracks,
    name: '',
  }
})

export const userSongsAtom = atom([])
