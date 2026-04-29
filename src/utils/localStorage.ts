import type { ThemeMode } from '../theme/theme'
import type { Todo } from '../types/todo'

const TODOS_STORAGE_KEY = 'todo-app.todos'
const THEME_STORAGE_KEY = 'todo-app.theme'

interface StoredTodo {
  id: number
  text: string
  completed: boolean
  createdAt: string
}

const isBrowser = typeof window !== 'undefined'

const isValidThemeMode = (value: unknown): value is ThemeMode =>
  value === 'light' || value === 'dark'

export const getStoredTodos = (): Todo[] => {
  if (!isBrowser) {
    return []
  }

  try {
    const rawValue = window.localStorage.getItem(TODOS_STORAGE_KEY)

    if (!rawValue) {
      return []
    }

    const parsedValue = JSON.parse(rawValue) as StoredTodo[]

    if (!Array.isArray(parsedValue)) {
      return []
    }

    return parsedValue
      .map((todo) => {
        const createdAt = new Date(todo.createdAt)

        if (
          typeof todo.id !== 'number' ||
          typeof todo.text !== 'string' ||
          typeof todo.completed !== 'boolean' ||
          Number.isNaN(createdAt.getTime())
        ) {
          return null
        }

        return {
          id: todo.id,
          text: todo.text,
          completed: todo.completed,
          createdAt: todo.createdAt,
        }
      })
      .filter((todo): todo is Todo => todo !== null)
  } catch {
    return []
  }
}

export const saveTodos = (todos: Todo[]): void => {
  if (!isBrowser) {
    return
  }

  const serializedTodos: StoredTodo[] = todos.map((todo) => ({
    ...todo,
    createdAt: todo.createdAt,
  }))

  window.localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(serializedTodos))
}

export const getStoredTheme = (): ThemeMode => {
  if (!isBrowser) {
    return 'light'
  }

  const rawValue = window.localStorage.getItem(THEME_STORAGE_KEY)

  return isValidThemeMode(rawValue) ? rawValue : 'light'
}

export const saveTheme = (themeMode: ThemeMode): void => {
  if (!isBrowser) {
    return
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, themeMode)
}
