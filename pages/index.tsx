import type { NextPage } from 'next'
import Head from 'next/head'
import { NextSeo } from 'next-seo'

import { StyledMainPage } from 'styles/pages'

import { MAIN_SEO } from 'lib/seo'

import RootFavicon from 'components/RootFavicon'
import WncgCard from 'components/main/WncgCard'
import NcgCard from 'components/main/NcgCard'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { QueryClient, dehydrate } from '@tanstack/react-query'
import { ChainId } from 'config/chains'
import { build } from 'lib/queries/build'

const Home: NextPage = () => {
  return (
    <main>
      <Head>
        <title>Nine Chronicles Staking</title>
        <meta
          name="description"
          content="Stake Balancer LP token and earn rewards!"
        />
        <NextSeo {...MAIN_SEO} />
        <RootFavicon />
      </Head>

      <StyledMainPage layout>
        <div className="container">
          <ul className="cardList">
            <li className="cardItem">
              <WncgCard />
            </li>

            <li className="cardItem">
              <NcgCard />
            </li>
          </ul>
        </div>
      </StyledMainPage>
    </main>
  )
}

export default Home

export async function getStaticProps() {
  const queryClient = new QueryClient()

  const chainId = ChainId.ETHEREUM satisfies ChainId

  await queryClient.prefetchQuery(
    [QUERY_KEYS.Build, chainId],
    () => build(chainId),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60 * 24, // 1 day
  }
}
