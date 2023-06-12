import { ANIMATION_MAP, MOTION } from 'config/constants/motions'
import { assertUnreachable } from 'utils/assertUnreachable'

import { StyledToastStatus } from './styled'
import Icon from 'components/Icon'
import Lottie from 'components/Lottie'

type ToastStatusProps = {
  status: null | 0 | 1
}
export default function ToastStatus({ status }: ToastStatusProps) {
  switch (status) {
    case 0:
      return (
        <StyledToastStatus {...MOTION} variants={ANIMATION_MAP.fadeIn}>
          Fail
        </StyledToastStatus>
      )
    case 1:
      return (
        <StyledToastStatus {...MOTION} variants={ANIMATION_MAP.fadeIn} $success>
          Success <Icon icon="check" />
        </StyledToastStatus>
      )
    case null:
      return <Lottie className="loading" animationData="toastLoading" />
    default:
      assertUnreachable(status)
  }
}
