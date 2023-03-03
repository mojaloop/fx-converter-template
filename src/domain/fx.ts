import Logger from '@mojaloop/central-services-logger'
import { CurrencyConversionConfig } from '../shared/config'
import FXRates from './fx-data'

interface ConvertCurrencyResult {
    currency: string
    amount: string
}

export async function getFXRate (fromCurrency: string, toCurrency: string): Promise<number | null | undefined> {
    if(fromCurrency === FXRates.base) {
        return FXRates.rates[toCurrency as keyof typeof FXRates.rates]
    } else {
        // Convert fromCurrency to base currency first
        const invertConvRate1 = FXRates.rates[fromCurrency as keyof typeof FXRates.rates]
        const baseConvRate = FXRates.rates[toCurrency as keyof typeof FXRates.rates]
        const calculatedRate = baseConvRate / invertConvRate1
        // console.log(invertConvRate1, baseConvRate, calculatedRate)
        return calculatedRate
    }
}

export async function convertCurrency(currency: string, amount: string, currencyConversionConfig: CurrencyConversionConfig, reverseDirection: boolean = false): Promise<ConvertCurrencyResult> {

    // Check the input currency is in the conversion list
    const conversion = currencyConversionConfig.conversions.find(conversion => (reverseDirection ? conversion.dstCurrency : conversion.srcCurrency) === currency)
    if(conversion) {
        let sourceCurrency = conversion.srcCurrency
        let destinationCurrency = conversion.dstCurrency
        if(reverseDirection) {
            sourceCurrency = conversion.dstCurrency
            destinationCurrency = conversion.srcCurrency
        }
        Logger.info(`Conversion entry found: converting ${sourceCurrency} to ${destinationCurrency}`)
        const convRate = await getFXRate(sourceCurrency, destinationCurrency)
        if (convRate) {
            const calculatedAmount = Math.round(Number(amount) * convRate)
            return {
                currency: destinationCurrency,
                amount: calculatedAmount + ''
            }
        }
    }
    return {
        currency,
        amount
    }
  }
  