import { atom } from 'jotai'
import { tracksAtom } from './tracks'

export const songAtom = atom((get) => {
  const tracks = get(tracksAtom)

  return {
    tracks,
    name: '',
    artist: '',
    keyChanges: [],
    tempoChanges: [],
  }
})

export const userSongsAtom = atom([])
