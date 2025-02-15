import { memo } from 'react'

import { useAuth, useStaking } from 'hooks'
import { JoinFormFocusedElement } from 'hooks/useJoinForm'

import { StyledJoinFormHeader } from './styled'
import Button from 'components/Button'
import Icon from 'components/Icon'
import SlippageControl from 'components/SlippageControl'
import TokenIcon from 'components/TokenIcon'
import Tooltip from 'components/Tooltip'

type JoinFormHeaderProps = {
  optimize(): void
  optimized: boolean
  reset(): void
  resetDisabled: boolean
  setFocusedElement(value: JoinFormFocusedElement): void
}

function JoinFormHeader({
  optimize,
  optimized,
  reset,
  resetDisabled,
  setFocusedElement,
}: JoinFormHeaderProps) {
  const { isConnected } = useAuth()
  const { bptName, stakedTokenAddress } = useStaking()

  function handleReset() {
    reset()
    setFocusedElement(null)
  }

  return (
    <StyledJoinFormHeader className="joinFormHeader" $disabled={!isConnected}>
      <h3 className="title">
        <TokenIcon address={stakedTokenAddress} $size={24} />
        Join pool
      </h3>

      <div className="buttonGroup">
        <div className="tooltipGroup">
          <Button
            className="optimizeButton toggler"
            onClick={optimize}
            disabled={optimized || !isConnected}
            $contain
            $size="sm"
          >
            Optimize{optimized ? 'd' : ''}
          </Button>
          <Tooltip
            message={`Join ${bptName} pool with the optimized ratio`}
            $noWrap
            $direction="bottom"
          />
        </div>

        <button
          className="resetButton"
          type="reset"
          onClick={handleReset}
          disabled={resetDisabled || !isConnected}
          aria-label="Reset"
        >
          <Icon icon={resetDisabled ? 'refreshOff' : 'refreshOn'} $size={32} />
        </button>
      </div>

      <SlippageControl />
    </StyledJoinFormHeader>
  )
}

export default memo(JoinFormHeader)
