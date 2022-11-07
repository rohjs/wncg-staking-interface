import type { NextPage } from 'next'
import Head from 'next/head'

import Pool from 'components/Pool'

const WncgPool: NextPage = () => {
  return (
    <>
      <Head>
        <title>WNCG Staking</title>
      </Head>

      <Pool />
    </>
  )
}

export default WncgPool
