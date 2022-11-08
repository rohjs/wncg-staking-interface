type PoolStaticData = {
  id: string
  address: string
  factory: string
  symbol: stirng
  name: string
  owner: string
  createTime: number
  tokensList: string[]
  tokens: Omit<PoolToken, 'balance'>[]
}

type PoolDynamicData = {
  swapFee: string
  totalWeight: string
  totalLiquidity: string
  totalShares: string
  totalSwapFee: string
  totalSwapVolume: string
  tokens: Pick<PoolToken, 'balance'>[]
}

type Pool = PoolDynamicData & PoolDynamicData

type PoolToken = {
  address: string
  balance: string
  weight: string
  name: string
  symbol: string
  decimals: number
}

type PoolAction = 'join' | 'exit'

type PoolLpToken = 'bpt'
type PoolTokenSymbol = 'weth' | 'wncg'
