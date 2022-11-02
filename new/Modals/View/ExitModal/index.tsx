import { memo, useRef, useState } from 'react'
import { useUnmount } from 'react-use'
import { useMachine } from '@xstate/react'
import { useAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import { useWaitForTransaction } from 'wagmi'
import type { TransactionReceipt } from '@ethersproject/abstract-provider'

import { pendingExitTxAtom } from 'states/form'
import { createLogger } from 'utils/log'
import { networkChainId } from 'utils/network'
import { currentPage, exitMachine } from './stateMachine'
import { parseExitLogs } from './utils'
import { useExitForm } from './useExitForm'

import Page1 from './Page1'
import Page2 from './Page2'

const log = createLogger('black')

function ExitModal() {
  const [result, setResult] = useState<Record<string, string>>({})

  const formReturns = useExitForm()

  const [pendingTx, setPendingTx] = useAtom(pendingExitTxAtom)
  const { hash: pendingHash } = pendingTx

  const hash = pendingHash ?? undefined

  const stateMachine = useRef(exitMachine)
  const [state, send] = useMachine(stateMachine.current, {
    context: {
      hash,
    },
  })

  useWaitForTransaction({
    hash: hash!,
    enabled: !!hash,
    chainId: networkChainId,
    onSettled() {
      log(`Exit tx: ${hash?.slice(0, 6)}`)
    },
    async onSuccess(data: TransactionReceipt) {
      const result = parseExitLogs(data.logs)
      setResult(result)
      send('SUCCESS')
    },
    onError() {
      send('FAIL')
    },
  })

  const page = currentPage(state.value)

  useUnmount(() => {
    if (!!state.done) {
      setPendingTx(RESET)
    }
  })

  return (
    <>
      <Page1
        {...formReturns}
        currentPage={page}
        currentState={state.value}
        hash={hash}
        send={send}
      />
      <Page2 currentPage={page} currentState={state.value} result={result} />
    </>
  )
}

export default memo(ExitModal)
