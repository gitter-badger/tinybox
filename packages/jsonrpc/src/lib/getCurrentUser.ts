import { JSONRPCServerParams } from './types';
import { User } from '@tinybox/models';

export type GetCurrentUserParams = unknown;

export type GetCurrentUserResult = {
  id: string;
  name: string;
  email: string;
};

export async function getCurrentUserHandler(
  params: GetCurrentUserParams,
  { req }: JSONRPCServerParams
): Promise<GetCurrentUserResult> {
  if (!req['session']['userId']) {
    throw new Error('You are not logged in.');
  }
  const user = await User.findOne({ _id: req['session']['userId'] });
  if (!user) {
    req['session']['userId'] = null;
    throw new Error('Something went wrong internally, try again later.');
  }
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
}
