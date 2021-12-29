import {
  assertEmail,
  assertMinLength,
  assertNonNull,
} from '@tinybox/assertion';

import { JSONRPCServerParams } from './types';
import { User } from '@tinybox/models';
import { bcryptHash } from '@tinybox/crypto';

export type CreateAccountParams = {
  name: string;
  email: string;
  password: string;
};

export type CreateAccountResult = {
  id: string;
};

export async function createAccountHandler(
  params: CreateAccountParams,
  { req }: JSONRPCServerParams
): Promise<CreateAccountResult> {
  assertNonNull(params.name, 'You must provide a name.');
  assertNonNull(params.password, 'You must provide a password.');
  assertNonNull(params.email, 'You must provide an email.');
  assertEmail(params.email, 'Invalid email address provided.');
  assertMinLength(
    params.password,
    8,
    'Password must be at least 8 characters long.'
  );

  const existingUser = await User.findOne({ email: params.email });
  if (existingUser) {
    throw new Error(`User with email '${params.email}' already exists.`);
  }
  const user = new User({
    name: params.name,
    email: params.email,
    hashedPassword: await bcryptHash(params.password),
  });
  await user.save();
  req['session']['userId'] = user._id;
  return {
    id: user._id,
  };
}
