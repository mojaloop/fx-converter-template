// getPayeeProxyDisplayInfo
import Logger from '@mojaloop/central-services-logger'
import { Request, ResponseObject } from '@hapi/hapi'
import axios from 'axios'
import { StateResponseToolkit } from '../../shared/plugins/state'
import { convertCurrency } from '../../domain/fx'

async function PostTransfers(_context: unknown, _request: Request, h: StateResponseToolkit): Promise<ResponseObject>  {
  try {
    const destUrl = h.context.serviceConfig.endpoints.sdkUrl + _request.path
    // TODO: optimize the following deep copy function
    const reqBody = JSON.parse(JSON.stringify(_request.payload))

    // Modify the body here based on the FX rules
    const convResult  = await convertCurrency(reqBody.currency, reqBody.amount, h.context.serviceConfig.currencyConversion)
    reqBody.currency = convResult.currency
    reqBody.amount = convResult.amount

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
    // Modify the response data here based on the FX rules
    const reverseDirection = true
    const transferAmount = data.quoteResponse.body.transferAmount
    const convResult2  = await convertCurrency(transferAmount.currency, transferAmount.amount, h.context.serviceConfig.currencyConversion, reverseDirection)
    transferAmount.currency = convResult2.currency
    transferAmount.amount = convResult2.amount

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
