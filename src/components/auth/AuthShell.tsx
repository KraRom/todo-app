import type { PropsWithChildren } from 'react'
import styled from 'styled-components'

const Page = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
`

const Card = styled.section`
  width: min(100%, 460px);
  padding: 28px;
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.gradients.card};
  box-shadow: ${({ theme }) => theme.shadows.panel};
`

export const AuthShell = ({ children }: PropsWithChildren) => (
  <Page>
    <Card>{children}</Card>
  </Page>
)
