import { Interface } from '@ethersproject/abi'

import {
  BalancerRewardPoolAbi,
  BalancerVaultAbi,
  Erc20Abi,
  LiquidityGaugeAbi,
  Multicall3Abi,
  StakingBscAbi,
  StakingEthereumAbi,
  WETHAbi,
} from 'config/abi'

export const balRewardPoolIface = new Interface(BalancerRewardPoolAbi)
export const ercTokenIface = new Interface(Erc20Abi)
export const liquidityGaugeIface = new Interface(LiquidityGaugeAbi)
export const multicall3 = new Interface(Multicall3Abi)
export const stakingBscIface = new Interface(StakingBscAbi)
export const stakingEthereumIface = new Interface(StakingEthereumAbi)
export const vaultIface = new Interface(BalancerVaultAbi)
export const wethIface = new Interface(WETHAbi)
