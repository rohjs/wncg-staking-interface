import type { AxiosResponse } from 'axios'

import axios from 'lib/axios'
import { IS_ETHEREUM } from 'utils/env'

export class CoingeckoService {
  fiatCurrency: string

  constructor() {
    this.fiatCurrency = 'usd'
  }

  getTokenId(key: string) {
    switch (key) {
      case 'bal':
        return 'balancer'
      case 'weth':
        return 'weth'
      case 'wncg':
        return IS_ETHEREUM ? 'wrapped-ncg' : 'wrapped-bitcoin'
      default:
        return key.toLowerCase()
    }
  }

  getSymbolName(key: string) {
    switch (key) {
      case 'balancer':
        return 'bal'
      case 'wrapped-ncg':
      case 'wrapped-bitcoin': // NOTE: Kovan network
        return 'wncg'
      default:
        return key.toLowerCase()
    }
  }

  async fetchTokenPrices(symbols: string[]) {
    const responses: Promise<AxiosResponse<TokenPrice>>[] = []

    symbols.forEach((symb) => {
      const tokenId = this.getTokenId(symb)
      const res = axios.get<TokenPrice>(
        `/simple/price?ids=${tokenId}&vs_currencies=${this.fiatCurrency}`
      )
      responses.push(res)
    })

    return await Promise.all(responses)
  }

  async getTokenPrices(symbols: string[]) {
    try {
      const results = await this.fetchTokenPrices(symbols)
      const priceMap = Object.fromEntries(
        results.map((result) => {
          const [key, value] = Object.entries(result.data)[0]
          const symb = this.getSymbolName(key)
          return [symb, value.usd]
        })
      )
      return priceMap
    } catch (error: any) {
      console.error('Unable to fetch token prices', symbols)
      throw new Error(error)
    }
  }
}

export const tokenIds = ['weth', 'balancer', 'wrapped-ncg', 'wrapped-bitcoin']
export const tokenSymbols = ['weth', 'bal', 'wncg']

export const coingecko = new CoingeckoService()