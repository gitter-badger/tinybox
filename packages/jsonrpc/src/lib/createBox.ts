import { Box, Home } from '@tinybox/models';

import { JSONRPCServerParams } from './types';
import { assertNonNull } from '@tinybox/assertion';

export type CreateBoxParams = {
  homeId: string;
  parentId?: string;
  name: string;
};

export type CreateBoxResult = {
  id: string;
};

export async function createBoxHandler(
  params: CreateBoxParams,
  { req }: JSONRPCServerParams
): Promise<CreateBoxResult> {
  assertNonNull(req['session']['userId'], 'You are not logged in.');
  assertNonNull(params?.name, 'You must provide a name.');
  assertNonNull(params?.homeId, 'You must provide a homeId.');

  const home = await Home.findOne({
    ownerId: req['session']['userId'],
    _id: params.homeId,
  });
  assertNonNull(home, `Home with ID '${params.homeId}' cannot be found.`);

  if (params.parentId) {
    const parentBox = await Box.findOne({
      _id: params.parentId,
      homeId: home._id,
    });
    assertNonNull(
      parentBox,
      `Box with ID '${params.parentId}' cannot be found.`
    );
  }

  const box = new Box({
    name: params.name,
    homeId: params.homeId,
    parentId: params.parentId,
  });
  await box.save();

  return {
    id: box._id,
  };
}
