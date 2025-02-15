import { memo } from 'react'

import { useAuth, useConnect, useStaking } from 'hooks'

import { StyledPoolBalances } from './styled'
import Suspense from 'components/Suspense'
import TokenIcon from 'components/TokenIcon'
import Content from './Content'
import Button from 'components/Button'

function PoolBalances() {
  const { isConnected } = useAuth()
  const { openConnectModal } = useConnect()
  const { bptName, stakedTokenAddress } = useStaking()

  return (
    <StyledPoolBalances layout>
      <div className="balancesHeader">
        <TokenIcon address={stakedTokenAddress} $size={48} />

        <h2 className="title">{bptName}</h2>

        {!isConnected && (
          <Button
            className="connectButton"
            type="button"
            onClick={openConnectModal}
            $size="lg"
          >
            Connect wallet
          </Button>
        )}
      </div>

      {!!isConnected && (
        <Suspense>
          <Content />
        </Suspense>
      )}
    </StyledPoolBalances>
  )
}

export default memo(PoolBalances)
