import { useAtomValue } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { isHarvestableAtom } from 'states/system'
import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { bnum } from 'utils/bnum'
import { useChain, useFiat, useHarvest, useStaking } from 'hooks'
import { useFetchStaking } from 'hooks/queries'

import { StyledStakingDashboardHarvest } from './styled'
import Button from 'components/Button'
import CountUp from 'components/CountUp'
import Icon from 'components/Icon'
import Tooltip from 'components/Tooltip'
import { BAL_ADDRESS } from 'config/constants/addresses'

type StakingDashboardHarvestProps = {
  show: boolean
  closeTooltip(): void
}

export default function StakingDashboardHarvest({
  show,
  closeTooltip,
}: StakingDashboardHarvestProps) {
  const { chainId } = useChain()
  const toFiat = useFiat()
  const { earmarkIncentivePcnt } = useStaking<'ethereum'>()

  // FIXME: 수정
  // const { claimableTokens = '0' } =
  //   useFetchStaking({
  //     refetchInterval: 10 * 1_000,
  //     refetchOnWindowFocus: 'always',
  //   }).data ?? {}
  const claimableTokens = '0'
  const harvest = useHarvest()

  const isHarvestable = useAtomValue(isHarvestableAtom)

  if (!isHarvestable) return null

  const harvestRewardAmount = bnum(claimableTokens)
    .times(earmarkIncentivePcnt)
    .toString()
  const harvestRewardInFiatValue = toFiat(
    harvestRewardAmount,
    BAL_ADDRESS[chainId] as Hash
  )

  return (
    <AnimatePresence>
      {show && (
        <StyledStakingDashboardHarvest
          {...EXIT_MOTION}
          variants={ANIMATION_MAP.fadeIn}
        >
          <Tooltip
            as="div"
            className="harvestTooltip"
            $direction="top"
            $align="center"
            $gap={20}
            $width={540}
            $float
          >
            <header className="tooltipHeader">
              <h4 className="title">
                BAL rewards have temporarily stopped streaming. Please execute
                harvest to resume the reward streaming.
              </h4>

              <button
                className="closeButton"
                type="button"
                onClick={closeTooltip}
              >
                <Icon icon="close" $size={24} />
              </button>
            </header>

            <footer className="tooltipFooter">
              <p className="desc">
                Get <CountUp value={harvestRewardAmount} symbol="BAL" />
                <span className="parenthesis">
                  <CountUp value={harvestRewardInFiatValue} type="fiat" />
                </span>{' '}
                as the harvest reward!
              </p>

              {harvest && (
                <Button
                  className="harvestButton"
                  onClick={harvest}
                  $variant="tertiary"
                  $size="sm"
                  $contain
                >
                  Harvest
                </Button>
              )}
            </footer>
          </Tooltip>
        </StyledStakingDashboardHarvest>
      )}
    </AnimatePresence>
  )
}
