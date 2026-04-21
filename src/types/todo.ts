export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

export type TodoFilter = 'all' | 'completed' | 'active'

export type SortOrder = 'newest' | 'oldest'
