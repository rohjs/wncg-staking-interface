import { useAtomValue } from 'jotai'

import { nowAtom } from 'states/user'
import { parseTimeDistance } from 'utils/datetime'

type UnstakePeriodTimerProps = {
  expiresAt: number
}

function UnstakePeriodTimer({ expiresAt }: UnstakePeriodTimerProps) {
  const now = useAtomValue(nowAtom) as number
  const { days, hours, minutes, seconds } = parseTimeDistance(expiresAt - now)

  return (
    <time>
      {days ? `${days}d ` : null}
      {hours ? `${hours}h ` : null}
      {minutes ? `${minutes}m ` : null}
      {seconds}s
    </time>
  )
}

export default UnstakePeriodTimer
