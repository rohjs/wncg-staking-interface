import dynamic from 'next/dynamic'
import type { NextPage } from 'next'
import Head from 'next/head'
import { NextSeo } from 'next-seo'

import { STAKING_SEO } from 'lib/seo'
export { getStaticProps } from 'lib/getStaticProps'
export { getStaticPaths } from 'lib/getStaticPaths'

import { StyledStakingPage } from 'styles/pages/staking'

import Favicon from 'components/Favicon'
import GlobalFooter from 'components/GlobalFooter'
import Suspense from 'components/Suspense'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from 'config/constants/queryKeys'

import { useChain } from 'hooks'
import { build } from 'lib/queries/build'
import Stake from 'components/staking/Stake'

const Dashboard = dynamic(() => import('components/staking/Dashboard'), {
  suspense: true,
})

const WncgStaking: NextPage = (props) => {
  const { chainId } = useChain()

  useQuery([QUERY_KEYS.Build, chainId], () => build(chainId), {
    suspense: true,
  })

  return (
    <>
      <NextSeo {...STAKING_SEO} />
      <Head>
        <title>WNCG Staking</title>
        <meta
          name="description"
          content="Stake Balancer LP token and earn rewards!"
        />
        <Favicon />
      </Head>

      <StyledStakingPage layout>
        <div className="container">
          <div className="left">
            <Stake />
          </div>

          <div className="right">
            <Suspense>
              <Dashboard />
            </Suspense>
          </div>
        </div>
      </StyledStakingPage>

      <GlobalFooter />
    </>
  )
}

export default WncgStaking
