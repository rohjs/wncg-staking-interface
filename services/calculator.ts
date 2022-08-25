// https://github.com/balancer-labs/frontend-v2

import { BigNumber, BigNumberish } from 'ethers'
import { formatUnits, getAddress, parseUnits } from 'ethers/lib/utils'
import OldBigNumber from 'bignumber.js'
import { weightedBPTForTokensZeroPriceImpact as _bptForTokensZeroPriceImpact } from '@balancer-labs/sdk'
import { WeightedMath } from '@georgeroman/balancer-v2-pools'

import Decimal, { bnum } from 'utils/num'
import { getTokenInfo } from 'utils/token'
import { configService } from './config'

const POOL_DECIMALS = 18

interface Amounts {
  send: string[]
  receive: string[]
  fixedToken: number
}

type PriceImpactOption = {
  exactOut?: boolean
  tokenIndex?: number | null
  queryBpt?: OldBigNumber
}

export default class CalculatorService {
  constructor(
    public pool: Pool,
    public bptBalance: string,
    public action: PoolAction,
    public useNativeAsset = false,
    public readonly config = configService
  ) {}

  public exactTokensInForBptOut(tokenAmounts: string[]): OldBigNumber {
    const balances = this.poolTokenBalances.map((b) => bnum(b.toString()))
    const weights = this.poolTokenWeights.map((w) => bnum(w.toString()))
    const amountsIn = this.denormAmounts(tokenAmounts).map((a) =>
      bnum(a.toString())
    )

    return WeightedMath._calcBptOutGivenExactTokensIn(
      balances,
      weights,
      amountsIn,
      bnum(this.poolTotalSupply.toString()),
      bnum(this.poolSwapFee.toString())
    )
  }

  public bptInForExactTokensOut(tokenAmounts: string[]): OldBigNumber {
    const balances = this.poolTokenBalances.map((b) => bnum(b.toString()))
    const weights = this.poolTokenWeights.map((w) => bnum(w.toString()))
    const amountsOut = this.denormAmounts(tokenAmounts).map((a) =>
      bnum(a.toString())
    )

    return WeightedMath._calcBptInGivenExactTokensOut(
      balances,
      weights,
      amountsOut,
      bnum(this.poolTotalSupply.toString()),
      bnum(this.poolSwapFee.toString())
    )
  }

  public bptInForExactTokenOut(
    amount: string,
    tokenIndex: number
  ): OldBigNumber {
    const balance = bnum(this.poolTokenBalances[tokenIndex].toString())
    const weight = bnum(this.poolTokenWeights[tokenIndex].toString())
    const amountOut = bnum(
      parseUnits(amount, this.poolTokenDecimals[tokenIndex]).toString()
    )

    return WeightedMath._calcBptInGivenExactTokenOut(
      balance,
      weight,
      amountOut,
      bnum(this.poolTotalSupply.toString()),
      bnum(this.poolSwapFee.toString())
    )
  }

  public exactBptInForTokenOut(
    bptAmount: string,
    tokenIndex: number
  ): OldBigNumber {
    const balance = bnum(this.poolTokenBalances[tokenIndex].toString())
    const weight = bnum(this.poolTokenWeights[tokenIndex].toString())

    return WeightedMath._calcTokenOutGivenExactBptIn(
      balance,
      weight,
      bnum(bptAmount),
      bnum(this.poolTotalSupply.toString()),
      bnum(this.poolSwapFee.toString())
    )
  }

