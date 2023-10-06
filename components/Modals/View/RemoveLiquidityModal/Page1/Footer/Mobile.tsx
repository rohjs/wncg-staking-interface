import { useMemo } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import dynamic from 'next/dynamic'

import type { RemoveLiquidityForm } from 'hooks/pancakeswap/useRemoveLiquidityForm'

import TxButton from 'components/TxButton'
import Signature from './Signature'

const Timer = dynamic(() => import('./Timer'), {
  ssr: false,
})

type RemoveLiquidityModalPage1FooterMobileProps = {
  onRemoveLiquidity(): Promise<void>
  disabled: boolean
  submitDisabled: boolean
  lpAmountOut: string
  setValue: UseFormSetValue<RemoveLiquidityForm>
  signature?: Signature
}

export default function RemoveLiquidityModalPage1FooterMobile({
  onRemoveLiquidity,
  disabled,
  submitDisabled,
  lpAmountOut,
  setValue,
  signature,
}: RemoveLiquidityModalPage1FooterMobileProps) {
  const elem = useMemo(
    () =>
      signature ? (
        <TxButton
          onClick={onRemoveLiquidity}
          disabled={disabled || submitDisabled}
        >
          Exit pool
        </TxButton>
      ) : (
        <Signature
          lpAmountOut={lpAmountOut}
          setValue={setValue}
          signature={signature}
        />
      ),
    [
      disabled,
      lpAmountOut,
      onRemoveLiquidity,
      setValue,
      signature,
      submitDisabled,
    ]
  )

  return (
    <>
      {elem}
      <Timer
        setValue={setValue}
        deadline={signature?.deadline}
        disabled={disabled}
      />
    </>
  )
}
