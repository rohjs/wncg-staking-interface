import { PropsWithChildren } from 'react'
import styled from 'styled-components'
import { textStyle } from 'styles/utils'

const StyledLoading = styled.div`
  ${textStyle('subtitle', 1)}
  width: 100%;
  padding: 8px;
  background-color: var(--error-400);
`

function Loading({ children }: PropsWithChildren) {
  return <StyledLoading>{children}</StyledLoading>
}

export default Loading
