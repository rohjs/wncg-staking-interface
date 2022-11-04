import { useMemo } from 'react'
import { useAtomValue } from 'jotai'

import { totalStakedAtom } from 'states/staking'
import { percentCountUpOption, usdCountUpOption } from 'constants/countUp'
import { useApr, useFiatCurrency, useRewards } from 'hooks'

import { StyledStakingDashboard } from './styled'
import CountUp from 'components/CountUp'

function StakingDashboard() {
  const { aprs } = useApr()
  const { bptToFiat } = useFiatCurrency()
  const { rewardTokenSymbols } = useRewards()

  const totalStaked = useAtomValue(totalStakedAtom)
  const fiatValue = useMemo(
    () => bptToFiat(totalStaked),
    [bptToFiat, totalStaked]
  )

  return (
    <StyledStakingDashboard>
      <dl className="detailList">
        <div className="detailItem">
          <dt>Total Staked</dt>
          <dd>
            <CountUp {...usdCountUpOption} end={fiatValue} showAlways />
          </dd>
        </div>

        {rewardTokenSymbols.map((symbol, i) => {
          return (
            <div className="detailItem" key={`rewardApr.${symbol}`}>
              <dt>{symbol} APR</dt>
              <dd>
                <CountUp {...percentCountUpOption} end={aprs[i]} showAlways />
              </dd>
            </div>
          )
        })}
      </dl>
    </StyledStakingDashboard>
  )
}

export default StakingDashboard
