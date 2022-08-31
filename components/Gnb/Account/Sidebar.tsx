/* eslint-disable react/jsx-no-target-blank */
import { useRef, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useRecoilValue } from 'recoil'
import { motion } from 'framer-motion'
import store from 'store'
import clsx from 'clsx'
import styles from './style.module.scss'

import { accountState } from 'app/states/connection'
import { networkMismatchState } from 'app/states/error'
import STORAGE_KEYS from 'constants/storageKeys'
import { gaEvent } from 'lib/gtag'
import { networkChainId, networkNameFor } from 'utils/network'
import { truncateAddress } from 'utils/string'
import { getEtherscanUrl } from 'utils/url'
import { useConnection } from 'hooks'
import { sidebarVariants } from './constants'

import { Button } from 'components/Button'
import { Icon } from 'components/Icon'
import { Jazzicon } from 'components/Jazzicon'

type AccountSidebarProps = {
  close(): void
}

export function AccountSidebar({ close }: AccountSidebarProps) {
  const [copied, setCopied] = useState(false)
  const [muted, setMuted] = useState<boolean>(
    store.get(STORAGE_KEYS.UserSettings.Muted) || false
  )
  const menuRef = useRef<HTMLDivElement>(null)

  const { disconnect: _disconnect, switchNetwork: _switchNetwork } =
    useConnection()

  const account = useRecoilValue(accountState)
  const networkMismatch = useRecoilValue(networkMismatchState)

  function disconnect() {
    close()
    setTimeout(_disconnect, 500)
  }

  function switchNetwork() {
    close()
    _switchNetwork()
  }

  function handleCopy() {
    setCopied(true)
    setTimeout(() => setCopied(false), 500)
    gaEvent({
      name: 'copy_address',
    })
  }

  function handleMute() {
    setMuted((prev) => {
      store.set(STORAGE_KEYS.UserSettings.Muted, !prev)
      gaEvent({
        name: 'mute_sound',
        params: {
          muted: !prev,
        },
      })
      return !prev
    })
  }

  function handleEtherscan() {
    gaEvent({
      name: 'open_account_etherscan',
      params: {
        account,
      },
    })
  }

  if (!account) {
    return null
  }

  return (
    <motion.aside
      className={styles.accountSidebar}
      ref={menuRef}
      key="accountSidebar"
      variants={sidebarVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ background: 'white' }}
    >
      <h1 className={styles.title}>Account</h1>
      <button className={styles.closeButton} type="button" onClick={close}>
        <Icon id="close" ariaLabel="Close sidebar" />
      </button>

      <header className={styles.header}>
        <Jazzicon className={styles.jazzicon} address={account} diameter={40} />

        <div className={styles.detail}>
          <div className={styles.account}>
            <strong>{truncateAddress(account)}</strong>
            <CopyToClipboard text={account} onCopy={handleCopy}>
              <button className={clsx({ [styles.copied]: copied })}>
                <Icon id={copied ? 'check' : 'clipboard'} />
              </button>
            </CopyToClipboard>
            <a
              href={getEtherscanUrl(account)}
              onClick={handleEtherscan}
              target="_blank"
              rel="noopener"
            >
              <Icon id="externalLink" ariaLabel="Go to Etherscan" />
            </a>
          </div>
          <span className={styles.wallet}>MetaMask</span>
        </div>
      </header>

      <dl className={styles.details}>
        <div>
          <dt>Network</dt>
          <dd>
            {networkMismatch ? (
              <Button variant="tertiary" size="small" onClick={switchNetwork}>
                Switch Network
              </Button>
            ) : (
              <>
                <span className={styles.ethereum}>
                  <Icon id="ethereumSimple" />
                </span>
                {networkNameFor(networkChainId)}
              </>
            )}
          </dd>
        </div>
        <div>
          <dt>Sound</dt>
          <dd>
            <Button variant="tertiary" size="small" onClick={handleMute}>
              {muted ? 'Unmute' : 'Mute'}
            </Button>
          </dd>
        </div>
      </dl>

      <Button
        className={styles.disconnectButton}
        variant="danger"
        size="small"
        onClick={disconnect}
        fullWidth
      >
        Disconnect
      </Button>
    </motion.aside>
  )
}
