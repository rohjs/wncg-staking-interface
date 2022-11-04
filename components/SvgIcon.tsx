import { memo } from 'react'
import clsx from 'clsx'

import { StyledSvgIcon, SvgIconSize } from './styled'

import CoinIcon from 'public/ic-coin.svg'
import WalletConnectIcon from 'public/ic-wallet-connect.svg'

export type SvgIconType =
  | 'approximate'
  | 'balancer'
  | 'check'
  | 'checkLarge'
  | 'checkboxOff'
  | 'checkboxOn'
  | 'chevronDown'
  | 'chevronRight'
  | 'chevronUp'
  | 'close'
  | 'coin'
  | 'coinbaseWallet'
  | 'copy'
  | 'done'
  | 'discord'
  | 'ether'
  | 'export'
  | 'info'
  | 'link'
  | 'loading'
  | 'lock'
  | 'metaMask'
  | 'radioOff'
  | 'radioOn'
  | 'refresh'
  | 'telegram'
  | 'twitter'
  | 'unlock'
  | 'walletConnect'
  | 'warning'
  | 'wncgDark'
  | 'wncgLight'

type SvgIconProps = {
  icon: SvgIconType
  ariaLabel?: string
  ariaHidden?: boolean
  className?: string
  $size?: SvgIconSize
}

function SvgIcon({
  icon,
  ariaLabel,
  ariaHidden = true,
  className,
  $size = 16,
}: SvgIconProps) {
  if (hasGradient(icon)) {
    return (
      <StyledSvgIcon
        className={clsx('icon', className)}
        as="span"
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
        $size={$size}
      >
        {renderGradientSvgIcon(icon)}
      </StyledSvgIcon>
    )
  }

  return (
    <StyledSvgIcon
      className={clsx('icon', className)}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      $size={$size}
    >
      <use href={`/sprites.svg#${icon}`} />
    </StyledSvgIcon>
  )
}

export default memo(SvgIcon)

const gradientIconList = ['coin', 'walletConnect'] as SvgIconType[]

function hasGradient(icon: SvgIconType) {
  return gradientIconList.includes(icon)
}

function renderGradientSvgIcon(icon: SvgIconType) {
  switch (icon) {
    case 'coin':
      return <CoinIcon />
    case 'walletConnect':
      return <WalletConnectIcon />
    default:
      return null
  }
}