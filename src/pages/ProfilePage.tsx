import { useState } from 'react'
import { Alert, Button, Stack, TextField, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'

import { changePassword, clearAuthError } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { isValidPassword } from '../utils/validation'

const Page = styled.main`
  min-height: 100vh;
  padding: 32px 18px;
`

const Shell = styled.div`
  max-width: 760px;
  margin: 0 auto;
  display: grid;
  gap: 20px;
`

const Card = styled.section`
  padding: 24px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.gradients.card};
  box-shadow: ${({ theme }) => theme.shadows.soft};
`

const MetaGrid = styled.div`
  display: grid;
  gap: 10px;
`

const Label = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
`

interface PasswordErrors {
  oldPassword?: string
  newPassword?: string
  confirmPassword?: string
}

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  dateStyle: 'long',
  timeStyle: 'short',
})

export const ProfilePage = () => {
  const dispatch = useAppDispatch()
  const { user, status, error } = useAppSelector((state) => state.auth)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({})
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: PasswordErrors = {}

    if (!oldPassword) {
      nextErrors.oldPassword = 'Введите текущий пароль'
    }

    if (!isValidPassword(newPassword)) {
      nextErrors.newPassword = 'Новый пароль должен содержать минимум 6 символов'
    }

    if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = 'Пароли не совпадают'
    }

    setPasswordErrors(nextErrors)
    setSuccessMessage('')

    if (Object.keys(nextErrors).length) {
      return
    }

    try {
      await dispatch(changePassword({ oldPassword, newPassword })).unwrap()
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSuccessMessage('Пароль успешно обновлён')
    } catch {
      return
    }
  }

  return (
    <Page>
      <Shell>
        <Button component={RouterLink} to="/" variant="text" sx={{ justifySelf: 'start' }}>
          ← К задачам
        </Button>

        <Card>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            Профиль
          </Typography>
          <MetaGrid>
            <Typography>
              <Label>Email:</Label> {user?.email ?? '—'}
            </Typography>
            <Typography>
              <Label>Возраст:</Label> {user?.age ?? 'не указан'}
            </Typography>
            <Typography>
              <Label>Дата регистрации:</Label>{' '}
              {user?.createdAt ? dateFormatter.format(new Date(user.createdAt)) : '—'}
            </Typography>
          </MetaGrid>
        </Card>

        <Card>
          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            <div>
              <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
                Смена пароля
              </Typography>
              <Typography color="text.secondary">
                Используйте минимум 6 символов и подтвердите новый пароль.
              </Typography>
            </div>

            {error && (
              <Alert severity="error" onClose={() => dispatch(clearAuthError())}>
                {error}
              </Alert>
            )}

            {successMessage && <Alert severity="success">{successMessage}</Alert>}

            <TextField
              label="Старый пароль"
              type="password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              error={Boolean(passwordErrors.oldPassword)}
              helperText={passwordErrors.oldPassword ?? ' '}
              fullWidth
            />
            <TextField
              label="Новый пароль"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              error={Boolean(passwordErrors.newPassword)}
              helperText={passwordErrors.newPassword ?? ' '}
              fullWidth
            />
            <TextField
              label="Подтверждение нового пароля"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              error={Boolean(passwordErrors.confirmPassword)}
              helperText={passwordErrors.confirmPassword ?? ' '}
              fullWidth
            />
            <Button type="submit" variant="contained" disabled={status === 'loading'}>
              Обновить пароль
            </Button>
          </Stack>
        </Card>
      </Shell>
    </Page>
  )
}
