import { useEffect, useState } from 'react'
import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  type SelectChangeEvent,
} from '@mui/material'
import styled from 'styled-components'

import { AddTodo } from './components/AddTodo/AddTodo'
import { TodoList } from './components/TodoList/TodoList'
import { useThemeMode } from './context/useThemeMode'
import type { SortOrder, Todo, TodoFilter } from './types/todo'
import { getStoredTodos, saveTodos } from './utils/localStorage'

const Page = styled.main`
  min-height: 100vh;
  padding: 32px 18px 52px;

  @media (max-width: 640px) {
    padding: 18px 12px 32px;
  }
`

const Shell = styled.div`
  max-width: 920px;
  margin: 0 auto;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.gradients.card};
  box-shadow: ${({ theme }) => theme.shadows.panel};
  overflow: hidden;
`

const Header = styled.header`
  padding: 28px;
  border-bottom: 1px solid ${({theme}) => theme.colors.border};
  background: rgb(156, 191, 241);
  ${({theme}) => theme.gradients.accent};
  color: #fff7ef;

  @media (max-width: 640px) {
    padding: 22px 18px;
  }
`

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`

/*const Eyebrow = styled.p`
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.8rem;
  font-weight: 700;
  opacity: 0.86;
`*/

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1.02;
  color: inherit;
`

const Subtitle = styled.p`
  max-width: 560px;
  margin: 14px 0 0;
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.94;
`

const ThemeToggle = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 247, 239, 0.14);
  font-weight: 700;
  white-space: nowrap;
`

const Content = styled.section`
  padding: 28px;

  @media (max-width: 640px) {
    padding: 18px;
  }
`

const ControlPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 220px));
  gap: 14px;
  margin: 12px 0 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const Stats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 22px;
`

const SectionLabel = styled.p`
  margin: 0 0 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.92rem;
`

const filterTodo = (todo: Todo, filter: TodoFilter): boolean => {
  if (filter === 'completed') {
    return todo.completed
  }

  if (filter === 'active') {
    return !todo.completed
  }

  return true
}

const sortTodos = (leftTodo: Todo, rightTodo: Todo, sortOrder: SortOrder): number => {
  const leftDate = leftTodo.createdAt.getTime()
  const rightDate = rightTodo.createdAt.getTime()

  return sortOrder === 'newest' ? rightDate - leftDate : leftDate - rightDate
}

function App() {
  const { themeMode, toggleTheme } = useThemeMode()
  const [todos, setTodos] = useState<Todo[]>(() => getStoredTodos())
  const [inputValue, setInputValue] = useState('')
  const [inputError, setInputError] = useState('')
  const [filter, setFilter] = useState<TodoFilter>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  const visibleTodos = [...todos]
    .filter((todo) => filterTodo(todo, filter))
    .sort((leftTodo, rightTodo) => sortTodos(leftTodo, rightTodo, sortOrder))

  const completedCount = todos.filter((todo) => todo.completed).length
  const activeCount = todos.length - completedCount

  const handleAddTodo = () => {
    const trimmedValue = inputValue.trim()

    if (!trimmedValue) {
      setInputError('Поле пустое!')
      return
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: trimmedValue,
      completed: false,
      createdAt: new Date(),
    }

    setTodos((currentTodos) => [...currentTodos, newTodo])
    setInputValue('')
    setInputError('')
  }

  const handleFilterChange = (event: SelectChangeEvent<TodoFilter>) => {
    setFilter(event.target.value as TodoFilter)
  }

  const handleSortChange = (event: SelectChangeEvent<SortOrder>) => {
    setSortOrder(event.target.value as SortOrder)
  }

  return (
    <Page>
      <Shell>
        <Header>
          <HeaderTop>
            <div>

              <Title>ToDo App</Title>
              <Subtitle>
                Приложение для управления задачами
              </Subtitle>
            </div>
            <ThemeToggle>
              {themeMode === 'light' ? 'Светлая' : 'Темная'}
              <Switch checked={themeMode === 'dark'} onChange={toggleTheme} />
            </ThemeToggle>
          </HeaderTop>
        </Header>

        <Content>
          <AddTodo
            value={inputValue}
            error={inputError}
            onChange={(value) => {
              setInputValue(value)
              if (inputError && value.trim()) {
                setInputError('')
              }
            }}
            onSubmit={handleAddTodo}
          />

          <ControlPanel>
            <FormControl fullWidth>
              <InputLabel id="sort-order-label">Сортировка</InputLabel>
              <Select
                labelId="sort-order-label"
                value={sortOrder}
                label="Сортировка"
                onChange={handleSortChange}
              >
                <MenuItem value="newest">Cначала новые</MenuItem>
                <MenuItem value="oldest">Сначала старые</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="filter-label">Фильтр</InputLabel>
              <Select
                labelId="filter-label"
                value={filter}
                label="Фильтр"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">Все</MenuItem>
                <MenuItem value="completed">Выполненные</MenuItem>
                <MenuItem value="active">Невыполненные</MenuItem>
              </Select>
            </FormControl>
          </ControlPanel>

          <SectionLabel>Сводка по задачам</SectionLabel>
          <Stats>
            <Chip label={`Всего: ${todos.length}`} />
            <Chip color="success" variant="outlined" label={`Готовые: ${completedCount}`} />
            <Chip color="primary" variant="outlined" label={`Неготовые: ${activeCount}`} />
          </Stats>

          <TodoList
            todos={visibleTodos}
            onToggle={(todoId) => {
              setTodos((currentTodos) =>
                currentTodos.map((todo) =>
                  todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
                ),
              )
            }}
            onDelete={(todoId) => {
              setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId))
            }}
            onUpdate={(todoId, text) => {
              setTodos((currentTodos) =>
                currentTodos.map((todo) => (todo.id === todoId ? { ...todo, text } : todo)),
              )
            }}
          />
        </Content>
      </Shell>
    </Page>
  )
}

export default App
