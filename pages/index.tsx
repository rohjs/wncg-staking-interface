import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <main className="main">
      <Head>
        <title>WNCG Staking</title>
        <meta
          name="description"
          content="Stake Balancer LP token and earn rewards!"
        />
      </Head>

      <div className="container">
        <h1 className="title">Staking Nine Chronicles Gold</h1>

        <div className="wrapper">
          <div>
            <h3 className="subtitle">For NCG</h3>
            <a
              href="https://ninechronicles.medium.com/monster-collection-muspelheim-the-realm-of-fire-part-2-b5c36e089b81"
              target="_blank"
              rel="noopener"
            >
              <div className="bg" aria-hidden>
                <Image
                  src="/img-monster-1.png"
                  layout="fill"
                  objectFit="contain"
                  priority
                  alt=""
                />
              </div>
              <strong>Monster Collection in Nine Chronicles game</strong>
            </a>

            <a
              href="https://github.com/planetarium/libplanet/tree/pbft"
              target="_blank"
              rel="noopener"
            >
              <div className="bg" aria-hidden>
                <Image
                  src="/img-monster-2.png"
                  layout="fill"
                  objectFit="contain"
                  priority
                  alt=""
                />
              </div>
              <strong>
                Proof of Stake
                <span className="misc">(in development)</span>
              </strong>
            </a>
          </div>

          <div>
            <h3 className="subtitle">For WNCG in Ethereum</h3>
            <Link href="/wncg">
              <div className="bg" aria-hidden>
                <Image
                  src="/img-bg-human.png"
                  layout="fill"
                  objectFit="contain"
                  priority
                  alt=""
                />
              </div>
              <strong>WNCG Staking</strong>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home
