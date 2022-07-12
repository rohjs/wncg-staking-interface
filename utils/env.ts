export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

export const IS_ETHEREUM =
  Number(process.env.NEXT_PUBLIC_MAINNET_CHAIN_ID) === 1

export const BPT_POOL_ID = IS_ETHEREUM
  ? process.env.NEXT_PUBLIC_BPT_POOL_ID_MAINNET
  : process.env.NEXT_PUBLIC_BPT_POOL_ID_KOVAN

export const BALANCER_POOL_URL = IS_ETHEREUM
  ? process.env.NEXT_PUBLIC_BALANCER_POOL_URL_MAINNET
  : process.env.NEXT_PUBLIC_BALANCER_POOL_URL_KOVAN