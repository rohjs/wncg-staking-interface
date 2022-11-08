import { useCallback } from 'react'
import { useDisconnect } from 'wagmi'

import { ModalCategory } from 'states/ui'
import { useModal } from './useModal'
import { useSettings } from './useSettings'

export function useConnectWallets() {
  const { addModal } = useModal()
  const { resetSettings } = useSettings()

  const { disconnect: initDisconnect } = useDisconnect({
    onSuccess() {
      resetSettings()
    },
  })

  const connect = useCallback(() => {
    addModal({
      category: ModalCategory.Connect,
    })
  }, [addModal])

  const disconnect = useCallback(() => {
    initDisconnect()
  }, [initDisconnect])

  return {
    connect,
    disconnect,
  }
}
