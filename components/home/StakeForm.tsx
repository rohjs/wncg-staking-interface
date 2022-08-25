import { memo, useMemo } from 'react'
import { Control, FieldValues, useForm } from 'react-hook-form'
import { useRecoilValue } from 'recoil'
import { motion } from 'framer-motion'
import styles from './styles/StakeForm.module.scss'

import { getBptBalance } from 'app/states/balance'
import { networkMismatchState } from 'app/states/network'
import { gaEvent } from 'lib/gtag'
import Decimal, { sanitizeNumber } from 'utils/num'
import { useAppSelector } from 'hooks'
import { formTransition, motionVariants, TabId, TabPanelId } from './constants'

import { EstimatedEarn } from './EstimatedEarn'
import { InputGroup } from './InputGroup'
import { StakeSubmit } from './StakeSubmit'

const minAmount = 1e-18

function StakeForm() {
  const networkMismatch = useRecoilValue(networkMismatchState)
  const bptBalance = useAppSelector(getBptBalance)
  const { clearErrors, control, formState, setValue, watch } = useForm<{
    stakeAmount: string
  }>({
    mode: 'onBlur',
  })
  const stakeAmountValue = watch('stakeAmount')
  const disabled =
    networkMismatch ||
    Object.keys(formState.errors).length > 0 ||
    new Decimal(sanitizeNumber(stakeAmountValue)).isZero()

  const rules = useMemo(
    () => ({
      required: 'Please enter valid amount',
      validate: {
        maxAmount: (v: string) =>
          new Decimal(sanitizeNumber(v)).lte(bptBalance) ||
          'You don’t have enough balance',
        minAmount: (v: string) =>
          new Decimal(sanitizeNumber(v)).gte(minAmount) ||
          'Please enter the amount bigger than or equal to 1e-18',
      },
      onChange: () => {
        clearErrors('stakeAmount')
      },
    }),
    [bptBalance, clearErrors]
  )

  function setMaxValue() {
    setValue('stakeAmount', bptBalance)
    clearErrors('stakeAmount')
    gaEvent({
      name: 'stake_max',
    })
  }

  function clearInput() {
    setValue('stakeAmount', '')
  }

  return (
    <motion.section
      className={styles.stakeForm}
      id={TabPanelId.Stake}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={formTransition}
      variants={motionVariants}
      aria-labelledby={TabId.Stake}
      role="tabpanel"
    >
      <h1 className="hidden">Stake</h1>

      <InputGroup
        name="stakeAmount"
        control={control as any as Control<FieldValues, 'any'>}
        label="20WETH-80WNCG"
        maxAmount={bptBalance}
        rules={rules}
        setMaxValue={setMaxValue}
      />
      <EstimatedEarn amount={stakeAmountValue} />
      <StakeSubmit
        amount={stakeAmountValue}
        clearInput={clearInput}
        disabled={disabled}
      />
    </motion.section>
  )
}

const MemoizedStakeForm = memo(StakeForm)
export { MemoizedStakeForm as StakeForm }