  public propAmountsGiven(
    amount: string,
    index: number,
    type: 'send' | 'receive'
  ): Amounts {
    if (amount.trim() === '') {
      return { send: [], receive: [], fixedToken: 0 }
    }

    const types = ['send', 'receive']
    const fixedTokenAddress = this.tokenOf(type, index)
    const fixedToken = getTokenInfo(fixedTokenAddress)
    const fixedTokenDecimals = fixedToken?.decimals || 18
    const fixedAmount = new Decimal(amount).toFixed(fixedTokenDecimals)
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
            fixedDenormAmount.mul(ratio).div(fixedRatio),
            token?.decimals || 18
          )
        }
      })
    })

    return amounts
  }

  public priceImpact(
    tokenAmounts: string[],
    option: PriceImpactOption
  ): OldBigNumber {
    let bptAmount: OldBigNumber
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
        bnum(parseUnits(this.bptBalance, POOL_DECIMALS).toString())

      tokenAmounts = this.poolTokens.map((_, i) => {
        if (i !== tokenIndex) return '0'
        const tokenAmount = this.exactBptInForTokenOut(
          bptAmount.toString(),
          tokenIndex
        ).toString()

        return formatUnits(
          tokenAmount,
          this.poolTokenDecimals[tokenIndex]
        ).toString()
      })

      bptZeroPriceImpact = this.bptForTokensZeroPriceImpact(tokenAmounts)
    }

    return bnum(bptAmount).div(bptZeroPriceImpact).minus(1)
  }

  public bptForTokensZeroPriceImpact(tokenAmounts: string[]): OldBigNumber {
    const denormAmounts = this.denormAmounts(tokenAmounts)

    return bnum(
      _bptForTokensZeroPriceImpact(
        this.poolTokenBalances,
        this.poolTokenDecimals,
        this.poolTokenWeights,
        denormAmounts,
        this.poolTotalSupply
      ).toString()
    )
  }

  //   NOTE: Utils
  public denormAmounts(amounts: string[]): BigNumber[] {
    return amounts.map((a, i) =>
      parseUnits(
        new Decimal(a).toFixed(4, Decimal.ROUND_DOWN),
        this.poolTokenDecimals[i]
      )
    )
  }

  public tokenOf(type: string, index: number): string {
    const key = `${type}Tokens` as 'sendTokens' | 'receiveTokens'
    return getAddress(this[key][index])
  }

  public ratioOf(type: string, index: number): BigNumberish {
    const key = `${type}Ratios` as 'sendRatios' | 'receiveRatios'
    return this[key][index]
  }

  // NOTE: Getters
  public get tokenAddresses(): string[] {
    if (this.useNativeAsset) {
      return this.pool.tokensList.map((address) => {
        if (address === this.config.weth) {
          return this.config.network.nativeAsset.address
        }
        return address
      })
    }

    return this.pool.tokensList
  }

  public get poolTokens(): PoolToken[] {
    return this.pool.tokens
  }

  public get poolTokenDecimals(): number[] {
    return this.poolTokens.map((t) => t.decimals)
  }

  public get poolTokenBalances(): BigNumber[] {
    const normalizedBalances = this.poolTokens.map((t) => t.balance)
    return normalizedBalances.map((b, i) =>
      parseUnits(b, this.poolTokenDecimals[i])
    )
  }

  public get poolTokenWeights(): BigNumber[] {
    const normalizedWeights = this.poolTokens.map((t) => t.weight)
    return normalizedWeights.map((w) => parseUnits(w, 18))
  }

  public get poolTotalSupply(): BigNumber {
    return parseUnits(this.pool.totalShares || '0', POOL_DECIMALS)
  }

  public get poolSwapFee(): BigNumber {
    return parseUnits(this.pool.swapFee || '0', 18)
  }

  public get sendTokens(): string[] {
    if (this.action === 'join') return this.tokenAddresses
    return [this.pool.address]
  }

  public get receiveTokens(): string[] {
    if (this.action === 'join') return [this.pool.address]
    return this.tokenAddresses
  }

  public get sendRatios(): BigNumberish[] {
    if (this.action === 'join') return this.poolTokenBalances
    return [this.poolTotalSupply]
  }

  public get receiveRatios(): BigNumberish[] {
    if (this.action === 'join') return [this.poolTotalSupply]
    return this.poolTokenBalances
  }
}
