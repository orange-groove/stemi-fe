export interface Track {
  name: string
  url: string
}

export interface FilePayload {
  file: any
}

export interface Song {
  id: string
  title: string
  artist: string
  tracks: Track[]
}
