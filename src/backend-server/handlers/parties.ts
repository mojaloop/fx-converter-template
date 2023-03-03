// getPayeeProxyDisplayInfo

import { Request, ResponseObject } from '@hapi/hapi'
import axios from 'axios'
import { StateResponseToolkit } from '../../shared/plugins/state'

async function PartiesByTypeAndID(_context: unknown, _request: Request, h: StateResponseToolkit): Promise<ResponseObject>  {
  try {
    const destUrl = h.context.serviceConfig.endpoints.sdkUrl + _request.path
    const headers = { ..._request.headers }
    const { data, status } = await axios.get(
      destUrl,
      {
        headers,
      },
    );
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
  PartiesByTypeAndID
}
