import { createAsyncThunk, createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit'

import {
  createTodo,
  deleteTodo,
  fetchTodos,
  toggleTodo,
  updateTodo,
} from '../api/todos'
import type { SortOrder, Todo, TodoFilter, TodosResponse } from '../types/todo'

interface FetchTodosArgs {
  page: number
  limit: number
  filter: TodoFilter
}

interface UpdateTodoArgs {
  id: number
  text: string
}

export interface TodosState {
  todos: Todo[]
  total: number
  page: number
  limit: number
  totalPages: number
  filter: TodoFilter
  sortOrder: SortOrder
  loading: boolean
  error: string | null
}

interface TodosRootState {
  todos: TodosState
}

const initialState: TodosState = {
  todos: [],
  total: 0,
  page: 1,
  limit: 5,
  totalPages: 1,
  filter: 'all',
  sortOrder: 'newest',
  loading: false,
  error: null,
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }

  return 'Не удалось выполнить запрос к серверу'
}

const getPageAfterDelete = (state: TodosState): number => {
  const totalAfterDelete = Math.max(state.total - 1, 0)
  const totalPagesAfterDelete = Math.max(Math.ceil(totalAfterDelete / state.limit), 1)

  return Math.min(state.page, totalPagesAfterDelete)
}

export const fetchTodosThunk = createAsyncThunk<
  TodosResponse,
  FetchTodosArgs,
  { rejectValue: string }
>('todos/fetchTodos', async ({ page, limit, filter }, { rejectWithValue }) => {
  try {
    return await fetchTodos(page, limit, filter)
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const createTodoThunk = createAsyncThunk<
  TodosResponse,
  string,
  { state: TodosRootState; rejectValue: string }
>('todos/createTodo', async (text, { getState, rejectWithValue }) => {
  try {
    const { limit, filter } = getState().todos

    await createTodo(text)

    return await fetchTodos(1, limit, filter)
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const updateTodoThunk = createAsyncThunk<
  TodosResponse,
  UpdateTodoArgs,
  { state: TodosRootState; rejectValue: string }
>('todos/updateTodo', async ({ id, text }, { getState, rejectWithValue }) => {
  try {
    const { page, limit, filter } = getState().todos

    await updateTodo(id, { text })

    return await fetchTodos(page, limit, filter)
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const deleteTodoThunk = createAsyncThunk<
  TodosResponse,
  number,
  { state: TodosRootState; rejectValue: string }
>('todos/deleteTodo', async (id, { getState, rejectWithValue }) => {
  try {
    const state = getState().todos
    const page = getPageAfterDelete(state)

    await deleteTodo(id)

    return await fetchTodos(page, state.limit, state.filter)
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const toggleTodoThunk = createAsyncThunk<
  TodosResponse,
  number,
  { state: TodosRootState; rejectValue: string }
>('todos/toggleTodo', async (id, { getState, rejectWithValue }) => {
  try {
    const { page, limit, filter } = getState().todos

    await toggleTodo(id)

    return await fetchTodos(page, limit, filter)
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

const applyTodosResponse = (state: TodosState, payload: TodosResponse) => {
  state.todos = payload.data
  state.total = payload.total
  state.page = payload.page
  state.limit = payload.limit
  state.totalPages = Math.max(payload.totalPages, 1)
}

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload
      state.page = 1
    },
    setFilter: (state, action: PayloadAction<TodoFilter>) => {
      state.filter = action.payload
      state.page = 1
    },
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.sortOrder = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTodosThunk.fulfilled, (state, action) => {
        state.loading = false
        applyTodosResponse(state, action.payload)
      })
      .addCase(fetchTodosThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Не удалось загрузить задачи'
      })
      .addMatcher(
        isAnyOf(
          createTodoThunk.pending,
          updateTodoThunk.pending,
          deleteTodoThunk.pending,
          toggleTodoThunk.pending,
        ),
        (state) => {
          state.loading = true
          state.error = null
        },
      )
      .addMatcher(
        isAnyOf(
          createTodoThunk.fulfilled,
          updateTodoThunk.fulfilled,
          deleteTodoThunk.fulfilled,
          toggleTodoThunk.fulfilled,
        ),
        (state, action: PayloadAction<TodosResponse>) => {
          state.loading = false
          applyTodosResponse(state, action.payload)
        },
      )
      .addMatcher(
        isAnyOf(
          createTodoThunk.rejected,
          updateTodoThunk.rejected,
          deleteTodoThunk.rejected,
          toggleTodoThunk.rejected,
        ),
        (state, action) => {
          state.loading = false
          state.error = action.payload ?? 'Не удалось сохранить изменения'
        },
      )
  },
})

export const { clearError, setFilter, setLimit, setPage, setSortOrder } = todoSlice.actions

export default todoSlice.reducer
