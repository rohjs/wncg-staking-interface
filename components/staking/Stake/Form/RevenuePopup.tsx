import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { add } from 'date-fns'

import { priceMapAtom } from 'states/system'
import { APR_SPAN_LIST } from 'config/misc'
import { bnum } from 'utils/bnum'
import { calcApr } from 'utils/calcApr'
import {
  ExpectedRevenueMap,
  calcExpectedRevenue,
} from 'utils/calcExpectedRevenue'
import { format } from 'utils/format'
import { formatISO } from 'utils/formatISO'
import { useFiat, useStaking } from 'hooks'
import { useFetchStaking } from 'hooks/queries'

import { StyledStakeFormRevenuePopup } from './styled'
import CountUp from 'components/CountUp'
import Icon from 'components/Icon'
import TokenIcon from 'components/TokenIcon'

type StakeFormRevenueProps = {
  amount: string
  className?: string
}

export default function StakeFormRevenuePopup({
  amount,
  className,
}: StakeFormRevenueProps) {
  const toFiat = useFiat()
  const { rewardEmissions, rewardTokenAddresses, stakedTokenAddress } =
    useStaking()

  const priceMap = useAtomValue(priceMapAtom)
  const stakedTokenPrice = priceMap[stakedTokenAddress] ?? '0'
  const { totalStaked = '0' } = useFetchStaking().data ?? {}

  const expectedTotalStakedValue = toFiat(
    bnum(totalStaked).plus(bnum(amount).toString()).toString(),
    stakedTokenAddress
  )

  const aprs = useMemo(
    () =>
      rewardEmissions.map(
        (e, i) =>
          calcApr(
            e,
            priceMap[rewardTokenAddresses[i]],
            expectedTotalStakedValue
          ) ?? 0
      ),
    [expectedTotalStakedValue, priceMap, rewardEmissions, rewardTokenAddresses]
  )

  const revenueMapList = useMemo(() => {
    const list = rewardTokenAddresses.map((addr, i) => {
      const tokenPrice = priceMap[addr] ?? '0'
      return calcExpectedRevenue(amount, aprs[i], stakedTokenPrice, tokenPrice)
    })

    return APR_SPAN_LIST.map((key) => {
      const revenues = list.map((data) => data[key as keyof ExpectedRevenueMap])
      return [key, revenues]
    })
  }, [amount, aprs, priceMap, rewardTokenAddresses, stakedTokenPrice])

  return (
    <StyledStakeFormRevenuePopup className={className}>
      <header className="header">
        <Icon icon="time" />
        <h3 className="title">Estimated earnings</h3>
      </header>

      <div className="content">
        <dl className="revenueList">
          {revenueMapList.map(([span, amounts]) => {
            const timestamp =
              add(Date.now(), {
                days: span === 'day' ? 1 : 0,
                weeks: span === 'week' ? 1 : 0,
                months: span === 'month' ? 1 : 0,
                years: span === 'year' ? 1 : 0,
              }).getTime() / 1_000

            return (
              <div className="revenueItem" key={`revenueMap:${span}`}>
                <dt>
                  In a {span}
                  <time dateTime={formatISO(timestamp)}>
                    {format(timestamp, { dateOnly: true })}
                  </time>
                </dt>

                <dd>
                  {(amounts as string[]).map((amt, i) => {
                    const addr = rewardTokenAddresses[i]

                    return (
                      <div
                        className="revenueGroup"
                        key={`revenuePopup:${span}:${addr}`}
                      >
                        <div className="token">
                          <TokenIcon address={addr} $size={16} />
                          <CountUp value={amt} />
                        </div>

                        <CountUp
                          className="fiatValue"
                          value={toFiat(amt, rewardTokenAddresses[i])}
                          type="fiat"
                        />
                      </div>
                    )
                  })}
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </StyledStakeFormRevenuePopup>
  )
}
