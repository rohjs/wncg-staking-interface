import styled from 'styled-components'

import { flexbox, posCenterY, textStyle } from 'styles/utils'

export const StyledRemoveLiquidityModalPage1Footer = styled.div`
  .buttonGroup {
    ${flexbox('start', 'start')}
    align-items: flex-start !important;

    .txButton,
    .signatureButton {
      position: relative;
      width: calc(50% - ${8 + 8 + 48 / 2}px);
      margin: 0 !important;
      flex-grow: 1;

      button {
        margin: 0 !important;
      }

      .count {
        ${posCenterY()}
        ${flexbox()}
        ${textStyle('body', 3)}
        width: 24px;
        height: 24px;
        z-index: 2;
        left: 0;
        margin-right: 8px;
        font-weight: 700;
        border-radius: 24px;
        background-color: rgba(var(--white-rgb), 0.1);
      }
    }

    .lottie.progress {
      ${flexbox()}
      width: 48px;
      height: 48px;
      margin: 0 8px;
      overflow: hidden;

      > div {
        transform: scale(7) rotate(-90deg);
        margin-left: -12px;
      }
    }
  }
`

export const StyledRemoveLiquidityModalPage1FooterSignature = styled.div`
  .desc {
    ${textStyle('body', 4)}
    margin-top: 8px;
    color: var(--gray-500);
  }

  .timer {
    ${textStyle('body', 4)}
    margin-top: 8px;
    white-space: nowrap;

    strong {
      color: var(--primary-200);
      font-weight: 500;
    }
  }
`
