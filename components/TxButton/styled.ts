import styled, { css } from 'styled-components'

import { flexbox, media, posCenterY } from 'styles/utils'

import { StyledButton } from 'components/Button/styled'

export const StyledTxButton = styled(StyledButton)<{ $short?: boolean }>`
  .leftIcon,
  .rightIcon {
    ${flexbox()}
    position: relative;
    z-index: 1;
    width: 32px;
    height: 32px;
    opacity: 1;
  }

  .leftIcon {
    margin-right: 8px;
  }

  .rightIcon {
    margin-left: 8px;

    .icon {
      width: 20px;
      height: 20px;
      margin: 0;
    }
  }

  ${media(
    'minSmLaptop',
    css`
      .leftIcon,
      .rightIcon {
        ${posCenterY()}
        margin: 0;
      }

      .leftIcon {
        left: 16px;
      }

      .rightIcon {
        right: 16px;
      }
    `
  )}

  ${({ $short }) =>
    $short &&
    css`
      ${media(
        'minSmLaptop',
        css`
          .leftIcon {
            left: 12px;
          }

          .rightIcon {
            width: 24px;
            height: 24px;
            right: 12px;

            .connectorIcon {
              width: 24px;
              height: 24px;

              svg {
                width: ${24 * 0.8}px;
                height: ${24 * 0.8}px;
              }
            }
          }
        `
      )}
    `}
`
