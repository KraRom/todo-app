import axios from 'axios'

interface ApiErrorResponse {
  message?: string
  error?: string
}

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      'Не удалось выполнить запрос к серверу'
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Не удалось выполнить запрос к серверу'
}
