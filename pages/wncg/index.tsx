import { Suspense } from 'react'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { AnimatePresence } from 'framer-motion'

import { STAKING_SEO } from 'lib/seo'

import { StyledWncgStakingPage } from 'styles/styled'
import ErrorBoundary from 'components/ErrorBoundary'
import Form from 'components/staking/Form'
import Header from 'components/staking/Header'
import Pool from 'components/Pool'
import Loading from 'components/Loading'

const Dashboard = dynamic(() => import('components/staking/Dashboard'), {
  suspense: true,
})

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
          <Form />
        </div>
        <div className="right">
          <ErrorBoundary fallback={<Loading>Loading: ErrorBoundary</Loading>}>
            <Suspense fallback={<Loading>Loading: Suspense</Loading>}>
              <Dashboard />
            </Suspense>
          </ErrorBoundary>
        </div>
      </StyledWncgStakingPage>

      <AnimatePresence>{showPoolPage && <Pool isModal />}</AnimatePresence>
    </>
  )
}

export default WncgStaking
