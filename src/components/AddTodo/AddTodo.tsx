import { Button, TextField } from '@mui/material'
import styled from 'styled-components'

interface AddTodoProps {
  value: string
  error: string
  onChange: (value: string) => void
  onSubmit: () => void
}

const Form = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 14px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const AddTodo = ({ value, error, onChange, onSubmit }: AddTodoProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <Form onSubmit={handleSubmit}>
      <TextField
        label="Новая задача"
        placeholder="Что сегодня нужно сделать?"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        error={Boolean(error)}
        helperText={error || ' '}
        fullWidth
      />
      <Button type="submit" variant="contained" size="large">
        Добавить
      </Button>
    </Form>
  )
}
