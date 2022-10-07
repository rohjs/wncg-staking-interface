import type { Control, RegisterOptions } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import clsx from 'clsx'
import styles from './styles/InputGroup.module.scss'

import { bnum } from 'utils/num'
import { useAccount, usePool } from 'hooks'

import { Input } from 'components/Input'
import { TokenIcon } from 'components/TokenIcon'

type InputGroupProps = {
  control: Control
  label: string
  maxAmount: string
  name: string
  rules: Partial<RegisterOptions>
  setMaxValue(): void
  disabled?: boolean
}

export function InputGroup({
  control,
  label,
  maxAmount,
  name,
  rules,
  setMaxValue,
  disabled,
}: InputGroupProps) {
  const { isConnected } = useAccount()
  const { poolTokenSymbols } = usePool()

  const isMaxAmountZero = bnum(maxAmount).isZero()

  return (
    <div className={styles.inputGroup}>
      <Input
        name={name}
        control={control}
        rules={rules}
        setMaxValue={setMaxValue}
        placeholder="0.0"
        disabled={disabled}
        maxButtonDisabled={isMaxAmountZero}
      />

      <div
        className={clsx(styles.balanceGroup, { [styles.disabled]: disabled })}
      >
        {poolTokenSymbols.map((symbol) => (
          <TokenIcon
            key={`inputGroup.${symbol}`}
            className={styles.token}
            symbol={symbol}
          />
        ))}
        <strong>{label}</strong>

        {isConnected ? (
          <NumericFormat
            className={styles.balance}
            decimalScale={8}
            displayType="text"
            valueIsNumericString
            thousandSeparator={true}
            value={maxAmount}
          />
        ) : (
          <span className={styles.balance}>-</span>
        )}
      </div>
    </div>
  )
}
