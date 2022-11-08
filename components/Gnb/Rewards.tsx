import { countUpOption, usdCountUpOption } from 'constants/countUp'
import { useRewards } from 'hooks'

import CountUp from 'components/CountUp'
import SvgIcon from 'components/SvgIcon'

function GnbClaimRewards() {
  const { rewards, rewardTokenSymbols, rewardsInFiatValue } = useRewards()

  return (
    <>
      {rewardTokenSymbols.map((symbol, i) => {
        return (
          <div className="reward" key={`gnb:claim:${symbol}`}>
            <strong className="amount">
              <CountUp {...countUpOption} end={rewards[i]} prefix="+" />
            </strong>
            <strong className="usd">
              <SvgIcon icon="approximate" />
              (
              <CountUp {...usdCountUpOption} end={rewardsInFiatValue[i]} />)
            </strong>
            <span className="symbol">{symbol}</span>
          </div>
        )
      })}
    </>
  )
}

export default GnbClaimRewards
