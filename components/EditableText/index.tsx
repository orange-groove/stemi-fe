import React, { useState, KeyboardEvent, ChangeEvent, useEffect } from 'react'
import { Input, InputProps } from '@mui/material'

interface EditableTextProps extends InputProps {
  value: string
  onComplete: (newValue: string) => void
  onCancel?: () => void // Optional callback for cancel (e.g., on `Escape` key)
}

const EditableText: React.FC<EditableTextProps> = ({
  value,
  onComplete,
  onCancel,
  ...props
}) => {
  const [localValue, setLocalValue] = useState(value)
  const [isEditing, setIsEditing] = useState(false)

  // Sync localValue with value prop when it changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleBlur = () => {
    if (localValue !== value) {
      onComplete(localValue)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (localValue !== value) {
        onComplete(localValue)
      }
      setIsEditing(false)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setLocalValue(value) // Revert to original value
      if (onCancel) {
        onCancel()
      }
      setIsEditing(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
  }

  return (
    <Input
      {...props}
      value={localValue}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsEditing(true)}
      onClick={(e) => e.stopPropagation()}
      sx={{
        px: 0,
        ...props.sx,
      }}
      disableUnderline
    />
  )
}

export default EditableText
