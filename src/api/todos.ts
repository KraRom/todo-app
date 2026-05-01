import axios from 'axios'

import type { Todo, TodoFilter, TodosResponse } from '../types/todo'

const API_URL = 'https://todo-redux-server-f22y.onrender.com'

interface UpdateTodoPayload {
  text?: string
  completed?: boolean
}

export const fetchTodos = async (
  page: number,
  limit: number,
  filter: TodoFilter,
): Promise<TodosResponse> => {
  const response = await axios.get<TodosResponse>(`${API_URL}/todos`, {
    params: {
      page,
      limit,
      filter,
    },
  })

  return response.data
}

export const createTodo = async (text: string): Promise<Todo> => {
  const response = await axios.post<Todo>(`${API_URL}/todos`, { text })

  return response.data
}

export const updateTodo = async (id: number, payload: UpdateTodoPayload): Promise<Todo> => {
  const response = await axios.put<Todo>(`${API_URL}/todos/${id}`, payload)

  return response.data
}

export const deleteTodo = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/todos/${id}`)
}

export const toggleTodo = async (id: number): Promise<Todo> => {
  const response = await axios.patch<Todo>(`${API_URL}/todos/${id}/toggle`)

  return response.data
}
