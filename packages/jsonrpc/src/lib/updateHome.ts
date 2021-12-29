import { assertNonNull, isNull } from '@tinybox/assertion';

import { Home } from '@tinybox/models';
import { JSONRPCServerParams } from './types';

export type UpdateHomeParams = {
  id: string;
  name?: string;
};

export type UpdateHomeResult = {
  id: string;
};

export async function updateHomeHandler(
  params: UpdateHomeParams,
  { req }: JSONRPCServerParams
): Promise<UpdateHomeResult> {
  assertNonNull(req['session']['userId'], 'You are not logged in.');
  assertNonNull(params?.id, `'id' is a required parameter.`);

  const userId = req['session']['userId'];
  const home = await Home.findOne({ ownerId: userId, _id: params.id });

  assertNonNull(
    home,
    `Home with ID '${params.id}' cannot be found, make sure you have access to it.`
  );

  if (!isNull(params.name)) {
    home.name = params.name;
  }
  await home.save();

  return {
    id: home._id,
  };
}
