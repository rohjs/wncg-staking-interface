import { useRef } from 'react'
import ReactGA from 'react-ga4'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import type { DehydratedState } from '@tanstack/react-query'
import { useMount } from 'react-use'
import type { AppProps as NextAppProps, NextWebVitalsMetric } from 'next/app'
import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
import { Provider } from 'jotai'
import { WagmiConfig } from 'wagmi'

import { configService } from 'services/config'
import { DEFAULT_SEO } from 'lib/seo'
import wagmiClient from 'lib/wagmi'
import { useMediaQuery } from 'hooks'

import GlobalStyle from 'styles/GlobalStyle'
import Layout from 'components/Layout'
import Modals from 'components/Modals'

type AppProps = NextAppProps & {
  pageProps: {
    dehydratedState: DehydratedState
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  useMediaQuery()

  const queryClient = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          keepPreviousData: true,
        },
      },
    })
  )
  const config = configService.env.env
  const isProd = config === 'production'

  useMount(() => {
    if (!isProd) return
    ReactGA.initialize(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string)
  })

  return (
    <>
      {isProd && !!process.env.NEXT_PUBLIC_HOTJAR_SITE_ID && (
        <Script
          id="hotjar"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_SITE_ID},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
          }}
        />
      )}

      <GlobalStyle />
      <QueryClientProvider client={queryClient.current}>
        <Hydrate state={pageProps.dehydratedState}>
          <Provider>
            <WagmiConfig client={wagmiClient}>
              <DefaultSeo {...DEFAULT_SEO} />
              <Layout>
                <Component {...pageProps} />
              </Layout>
              <Modals />
            </WagmiConfig>
          </Provider>
        </Hydrate>
      </QueryClientProvider>
    </>
  )
}

export default MyApp

export function reportWebVitals({ id, name, value }: NextWebVitalsMetric) {
  if (name === 'Next.js-hydration') return

  window?.gtag?.('event', name, {
    event_category: 'Web Vitals',
    value: Math.round(name === 'CLS' ? value * 1_000 : value),
    event_label: id, // id unique to current page load
    non_interaction: true, // avoids affecting bounce rate.
  })
}
