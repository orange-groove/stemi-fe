export interface Track {
  name: string
  files: {
    name: string
    url: string
    offset: number
  }[]
}

export interface FilePayload {
  file: any
}

export interface Song {
  id: string
  name: string
  description: string
  tracks?: Track[]
}
