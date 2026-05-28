import { Button, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'

const Page = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
`

export const NotFoundPage = () => (
  <Page>
    <Stack spacing={2} sx={{ alignItems: 'center' }}>
      <Typography variant="h3" component="h1">
        404
      </Typography>
      <Typography color="text.secondary">Страница не найдена</Typography>
      <Button component={RouterLink} to="/" variant="contained">
        На главную
      </Button>
    </Stack>
  </Page>
)
