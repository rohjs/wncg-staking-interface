// https://github.com/balancer-labs/frontend-v2
import { getAddress } from 'ethers/lib/utils.js'
import {
  isSameAddress,
  weightedBPTForTokensZeroPriceImpact as _bptForTokensZeroPriceImpact,
} from '@balancer-labs/sdk'
import { WeightedMath } from '@georgeroman/balancer-v2-pools'

import config from 'config'
import { bnum } from 'utils/bnum'
import { formatUnits } from 'utils/formatUnits'
import { parseUnits } from 'utils/parseUnits'
import { getTokenInfo } from 'utils/token'

const POOL_DECIMALS = 18

type PriceImpactOption = {
  exactOut?: boolean
  tokenIndex?: number | null
  queryBpt?: BigNumber
}

export default class CalculatorService {
  constructor(
    public pool: PoolResponse,
    public bptBalance: string,
    public action: PoolAction,
    public useNativeAsset = false
  ) {}

  exactTokensInForBptOut(tokenAmounts: string[]) {
    const balances = this.poolTokenBalances.map((b) => bnum(b.toString()))
    const weights = this.poolTokenWeights.map((w) => bnum(w.toString()))
    const amountsIn = this.denormAmounts(tokenAmounts).map((a) =>
      bnum(a.toString())
    )

    return WeightedMath._calcBptOutGivenExactTokensIn(
      balances,
      weights,
      amountsIn,
      bnum(this.poolTotalShares.toString()),
      bnum(this.poolSwapFee.toString())
    )
  }

  bptInForExactTokensOut(tokenAmounts: string[]) {
    const balances = this.poolTokenBalances.map((b) => bnum(b.toString()))
    const weights = this.poolTokenWeights.map((w) => bnum(w.toString()))
    const amountsOut = this.denormAmounts(tokenAmounts).map((a) =>
      bnum(a.toString())
    )

    return WeightedMath._calcBptInGivenExactTokensOut(
      balances,
      weights,
      amountsOut,
      bnum(this.poolTotalShares.toString()),
      bnum(this.poolSwapFee.toString())
    )
  }

  bptInForExactTokenOut(_amount: string, tokenIndex: number) {
    const balance = bnum(this.poolTokenBalances[tokenIndex])
    const weight = bnum(this.poolTokenWeights[tokenIndex])

    const scaledAmount = parseUnits(_amount, this.poolTokenDecimals[tokenIndex])

    const amount = bnum(
      Math.min(scaledAmount.toNumber(), balance.toNumber())
    ).toString()

    const amountOut = bnum(amount)

    return WeightedMath._calcBptInGivenExactTokenOut(
      balance,
      weight,
      amountOut,
      bnum(this.poolTotalShares.toString()),
      bnum(this.poolSwapFee.toString())
    )
  }

  exactBptInForTokenOut(bptAmount: string, tokenIndex: number) {
    const balance = bnum(this.poolTokenBalances[tokenIndex].toString())
    const weight = bnum(this.poolTokenWeights[tokenIndex].toString())

    return WeightedMath._calcTokenOutGivenExactBptIn(
      balance,
      weight,
      bnum(bptAmount),
      bnum(this.poolTotalShares.toString()),
      bnum(this.poolSwapFee.toString())
    )
  }

  propAmountsGiven(amount: string, index: number, type: 'send' | 'receive') {
    if (!amount?.trim()) {
      return { send: [], receive: [], fixedToken: 0 }
    }

    const types = ['send', 'receive']
    const fixedTokenAddress = this.tokenOf(type, index)
    const fixedToken = getTokenInfo(fixedTokenAddress)
    const fixedTokenDecimals = fixedToken?.decimals ?? 18
    const fixedAmount = bnum(amount).toFixed(fixedTokenDecimals)
    const fixedDenormAmount = parseUnits(fixedAmount, fixedTokenDecimals)
    const fixedRatio = this.ratioOf(type, index)
    const amounts = {
      send: this.sendTokens.map(() => ''),
      receive: this.receiveTokens.map(() => ''),
      fixedToken: index,
    }

    amounts[type][index] = fixedAmount
    ;[this.sendRatios, this.receiveRatios].forEach((ratios, ratioType) => {
      ratios.forEach((ratio, i) => {
        if (i !== index || type !== types[ratioType]) {
          const tokenAddress = this.tokenOf(types[ratioType], i)
          const token = getTokenInfo(tokenAddress)

          amounts[types[ratioType] as 'send' | 'receive'][i] = formatUnits(
            fixedDenormAmount.times(ratio).div(fixedRatio).toFixed(0),
            token?.decimals ?? 18
          ).replace(/0+$/, '')
        }
      })
    })

    return amounts
  }

