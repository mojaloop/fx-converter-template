import FXRates from './fx-data'

export interface ConvertCurrencyResult {
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
        return (baseConvRate / invertConvRate1)
    }
}

  