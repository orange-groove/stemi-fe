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
  tempoChanges?: TempoChange[]
  userId?: string
  createdAt: string
}

export interface KeyChange {
  beat: number
  key: string
}

export interface TempoChange {
  beat: number
  tempo: number
}
