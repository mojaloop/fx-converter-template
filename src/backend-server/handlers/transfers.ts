// getPayeeProxyDisplayInfo

import { Request, ResponseObject } from '@hapi/hapi'
import axios from 'axios'
import { StateResponseToolkit } from '../../shared/plugins/state'

async function PostTransfers(_context: unknown, _request: Request, h: StateResponseToolkit): Promise<ResponseObject>  {
  try {
    const destUrl = h.context.serviceConfig.endpoints.sdkUrl + _request.path
    // TODO: optimize the following deep copy function
    const reqBody = JSON.parse(JSON.stringify(_request.payload))
    // TODO: Modify the body here based on the FX rules
    const headers = { ..._request.headers }
    const { data, status } = await axios.post(
      destUrl,
      reqBody,
      {
        headers,
      },
    );
    // TODO: Modify the response data here based on the FX rules
    return h.response(data).code(status)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
      return h.response(error.message).code(500)
    } else {
      console.log('unexpected error: ', error);
      return h.response('An unexpected error occurred').code(500)
    }
  }
}

export default {
  PostTransfers
}