  priceImpact(tokenAmounts: string[], option: PriceImpactOption) {
    let bptAmount: BigNumber
    let bptZeroPriceImpact

    if (this.action === 'join') {
      bptAmount = this.exactTokensInForBptOut(tokenAmounts)
      if (bptAmount.lte(0)) return bnum(0)

      bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmounts)
      return bnum(1).minus(bptAmount.div(bptZeroPriceImpact))
    }

    const { exactOut, tokenIndex } = option || {
      exactOut: false,
      tokenIndex: 0,
    }

    if (exactOut) {
      bptAmount = this.bptInForExactTokensOut(tokenAmounts)
      bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmounts)
    } else {
      bptAmount =
        option.queryBpt ||
        bnum(parseUnits(this.bptBalance || '0', POOL_DECIMALS).toString())

      tokenAmounts = this.poolTokens.map((_, i) => {
        if (i !== tokenIndex) return '0'
        const tokenAmount = this.exactBptInForTokenOut(
          bptAmount.toString(),
          tokenIndex
        )

        return formatUnits(
          tokenAmount,
          this.poolTokenDecimals[tokenIndex]
        ).toString()
      })

      bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmounts)
    }

    return bnum(bptAmount).div(bptZeroPriceImpact).minus(1)
  }

  bptForTokensZeroPriceImpact(tokenAmounts: string[]) {
    const denormAmounts = this.denormAmounts(tokenAmounts)

    return bnum(
      _bptForTokensZeroPriceImpact(
        this.poolTokenBalances,
        this.poolTokenDecimals,
        this.poolTokenWeights,
        denormAmounts,
        this.poolTotalShares
      ).toString()
    )
  }

  denormAmounts(amounts: string[]) {
    return amounts.map((amount, i) =>
      parseUnits(amount, this.poolTokenDecimals[i]).toString()
    )
  }

  tokenOf(type: string, index: number) {
    const key = `${type}Tokens` as 'sendTokens' | 'receiveTokens'
    return getAddress(this[key][index])
  }

  ratioOf(type: string, index: number) {
    const key = `${type}Ratios` as 'sendRatios' | 'receiveRatios'
    return this[key][index]
  }

  get tokenAddresses() {
    if (this.useNativeAsset) {
      return this.pool.tokensList.map((address) => {
        if (isSameAddress(address, config.weth)) {
          return config.nativeCurrency.address
        }
        return address
      })
    }

    return this.pool.tokensList
  }

  get poolTokens() {
    return this.pool.tokens
  }

  get poolTokenDecimals() {
    return this.poolTokens.map((t) => t.decimals)
  }

  get poolTokenBalances() {
    const balances = this.poolTokens.map((t) => t.balance)
    return balances.map((b, i) =>
      parseUnits(b ?? '0', this.poolTokenDecimals[i]).toString()
    )
  }

  get poolTokenWeights() {
    const normalizedWeights = this.poolTokens.map((t) => t.weight)
    return normalizedWeights.map((w) => parseUnits(w, 18).toString())
  }

  get poolTotalShares() {
    return parseUnits(this.pool.totalShares, POOL_DECIMALS).toString()
  }

  get poolSwapFee() {
    return parseUnits(this.pool.swapFee, 18)
  }

  private get sendTokens() {
    if (this.action === 'join') return this.tokenAddresses
    return [this.pool.address]
  }

  private get receiveTokens() {
    if (this.action === 'join') return [this.pool.address]
    return this.tokenAddresses
  }

  private get sendRatios() {
    if (this.action === 'join') return this.poolTokenBalances
    return [this.poolTotalShares]
  }

  private get receiveRatios() {
    if (this.action === 'join') return [this.poolTotalShares]
    return this.poolTokenBalances
  }
}
