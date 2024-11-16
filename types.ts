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
  tracks?: Track[]
  user_id: string
  playlist_id: string
  image_url: string
  created_at: string
}

export interface Playlist {
  id: string
  name: string
  user_id?: string
  created_at: string
}

export interface KeyChange {
  beat: number
  key: string
}

export interface TempoChange {
  beat: number
  tempo: number
}
