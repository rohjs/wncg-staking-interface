import { motion } from 'framer-motion'
import styled from 'styled-components'

import { flexbox, gradient, textStyle } from 'newStyles/utils'
import { buttonStyle } from 'new/Button/styled'

export const StyledModalOverlay = styled(motion.div)`
  ${flexbox('flex-end')}
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(32px);

  @media screen and (min-width: 1000px) {
    justify-content: center;
  }
`

export const StyledModalContainer = styled(motion.aside)`
  width: 100%;
`

export const StyledModalContent = styled.div`
  position: relative;
  flex-grow: 1;
  width: 100%;
  margin: 0 auto;
  padding: 48px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 16px 16px 0 0;
  box-shadow: 0px 4px 48px rgba(0, 0, 0, 0.24);

  .header {
    position: relative;
    margin-bottom: 64px;

    .modalClose {
      position: absolute;
      top: 0;
      right: 0;
    }
  }

  .titleGroup {
    padding-right: ${32 + 24}px;
  }

  .title {
    ${textStyle('body', 2)}
    margin-bottom: 8px;
    font-weight: 700;
    color: var(--primary-300);
  }

  .subtitle {
    ${textStyle('header', 5)}
  }

  .desc {
    ${textStyle('body', 2)}
    margin-top: 8px;
    color: rgba(var(--white-rgb), 0.6);
  }

  @media screen and (min-width: 1000px) {
    padding: 48px;
    border-radius: 16px;
  }
`

export const StyledCloseButton = styled.button`
  ${flexbox()}
  width: 32px;
  height: 32px;
  color: var(--white);
`

export const StyledPendingNotice = styled(motion.footer)`
  ${flexbox('flex-start')}
  height: 72px;
  padding-right: 16px;
  padding-left: 12px;
  margin: 48px -48px -48px;
  overflow: hidden;
  border-radius: 0 0 16px 16px;
  background-image: ${gradient(2)};

  .loading {
    flex-shrink: 0;
    margin-right: 4px;
    transform: scale(0.7);
    color: var(--gray-400);
  }

  .content {
    flex-grow: 1;
  }

  .title {
    ${textStyle('body', 2)}
    margin: 0;
    color: var(--white);
  }

  .desc {
    ${textStyle('body', 3)}
    margin: 0;
    color: rgba(var(--white-rgb), 0.6);
  }

  .extLink {
    ${buttonStyle}
    ${textStyle('caption')}
    flex-grow: 0;
    flex-shrink: 0;
    width: auto;
    padding: 8px 16px;
    font-weight: 700;
    color: var(--primary-500);
    background-color: var(--white);
    border-radius: 100px;

    .icon {
      flex-shrink: 0;
      margin-right: -4px;
      margin-left: 4px;
    }
  }
`

export const StyledModalApprovePage = styled(StyledModalContent)`
  max-width: 720px;
`

export const StyledModalCompletePage = styled(StyledModalContent)`
  max-width: 480px;

  .title {
    ${textStyle('header', 5)}
    color: var(--white);
    text-align: center;
  }
`