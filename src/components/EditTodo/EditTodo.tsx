import { useState } from 'react'
import { Button, TextField } from '@mui/material'
import styled from 'styled-components'

interface EditTodoProps {
  initialValue: string
  onSave: (value: string) => void
  onCancel: () => void
}

const EditForm = styled.form`
  display: grid;
  gap: 12px;
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

export const EditTodo = ({ initialValue, onSave, onCancel }: EditTodoProps) => {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedValue = value.trim()

    if (!trimmedValue) {
      setError('Поле пустое!')
      return
    }

    onSave(trimmedValue)
  }

  return (
    <EditForm onSubmit={handleSubmit}>
      <TextField
        label="Редактирование задачи"
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
          if (error) {
            setError('')
          }
        }}
        error={Boolean(error)}
        helperText={error || ' '}
        autoFocus
        fullWidth
      />
      <Actions>
        <Button type="submit" variant="contained" size="small">
          Сохранить
        </Button>
        <Button type="button" variant="outlined" size="small" onClick={onCancel}>
          Отмена
        </Button>
      </Actions>
    </EditForm>
  )
}
