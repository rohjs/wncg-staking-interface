import { useAtom, useSetAtom } from 'jotai'

import { removeLiquidityTxAtom } from 'states/tx'
import { useRemoveLiquidity } from 'hooks/pancakeswap'
import type { UseRemoveLiquidityFormReturns } from 'hooks/pancakeswap/useRemoveLiquidityForm'
import { removeLiquidityErrorAtom } from '../useWatch'

import { StyledRemoveLiquidityModalPage1 } from './styled'
import { CloseButton, PendingNotice } from 'components/Modals/shared'
import SlippageControl from 'components/SlippageControl'
import Footer from './Footer'
import Form from './Form'

type RemoveLiquidityModalPage1Props = {
  send: XstateSend
} & UseRemoveLiquidityFormReturns

function RemoveLiquidityModalPage1({
  send,
  ...props
}: RemoveLiquidityModalPage1Props) {
  const [tx, setTx] = useAtom(removeLiquidityTxAtom)
  const setError = useSetAtom(removeLiquidityErrorAtom)

  const {
    amountsOut,
    amountsOutFiatValueSum,
    isNative,
    lpAmountOut,
    signature,
    pcntOut,
  } = props

  const { removeLiquidity, error } = useRemoveLiquidity(
    amountsOut,
    lpAmountOut,
    isNative,
    signature!
  )

  const disabled = !!tx.hash

  return (
    <StyledRemoveLiquidityModalPage1 $disabled={disabled}>
      <header className="modalHeader">
        <div className="titleGroup">
          <h2 className="subtitle">Exit pool</h2>
        </div>
        <SlippageControl disabled={disabled} />
        <CloseButton />
      </header>

      <div className="container">
        <div className="modalContent">
          <Form {...props} />
        </div>
      </div>

      <Footer {...props} send={send} />

      <PendingNotice hash={tx.hash} />
    </StyledRemoveLiquidityModalPage1>
  )
}

export default RemoveLiquidityModalPage1
