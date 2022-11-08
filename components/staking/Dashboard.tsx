import { Suspense, useMemo } from 'react'
import dynamic from 'next/dynamic'

import { percentCountUpOption, usdCountUpOption } from 'constants/countUp'
import { useTotalStaked } from 'hooks/contracts'

import { StyledStakingDashboard } from './styled'
import CountUp from 'components/CountUp'
import Loading from 'components/Loading'
import { useFiatCurrency, usePrices, useStaking } from 'hooks'
import { calcApr } from 'utils/calculator'

function StakingDashboard() {
  const { bptToFiat } = useFiatCurrency()
  const { priceFor } = usePrices()
  const { data: totalStaked, status } = useTotalStaked()
  const { emissions, rewardTokensList, status: stakingStatus } = useStaking()

  const aprs = useMemo(() => {
    const totalValue = bptToFiat(totalStaked)
    return emissions.map((emission, i) =>
      calcApr(emission, priceFor(rewardTokensList[i]), totalValue)
    )
  }, [bptToFiat, emissions, priceFor, rewardTokensList, totalStaked])

  console.log(6666, status, aprs, stakingStatus)

  // const { aprs } = useApr()
  // const { bptToFiat } = useFiatCurrency()
  // const { rewardTokenSymbols } = useStaking()

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
            <Suspense fallback={<Loading>TOTAL STAKED...</Loading>}>
              <CountUp
                {...usdCountUpOption}
                end={totalStaked}
                showAlways
                decimals={18}
              />
            </Suspense>
          </dd>
        </div>

        {/* <Suspense fallback={<Loading>APRS...</Loading>}>
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
        </Suspense> */}
      </dl>
    </StyledStakingDashboard>
  )
}

export default StakingDashboard
