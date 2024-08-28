export interface Track {
  name: string
  url: string
}

export interface FilePayload {
  file: any
}

export interface Song {
  id: string
  name: string
  artist: string
  tracks?: Track[]
  keyChanges?: string[]
  tempoChanges?: any[]
  userId?: string
}
