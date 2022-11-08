import axios, { AxiosResponse } from 'axios'

import { configService } from 'services/config'
import { TOKEN_PRICES_PLACEHOLDERS } from 'constants/tokens'
import { revertAddress } from 'utils/address'

export async function fetchCoinmarketCapTokenPrice(): Promise<
  AxiosResponse<CoinmarketCapQuoteMap>
> {
  return await axios.get<CoinmarketCapQuoteMap>('/api/prices')
}

export function parseCoinmarketCapPrice(data: CoinmarketCapQuoteMap) {
  try {
    const quotes = Object.entries(data).map(([key, quote], i) => {
      const match = quote.find(
        (q) => q.symbol.toLowerCase() === key.toLowerCase()
      )
      return match
    })

    const prices = quotes.reduce((acc, quote, i) => {
      if (!quote) return acc

      let _address = quote.platform?.token_address
      const address = _address
        ? revertAddress(_address)
        : configService.nativeAssetAddress

      acc[address] = quote.quote.USD.price.toString()
      return acc
    }, {} as TokenPrices)

    return prices
  } catch {
    return TOKEN_PRICES_PLACEHOLDERS
  }
}
