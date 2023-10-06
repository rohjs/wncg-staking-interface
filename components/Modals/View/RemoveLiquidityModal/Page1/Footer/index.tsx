import { useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'

import { slippageAtom } from 'states/system'
import { removeLiquidityTxAtom } from 'states/tx'
import { RemoveLiquidityField } from 'config/constants'
import { walletErrorHandler } from 'utils/walletErrorHandler'
import { useResponsive } from 'hooks'
import { useRemoveLiquidity } from 'hooks/pancakeswap'
import type { UseRemoveLiquidityFormReturns } from 'hooks/pancakeswap/useRemoveLiquidityForm'
import { removeLiquidityErrorAtom } from '../../useWatch'

import { StyledRemoveLiquidityModalPage1Footer } from './styled'
import { Checkout } from 'components/Modals/shared'

const Desktop = dynamic(() => import('./Desktop'), { ssr: false })
const Mobile = dynamic(() => import('./Mobile'), { ssr: false })

type RemoveLiquidityModalPage1FooterProps = {
  send: XstateSend
} & UseRemoveLiquidityFormReturns

export default function RemoveLiquidityPage1Footer(
  props: RemoveLiquidityModalPage1FooterProps
) {
  const { isPortable } = useResponsive()

  const [tx, setTx] = useAtom(removeLiquidityTxAtom)
  const setError = useSetAtom(removeLiquidityErrorAtom)
  const slippage = useAtomValue(slippageAtom) ?? '0.5'

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

  const childrenProps = {
    disabled,
    onRemoveLiquidity: onClickRemoveLiquidity,
    lpAmountOut,
    setValue,
    signature,
    submitDisabled,
  }

  useEffect(() => {
    setValue(RemoveLiquidityField.Signature, undefined)
  }, [setValue, pcntOut, slippage])

  return (
    <StyledRemoveLiquidityModalPage1Footer className="modalFooter">
      <Checkout
        message="You can get"
        amount={amountsOutFiatValueSum}
        type="fiat"
      />

      {isPortable ? (
        <Mobile {...childrenProps} />
      ) : (
        <Desktop {...childrenProps} />
      )}
    </StyledRemoveLiquidityModalPage1Footer>
  )
}
