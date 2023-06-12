import { Erc20Abi } from 'config/abi'
import { readContractsPool } from 'lib/readContractsPool'
import { formatUnits } from 'utils/formatUnits'

export async function fetchUserAllowances(
  chainId: ChainId,
  account: Hash,
  pairs: AllowancePair[]
) {
  const contracts = pairs.map(([t, spender]) => ({
    address: t.address,
    abi: Erc20Abi as Abi,
    args: [account, spender],
    chainId,
    functionName: 'allowance',
  }))

  try {
    const data = (await readContractsPool.call({
      allowFailure: true,
      contracts,
    })) as BigNumber[]

    const entries = pairs.map(([t, spender], i) => [
      t.address,
      { [spender]: formatUnits(data[i], t.decimals) },
    ])

    return Object.fromEntries(entries)
  } catch (error) {
    throw error
  }
}
