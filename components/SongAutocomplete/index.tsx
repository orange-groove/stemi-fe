import React, { useState } from 'react'
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import { CircularProgress, Grid, Typography } from '@mui/material'

const SongAutocomplete = (props: any) => {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (event: any) => {
    const query = event.target.value
    if (query?.length < 3) return // Wait until the user has typed at least 3 characters

    setLoading(true)

    try {
      const response = await axios.get('https://api.genius.com/search', {
        params: {
          q: query,
          access_token: process.env.NEXT_PUBLIC_GENIUS_ACCESS_TOKEN,
        },
      })

      const songs = response.data.response.hits.map((hit: any) => ({
        title: hit.result.full_title,
        id: hit.result.id,
      }))

      setOptions(songs)
    } catch (error) {
      console.error('Error fetching data from Genius API:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option: any) => option.title}
      loading={loading}
      freeSolo
      onInputChange={handleSearch}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search for a song"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option: any) => {
        const { key, ...optionProps } = props

        return (
          <li key={key} {...optionProps}>
            <Grid container sx={{ alignItems: 'center' }}>
              <Grid item sx={{ display: 'flex', width: 44 }}>
                <MusicNoteIcon sx={{ color: 'text.secondary' }} />
              </Grid>
              <Grid
                item
                sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {option?.title}
                </Typography>
              </Grid>
            </Grid>
          </li>
        )
      }}
      {...props}
    />
  )
}

export default SongAutocomplete
