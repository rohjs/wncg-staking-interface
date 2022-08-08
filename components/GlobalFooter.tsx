/* eslint-disable react/jsx-no-target-blank */
import { memo, MouseEvent, ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import styles from './styles/GlobalFooter.module.scss'

import { gaEvent } from 'lib/gtag'
import { getEtherscanUrl } from 'utils/url'

import { Icon } from './Icon'

const etherscanUrl = getEtherscanUrl(
  process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS
)
const githubUrl = `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_REPO}`

function handleClick(e: MouseEvent<HTMLAnchorElement>) {
  gaEvent({
    name: `open_${e.currentTarget.dataset.name}`,
  })
}

function GlobalFooter() {
  const { pathname } = useRouter()
  const isStakingPage = pathname.startsWith('/wncg')
  const isDocumentPage = ['/wncg/terms', '/wncg/privacy'].includes(pathname)

  const snsLinks = (
    <div className={styles.buttonGroup}>
      <a
        className={styles.snsButton}
        href="https://twitter.com/NineChronicles"
        onClick={handleClick}
        data-name="twitter"
        target="_blank"
        rel="noopener"
        aria-label="Go to Twitter"
      >
        <Icon id="twitter" />
      </a>
      <a
        className={styles.snsButton}
        href="https://ninechronicles.medium.com/"
        onClick={handleClick}
        data-name="medium"
        target="_blank"
        rel="noopener"
        aria-label="Go to Medium"
      >
        <Icon id="medium" />
      </a>
      <a
        className={styles.snsButton}
        href="https://discord.gg/planetarium"
        onClick={handleClick}
        data-name="discord"
        target="_blank"
        rel="noopener"
        aria-label="Open Discord"
      >
        <Icon id="discord" />
      </a>
      {isStakingPage && (
        <>
          <a
            className={clsx(styles.snsButton, styles.etherscan)}
            href={etherscanUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Open Etherscan"
          >
            <Icon id="ethereumSimple" />
          </a>
          <a
            className={styles.snsButton}
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Open Github"
          >
            <Icon id="github" />
          </a>
        </>
      )}
    </div>
  )

  if (!isStakingPage) {
    return (
      <footer className={styles.globalFooter}>
        <div className={styles.container}>
          <div className={styles.center}>{snsLinks}</div>
        </div>
      </footer>
    )
  }

  return (
    <footer className={styles.globalFooter}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.title}>
            <h1>
              <Link href="/wncg">
                <a>
                  WNCG Staking
                  <span>{process.env.NEXT_PUBLIC_VERSION}</span>
                </a>
              </Link>
            </h1>
            <span className={styles.copyright}>© 2022 WNCG Staking</span>
          </div>

          <FooterLink
            href="/wncg/terms"
            dataName="terms_of_service"
            target={!isDocumentPage}
          >
            Terms of Service
          </FooterLink>
          <FooterLink
            href="/wncg/privacy"
            dataName="privacy_policy"
            target={!isDocumentPage}
          >
            Privacy Policy
          </FooterLink>
          <a
            className={styles.link}
            href={process.env.NEXT_PUBLIC_DOCUMENTATION_URL}
            data-name="docs"
            target="_blank"
            rel="noreferrer"
            onClick={handleClick}
          >
            Docs
          </a>
        </div>

        <div className={styles.right}>{snsLinks}</div>
      </div>
    </footer>
  )
}

const MemoizedGlobalFooter = memo(GlobalFooter)
export { MemoizedGlobalFooter as GlobalFooter }

type FooterLinkProps = {
  children: ReactNode
  dataName: string
  href: string
  target: boolean
}

function FooterLink({ children, dataName, href, target }: FooterLinkProps) {
  if (target) {
    return (
      <a
        className={styles.link}
        href={href}
        onClick={handleClick}
        data-name={dataName}
        target="_blank"
        rel="noopener"
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} data-name={dataName}>
      <a className={styles.link} onClick={handleClick}>
        {children}
      </a>
    </Link>
  )
}