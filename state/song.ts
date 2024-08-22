import { atom } from 'jotai'
import { tracksAtom } from './tracks'

const songAtom = atom((get) => {
  const tracks = get(tracksAtom)

  return {
    tracks,
    name: '',
  }
})
