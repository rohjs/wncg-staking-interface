import { useMount, useUnmount } from 'react-use'
import { useAtomValue } from 'jotai'
import { useWaitForTransaction } from 'wagmi'

import { joinTxAtom } from 'states/tx'
import config from 'config'
import { useRefetch } from 'hooks'

export function useWatch(send: (event: string) => void) {
  const refetch = useRefetch({
    userBalances: true,
    pool: true,
    userData: true,
    userAllowances: true,
  })

  const tx = useAtomValue(joinTxAtom)

  useWaitForTransaction({
    hash: tx.hash!,
    enabled: !!tx.hash,
    chainId: config.chainId,
    suspense: false,
    async onSuccess() {
      await refetch()

      send('SUCCESS')
    },
    onError() {
      send('FAIL')
    },
  })

  useMount(() => {
    refetch()
  })

  useUnmount(() => {
    refetch()
  })
}
