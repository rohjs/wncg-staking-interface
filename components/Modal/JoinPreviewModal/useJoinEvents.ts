import { useCallback } from 'react'
import { useRecoilValue } from 'recoil'

import { accountState } from 'app/states/connection'
import { configService } from 'services/config'
import { createApprovalEventFilter } from 'utils/event'
import { useAllowances, useEventFilters, usePool } from 'hooks'

export function useJoinEvents(send: any) {
  const { allowanceFor } = useAllowances()
  const { poolBalanceChangedEventFilter } = useEventFilters()
  const { poolTokenAddresses, poolTokenSymbols } = usePool()
  const account = useRecoilValue(accountState)

  const approvalEventFilters = poolTokenAddresses.map((address) => {
    if (allowanceFor(address, configService.vaultAddress)) return null
    return createApprovalEventFilter(
      account,
      address,
      configService.vaultAddress
    )
  })
  const approvalEventHandlers = poolTokenSymbols.map((symbol) => {
    return function () {
      send(`APPROVED_${symbol}`)
    }
  })

  const poolBalanceChangedEventHandler = useCallback(() => {
    send('COMPLETED')
  }, [send])

  const eventFilters = [...approvalEventFilters, poolBalanceChangedEventFilter]
  const eventHandlers = [
    ...approvalEventHandlers,
    poolBalanceChangedEventHandler,
  ]

  return {
    eventFilters,
    eventHandlers,
  }
}
