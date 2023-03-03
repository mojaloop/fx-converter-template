// getPayeeProxyDisplayInfo
import Logger from '@mojaloop/central-services-logger'
import { Request, ResponseObject } from '@hapi/hapi'
import axios from 'axios'
import { StateResponseToolkit } from '../../shared/plugins/state'
import { convertCurrency, getFXRate } from '../../domain/fx'
import { CurrencyConversionConfig } from '../../shared/config'

async function PostTransfers(_context: unknown, _request: Request, h: StateResponseToolkit): Promise<ResponseObject>  {
  try {
    const destUrl = h.context.serviceConfig.endpoints.sdkUrl + _request.path
    // TODO: optimize the following deep copy function
    const reqBody = JSON.parse(JSON.stringify(_request.payload))

    // Check if the source currency is in the list
    const conversion = (h.context.serviceConfig.currencyConversion as CurrencyConversionConfig).conversions.find(conversion => conversion.srcCurrency === reqBody.currency)
    let convRate = 1
    // Modify the body here based on the FX rules
    // const convResult  = await convertCurrency(reqBody.currency, reqBody.amount, h.context.serviceConfig.currencyConversion)
    if (conversion) {
      const fetchedConvRate = await getFXRate(conversion.srcCurrency, conversion.dstCurrency)
      if (fetchedConvRate) {
        convRate = fetchedConvRate
        const calculatedAmount = Math.round(Number(reqBody.amount) * convRate)
        reqBody.currency = conversion.dstCurrency
        reqBody.amount = calculatedAmount + ''
      }
    }

    const headers = { ..._request.headers }
    // Delete the content-length header from inbound request so that it will be calculated again based on the payload
    delete headers['content-length']
    
    const { data, status } = await axios.post(
      destUrl,
      reqBody,
      {
        headers,
      },
    );
    // Modify the response data here based on the FX rules - reverse currency conversion
    if (conversion) {
      const transferAmount = data.quoteResponse.body.transferAmount
      const calculatedAmount = Math.round(Number(transferAmount.amount) / convRate)
      transferAmount.currency = conversion.srcCurrency
      transferAmount.amount = calculatedAmount + ''

      // TODO: Add conversion rate to a custom header in the response
    }

    return h.response(data).code(status)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      Logger.error('error message: ', error.message);
      return h.response(error.message).code(500)
    } else {
      Logger.error('unexpected error: ', error);
      return h.response('An unexpected error occurred').code(500)
    }
  }
}

async function PutTransfersById(_context: unknown, _request: Request, h: StateResponseToolkit): Promise<ResponseObject>  {
  try {
    const destUrl = h.context.serviceConfig.endpoints.sdkUrl + _request.path
    // TODO: optimize the following deep copy function
    const reqBody = JSON.parse(JSON.stringify(_request.payload))

    const headers = { ..._request.headers }
    // Delete the content-length header from inbound request so that it will be calculated again based on the payload
    delete headers['content-length']
    
    const { data, status } = await axios.put(
      destUrl,
      reqBody,
      {
        headers,
      },
    );

    return h.response(data).code(status)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      Logger.error('error message: ', error.message);
      return h.response(error.message).code(500)
    } else {
      Logger.error('unexpected error: ', error);
      return h.response('An unexpected error occurred').code(500)
    }
  }
}

export default {
  PostTransfers,
  PutTransfersById
}
