import { useState } from 'react'
import { useMount } from 'react-use'
import Link from 'next/link'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import { useTransaction } from 'wagmi'

import { claimTxAtom } from 'states/tx'
import config from 'config'
import { parseTransferLogs } from 'utils/parseTransferLogs'
import { txUrlFor } from 'utils/txUrlFor'
import { useFiat, useStaking } from 'hooks'
import { useWatch } from './useWatch'

import { StyledToast } from './styled'
import Icon from 'components/Icon'
import ImportToken from 'components/ImportToken'
import NumberFormat from 'components/NumberFormat'
import TokenIcon from 'components/TokenIcon'
import Status from './Status'
import { formatUnits } from 'utils/formatUnits'

type HarvestToastProps = Required<HarvestTx>

export default function HarvestToast({
  hash,
  harvestAmount,
}: HarvestToastProps) {
  const setTx = useSetAtom(claimTxAtom)

  const toFiat = useFiat()
  const { tokenMap } = useStaking()

  const [amount, setAmount] = useState(harvestAmount)
  const fiatValue = toFiat(amount, config.bal)

  const status = useWatch(hash)

  const balToken = tokenMap[config.bal]

  useTransaction({
    hash,
    chainId: config.chainId,
    enabled: !!hash,
    suspense: false,
    async onSuccess(tx) {
      try {
        const { logs = [] } = (await tx?.wait()) ?? {}

        const parsedLogs = parseTransferLogs(logs)
        const actualHarvestedAmount = parsedLogs?.[config.bal]

        if (actualHarvestedAmount) {
          setAmount(formatUnits(actualHarvestedAmount, balToken.decimals))
        }
      } catch {}
    },
  })

  useMount(() => setTx(RESET))

  return (
    <StyledToast>
      <header className="toastHeader">
        <Link href={txUrlFor(hash)!} target="_blank" rel="noopener">
          <h3 className="title">
            Harvest
            <Icon icon="outlink" />
          </h3>

          <Status status={status} />
        </Link>
      </header>

      <div className="toastContent">
        <dl className="detailList">
          <div className="detailItem">
            <dt>
              <div className="token">
                <TokenIcon address={config.bal} dark $size={20} />
              </div>
              BAL
            </dt>

            <dd>
              <NumberFormat value={amount} />
              <NumberFormat className="usd" value={fiatValue} type="fiat" />
            </dd>
          </div>
        </dl>
      </div>

      <footer className="toastFooter">
        <ImportToken
          {...balToken}
          name={undefined}
          $size="sm"
          $variant="primary"
        />
      </footer>
    </StyledToast>
  )
}