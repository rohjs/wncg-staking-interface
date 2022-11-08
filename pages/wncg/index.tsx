import { Suspense } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { AnimatePresence } from 'framer-motion'

import { STAKING_SEO } from 'lib/seo'

import { StyledWncgStakingPage } from 'styles/styled'
import Form from 'components/staking/Form'
import Dashboard from 'components/staking/Dashboard'
import Header from 'components/staking/Header'
import Pool from 'components/Pool'

import Loading from 'components/Loading'

const WncgStaking: NextPage = () => {
  const { query } = useRouter()
  const showPoolPage = !!query?.pool

  return (
    <>
      <NextSeo {...STAKING_SEO} />
      <Head>
        <title>WNCG Staking</title>
        <meta
          name="description"
          content="Stake Balancer LP token and earn rewards!"
        />
      </Head>

      <StyledWncgStakingPage>
        <div className="left">
          <Header />
          <Suspense fallback={<Loading>FORM Loading...</Loading>}>
            <Form />
          </Suspense>
        </div>
        <div className="right">{/* <Dashboard /> */}</div>
      </StyledWncgStakingPage>

      <AnimatePresence>{showPoolPage && <Pool isModal />}</AnimatePresence>
    </>
  )
}

export default WncgStaking
