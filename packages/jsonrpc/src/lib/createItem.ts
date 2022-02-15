import { Box, Home, Item } from '@tinybox/models';

import { JSONRPCServerParams } from './types';
import { assertNonNull } from '@tinybox/assertion';

export type CreateItemParams = {
  homeId: string;
  boxId: string;
  name: string;
  quantity: number;
};

export type CreateItemResult = {
  id: string;
};

export async function createItemHandler(
  params: CreateItemParams,
  { req }: JSONRPCServerParams
): Promise<CreateItemResult> {
  assertNonNull(req['session']['userId'], 'You are not logged in.');
  assertNonNull(params?.name, 'You must provide a name.');
  assertNonNull(params?.homeId, 'You must provide a homeId.');
  assertNonNull(params?.boxId, 'You must provide a boxId.');
  assertNonNull(params?.quantity, 'You must provide a quantity.');

  const home = await Home.findOne({
    ownerId: req['session']['userId'],
    _id: params.homeId,
  });
  assertNonNull(home, `Home with ID '${params.homeId}' cannot be found.`);

  const box = await Box.findOne({
    _id: params.boxId,
    homeId: home._id,
  });
  assertNonNull(box, `Box with ID '${params.boxId}' cannot be found.`);

  const item = new Item({
    homeId: params.homeId,
    boxId: params.boxId,
    name: params.name,
    quantity: params.quantity,
  });
  await item.save();

  return {
    id: item._id,
  };
}
