import type { Todo, TodoFilter, TodosResponse } from '../types/todo'
import { apiClient } from './client'

interface UpdateTodoPayload {
  text?: string
  completed?: boolean
}

export const fetchTodos = async (
  page: number,
  limit: number,
  filter: TodoFilter,
): Promise<TodosResponse> => {
  const response = await apiClient.get<TodosResponse>('/todos', {
    params: {
      page,
      limit,
      filter,
    },
  })

  return response.data
}

export const createTodo = async (text: string): Promise<Todo> => {
  const response = await apiClient.post<Todo>('/todos', { text })

  return response.data
}

export const updateTodo = async (id: number, payload: UpdateTodoPayload): Promise<Todo> => {
  const response = await apiClient.put<Todo>(`/todos/${id}`, payload)

  return response.data
}

export const deleteTodo = async (id: number): Promise<void> => {
  await apiClient.delete(`/todos/${id}`)
}

export const toggleTodo = async (id: number): Promise<Todo> => {
  const response = await apiClient.patch<Todo>(`/todos/${id}/toggle`)

  return response.data
}
