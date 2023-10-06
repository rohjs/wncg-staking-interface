import styled, { css } from 'styled-components'

import { flexbox, media, textStyle } from 'styles/utils'

export const StyledRemoveLiquidityModalPage1Form = styled.div`
  .formHeader {
    ${flexbox('between', 'start')}
    white-space: nowrap;
  }

  .formLabel {
    ${flexbox('start')}
    ${textStyle('body', 3, 700)}
    color: rgba(var(--white-rgb), 0.9);

    .count {
      ${flexbox()}
      ${textStyle('body', 4, 700)}
      width: 20px;
      height: 20px;
      margin-right: 8px;
      border-radius: 24px;
      background-color: rgba(var(--white-rgb), 0.1);
    }
  }

  .formOutput {
    ${flexbox('center', 'end')}
    flex-direction: column;
    flex-grow: 1;
    flex-shrink: 0;
    padding-left: 12px;

    .amount {
      .value {
        ${textStyle('body', 3, 700)}
      }
    }

    .number,
    .symbol {
      ${textStyle('body', 4, 700)}
      margin-left: 4px;
    }

    .totalBalance {
      ${textStyle('body', 4)}
      display: inline-block;
      margin-top: 2px;
      color: rgba(var(--gray-25-rgb), 0.5);

      .symbol {
        ${textStyle('body', 4)}
        margin-left: 2px;
      }
    }
  }

  .inputControl {
    margin-top: 4px;
  }

  ${media(
    'minLaptop',
    css`
      .formLabel {
        ${textStyle('body', 2, 700)}

        .count {
          ${textStyle('body', 3, 700)}
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
      }

      .formOutput {
        padding-left: 16px;

        .amount {
          .value {
            ${textStyle('body', 2, 700)}
          }
        }

        .number,
        .symbol {
          ${textStyle('body', 3, 700)}
          margin-left: 4px;
        }

        .totalBalance {
          ${textStyle('body', 3)}

          .symbol {
            ${textStyle('body', 4)}
          }
        }
      }
    `
  )}
`

export const StyledRemoveLiquidityModalPage1FormButtonGroup = styled.div`
  ${flexbox('between')}
  padding: 12px 0;

  .ratioButton {
    width: calc(${100 / 4} - ${(12 * 3) / 4}px);
    height: 40px;
    margin-left: 12px;

    &:first-child {
      margin-left: 0;
    }
  }
`

export const StyledRemoveLiquidityModalPageFormSummary = styled.div`
  margin-top: 16px;

  .title {
    ${textStyle('body', 3)}
    ${flexbox('between')}
    font-weight: 700;
  }

  .content {
    padding: 20px 24px;
    margin-top: 8px;
    background-color: rgba(var(--white-rgb), 0.1);
    border-radius: 8px;
  }

  .radioGroup {
    ${flexbox('end')}
  }

  .radioItem {
    ${flexbox('start')}
    margin-left: 8px;

    &:first-child {
      margin-left: 0;
    }

    .radio {
      margin-right: 8px;
    }

    .text {
      ${textStyle('body', 3, 700)}
      color: rgba(var(--white-rgb), 0.9);
    }
  }

  .formSummaryItem {
    ${flexbox('between')}
    margin-top: 16px;

    &:first-child {
      margin-top: 0;
    }

    dt {
      ${flexbox('start')}
      ${textStyle('body', 2)}
    font-weight: 700;

      .tokenIcon {
        margin-right: 8px;
      }

      .parenthesis {
        margin-left: 8px;
        color: var(--gray-500);
        font-weight: 500;
      }
    }

    dd {
      ${flexbox('center', 'end')}
      flex-direction: column;

      .number {
        ${textStyle('body', 2)}
        color: rgba(var(--white-rgb), 0.9);
      }

      .countUp {
        ${textStyle('body', 2)}
        margin-top: 2px;
        font-weight: 700;
        color: var(--primary-300);
      }
    }
  }

  .divider {
    display: block;
    width: 100%;
    height: 1px;
    margin: 16px 0;
    background-color: rgba(var(--white-rgb), 0.1);
  }

  .currentPrice {
    color: rgba(var(--gray-25-rgb), 0.5);

    dt,
    dd {
      ${textStyle('body', 3)}
    }

    dd {
      ${flexbox('start')}
      flex-wrap: wrap;
      margin-top: 4px;
    }

    .price {
      margin-right: 16px;

      &:last-child {
        margin-right: 0;
      }
    }

    .number {
      display: inline-block;
      color: inherit;
    }

    .symbol {
      ${textStyle('caption')}
      margin-left: 0.25em;
    }
  }

  ${media(
    'minLaptop',
    css`
      .currentPrice {
        dd {
          flex-wrap: nowrap;
        }
      }
    `
  )}
`
