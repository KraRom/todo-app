import { useState } from 'react'
import { Alert, Button, Stack, TextField, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

import { clearAuthError, fetchUserProfile, registerUser } from '../../store/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { isValidEmail, isValidPassword } from '../../utils/validation'

interface FormErrors {
  email?: string
  password?: string
  age?: string
}

export const RegisterForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { status, error } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [age, setAge] = useState('')
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FormErrors = {}
    const numericAge = age ? Number(age) : undefined

    if (!isValidEmail(email)) {
      nextErrors.email = 'Введите корректный email'
    }

    if (!isValidPassword(password)) {
      nextErrors.password = 'Пароль должен содержать минимум 6 символов'
    }

    if (numericAge !== undefined && (!Number.isInteger(numericAge) || numericAge <= 0)) {
      nextErrors.age = 'Возраст должен быть положительным числом'
    }

    setFormErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      return
    }

    try {
      await dispatch(
        registerUser({
          email,
          password,
          age: numericAge,
        }),
      ).unwrap()
      await dispatch(fetchUserProfile()).unwrap()
      navigate('/', { replace: true })
    } catch {
      return
    }
  }

  return (
    <Stack component="form" spacing={2.2} onSubmit={handleSubmit}>
      <div>
        <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
          Регистрация
        </Typography>
        <Typography color="text.secondary">
          Создайте аккаунт, чтобы задачи сохранялись персонально для вас.
        </Typography>
      </div>

      {error && (
        <Alert severity="error" onClose={() => dispatch(clearAuthError())}>
          {error}
        </Alert>
      )}

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={Boolean(formErrors.email)}
        helperText={formErrors.email ?? ' '}
        fullWidth
      />
      <TextField
        label="Пароль"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={Boolean(formErrors.password)}
        helperText={formErrors.password ?? ' '}
        fullWidth
      />
      <TextField
        label="Возраст"
        type="number"
        value={age}
        onChange={(event) => setAge(event.target.value)}
        error={Boolean(formErrors.age)}
        helperText={formErrors.age ?? 'Необязательно'}
        fullWidth
      />
      <Button type="submit" variant="contained" disabled={status === 'loading'}>
        Зарегистрироваться
      </Button>
      <Typography color="text.secondary">
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </Typography>
    </Stack>
  )
}
