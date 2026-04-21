import styled from 'styled-components'

import { TodoItem } from '../TodoItem/TodoItem'
import type { Todo } from '../../types/todo'

interface TodoListProps {
  todos: Todo[]
  onToggle: (todoId: number) => void
  onDelete: (todoId: number) => void
  onUpdate: (todoId: number, text: string) => void
}

const List = styled.div`
  display: grid;
  gap: 14px;
`

const EmptyState = styled.div`
  padding: 32px 24px;
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.accentSoft};
`

export const TodoList = ({ todos, onToggle, onDelete, onUpdate }: TodoListProps) => {
  if (!todos.length) {
    return (
      <EmptyState>
        Задачи отсутсвуют
      </EmptyState>
    )
  }

  return (
    <List>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </List>
  )
}
