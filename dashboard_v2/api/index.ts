import { handleAgentDataRequest } from './agentData';

export default async function handler(req: any, res: any) {
  const result = await handleAgentDataRequest(req);

  if (result.status === 405) {
    res.setHeader('Allow', 'GET');
  }

  return res.status(result.status).json(result.body);
}
