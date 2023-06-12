import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { ModalType } from 'config/constants'
import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { useFiat, useModal, useStaking } from 'hooks'
import { useFetchUserRewards } from 'hooks/queries'

import { StyledWalletRewards } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import Icon from 'components/Icon'
import NumberFormat from 'components/NumberFormat'

type WalletRewardsProps = {
  closeWallet(): void
}

export default function WalletRewards({ closeWallet }: WalletRewardsProps) {
  const [show, setShow] = useState(false)

  const toFiat = useFiat()
  const { addModal } = useModal()
  const { rewardTokenAddresses, tokens } = useStaking()

  const { earnedTokenRewards = [], hasRewards = false } =
    useFetchUserRewards().data ?? {}

  function toggle() {
    setShow((prev) => !prev)
  }

  function openClaim() {
    addModal({
      type: ModalType.Claim,
    })
    closeWallet()
  }

  return (
    <StyledWalletRewards $show={show}>
      <button className="rewardToggle" type="button" onClick={toggle}>
        Earned rewards
        <Icon icon={show ? 'chevronDown' : 'chevronRight'} />
      </button>

      <AnimatePresence>
        {show && (
          <motion.dl
            {...EXIT_MOTION}
            className="rewardList"
            variants={ANIMATION_MAP.fadeIn}
          >
            {rewardTokenAddresses.map((addr, i) => {
              const amount = earnedTokenRewards[i]
              const fiatValue = toFiat(amount, addr)

              const showFiatValue = bnum(amount).gt(0)

              return (
                <div
                  className="rewardItem"
                  key={`gnb:myStaking:walletStaking:${addr}`}
                >
                  <dt>{tokens[addr]?.symbol}</dt>
                  <dd>
                    <CountUp value={amount} plus={showFiatValue} />
                    {showFiatValue && (
                      <span className="parenthesis">
                        <NumberFormat value={fiatValue} type="fiat" abbr />
                      </span>
                    )}
                  </dd>
                </div>
              )
            })}

            {hasRewards && (
              <div className="rewardItem">
                <dt className="a11y">Actions</dt>
                <dd>
                  <Button
                    className="claimButton"
                    onClick={openClaim}
                    $size="sm"
                    $variant="tertiary"
                  >
                    Claim rewards
                  </Button>
                </dd>
              </div>
            )}
          </motion.dl>
        )}
      </AnimatePresence>
    </StyledWalletRewards>
  )
}
