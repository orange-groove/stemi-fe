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
  keyChanges?: KeyChanges[]
  tempoChanges?: TempoChanges[]
  userId?: string
}
