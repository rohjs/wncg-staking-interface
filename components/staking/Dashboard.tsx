import { percentCountUpOption, usdCountUpOption } from 'constants/countUp'
import { useApr, useRewards } from 'hooks'

import { StyledStakingDashboard } from './styled'
import CountUp from 'components/CountUp'
import { useTotalStaked } from 'hooks/contracts'

function StakingDashboard() {
  const { aprs } = useApr()
  // const { bptToFiat } = useFiatCurrency()
  const { rewardTokenSymbols } = useRewards()
  const { data: totalStaked } = useTotalStaked()

  // const fiatValue = useMemo(
  //   () => bptToFiat(totalStaked),
  //   [bptToFiat, totalStaked]
  // )

  return (
    <StyledStakingDashboard>
      <dl className="detailList">
        <div className="detailItem">
          <dt>Total Staked</dt>
          <dd>
            <CountUp
              {...usdCountUpOption}
              end={totalStaked ?? 0}
              showAlways
              decimals={18}
            />
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
