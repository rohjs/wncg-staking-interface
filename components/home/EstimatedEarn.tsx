import {
  memo,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useIsomorphicLayoutEffect } from 'react-use'
import store from 'store'
import clsx from 'clsx'
import styles from './styles/EstimatedEarn.module.scss'

import STORAGE_KEYS from 'constants/storageKeys'
import { configService } from 'services/config'
import { gaEvent } from 'lib/gtag'
import { countUpOption, usdCountUpOption } from 'utils/countUp'
import { getTokenSymbol } from 'utils/token'
import { useFiatCurrency } from 'hooks'
import { useEstimation } from './useEstimation'

import { CountUp } from 'components/CountUp'
import { TokenIcon } from 'components/TokenIcon'

type EstimatedEarnProps = {
  amount?: string
}

function EstimatedEarn({ amount = '' }: EstimatedEarnProps) {
  const [option, setOption] = useState('year')
  const [estimation, setEstimation] = useState([0, 0])

  const { calcEstimatedRevenue } = useEstimation()
  const { toFiat } = useFiatCurrency()

  const updateEstimation = useCallback(() => {
    const expectedRevenues = calcEstimatedRevenue(amount, option)
    if (expectedRevenues.every((value, i) => value === estimation[i])) return
    setEstimation(expectedRevenues)
  }, [amount, estimation, calcEstimatedRevenue, option])

  function handleOption(e: MouseEvent<HTMLButtonElement>) {
    const newOption = e.currentTarget.value
    setOption(newOption)
    store.set(STORAGE_KEYS.UserSettings.EstimatedEarnOption, newOption)
    gaEvent({
      name: 'estimated_earn_period',
      params: {
        period: newOption,
      },
    })
  }

  const optionsClassName = useMemo(
    () =>
      clsx(styles.options, {
        [styles.day]: option === 'day',
        [styles.week]: option === 'week',
        [styles.month]: option === 'month',
        [styles.year]: option === 'year',
      }),
    [option]
  )

  useIsomorphicLayoutEffect(() => {
    const initialOption = store.get(
      STORAGE_KEYS.UserSettings.EstimatedEarnOption
    )
    if (initialOption && initialOption !== option) {
      setOption(initialOption)
    }
  }, [option])

  useEffect(() => {
    updateEstimation()
  }, [updateEstimation])

  return (
    <div className={styles.estimatedEarn}>
      <header className={styles.header}>
        <h2 className={styles.title}>Estimated Earn</h2>

        <div className={optionsClassName}>
          <button
            className={styles.day}
            type="button"
            value="day"
            onClick={handleOption}
            aria-label="per day"
          >
            1d
          </button>
          <button
            className={styles.week}
            type="button"
            value="week"
            onClick={handleOption}
            aria-label="per week"
          >
            1w
          </button>
          <button
            className={styles.month}
            type="button"
            value="month"
            onClick={handleOption}
            aria-label="per month"
          >
            1m
          </button>
          <button
            className={styles.year}
            type="button"
            value="year"
            onClick={handleOption}
            aria-label="per year"
          >
            1y
          </button>
        </div>
      </header>

      <p className={styles.desc}>
        Expected rewards in case the current APR persists for the selected time
        period. APR can fluctuate with several factors including staking pool
        size and token price.
      </p>

      <dl className={styles.detail}>
        {configService.rewardTokensList.map((address, i) => {
          const amount = estimation[i]

          return (
            <div key={`estimation.${address}`} className={styles.detailItem}>
              <dt>
                <TokenIcon
                  className={styles.token}
                  symbol={getTokenSymbol(address)}
                />
                <strong>{getTokenSymbol(address)}</strong>
              </dt>
              <dd>
                <CountUp
                  {...countUpOption}
                  end={amount}
                  decimals={8}
                  duration={0.5}
                  showAlways
                />
                <CountUp
                  {...usdCountUpOption}
                  className={styles.usd}
                  end={toFiat(configService.rewardTokensList[i], amount)}
                  isApproximate
                  showAlways
                />
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}

const MemoizedEstimatedEarn = memo(EstimatedEarn)
export { MemoizedEstimatedEarn as EstimatedEarn }
