import { UseFormSetValue } from 'react-hook-form'
import type { RemoveLiquidityForm } from 'hooks/pancakeswap/useRemoveLiquidityForm'

import Lottie from 'components/Lottie'
import TxButton from 'components/TxButton'
import Signature from './Signature'

type RemoveLiquidityModalPage1FooterDesktopProps = {
  onRemoveLiquidity(): Promise<void>
  disabled: boolean
  submitDisabled: boolean
  lpAmountOut: string
  setValue: UseFormSetValue<RemoveLiquidityForm>
  signature?: Signature
}

export default function RemoveLiquidityModalPage1FooterDesktop({
  onRemoveLiquidity,
  disabled,
  submitDisabled,
  lpAmountOut,
  setValue,
  signature,
}: RemoveLiquidityModalPage1FooterDesktopProps) {
  return (
    <div className="buttonGroup">
      <Signature
        lpAmountOut={lpAmountOut}
        setValue={setValue}
        signature={signature}
      />

      <Lottie className="progress" animationData="modalProgress" />

      <TxButton
        onClick={onRemoveLiquidity}
        disabled={disabled || submitDisabled}
        $short
      >
        Exit pool
      </TxButton>
    </div>
  )
}
