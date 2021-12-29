import { JSONRPCServerParams } from './types';
import { User } from '@tinybox/models';
import { bcryptCompare } from '@tinybox/crypto';

export type LoginParams = {
  email: string;
  password: string;
};

export type LoginResult = {
  message: string;
};

export async function loginHandler(
  params: LoginParams,
  { req }: JSONRPCServerParams
): Promise<LoginResult> {
  if (req['session']['userId']) {
    throw new Error('You are already logged in, please logout first.');
  }
  const user = await User.findOne({ email: params.email });
  if (!user) {
    throw new Error(`User with email '${params.email}' cannot be found.`);
  }
  if (!(await bcryptCompare(params.password, user.hashedPassword))) {
    throw new Error(`Invalid password.`);
  }
  req['session']['userId'] = user._id;
  return {
    message: 'ok',
  };
}
