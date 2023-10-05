import dynamic from 'next/dynamic'
import { useCallback } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { AnimatePresence, motion } from 'framer-motion'

import { removeLiquidityTxAtom } from 'states/tx'
import { walletErrorHandler } from 'utils/walletErrorHandler'
import { useRemoveLiquidity } from 'hooks/pancakeswap'
import type { UseRemoveLiquidityFormReturns } from 'hooks/pancakeswap/useRemoveLiquidityForm'
import { removeLiquidityErrorAtom } from '../../useWatch'

import { StyledRemoveLiquidityModalPage1Footer } from './styled'
import { Checkout } from 'components/Modals/shared'
import TxButton from 'components/TxButton'
import Signature from './Signature'
import Lottie from 'components/Lottie'

const Timer = dynamic(() => import('./Timer'), {
  ssr: false,
})

type RemoveLiquidityModalPage1FooterProps = {
  send: XstateSend
} & UseRemoveLiquidityFormReturns

export default function RemoveLiquidityPage1Footer(
  props: RemoveLiquidityModalPage1FooterProps
) {
  const [tx, setTx] = useAtom(removeLiquidityTxAtom)
  const setError = useSetAtom(removeLiquidityErrorAtom)

  const {
    send,
    amountsOut,
    amountsOutFiatValueSum,
    isNative,
    lpAmountOut,
    signature,
    submitDisabled,
    pcntOut,
    setValue,
  } = props

  const { removeLiquidity, error } = useRemoveLiquidity(
    amountsOut,
    lpAmountOut,
    isNative,
    signature!
  )

  const onClickRemoveLiquidity = useCallback(async () => {
    try {
      if (error) {
        throw Error(error)
      }

      const txHash = await removeLiquidity?.()
      if (!txHash) throw Error('No txHash')

      setTx({
        hash: txHash,
        amountsOut,
        amountsOutFiatValueSum,
        pcntOut,
        isNative,
        lpAmountOut,
      })

      send('NEXT')
    } catch (error: any) {
      walletErrorHandler(error, () => {
        setError(error)
        send('FAIL')
      })
      send('ROLLBACK')
    }
  }, [
    amountsOut,
    amountsOutFiatValueSum,
    error,
    isNative,
    lpAmountOut,
    pcntOut,
    removeLiquidity,
    send,
    setError,
    setTx,
  ])

  const disabled = !!tx.hash

  return (
    <StyledRemoveLiquidityModalPage1Footer className="modalFooter">
      <Checkout
        message="You can get"
        amount={amountsOutFiatValueSum}
        type="fiat"
      />

      <div className="buttonGroup">
        <Signature
          lpAmountOut={lpAmountOut}
          setValue={setValue}
          signature={signature}
        />

        <Lottie className="progress" animationData="modalProgress" />

        <TxButton
          onClick={onClickRemoveLiquidity}
          disabled={disabled || submitDisabled}
          $short
        >
          Exit pool
        </TxButton>
      </div>
    </StyledRemoveLiquidityModalPage1Footer>
  )
}
