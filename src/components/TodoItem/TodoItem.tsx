import { useState } from 'react'
import { Button, Checkbox, Chip } from '@mui/material'
import styled from 'styled-components'

import { EditTodo } from '../EditTodo/EditTodo'
import type { Todo } from '../../types/todo'

interface TodoItemProps {
  todo: Todo
  onToggle: (todoId: number) => void
  onDelete: (todoId: number) => void
  onUpdate: (todoId: number, text: string) => void
}

const ItemCard = styled.article`
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.gradients.card};
  box-shadow: ${({ theme }) => theme.shadows.soft};
`

const ItemHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`

const Content = styled.div`
  flex: 1;
  min-width: 0;
`

const TodoText = styled.p<{ $completed: boolean }>`
  margin: 0;
  color: ${({ theme }) => theme.colors.title};
  font-size: 1.05rem;
  line-height: 1.45;
  text-decoration: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
  opacity: ${({ $completed }) => ($completed ? 0.7 : 1)};
  word-break: break-word;
`

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`

const TimeLabel = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.92rem;
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
`

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export const TodoItem = ({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <ItemCard>
        <EditTodo
          initialValue={todo.text}
          onSave={(value) => {
            onUpdate(todo.id, value)
            setIsEditing(false)
          }}
          onCancel={() => setIsEditing(false)}
        />
      </ItemCard>
    )
  }

  return (
    <ItemCard>
      <ItemHeader>
        <Checkbox
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          slotProps={{ input: { 'aria-label': `Отметить задачу "${todo.text}"` } }}
        />
        <Content>
          <TodoText $completed={todo.completed}>{todo.text}</TodoText>
          <Meta>
            <Chip
              size="small"
              color={todo.completed ? 'success' : 'default'}
              label={todo.completed ? 'Готово' : 'В работе'}
            />
            <TimeLabel>{dateFormatter.format(todo.createdAt)}</TimeLabel>
          </Meta>
          <Actions>
            <Button variant="outlined" size="small" onClick={() => setIsEditing(true)}>
              Редактировать
            </Button>
            <Button variant="text" color="error" size="small" onClick={() => onDelete(todo.id)}>
              Удалить
            </Button>
          </Actions>
        </Content>
      </ItemHeader>
    </ItemCard>
  )
}
