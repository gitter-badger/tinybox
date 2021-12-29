import { JSONRPCServerParams } from './types';

export type LogoutParams = unknown;

export type LogoutResult = {
  message: string;
};

export async function logoutHandler(
  params: LogoutParams,
  { req }: JSONRPCServerParams
): Promise<LogoutResult> {
  if (!req['session']['userId']) {
    throw new Error('You are not logged in.');
  }
  req['session']['userId'] = null;
  return {
    message: 'ok',
  };
}
