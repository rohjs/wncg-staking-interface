import { memo, useMemo } from 'react'
import NumberFormat from 'react-number-format'
import { useQuery } from 'react-query'
import styles from './styles/Widget.module.scss'

import { getBptBalance } from 'app/states/balance'
import CalculatorService from 'services/calculator'
import { poolService } from 'services/pool'
import Decimal from 'utils/num'
import { useAppSelector, useUsd } from 'hooks'

function MyBalance() {
  const { calculateUsdValue } = useUsd()
  const { data: pool } = useQuery('pool', poolService.fetchPool, {
    keepPreviousData: true,
    staleTime: 5 * 1_000,
  })
  const poolTokens = pool?.tokens || []

  const bptBalance = useAppSelector(getBptBalance)

  const calculator = useMemo(() => {
    if (!pool) return null
    return new CalculatorService(pool, bptBalance, 'exit')
  }, [bptBalance, pool])

  const propAmounts = useMemo(
    () =>
      calculator?.propAmountsGiven(bptBalance, 0, 'send').receive || ['0', '0'],
    [bptBalance, calculator]
  )

  const totalValue = useMemo(
    () =>
      propAmounts.reduce((acc, amount, i) => {
        const symb = i === 0 ? 'wncg' : 'weth'
        return acc + calculateUsdValue(symb, amount)
      }, 0),
    [calculateUsdValue, propAmounts]
  )

  return (
    <section className={styles.myBalance}>
      <h3 className={styles.title}>My Pool Balance</h3>
      <dl className={styles.details}>
        {poolTokens.map((token, i) => {
          const symbol = token.symbol.toLowerCase()
          const amount = propAmounts[i]
          const amountUsdValue = calculateUsdValue(symbol, amount)

          const tokenAmount = new Decimal(amount)
          const isAmountLessThanMinAmount =
            !tokenAmount.isZero() && tokenAmount.lt(0.0001)

          return (
            <div
              className={styles.detailItem}
              key={`poolBalance-${token.symbol}`}
            >
              <dt>
                <strong>{symbol}</strong>
                <span>{token.name}</span>
              </dt>
              <dd>
                {isAmountLessThanMinAmount ? (
                  '< 0.0001'
                ) : (
                  <NumberFormat
                    value={amount}
                    displayType="text"
                    thousandSeparator
                    decimalScale={4}
                  />
                )}
                <NumberFormat
                  className={styles.usd}
                  value={amountUsdValue}
                  displayType="text"
                  thousandSeparator
                  decimalScale={2}
                  prefix="$"
                />
              </dd>
            </div>
          )
        })}

        <div className={styles.total}>
          <dt>Total</dt>
          <dd>
            <NumberFormat
              value={totalValue}
              displayType="text"
              thousandSeparator
              decimalScale={2}
              prefix="$"
            />
          </dd>
        </div>
      </dl>
    </section>
  )
}

export default memo(MyBalance)
