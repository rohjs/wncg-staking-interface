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

  .desc {
    ${textStyle('body', 4)}
    margin-top: 8px;
    color: var(--gray-500);
    text-align: center;
  }

  .timer {
    ${textStyle('body', 4)}
    margin-top: 8px;
    white-space: nowrap;
    text-align: center;

    strong {
      color: var(--primary-200);
      font-weight: 500;
    }
  }
`

export const StyledRemoveLiquidityModalPage1FooterSignature = styled.div`
  .desc,
  .timer {
    text-align: left;
  }
`
