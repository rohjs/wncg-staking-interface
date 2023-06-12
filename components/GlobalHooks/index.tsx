import { memo } from 'react'
import dynamic from 'next/dynamic'

import Suspense from 'components/Suspense'
import Web3 from './Web3'
import Contract from './Contract'
import Interface from './Interface'
import Unstake from './Unstake'

function GlobalHooks() {
  return (
    <>
      <Web3 />

      <Suspense>
        <Contract />
      </Suspense>

      <Suspense>
        <Interface />
      </Suspense>

      <Suspense>
        <Unstake />
      </Suspense>
    </>
  )
}

export default memo(GlobalHooks)
