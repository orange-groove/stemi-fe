'use client'

import { useForm } from 'react-hook-form'
import { useUploadSong } from '@/hooks/api/song'

type Inputs = {
  file: string
}

export default function UploadForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const { mutate, error, isPending } = useUploadSong()

  const onSubmit = async (data: Inputs) => {
    const formData = new FormData()

    for (const key in data) {
      if (key === 'file') {
        formData.append(key, data[key][0])
      } else {
        formData.append(key, data[key as keyof typeof data])
      }
    }

    mutate(formData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="file" {...register('file')} />
      {errors.file && <span>This field is required</span>}

      <input type="submit" />

      {isPending && <div>Uploading... give me a minute.</div>}
      {error?.message && <div>{error?.message}</div>}
    </form>
  )
}
