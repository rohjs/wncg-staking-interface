import { memo, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import { StyledGnb } from './styled'
import Loading from 'components/Loading'

import MenuList from './MenuList'

const AccountDropdown = dynamic(() => import('./AccountDropdown'), {
  suspense: true,
})
const ActionDropdown = dynamic(() => import('./ActionDropdown'), {
  suspense: true,
})
const Claim = dynamic(() => import('./Claim'), {
  suspense: true,
})

function Gnb() {
  return (
    <StyledGnb className="gnb">
      <div className="left">
        <h1 className="logo">
          <Link href="/wncg">WNCG Staking</Link>
        </h1>
        <Suspense fallback={<Loading>ActionDropdown</Loading>}>
          <ActionDropdown />
        </Suspense>
      </div>

      <div className="right">
        <MenuList />
        <Suspense fallback={<Loading>AccountDropdown</Loading>}>
          <AccountDropdown />
        </Suspense>
      </div>

      <Suspense fallback={<Loading>Claim</Loading>}>
        <Claim />
      </Suspense>
    </StyledGnb>
  )
}

export default memo(Gnb)
