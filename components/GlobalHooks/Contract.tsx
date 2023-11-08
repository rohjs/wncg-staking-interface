import {
  useFetchHarvest,
  useFetchStaking,
  useFetchTotalStaked,
  useFetchUserData,
  useFetchUserRewards,
} from 'hooks/queries'

const INTERVAL = 30 * 1_000

function ContractHook() {
  useFetchHarvest()

  useFetchTotalStaked({
    refetchInterval: INTERVAL,
  })

  useFetchStaking({
    refetchInterval: INTERVAL,
  })

  useFetchUserData({
    refetchInterval: INTERVAL,
  })

  useFetchUserRewards({
    refetchInterval: INTERVAL,
  })

  return null
}

export default ContractHook
