import axios from 'axios';

export async function rpc(method: string, params: any): Promise<any> {
  const response = await axios.post(
    '/jsonrpc',
    {
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: 1, // TODO: Change this to random
    },
    { withCredentials: true }
  );
  if (response.data.error) {
    throw new Error(response.data.error.message);
  }
  return response.data.result;
}
