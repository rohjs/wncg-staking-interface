import {
  useFetchHarvest,
  useFetchStaking,
  useFetchUserData,
  useFetchUserRewards,
} from 'hooks/queries'

function ContractHook() {
  useFetchHarvest()

  useFetchStaking({
    refetchInterval: 10 * 1_000,
  })

  useFetchUserData({
    refetchInterval: 30 * 1_000,
  })

  useFetchUserRewards({
    refetchInterval: 30 * 1_000,
  })

  return null
}

export default ContractHook
