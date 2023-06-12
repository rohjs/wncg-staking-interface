import { atom } from 'jotai'
import { atomWithStorage, selectAtom } from 'jotai/utils'

export const currentTimestampAtom = atom(0)
export const priceMapAtom = atom<PriceMap>({})
export const totalStakedAtom = atom<string | null>(null)

export type AssetPlatform = 'ethereum' | 'bsc'

export const assetPlatformAtom = atom<AssetPlatform>('ethereum')

const isTestnet = Boolean(process.env.NEXT_PUBLIC_IS_TESTNET ?? 'true')

export const chainIdAtom = selectAtom(assetPlatformAtom, (platform) => {
  const ethereumChainId = isTestnet ? 5 : 1
  const bscChainId = isTestnet ? 97 : 56
  return platform === 'ethereum' ? ethereumChainId : bscChainId
})

export const currentChainAtom = atom<Chain | null>(null)
export const currentChainIdAtom = atom<ChainId | null>(
  (get) => (get(currentChainAtom)?.id as ChainId) ?? null
)

export const slippageAtom = atomWithStorage<string | null>(
  `wncg:staking:slippage`,
  null
)

export const isHarvestableAtom = atom(false)
export const showHarvestTooltipAtom = atomWithStorage(
  `wncg:staking:showHarvestTooltip`,
  false
)
