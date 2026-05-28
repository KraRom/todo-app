export const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const isValidPassword = (value: string): boolean => value.length >= 6
