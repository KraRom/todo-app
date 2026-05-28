import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Switch,
  type SelectChangeEvent,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'

import { AddTodo } from '../components/AddTodo/AddTodo'
import { TodoList } from '../components/TodoList/TodoList'
import { useThemeMode } from '../context/useThemeMode'
import { logoutUser } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  clearError,
  createTodoThunk,
  deleteTodoThunk,
  fetchTodosThunk,
  setFilter,
  setLimit,
  setPage,
  setSortOrder,
  toggleTodoThunk,
  updateTodoThunk,
} from '../store/todoSlice'
import type { SortOrder, Todo, TodoFilter } from '../types/todo'

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
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: rgb(156, 191, 241);
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

const HeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;

  @media (max-width: 640px) {
    justify-content: flex-start;
  }
`

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
  grid-template-columns: repeat(3, minmax(160px, 1fr));
  gap: 14px;
  margin: 12px 0 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const Stats = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
`

const SectionLabel = styled.p`
  margin: 0 0 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.92rem;
`

const FooterControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 22px;

  @media (max-width: 640px) {
    align-items: stretch;
    flex-direction: column;
  }
`

const PageSummary = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.92rem;
`

const LoadingBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
`

const sortTodos = (leftTodo: Todo, rightTodo: Todo, sortOrder: SortOrder): number => {
  const leftDate = new Date(leftTodo.createdAt).getTime()
  const rightDate = new Date(rightTodo.createdAt).getTime()

  return sortOrder === 'newest' ? rightDate - leftDate : leftDate - rightDate
}

export const HomePage = () => {
  const { themeMode, toggleTheme } = useThemeMode()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const { todos, total, page, limit, totalPages, filter, sortOrder, loading, error } =
    useAppSelector((state) => state.todos)
  const [inputValue, setInputValue] = useState('')
  const [inputError, setInputError] = useState('')

  useEffect(() => {
    void dispatch(fetchTodosThunk({ page, limit, filter }))
  }, [dispatch, filter, limit, page])

  const visibleTodos = [...todos].sort((leftTodo, rightTodo) =>
    sortTodos(leftTodo, rightTodo, sortOrder),
  )
  const completedCount = todos.filter((todo) => todo.completed).length
  const activeCount = todos.length - completedCount

  const handleAddTodo = () => {
    const trimmedValue = inputValue.trim()

    if (!trimmedValue) {
      setInputError('Поле пустое!')
      return
    }

    void dispatch(createTodoThunk(trimmedValue))
      .unwrap()
      .then(() => {
        setInputValue('')
      })
      .catch(() => undefined)
    setInputError('')
  }

  const handleFilterChange = (event: SelectChangeEvent<TodoFilter>) => {
    dispatch(setFilter(event.target.value as TodoFilter))
  }

  const handleSortChange = (event: SelectChangeEvent<SortOrder>) => {
    dispatch(setSortOrder(event.target.value as SortOrder))
  }

  const handleLimitChange = (event: SelectChangeEvent) => {
    dispatch(setLimit(Number(event.target.value)))
  }

  return (
    <Page>
      <Shell>
        <Header>
          <HeaderTop>
            <div>
              <Title>ToDo App</Title>
              <Subtitle>
                {user ? `Вы вошли как ${user.email}` : 'Приложение для управления задачами'}
              </Subtitle>
            </div>

            <HeaderActions>
              <ThemeToggle>
                {themeMode === 'light' ? 'Светлая' : 'Тёмная'}
                <Switch checked={themeMode === 'dark'} onChange={toggleTheme} />
              </ThemeToggle>
              <Button component={RouterLink} to="/profile" variant="outlined" color="inherit">
                Профиль
              </Button>
              <Button variant="contained" color="inherit" onClick={() => dispatch(logoutUser())}>
                Выйти
              </Button>
            </HeaderActions>
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
                <MenuItem value="newest">Сначала новые</MenuItem>
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

            <FormControl fullWidth>
              <InputLabel id="limit-label">На странице</InputLabel>
              <Select
                labelId="limit-label"
                value={String(limit)}
                label="На странице"
                onChange={handleLimitChange}
              >
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="20">20</MenuItem>
              </Select>
            </FormControl>
          </ControlPanel>

          {error && (
            <Alert severity="error" onClose={() => dispatch(clearError())} sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <SectionLabel>Сводка по задачам</SectionLabel>
          <Stats>
            <Chip label={`Всего по фильтру: ${total}`} />
            <Chip color="success" variant="outlined" label={`На странице готово: ${completedCount}`} />
            <Chip color="primary" variant="outlined" label={`На странице неготово: ${activeCount}`} />
            {loading && (
              <LoadingBox>
                <CircularProgress size={18} />
                Загрузка
              </LoadingBox>
            )}
          </Stats>

          <TodoList
            todos={visibleTodos}
            onToggle={(todoId) => {
              void dispatch(toggleTodoThunk(todoId))
            }}
            onDelete={(todoId) => {
              void dispatch(deleteTodoThunk(todoId))
            }}
            onUpdate={(todoId, text) => {
              void dispatch(updateTodoThunk({ id: todoId, text }))
            }}
          />

          <FooterControls>
            <PageSummary>
              Страница {page} из {totalPages}. На странице: {visibleTodos.length}
            </PageSummary>
            <Box>
              <Pagination
                count={totalPages}
                page={page}
                color="primary"
                disabled={loading}
                onChange={(_, nextPage) => dispatch(setPage(nextPage))}
              />
            </Box>
          </FooterControls>
        </Content>
      </Shell>
    </Page>
  )
}
