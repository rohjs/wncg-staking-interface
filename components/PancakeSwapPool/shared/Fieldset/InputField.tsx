import { memo, useCallback, useMemo } from 'react'
import { Control as ReactHookFormControl, FieldValues } from 'react-hook-form'
import clsx from 'clsx'

import { useAuth, useChain, useFiat } from 'hooks'
import { LiquidityFieldType } from 'config/constants'
import { bnum } from 'utils/bnum'
import { wait } from 'utils/wait'
import { useAddLiquidityMath } from 'hooks/pancakeswap'
import {
  FIELDS,
  UseAddLiquidityFormReturns,
} from 'hooks/pancakeswap/useAddLiquidityForm'

import { StyledAddLiquidityFormInputField } from './styled'
import { AvailableBalance, Control } from 'components/Form'
import Notice from './Notice'
import EtherSelect from './EtherSelect'

type AddLiquidityFormInputFieldProps = {
  index: number
  token: TokenInfo
  name: 'TokenA' | 'TokenB'
  value: string
  className?: string
} & UseAddLiquidityFormReturns

function AddLiquidityFormInputField({
  index,
  isNative,
  activeField,
  className,
  optimizeDisabled,
  control,
  focusedElement,
  formState,
  maxBalances,
  maxSafeBalances,
  name,
  resetFields,
  setActiveField,
  setFocusedElement,
  setValue,
  token,
  trigger,
  value,
  watch,
}: AddLiquidityFormInputFieldProps) {
  const { isConnected } = useAuth()
  const { nativeCurrency } = useChain()
  const toFiat = useFiat()
  const { calcPropAmountIn } = useAddLiquidityMath()

  const { address, decimals, symbol } = token

  const id = useMemo(() => `addLiquidityForm:InputField:${address}`, [address])
  const availableBalanceLabel = useMemo(
    () => `${symbol} in my wallet`,
    [symbol]
  )

  const subjectFieldName = FIELDS[1 - index]

  const maxBalance = maxBalances[index]
  const maxSafeBalance = maxSafeBalances[index]

  const maxBalanceFiatValue = useMemo(
    () => toFiat(maxBalance, address),
    [address, maxBalance, toFiat]
  )

  const rules = useMemo(
    () => ({
      validate: {
        maxAmount: (v: string) => {
          if (bnum(v).lte(maxBalance)) return true
          return activeField === name
            ? `Exceeds wallet balance`
            : `Not enough ${symbol} to match the pool ratio`
        },
      },
      async onChange(event: ReactHookFormChangeEvent<LiquidityFieldType>) {
        setFocusedElement('Input')

        if (activeField !== name) setActiveField(name)

        if (event.target.value === '') {
          resetFields()
          return
        }

        const bNewAmount = bnum(event.target.value)
        if (bNewAmount.isNaN()) return

        const subjectAmount = await calcPropAmountIn(
          bNewAmount.toString(),
          index
        )

        setValue(subjectFieldName, subjectAmount!)

        await wait(50)
        trigger(subjectFieldName)
      },
    }),
    [
      activeField,
      calcPropAmountIn,
      index,
      maxBalance,
      name,
      resetFields,
      setActiveField,
      setFocusedElement,
      setValue,
      subjectFieldName,
      symbol,
      trigger,
    ]
  )

  const setMaxValue = useCallback(async () => {
    const subjectAmount = await calcPropAmountIn(
      bnum(maxSafeBalance).toString(),
      index
    )

    setActiveField(name)
    setFocusedElement('Max')
    setValue(name, maxSafeBalance)
    setValue(subjectFieldName, bnum(subjectAmount).toString()!)
    trigger()
  }, [
    calcPropAmountIn,
    index,
    maxSafeBalance,
    name,
    setActiveField,
    setFocusedElement,
    setValue,
    subjectFieldName,
    trigger,
  ])

  const isEther = [
    nativeCurrency.wrappedTokenAddress,
    nativeCurrency.address,
  ].includes(address)

  const disabled = !isConnected

  const showMisc =
    activeField &&
    activeField !== name &&
    ((focusedElement === 'Input' && bnum(watch(name)).gt(0)) ||
      focusedElement === 'Max')

  return (
    <StyledAddLiquidityFormInputField
      className={className}
      layoutRoot
      $disabled={disabled}
    >
      <div className="labelGroup">
        {isEther ? (
          <>
            <EtherSelect
              name={FIELDS[index]}
              isNative={isNative}
              setFocusedElement={setFocusedElement}
              setValue={setValue}
              trigger={trigger}
            />
            <span
              className={clsx('misc parenthesis', {
                active: showMisc,
              })}
            >
              updated to match the pool ratio
            </span>
          </>
        ) : (
          <label className="label" htmlFor={id}>
            {symbol}

            <span
              className={clsx('misc parenthesis', {
                active: showMisc,
              })}
            >
              updated to match the pool ratio
            </span>
          </label>
        )}

        <span className="weight parenthesis">50%</span>
      </div>

      <Control<'number'>
        id={id}
        address={token.address}
        control={control as unknown as ReactHookFormControl<FieldValues>}
        name={name}
        rules={rules}
        maxAmount={maxBalance}
        decimals={decimals}
        setMaxValue={setMaxValue}
        placeholder="0.0"
        showFiatValue
        $size="sm"
        disabled={disabled}
      />

      <AvailableBalance
        layout
        label={availableBalanceLabel}
        maxAmount={maxBalance}
        fiatValue={maxBalanceFiatValue}
      />

      {isNative && isEther && (
        <Notice
          activeField={activeField}
          currentField={name}
          formState={formState}
          focusedElement={focusedElement}
          amountIn={value}
          optimizeDisabled={optimizeDisabled}
        />
      )}
    </StyledAddLiquidityFormInputField>
  )
}

export default memo(AddLiquidityFormInputField)
