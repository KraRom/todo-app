export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: string
}

export type TodoFilter = 'all' | 'completed' | 'active'

export type SortOrder = 'newest' | 'oldest'

export interface TodosResponse {
  data: Todo[]
  total: number
  page: number
  limit: number
  totalPages: number
}
