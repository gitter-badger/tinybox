import { assertMinLength, assertNonNull } from '@tinybox/assertion';

import { Home } from '@tinybox/models';
import { JSONRPCServerParams } from './types';

export type CreateHomeParams = {
  name: string;
};

export type CreateHomeResult = {
  id: string;
};

export async function createHomeHandler(
  params: CreateHomeParams,
  { req }: JSONRPCServerParams
): Promise<CreateHomeResult> {
  assertNonNull(req['session']['userId'], 'You are not logged in.');
  assertNonNull(params.name, 'You must provide a name.');
  assertMinLength(params.name, 1, 'You must provide a name.');

  const home = new Home({
    name: params.name,
    ownerId: req['session']['userId'],
  });
  await home.save();

  return {
    id: home._id,
  };
}
