import { MouseEvent, useMemo, useRef } from 'react'

import { ConnectorId } from 'config/constants'
import { EXIT_MOTION } from 'config/motions'
import { slideInUp } from 'config/motionVariants'
import { useAuth, useCloseOnBlur, useImportToken, useStaking } from 'hooks'

import { StyledGlobalFooterImportTokenDropdownMenu } from './styled'
import TokenIcon from 'components/TokenIcon'
import Icon from 'components/Icon'

type GlobalFooterImportTokenDropdownProps = {
  closeDropdown(): void
}

export default function GlobalFooterImportTokenDropdownMenu({
  closeDropdown,
}: GlobalFooterImportTokenDropdownProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  const { connector } = useAuth()
  const { importToken: _importToken } = useImportToken()
  const { rewardTokenAddress, stakedTokenAddress, tokenMap } = useStaking()

  useCloseOnBlur(menuRef, closeDropdown)

  const list = useMemo(
    () => [rewardTokenAddress, stakedTokenAddress],
    [rewardTokenAddress, stakedTokenAddress]
  )

  function importToken(e: MouseEvent<HTMLButtonElement>) {
    const { value } = e.currentTarget
    const tokenInfo = tokenMap[value as Hash]
    const { symbol } = tokenInfo

    const tokenSymbol = value === stakedTokenAddress ? 'BPT' : symbol

    _importToken({ ...tokenInfo, symbol: tokenSymbol })
    closeDropdown()
  }

  if (!connector) return null
  if (connector?.id === ConnectorId.Binance) return null

  return (
    <StyledGlobalFooterImportTokenDropdownMenu
      {...EXIT_MOTION}
      ref={menuRef}
      className="tokenMenu"
      variants={slideInUp}
    >
      <header className="dropdownHeader">
        <h4 className="title">Import token</h4>
        <button className="closeButton" type="button" onClick={closeDropdown}>
          <Icon icon="close" $size={24} />
        </button>
      </header>

      {list.map((addr) => {
        const { symbol } = tokenMap[addr]

        return (
          <button
            key={`globalFooter:importTokenDropdown:${addr}`}
            className="tokenButton"
            type="button"
            value={addr}
            onClick={importToken}
          >
            {symbol}

            <TokenIcon className="token" address={addr} $size={16} />
          </button>
        )
      })}
    </StyledGlobalFooterImportTokenDropdownMenu>
  )
}
