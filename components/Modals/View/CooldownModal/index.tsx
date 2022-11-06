import { useEffect, useMemo, useRef } from 'react'
import { useUnmount } from 'react-use'
import { useMachine } from '@xstate/react'
import { useAtom, useAtomValue } from 'jotai'
import { RESET } from 'jotai/utils'
import { useWaitForTransaction } from 'wagmi'

import { pendingCooldownTxAtom } from 'states/form'
import { timestampsAtom, unstakePhaseAtom } from 'states/user'
import { UnstakePhase } from 'constants/types'
import { createLogger } from 'utils/log'
import { networkChainId } from 'utils/network'
import { cooldownMachine, currentPage } from './stateMachine'

import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'

const log = createLogger('black')

function CooldownModal() {
  const [cooldownEndsAt] = useAtomValue(timestampsAtom)
  const unstakePhase = useAtomValue(unstakePhaseAtom)
  const isUnstakeWindow = unstakePhase !== UnstakePhase.Idle

  const [pendingTx, setPendingTx] = useAtom(pendingCooldownTxAtom)
  const { hash: pendingHash } = pendingTx

  const hash = pendingHash ?? undefined

  const stateMachine = useRef(cooldownMachine)
  const [state, send] = useMachine(stateMachine.current, {
    context: {
      cooldownEndsAt,
      hash,
    },
  })

  useWaitForTransaction({
    hash: hash!,
    enabled: !!hash,
    chainId: networkChainId,
    onSettled() {
      log(`Cooldown tx: ${hash?.slice(0, 6)}`)
    },
    onError() {
      send('FAIL')
    },
  })

  const page = useMemo(() => currentPage(state.value), [state.value])

  useEffect(() => {
    if (isUnstakeWindow) send('SUCCESS')
  }, [send, isUnstakeWindow])

  useUnmount(() => {
    if (!!state.done) setPendingTx(RESET)
  })

  return (
    <>
      <Page1
        currentPage={page}
        currentState={state.value}
        disabled={isUnstakeWindow}
        send={send}
      />
      <Page2
        currentPage={page}
        currentState={state.value}
        disabled={isUnstakeWindow}
        send={send}
      />
      <Page3
        currentPage={page}
        currentState={state.value}
        disabled={!isUnstakeWindow}
      />
    </>
  )
}

export default CooldownModal
