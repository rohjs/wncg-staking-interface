import { useAtomValue } from 'jotai'

import { isMobileAtom, Modal, ModalCategory } from 'states/ui'
import { assertUnreachable } from 'utils/assertion'
import {
  modalDesktopVariants,
  modalMobileVariants,
  overlayVariants,
} from '../constants'

import {
  StyledModalContainer,
  StyledModalOverlay,
} from 'components/Modals/shared/styled'
import JoinModal from 'components/Pool/Join/Modal'
import StakeModal from 'components/staking/StakeModal'
import ClaimRewardModal from './ClaimRewardModal'
import ConnectWalletModal from './ConnectWalletModal'
import CooldownModal from './CooldownModal'
import ExitModal from './ExitModal'
import SwitchNetworkModal from './SwitchNetworkModal'
import WithdrawModal from './WithdrawModal'

type ModalViewProps = {
  modal: Modal
}

function ModalView({ modal }: ModalViewProps) {
  const isMobile = useAtomValue(isMobileAtom)

  const variants = isMobile ? modalMobileVariants : modalDesktopVariants

  return (
    <StyledModalOverlay
      variants={overlayVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
    >
      <StyledModalContainer
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
      >
        {renderModal(modal)}
      </StyledModalContainer>
    </StyledModalOverlay>
  )
}

export default ModalView

function renderModal(modal: Modal) {
  const { category, props } = modal

  switch (category) {
    case ModalCategory.ClaimReward:
      return <ClaimRewardModal />
    case ModalCategory.Connect:
      return <ConnectWalletModal />
    case ModalCategory.Cooldown:
      return <CooldownModal />
    case ModalCategory.Join:
      return <JoinModal {...props} />
    case ModalCategory.Exit:
      return <ExitModal {...props} />
    case ModalCategory.Stake:
      return <StakeModal {...props} />
    case ModalCategory.SwitchNetwork:
      return <SwitchNetworkModal />
    case ModalCategory.Withdraw:
      return <WithdrawModal />
    default:
      assertUnreachable(modal.category)
  }
}
