import styled, { css } from 'styled-components'

import { ModalPage } from 'components/Modals/shared'

export const StyledRemoveLiquidityModalPage1 = styled(ModalPage)`
  max-width: 640px;

  ${({ $disabled }) =>
    $disabled &&
    css`
      .modalContent,
      .modalFooter {
        opacity: 0.5;
      }
    `}
`
