import { FormEvent, MouseEvent, useEffect } from 'react'
import type {
  Control as ReactHookFormControl,
  FieldValues,
} from 'react-hook-form'
import { useAtomValue } from 'jotai'

import { stakingContractAddressAtom } from 'states/staking'
import { ModalCategory } from 'states/ui'
import { configService } from 'services/config'
import { bnum } from 'utils/num'
import {
  useAccount,
  useAllowances,
  useBalances,
  useConnectWallets,
  useModal,
  useNetwork,
  useStaking,
} from 'hooks'
import { useStakeForm } from './useStakeForm'

import { StyledStakingForm } from './styled'
import Button from 'components/Button'
import { AvailableTokenAmount, Control } from 'components/Input'

function StakingForm() {
  const { isConnected } = useAccount()
  const { allowanceFor } = useAllowances()
  const { bptBalance } = useBalances()
  const { connect } = useConnectWallets()
  const { chain } = useNetwork()
  const { addModal } = useModal()
  const { stakedTokenAddress } = useStaking()

  const stakingAddress = useAtomValue(stakingContractAddressAtom)
  const isApproved = allowanceFor(stakedTokenAddress, stakingAddress)

  const {
    clearErrors,
    control,
    disabled,
    resetForm,
    rules,
    setMaxValue,
    submitDisabled,
  } = useStakeForm()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!isConnected) {
      connect()
      return
    }

    const target = e.target as typeof e.target & {
      stakeAmount: { value: string }
    }
    const stakeAmount = bnum(target.stakeAmount.value).toString()

    addModal({
      category: ModalCategory.Stake,
      props: {
        amount: stakeAmount,
        isApproved,
        resetForm,
      },
    })
  }

  function openPool(e: MouseEvent) {
    e.stopPropagation()
  }

  useEffect(() => {
    clearErrors()
  }, [chain, clearErrors, isConnected])

  return (
    <StyledStakingForm onSubmit={handleSubmit}>
      <Control
        id="stakeAmount"
        control={control as unknown as ReactHookFormControl<FieldValues, 'any'>}
        name="stakeAmount"
        rules={rules}
        decimals={8}
        setMaxValue={setMaxValue}
        disabled={disabled}
        placeholder="Enter the number of LP tokens to staking"
        $size="md"
      />
      <AvailableTokenAmount
        label="Your LP Tokens (=Available staking)"
        maxAmount={bptBalance}
      />

      <Button
        className="actionButton"
        type="submit"
        disabled={submitDisabled}
        $size="lg"
      >
        {isConnected ? `Stake` : `Connect Wallet`}
      </Button>

      <footer>
        <Button
          href={`/wncg?pool=${configService.poolId}`}
          onClick={openPool}
          as="/wncg/pool"
          $variant="text"
        >
          Join pool & Get LP Tokens
        </Button>
      </footer>
    </StyledStakingForm>
  )
}

export default StakingForm