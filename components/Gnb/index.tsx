import { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import styles from './style.module.scss'

import {
  ConnectionStatus,
  getShowAlert,
  getStatus,
} from 'app/states/connection'
import { getIsMobile } from 'app/states/mediaQuery'
import { useAppSelector } from 'hooks'

import { GnbAccount } from './Account'
import { GnbConnect } from './Connect'

export function Gnb() {
  const { pathname } = useRouter()
  const isStakingPage = ['/wncg', '/wncg/pool'].includes(pathname)

  const showAlert = useAppSelector(getShowAlert(() => isStakingPage))
  const status = useAppSelector(getStatus)
  const isMobile = useAppSelector(getIsMobile)
  const logoSize = useMemo(
    () => (isMobile ? { width: 40, height: 24 } : { width: 66, height: 40 }),
    [isMobile]
  )

  const accountElement =
    status === ConnectionStatus.Connected ? <GnbAccount /> : <GnbConnect />

  return (
    <nav className={clsx(styles.gnb, { [styles.withAlert]: showAlert })}>
      <h1 className={styles.logo}>
        <Link href="/">
          <a>
            <Image
              {...logoSize}
              src="/logo.png"
              layout="fill"
              objectFit="cover"
              priority
              alt="Nine Chronicles WNCG Staking"
            />
          </a>
        </Link>
      </h1>

      {isStakingPage && accountElement}
    </nav>
  )
}