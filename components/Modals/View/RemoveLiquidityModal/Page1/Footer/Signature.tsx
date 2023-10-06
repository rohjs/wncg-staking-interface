import { useCallback } from 'react'
import type { UseFormSetValue } from 'react-hook-form'
import dynamic from 'next/dynamic'
import { useAtomValue } from 'jotai'

import { removeLiquidityTxAtom } from 'states/tx'
import { RemoveLiquidityField } from 'config/constants'
import { bnum } from 'utils/bnum'
import { walletErrorHandler } from 'utils/walletErrorHandler'
import { useResponsive } from 'hooks'
import { useSignature } from 'hooks/pancakeswap'
import type { RemoveLiquidityForm } from 'hooks/pancakeswap/useRemoveLiquidityForm'

import { StyledRemoveLiquidityModalPage1FooterSignature } from './styled'
import Button from 'components/Button'

const Timer = dynamic(() => import('./Timer'), {
  ssr: false,
})

type RemoveLiquidityModalPage1FooterSignatureProps = {
  lpAmountOut: string
  setValue: UseFormSetValue<RemoveLiquidityForm>
  signature?: Signature
}

export default function RemoveLiquidityModalPage1FooterSignature({
  lpAmountOut,
  setValue,
  signature,
}: RemoveLiquidityModalPage1FooterSignatureProps) {
  const { isPortable } = useResponsive()
  const sign = useSignature()

  const tx = useAtomValue(removeLiquidityTxAtom)

  const onClickSign = useCallback(async () => {
    try {
      const sig = await sign(lpAmountOut)
      if (sig) {
        setValue(RemoveLiquidityField.Signature, sig)
      }
    } catch (error: any) {
      walletErrorHandler(error)
    }
  }, [sign, lpAmountOut, setValue])

  const removeLiquidityDisabled = bnum(lpAmountOut).isZero()
  const disabled = !!signature || !!tx.hash

  return (
    <StyledRemoveLiquidityModalPage1FooterSignature className="signatureButton">
      <Button
        className="signButton"
        onClick={onClickSign}
        disabled={disabled || removeLiquidityDisabled}
        $size="md"
      >
        <span className="count">2</span>
        <span className="label">{disabled ? 'Signed' : 'Sign'}</span>
      </Button>

      {!isPortable && (
        <Timer
          disabled={!!tx.hash}
          deadline={signature?.deadline}
          setValue={setValue}
        />
      )}
    </StyledRemoveLiquidityModalPage1FooterSignature>
  )
}
